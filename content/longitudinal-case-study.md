# 20. The Meridian renderer rewrite

This fictional case follows one graphics team from mandate to retrospective. It is a composite teaching model, not a report about a real studio. The technical numbers are internally consistent examples, not universal budgets. The type patterns are voluntary working hypotheses used by the characters themselves; no role, skill, conflict, or decision is explained by type alone.

The project is _Meridian_, an atmospheric exploration game built around dense cities, reflective water, volumetric weather, and a painterly material language. The existing renderer can produce strong isolated scenes, but content growth has exposed unstable frame times, hidden pass dependencies, shader-permutation growth, and a review process in which art and engineering discover constraints too late.

The mandate sounds simple: modernize the renderer without stopping production.

| Milestone     | W0       | W3       | W6     | W10      | W14       | W18    |
| ------------- | -------- | -------- | ------ | -------- | --------- | ------ |
| Project gate  | Contract | Capture  | Slice  | Crisis   | Ship gate | Review |
| Learning gate | Values   | Evidence | Design | Recovery | Integrate | Learn  |

<div class="case-roster">

The core group has six members:

| Person | Role                  | Self-selected type pattern | Signal the team especially needs                          |
| ------ | --------------------- | -------------------------- | --------------------------------------------------------- |
| Mara   | Rendering lead        | INTJ, Ni-Te-Fi-Se          | Architectural trajectory and staged leverage              |
| Leon   | Senior GPU programmer | ISTP, Ti-Se-Ni-Fe          | Mechanism, direct capture, and rapid diagnosis            |
| Imani  | Art director          | ISFP, Fi-Se-Ni-Te          | Visual integrity and embodied quality judgment            |
| Ana    | Technical-art lead    | ENFJ, Fe-Ni-Se-Ti          | Cross-discipline adoption and shared direction            |
| Soren  | Platform engineer     | ISTJ, Si-Te-Fi-Ne          | Regression history, platform limits, and migration safety |
| Jules  | Producer              | ESTJ, Te-Si-Ne-Fi          | Decision ownership, sequence, and delivery pressure       |

</div>

These patterns describe preferences, not job requirements. Every person uses every cognitive function. The case becomes useful when a needed operation enters the work, regardless of who supplies it.

<section class="longitudinal-stage">

## Stage 1. Contract before architecture

At the first meeting, each discipline hears a different project. Mara hears a chance to replace an accumulation of implicit pass ordering with a render graph. Leon hears a dangerous rewrite proposed before anyone has captured the bottleneck. Imani hears a threat to the hand-tuned qualities that make _Meridian_ recognizable. Ana hears a migration problem for artists. Soren remembers two previous modernization efforts that failed on the lower-memory console. Jules hears an eighteen-week commitment with no stable definition of done.

The initial language produces immediate misreads. Leon calls the proposal "architecture before evidence." Mara hears local optimization without trajectory. Imani says the renderer must preserve "wet light," which Leon cannot convert into a test. Jules asks for dates, which Ana hears as closure before the people affected have entered the room.

Instead of debating the solution, the group writes a success contract. It distinguishes constraints from preferences and pairs every aspiration with an observable review artifact.

| Contract layer   | Agreement                                                                      | Evidence at review                                               |
| ---------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Visual invariant | Wet streets retain colored light separation during motion                      | Three approved camera paths and side-by-side captures            |
| Performance      | Performance mode holds a 16.67 ms GPU frame ceiling in target scenes           | Captures on both console targets at representative content scale |
| Internal budget  | Core rendering work aims for 11.5 ms, leaving room for simulation and variance | Pass timings, percentile frame times, and memory telemetry       |
| Content          | Artists can author weather and signage without combinatorial shader knowledge  | Tool prototype tested by artists outside the core team           |
| Migration        | Existing levels remain playable throughout the rewrite                         | Dual-path build and explicit rollback criteria                   |
| Decision quality | Assumptions, owners, and reversal conditions remain visible                    | One-page decision record updated after every gate                |

The agreement recruits all eight cognitive functions. Se asks what the target hardware is doing. Si preserves known obligations. Ne keeps more than one implementation path alive. Ni states the intended architecture. Ti separates the mechanism from the slogan. Te names budgets and owners. Fi protects the visual promise. Fe defines how the change becomes usable by other teams.

