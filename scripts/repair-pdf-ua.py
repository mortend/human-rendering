# /// script
# requires-python = ">=3.10"
# dependencies = ["pypdf>=6,<7"]
# ///

"""Repair semantic tags emitted incorrectly by WeasyPrint's PDF/UA output."""

from __future__ import annotations

import argparse
import os
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, DictionaryObject, NameObject


def resolved(value):
    return value.get_object() if hasattr(value, "get_object") else value


def struct_children(element: DictionaryObject):
    kids = resolved(element.get("/K"))
    if isinstance(kids, ArrayObject):
        values = kids
    elif kids is None:
        values = []
    else:
        values = [kids]
    for value in values:
        child = resolved(value)
        if isinstance(child, DictionaryObject) and child.get("/Type") == "/StructElem":
            yield child


def has_direct_object_reference(element: DictionaryObject) -> bool:
    kids = resolved(element.get("/K"))
    if isinstance(kids, ArrayObject):
        values = kids
    elif kids is None:
        values = []
    else:
        values = [kids]
    return any(
        isinstance((child := resolved(value)), DictionaryObject)
        and child.get("/Type") == "/OBJR"
        for value in values
    )


def walk_structure(element: DictionaryObject):
    yield element
    for child in struct_children(element):
        yield from walk_structure(child)


def repair(path: Path) -> tuple[int, int]:
    reader = PdfReader(path)
    struct_root = resolved(reader.root_object.get("/StructTreeRoot"))
    if not isinstance(struct_root, DictionaryObject):
        raise RuntimeError("PDF has no structure tree")

    roots = resolved(struct_root.get("/K"))
    if not isinstance(roots, ArrayObject):
        roots = [roots]

    table_wrappers = 0
    link_tags = 0
    for root in roots:
        root = resolved(root)
        if not isinstance(root, DictionaryObject):
            continue
        for element in walk_structure(root):
            tag = element.get("/S")
            if tag == "/Table" and any(child.get("/S") == "/Table" for child in struct_children(element)):
                element[NameObject("/S")] = NameObject("/Div")
                table_wrappers += 1
            if tag != "/Link" and has_direct_object_reference(element):
                element[NameObject("/S")] = NameObject("/Link")
                link_tags += 1

    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.pdf_header = reader.pdf_header
    temporary = path.with_suffix(".ua-repair.pdf")
    with temporary.open("wb") as stream:
        writer.write(stream)
    os.replace(temporary, path)
    return table_wrappers, link_tags


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    args = parser.parse_args()
    tables, links = repair(args.pdf)
    print(f"Repaired {tables} table wrappers and {links} link tags in {args.pdf}")


if __name__ == "__main__":
    main()
