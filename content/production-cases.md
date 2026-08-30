# Appendix A. Production scenarios

These are not personality tests. They are short simulations for rehearsing a multi-function response. Use them after a sprint, during a design review, or as prompts for a team retrospective.

<section class="case-card">

## Case 1: the beautiful frame that misses budget

An artist's target frame is visually compelling but runs at half the required frame rate on the shipping hardware. **Se** says profile the actual build. **Ti** separates GPU, CPU, bandwidth, and content costs. **Ni** asks which visual qualities the frame must preserve. **Fi** protects the artistic promise. **Te** turns the decision into a budget and ownership plan. **Fe** ensures the review does not become a public defeat.

The output is not "art versus engineering." It is a ranked set of visual invariants, a capture, and a reversible experiment. The field question is: _what must remain true for the frame to still read as itself?_

</section>

<section class="case-card">

## Case 2: the elegant architecture with no adoption path

A renderer rewrite is conceptually cleaner, but teams cannot stop feature work for six months. **Ni** has seen a future maintenance trap. **Si** remembers previous migrations. **Ne** proposes coexistence layers. **Te** demands milestones and rollback conditions. **Fe** identifies who must be able to use the new system without becoming an expert.

The useful plan is a staged migration: prove one vertical slice, measure the gain, preserve an escape hatch, and publish a teaching path. A good architecture is not only correct; it is adoptable.

</section>

<section class="case-card">

## Case 3: the bug nobody can reproduce

A visual corruption appears only in a capture from one player on one device. **Se** requests raw evidence. **Si** checks driver, build, and asset history. **Ti** creates a smallest possible reproduction. **Ne** keeps alternate hypotheses alive. **Te** assigns containment while the investigation continues.

The social trap is premature certainty: the bug is blamed on an artist, a vendor, or a recent refactor before the model is earned. Treat the capture as a scene to inspect, not an accusation to defend against.

</section>

<section class="case-card">

## Case 4: the meeting that generates only opinions

The group debates whether an effect "feels expensive" and whether a feature is "worth it." **Ti** asks which terms are ambiguous. **Se** requests a side-by-side on target hardware. **Fi** asks what player experience is being protected. **Fe** makes sure the quiet stakeholder is heard. **Te** ends with a decision and a measurement.

The meeting becomes productive when it moves from adjectives to a shared render: target, constraint, alternative, owner, review date.

</section>

<section class="case-card">

## Case 5: the brilliant prototype that cannot become a system

A developer has a striking demo built through concentrated individual effort. **Ne** and **Se** made discovery fast. The next stage needs **Si** documentation, **Ti** boundaries, **Te** integration steps, and **Fe** onboarding language. The prototype is not invalid because it lacks these; it is simply in another phase.

Respect phase change. Do not demand production discipline during the first hour of discovery, and do not demand discovery freedom after the feature has become shared infrastructure.

</section>

<section class="case-card">

## Case 6: the team that cannot say no

Every request has a plausible value, so the roadmap becomes a pile of unfinished promises. **Fi** identifies the product principle. **Ni** names the trajectory. **Te** makes capacity visible. **Si** exposes the cost of previous commitments. **Fe** communicates the no without turning it into rejection.

The sentence to practice is: _This is a good idea, but it is not the next idea our current promise allows._ Boundaries are not a failure of care; they make care credible.

</section>

<section class="case-card">

## Case 7: the silent review

Everyone nods in a review, then privately complains afterward. **Fe** detects that agreement may be performative. **Fi** protects the right to a private concern. **Ti** asks for dissenting assumptions. **Te** creates an explicit decision record and a later reversal condition.

Psychological safety is not endless comfort. It is a reliable path by which unwelcome information can enter before the cost becomes large.

</section>

<section class="case-card">

## Case 8: the pattern that explains everything

A compelling theory begins to explain every production failure, every colleague, and every player behavior. **Ne** may be generating connections faster than they can be tested; **Ni** may be compressing too aggressively. Reintroduce **Se** and **Si**: what did the captures show, and what has happened across comparable cases? Use **Ti** to name the falsifiable claim.

An inspiring model becomes useful when it can lose. If nothing could disconfirm it, it is a story with no feedback channel.

</section>

<section class="case-card">

## Case 9: the performance emergency

Two days before a milestone, the frame time spikes. The team needs **Se** for the profile, **Te** for triage, **Si** for known mitigations, and **Fe** to prevent panic from destroying communication. **Ni** is still useful, but only for avoiding a fix that creates a larger near-term failure.

State the mode change explicitly: for the next two hours, stabilize; after the milestone, investigate root cause. Exploration and protection have different clocks.

</section>

<section class="case-card">

## Case 10: the values conflict disguised as an API debate

One person wants a flexible low-level interface; another wants a guided safe one. The argument sounds technical, but the values differ: expressiveness, correctness, onboarding, ownership, speed. **Fi** and **Fe** make the values speakable; **Ti** clarifies the trade-off; **Ne** considers separate layers; **Te** chooses a scope.

Do not force a value conflict to pretend it is only a fact conflict. Name the values, then build the smallest architecture that honors the important ones.

</section>

<section class="case-card">

## Case 11: the specialist bottleneck

One person understands a critical shader, exporter, or platform issue. Their expertise is real, but the system is fragile. **Si** preserves the knowledge, **Te** assigns redundancy, **Fe** makes asking safe, and **Fi** guards against treating the specialist as a resource rather than a person.

The intervention is not forced documentation alone. Create paired work, explain why the knowledge matters, and budget time for transmission before the emergency.

</section>

<section class="case-card">

## Case 12: the aesthetic disagreement

Two people see the same frame and disagree about quality. Start with **Se**: what visual properties differ? Use **Ni** to ask what mood or direction each interpretation serves. Use **Fi** to name taste without claiming universality. Use **Te** to choose a test with representative players or a defined art direction.

Taste becomes collaborative when it is translated into perceivable properties, intended effect, and a decision authority.

</section>

<section class="case-card">

## Case 13: the exhausted team

Under sustained pressure, every cognitive style degrades. Some people become rigid, some scattered, some controlling, some avoidant, some emotionally flooded, some detached. Do not use type language to romanticize burnout. **KNOWN:** sleep loss and sustained stress impair attention, regulation, and judgment.

The humane response is capacity reduction, clearer priorities, recovery time, and escalation when health or safety is at risk. A team cannot out-framework a depleted nervous system.

</section>

<section class="case-card">

## Case 14: the new hire with a different renderer

A new teammate asks questions the group considers obvious, notices different defects, or resists an established ritual. That difference may reveal a blind spot or may need onboarding; do not decide before evidence. Give the person a working artifact, history, context, and a safe route to challenge assumptions.

Diversity is not achieved by celebrating abstract difference. It is achieved when a distinct perceptual and social contribution can actually change the system.

</section>

<section class="case-card">

## Case 15: the retrospective as integration

End a project with four questions: What did we observe? What did we believe? What did we value? What did we change? Then ask what feedback arrived too late and what perspective was missing. The aim is neither blame nor self-congratulation. It is to improve the renderer that the team uses to meet the next scene.

This is the geometry of return in production form: evidence, meaning, value, action, and correction brought back into relationship.

</section>