The first improvement is therefore not code. It is a shared render target for the project itself.

**Checkpoint:** Before reading on, identify which part of the contract your own team would be most likely to omit. What later conflict would that omission create?

</section>

<section class="longitudinal-stage">

## Stage 2. From personality story to frame capture

The first week produces a familiar failure: everyone arrives with a plausible global explanation. Mara believes hidden dependencies are preventing optimization. Leon believes translucent effects and shadow filtering dominate. Imani believes the performance target is being used to lower quality before engineering has exhausted its options. Soren believes memory pressure on the lower console will become the real limit. Jules believes indecision is the bottleneck.

Each explanation may contain information, but none is yet a capture.

The team selects three scenes: a quiet canal, a crowded rain market, and a rooftop traversal at sunset. For each scene they record build, device, resolution mode, camera path, content revision, warm-up procedure, GPU time, memory, and visible defects. They also record what the capture does **not** establish.

```text
capture M-07: rain market, console B, performance mode
GPU frame: 19.6 ms at the 95th percentile
largest measured groups:
- shadow and light filtering: 4.3 ms
- transparency and particles: 3.2 ms
- post and temporal reconstruction: 2.9 ms
- depth, visibility, and material passes: 5.1 ms
unknown:
- cost after representative final signage density
- acceptable reflection degradation during rapid camera motion
```

The trace corrects every story. Leon was right that local effects matter, but no single pass explains the overrun. Mara was right that resource transitions and serialized work create lost overlap, but a render graph alone cannot reduce material cost. Imani was right that quality decisions are already being made implicitly: the current dynamic scaler damages reflected color separation without an art-approved fallback. Soren finds that the lower console is close to a transient-memory cliff. Jules discovers that two days of "delay" came from waiting for an undefined art decision.

The team adopts a rule: no type story may substitute for a project trace. "Mara is being Ni" is not evidence. "The architecture proposal predicts that pass culling will remove 1.2 ms from this capture" is testable. "Imani is being Fi" is not a decision. "The visual invariant rejects fallback B in camera path two" is actionable.

The function-interaction atlas now becomes practical. Se sends bounded evidence to Ni. Ni answers with a prediction. Ti states the mechanism that would make the prediction true. Te assigns a test. Fi and Fe define what result would count as acceptable to the people producing and judging the image.

**Decision:** The group will compare three approaches against the same captures: patch the existing renderer, wrap existing passes in a staged render graph, or begin a wider deferred-path rewrite. No option may change the success contract to make itself look successful.

</section>

<section class="longitudinal-stage">

## Stage 3. Divergence, convergence, and a reversible decision

Ravi, a consulting graphics engineer, joins for a three-day design workshop. He generates six plausible architectures before lunch. Mara rapidly compresses them into one long-term direction. Leon wants to reduce each to resource transitions, bandwidth, and synchronization behavior. Soren asks how old levels migrate. Imani asks which design gives artists a stable way to preserve the wet-light invariant. Jules asks which option can produce evidence in two weeks.

The meeting almost collapses into a contest between Ne expansion and Ni convergence. Ravi experiences Mara's synthesis as premature closure. Mara experiences Ravi's alternatives as refusal to select. The repair is directional: Ne leads first to map the option space; Ni then states the invariant trajectory; Ti tests whether the compressed model is coherent; Te converts it into a bounded decision.

| Option                                    | Leverage                                     | Main risk                                 | Reversal cost         | Two-week evidence                                  |
| ----------------------------------------- | -------------------------------------------- | ----------------------------------------- | --------------------- | -------------------------------------------------- |
| Patch current pass list                   | Fast local gains                             | Hidden dependencies remain                | Low now, higher later | Timing delta on known scenes                       |
| Stage existing passes into a render graph | Makes dependencies and lifetimes inspectable | Dual-path complexity during migration     | Moderate and bounded  | One representative path with graph visualization   |
| Replace lighting and materials together   | Largest theoretical redesign                 | Art-tool disruption and schedule coupling | High                  | Attractive prototype with weak production evidence |

The team chooses the staged render graph. This is not declared the universally superior architecture. It is the option that exposes the uncertainty the team most needs to reduce while preserving a rollback path.

The decision record contains five sentences:

