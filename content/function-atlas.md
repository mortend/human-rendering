# 13. The function atlas

The eight functions descend from Jung's account of psychological types and later Myers-Briggs type dynamics [13, 14]. This book extends that tradition through an original engineering and social-systems interpretation. The functions are best used as verbs, not identities. In a graphics pipeline, a team needs to inspect, compare, imagine, forecast, reason, implement, value, and coordinate. A person may be fluent in some operations and less practiced in others. Context changes what is available.

Each profile below has four parts: the signal it privileges, its production contribution, its social request, and its shadow. The social request is especially important. Friction often falls when a team gives someone the kind of information their attention is seeking.

<section class="function-profile">

## Se — the frame buffer

**Question:** What is actually present now?

Se is the attention of immediate contact: the artifact on screen, the performance capture, the input latency, the light in the room, the concrete next move. In a graphics team it is often visible in fast visual debugging, direct experimentation, practical demos, and a refusal to confuse a slide with a build.

Its gift is calibration. Se asks whether the shader really bands, whether the animation reads at normal speed, whether the player notices the feature, and whether the constraint is visible in the target environment. It grounds a group that has spent too long inside speculation.

Its social request is: **show me.** Bring a capture, a prototype, a reproduction case, or a side-by-side. Its shadow is presentism: treating what is visible today as the whole problem, or acting before a longer pattern is understood. Pair Se with Ni: direct evidence needs direction; direction needs contact.

</section>

<section class="function-profile">

## Si — the regression suite

**Question:** What does experience show, and what must remain stable?

Si attends to continuity, precedent, local detail, and remembered consequence. It notices the production rule everyone forgot, the device class that broke last time, the behavior hidden behind a familiar API, and the cost of changing a pipeline after it has accumulated dependencies.

Its gift is reliability. Si preserves hard-won learning and turns a one-off success into a repeatable practice. In social terms, it remembers commitments and makes trust durable.

Its social request is: **what changed, compared with what?** Give history, examples, acceptance criteria, migration plans, and time to compare. Its shadow is treating precedent as destiny. Pair Si with Ne: history protects against novelty theater; possibility prevents the past from becoming a prison.

</section>

<section class="function-profile">

## Ne — the node graph

**Question:** What else could this become?

Ne is associative, generative, and outwardly exploratory. It sees alternate pipelines, unusual combinations, possible tools, unexpected user behaviors, and routes around a constraint. It is strong in ideation, debugging by reframing, prototyping, and finding leverage across domains.

Its gift is optionality. When a team sees one blocked path, Ne can reveal five. It also keeps social systems alive by offering interpretations other than blame: perhaps the brief is unclear, the ownership is missing, or the constraint is real but mislocated.

Its social request is: **let us explore before we close.** Give a whiteboard, a short discovery window, and permission to offer alternatives. Its shadow is novelty addiction and the feeling that a connection is already proof. Pair Ne with Si and Te: preserve what has been learned, then choose and test.

</section>

<section class="function-profile">

## Ni — the render forecast

**Question:** Where is this pattern leading?

Ni compresses fragments into a trajectory. It is less interested in collecting every option than in sensing the few that matter. In production it often appears as architectural foresight, visual direction, design coherence, risk anticipation, and a sense that a small compromise will become an expensive pattern later.

Its gift is direction. Ni can turn a pile of observations into a coherent intent and help a team say no. Socially, it notices the unspoken story a group is living inside.

Its social request is: **give me the pattern and the time to synthesize it.** Do not demand every intermediate thought on command. Its shadow is overconfidence in a private model. Pair Ni with Se and Ti: return to the capture, state assumptions, and invite disconfirming evidence.

</section>

<section class="function-profile">

## Ti — the reference implementation

**Question:** Does this make sense on its own terms?

Ti looks for clean distinctions, coherent mechanisms, and a model that does not contradict itself. It is useful in rendering architecture, debugging, algorithm design, interface contracts, and any conversation where a vague word is hiding two different problems.

Its gift is precision. Ti can prevent a team from shipping a social agreement that has no operational meaning. It asks what exactly is meant by "quality," "optimized," "done," or "supports."

Its social request is: **define the model.** Give causal structure, edge cases, and room to ask apparently basic questions. Its shadow is endless refinement or the mistake that a clean model is automatically a humane one. Pair Ti with Fe and Te: test the explanation against people and outcomes.

</section>

<section class="function-profile">

## Te — the build system

**Question:** What works in the shared world?

Te organizes action around external criteria: deadlines, ownership, measurable performance, dependencies, throughput, and visible results. It is not identical with being bossy. At its best it makes the system legible enough that good intentions can become finished work.

Its gift is execution. Te turns a hypothesis into a benchmark, a benchmark into a decision, and a decision into a plan. Socially, it clarifies who is doing what by when.

Its social request is: **what is the goal, the constraint, and the next decision?** Give a definition of done, a metric, and authority appropriate to the task. Its shadow is mistaking efficiency for value or control for leadership. Pair Te with Fi and Si: ask whether the result is worth doing and what previous experience warns against.

</section>

<section class="function-profile">

## Fi — the artistic north star

**Question:** What matters, even when nobody is measuring it yet?

Fi attends to personal value, integrity, emotional truth, and the boundary between genuine consent and compliance. In a graphics context it is often the person who knows a visual choice feels wrong before the criteria are explicit, or who resists a productive-looking decision that violates the work's purpose.

Its gift is conscience. Fi protects the reason the system exists and helps individuals retain a self inside group pressure. It can make art, care, and ethical limits visible where a spreadsheet cannot.

Its social request is: **what does this cost, and does it fit what we stand for?** Give private reflection, honest language, and freedom from forced consensus. Its shadow is treating private conviction as beyond revision. Pair Fi with Te and Fe: translate values into consequences and hear their effect on others.

</section>

<section class="function-profile">

## Fe — the multiplayer protocol

**Question:** What is happening between us?

Fe attends to shared meaning, atmosphere, expectations, status, and connection. It detects when a technically correct discussion has become socially impossible, when a new teammate cannot enter the conversation, or when a decision needs language people can actually coordinate around.

Its gift is coherence between people. Fe can turn parallel expertise into collaboration, make feedback land, and create the psychological safety required for errors to surface early.

Its social request is: **who needs to understand, and what does this mean for the group?** Give context, visible agreements, and feedback that can be shared rather than weaponized. Its shadow is consensus pressure or the belief that discomfort proves wrongdoing. Pair Fe with Ti and Fi: clarify the facts and protect independent conscience.

</section>

## Function pairs as production checks

| Pair    | Production question                              | Social question                              |
| ------- | ------------------------------------------------ | -------------------------------------------- |
| Se / Ni | Does the build support the direction?            | Are we seeing reality and trajectory?        |
| Si / Ne | What have we learned, and what else is possible? | Are we honoring history without freezing it? |
| Ti / Fe | Is the model clear and communicable?             | Can people coordinate around it?             |
| Te / Fi | Does it work, and is it worth doing?             | Are results aligned with values?             |
