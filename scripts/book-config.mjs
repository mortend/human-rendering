import packageJson from "../package.json" with { type: "json" };

export const book = {
  slug: "human-rendering-ebook",
  version: packageJson.version,
  status: "ALPHA / PRE-RELEASE",
  title: "The Human Rendering Pipeline",
  subtitle: "MBTI Physics for Graphics Programmers",
  author: "Morten D. · Nazareth Editions",
};