```text
We believe explicit pass and resource dependencies will expose culling,
aliasing, overlap, and ownership opportunities hidden by the current path.
We will test that claim in the rain market on both console targets.
We will preserve the existing path until visual, timing, memory, and tooling
criteria pass. We will reverse if migration overhead prevents representative
content from running by the end of week six.
```

This record separates direction from certainty. Mara can protect trajectory without pretending to know every implementation. Leon can demand mechanism without reopening the project purpose. Soren can defend migration evidence without vetoing novelty. Imani can preserve value through concrete review scenes. Ana can plan adoption around a real artifact. Jules can schedule a decision without claiming that the schedule proves the decision correct.

The key social change is subtle: decision authority and truth authority are separated. Mara owns the architecture decision. Anyone can provide evidence that should reverse it.

</section>

<section class="longitudinal-stage">

## Stage 4. The beautiful vertical slice that lies

At the end of week five, the new path produces a striking canal scene. It is faster, graph visualization is clear, transient memory is lower, and the team feels relief. The review room becomes energetic. A senior stakeholder calls the rewrite "done in principle."

The phrase is dangerous. The prototype is not fraudulent, but its scene is unusually favorable: few transparent layers, stable camera motion, limited signage, and no dense weather interaction. The result answers whether the architecture can work. It does not answer whether production can live inside it.

Ana asks two artists outside the core group to rebuild an existing weather variant. They discover undocumented naming rules, a quality-tier switch exposed only in code, and a graph error that reports a resource hazard without identifying the authoring action that caused it. Soren runs the same content on console B and finds that aliasing saves memory until an optional capture tool is enabled, at which point the system crosses the budget abruptly. Imani sees temporal ghosting on high-contrast brush strokes during the rooftop path.

The team adds a confidence matrix:

| Claim                                       | Current evidence                        | Confidence | Missing test                                            |
| ------------------------------------------- | --------------------------------------- | ---------- | ------------------------------------------------------- |
| Graph exposes pass dependencies             | Canal and market graphs are inspectable | High       | Automated validation in continuous integration          |
| Transient allocation reduces peak memory    | Two scenes on both targets              | Medium     | Capture tools and worst-case weather enabled            |
| New path preserves art direction            | Static canal review                     | Low        | Motion, disocclusion, signage, and rapid weather change |
| Artists can author without engineer support | Core technical artist succeeded         | Low        | Independent artist task with measured support requests  |
| Migration can finish on schedule            | One path converted                      | Medium     | Old-level compatibility and dual-path maintenance cost  |

No person is blamed for the premature celebration. The problem was a system attractor: visible success reduced appetite for disconfirming evidence. Se had entered through one beautiful frame, but Si lacked representative history, Ne had not generated adverse conditions, and Fe momentum made dissent feel like ingratitude.

The correction is not cynicism. The team keeps the result and reduces the claim. "Done in principle" becomes "architecture viable in one bounded slice." Precision preserves the achievement while reopening learning.

**Exercise:** Take one successful prototype from your work. Write the strongest claim it actually supports, then name three production conditions it has not yet encountered.

</section>

<section class="longitudinal-stage">

## Stage 5. Render graphs and social dependency graphs

The technical graph now exposes passes, resources, queue transitions, and lifetimes. The project plan still hides social dependencies. A task named "migrate reflections" depends on the visual invariant, motion vectors, material conventions, camera cuts, temporal history, quality tiers, platform memory, capture tooling, and the authority to accept degradation.

Ana draws the human graph next to the render graph:

```text
art invariant -----------+
motion-vector contract --+--> reflection path --> target capture
history validity --------+          |                  |
material controls -------+          v                  v
platform memory ---------+      artist trial ------ ship decision
                                     ^                  ^
tool error language -----------------+                  |
rollback owner -----------------------------------------+
```

Three missing edges become visible. First, Imani can reject an image but has no scheduled point to define an acceptable degradation ladder. Second, Soren owns console memory evidence but receives feature changes after review. Third, artists can trigger graph constraints but the error language is written for renderer engineers.

The group distinguishes three kinds of coordination:

| Dependency | Meridian example                                                | Required response                              |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------- |
| Execution  | Motion vectors must exist before temporal reflection resolve    | Encode order in the graph                      |
| Visibility | Art and platform must see a quality-tier change before approval | Publish the changed contract and capture       |
| Ownership  | A fallback moves from experiment to supported production path   | Name maintainer, tests, and reversal authority |

This prevents a common category error. A meeting occurring before implementation does not mean its rationale became visible. A document being visible does not mean someone accepted ownership. A named owner does not mean the dependency can execute in any order.

Function interactions reveal the repair. Te leading to Fe makes implementation ownership socially legible. Fi leading to Te translates a visual value into acceptance criteria. Si leading to Ne states which old failure still applies and which condition has changed. Ti leading to Fe rewrites the error message without sacrificing mechanism.

The revised graph adds two artifacts: a visual fallback sheet owned jointly by Imani and Leon, and an author-facing validation report owned by Ana. The code change is small. The production change is large because information can now cross the boundary where the work actually fails.

</section>

<section class="longitudinal-stage">

## Stage 6. The permutation crisis and narrowed team weather

In week ten, the continuous build grows from twenty-two minutes to fifty-eight. Pipeline-cache misses produce severe stutter in a new district. Artists cannot predict which material features create a new variant. The renderer rewrite is blamed, although part of the growth comes from content that also affects the old path.

Pressure narrows everyone. Mara privately concludes that the real problem is a lack of architectural discipline and begins redesigning the material interface without showing intermediate reasoning - a Ni-Fi loop question. Leon reduces the failure to a technically elegant key-generation problem and stops attending art reviews - a Ti-Ni loop question. Jules tightens daily status control and treats uncertainty as lack of ownership. Imani hears the proposed restrictions as proof that engineering never valued the visual language.

These are not diagnoses. The type patterns offer questions about missing counterweights. Has Mara lost Se contact with the current authoring behavior? Has Leon bypassed Fe translation and the people who must use the model? Has Jules allowed Te urgency to outrun Fi awareness of what the schedule is sacrificing? Has Imani's Fi-Ni interpretation become insulated from alternative motives?

Ana interrupts the escalation with a recovery sequence:

1. **Capture:** list the top variant sources by measured count and build cost.
2. **History:** compare the count with the last stable district and the old renderer path.
3. **Mechanism:** separate shader source variation, pipeline-state variation, cache invalidation, and packaging.
4. **Value:** identify which material differences are visually meaningful.
5. **Alternatives:** generate reductions that do not assume one total redesign.
6. **Decision:** assign one experiment per hypothesis and reconvene after evidence.

The trace shows four causes: two feature bits multiply unnecessarily; one quality setting belongs in data rather than compilation; cache keys include an unstable field; and eighteen artist-created combinations are visually indistinguishable at the target distance.

The repair combines functions rather than selecting a winner. Ti simplifies the key. Se compares visible outputs. Fi protects three differences that carry the style. Te moves one dimension to runtime data and assigns migration. Si adds regression scenes. Ne proposes a bounded uber-shader experiment for rare variants. Ni checks whether the resulting convention supports the long-term material direction. Fe brings the explanation back to artists before the policy becomes irreversible.

Build time returns to twenty-nine minutes, and the remaining increase is accepted because the new district has measurable complexity. More importantly, the team learns to recognize narrowed weather before it becomes a personality verdict.

</section>

<section class="longitudinal-stage">

## Stage 7. The art-engineering boundary becomes an artifact

The hardest unresolved issue is temporal reconstruction. The new path performs well in most scenes, but bright painted lines smear across wet surfaces during camera acceleration. Leon calls the failure a narrow disocclusion case. Imani calls it a violation of the game's visual grammar. Both descriptions are true at different levels.

Their first exchange fails because each offers a currency the other cannot evaluate. Leon provides motion-vector plots, rejection masks, and timing. Imani provides side-by-side frames and says one version "loses intention." Leon hears an unbounded preference. Imani hears a mechanism being used to overrule perception.

Ana asks them to create a shared artifact with four synchronized views:

```text
beauty frame | motion vectors | history confidence | timing and memory
```

Imani marks three invariants directly on the sequence: colored lines must remain separable; reflected strokes may soften but cannot merge into gray; and degradation during rapid motion must recover within a defined interval. Leon translates those observations into measurable regions and frame windows. He discovers that one confidence clamp preserves the lines at modest cost, while a second option looks better in stills but creates instability after disocclusion.

The resulting degradation ladder is explicit:

| Tier               | Preserved                                   | Reduced                                       | Never allowed                                |
| ------------------ | ------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| Quality            | Full reflection separation and long history | Minor softness during fastest motion          | Persistent merged color bands                |
| Performance        | Separation at focal distances               | Reflection length and secondary ripple detail | Recovery longer than the agreed frame window |
| Emergency fallback | Primary color identity                      | Local reflection density                      | Silent switch to an unreviewed neutral blur  |

Fi has not been converted into a metric and erased. It has specified what the metric must protect. Ti has not surrendered mechanism to taste. It has made the mechanism answerable to a visible contract. Se supplies the actual moving image. Te records cost and implementation. Fe creates language both disciplines can use. Ni preserves the trajectory, while Si turns the agreement into a regression sequence.

The conflict resolves when neither side is required to become the other. The boundary acquires an interface.

</section>

<section class="longitudinal-stage">

## Stage 8. A performance emergency without a human scapegoat

At the week-fourteen gate, console B regresses from 11.7 ms to 14.8 ms in the rooftop scene. The schedule has six days before content lock. The old team habit would be to ask who introduced the regression and demand a fix. The new protocol asks what each cognitive function needs to contribute before the incident narrows.

| Function | Incident question                                   | Meridian answer                                                                                 |
| -------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Se       | What changed on the target now?                     | Async-compute overlap disappears when volumetric weather and capture telemetry are both enabled |
| Si       | Where has this pattern appeared before?             | A previous driver path serialized a similar queue transition                                    |
| Ne       | What credible mechanisms could produce it?          | Barrier scope, telemetry readback, memory pressure, or a driver-specific scheduling choice      |
| Ni       | Which consequence threatens the project trajectory? | Disabling weather would pass the gate but violate the central visual promise                    |
| Ti       | What minimal model distinguishes the causes?        | Four builds vary telemetry, queue use, barrier scope, and memory independently                  |
| Te       | Who owns the next evidence and decision?            | Soren owns platform captures; Leon owns synchronization; Jules owns the gate record             |
| Fi       | What must not be traded silently?                   | Weather identity and honest reporting of performance mode                                       |
| Fe       | Who needs visibility before the decision?           | Art, QA, platform, production, and the engineer maintaining telemetry                           |

The minimal builds show that telemetry readback changes resource lifetime, which expands a barrier and removes overlap on one driver. The tool is valuable, but it was never meant to ship in performance builds. A build-rule error enabled it.

The immediate repair excludes the readback from shipping configurations and adds a continuous test. The deeper repair records why the configuration exists, because a rule without rationale will eventually look obsolete. Soren also files the broader barrier behavior for investigation rather than claiming the local fix explains everything.

No one is publicly celebrated as the hero and no one is made the cause of the incident. The team praises the path by which bad news traveled: QA supplied the reproducible camera, Imani prevented a false visual compromise, Soren connected present evidence to platform history, and Leon reduced the mechanism. Jules protects focus by cancelling two status meetings and publishing one incident update.

This is psychological safety in operational form: not comfort, but a reliable route by which error can enter before blame seals the model.

</section>

<section class="longitudinal-stage">

## Stage 9. The ship gate as conscious integration

By week sixteen, the new renderer path is faster in representative scenes, memory is within budget, artists can author the supported weather variants, and the visual fallback sheet has passed review. It is not perfect. One rare camera cut produces a reflection pop. Graph diagnostics still use terminology unfamiliar to new artists. The dual path adds maintenance cost, and a driver workaround remains narrower than the team would like.

Jules resists the temptation to turn the gate into a single green or red status. The group reviews each remaining defect through consequence, visibility, reversibility, and ownership.

| Remaining issue               | Consequence                           | Decision                                                       | Owner and return condition                                                |
| ----------------------------- | ------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Reflection pop after rare cut | Visible but brief; no data loss       | Ship with documented camera workaround                         | Leon; remove workaround after history-reset fix passes three scenes       |
| Technical graph language      | Slows independent artist diagnosis    | Ship only with support rotation and revised messages scheduled | Ana; close when artist trial completes without renderer help              |
| Dual renderer paths           | Ongoing test and maintenance cost     | Keep through first patch                                       | Mara; remove old path after rollback window and platform telemetry review |
| Console B driver workaround   | Small performance and complexity cost | Keep scoped to affected driver                                 | Soren; retest on each driver update                                       |

The decision does not optimize every axis. Se confirms the current builds. Si checks obligations and known regressions. Ne preserves workarounds and future options. Ni asks whether the release advances the intended architecture. Ti confirms that limitations are understood. Te makes ownership and dates explicit. Fi names quality promises that cannot disappear inside schedule language. Fe ensures the people carrying support know what has been accepted.

The renderer ships because the trade-offs are conscious, observable, and recoverable - not because uncertainty has vanished.

Mara closes the gate with a statement that would have been impossible in week one: "The architecture is successful enough to release, incomplete enough to keep measuring, and reversible where our confidence is lowest." Leon adds the exact captures that could disprove that judgment. Imani signs the visual fallback sheet. Ana publishes the authoring path. Soren records the platform boundaries. Jules protects the return dates from being swallowed by the next milestone.

</section>

<section class="longitudinal-stage">

## Stage 10. Retrospective: what the system learned

The final review compares the project with its baseline rather than with a heroic success story.

| Dimension    | Week 0                                                             | Week 18                                                                               |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Architecture | Implicit pass order and hidden resource lifetimes                  | Staged render graph with explicit dependencies and rollback window                    |
| Performance  | Representative rain scene at 19.6 ms                               | Same capture family within the 16.67 ms frame ceiling, with internal budget monitored |
| Memory       | Late discovery of console B cliffs                                 | Transient budget visible in gates and worst-case captures                             |
| Art contract | "Wet light" understood socially but not testably                   | Approved motion sequences, invariants, and degradation ladder                         |
| Authoring    | Variant behavior required renderer expertise                       | Supported variants, validation messages, and independent artist trial                 |
| Team process | Architecture, art, and schedule argued through separate currencies | Shared captures, decision records, correction routes, and return conditions           |

No result is assigned to one type pattern. The retrospective instead records which operation changed the work:

```text
Se  made the target build and moving image unavoidable.
Si  preserved platform history, regression scenes, and decision rationale.
Ne  kept credible alternatives available before commitment.
Ni  maintained a coherent migration trajectory across local fixes.
Ti  separated synchronization, compilation, cache, and visual mechanisms.
Te  turned uncertainty into owners, tests, budgets, and return dates.
Fi  protected the visual promise and the boundary against silent trade-offs.
Fe  built interfaces through which art, engineering, QA, and production could correct one another.
```

The team also names its recurrent danger: under strain, it mistakes a useful signal for a complete world. Architecture becomes destiny, capture becomes the whole product, precedent becomes prohibition, possibility becomes delay, mechanism becomes distance, schedule becomes truth, value becomes veto, or harmony becomes silence.

Its new production loop therefore ends with a plurality check:

```text
capture -> model -> value -> decision -> artifact -> feedback -> correction
                              ^                              |
                              +------ missing view? <-------+
```

The human rendering pipeline is not a personality test applied to a studio. It is the discipline of keeping enough perspectives available that the studio can still learn.

</section>

<section class="longitudinal-stage">

## Transfer exercise. Build your own longitudinal case

Choose one project that lasted long enough to contain an initial model, a surprise, a conflict, and a consequential decision. Reconstruct it without typing anyone who has not chosen to participate.

1. **Contract:** What observable outcome, value, and relationship did the work need to preserve?
2. **Capture:** What happened in a bounded scene, build, meeting, or handoff?
3. **Competing models:** Which explanations initially seemed plausible?
4. **Function coverage:** Which of evidence, history, possibility, trajectory, mechanism, execution, value, or coordination was missing?
5. **Interaction:** Which directed function interaction could have translated the missing signal?
6. **Decision record:** What was chosen, on what evidence, by whom, and under what reversal condition?
7. **Team weather:** Where did pressure narrow people into loops, grips, control, withdrawal, or certainty?
8. **Recovery:** What restored contact without turning type into blame?
9. **Integration:** What shipped, what remained imperfect, and who owned the return?
10. **Learning:** Which practice changed the next project rather than merely explaining the last one?

Finish with two accounts. The first should be technical enough that another team could reproduce the relevant evidence. The second should be social enough that the people involved would recognize their agency and constraints. If the accounts contradict one another, the case is not finished. Find the missing edge.

</section>
