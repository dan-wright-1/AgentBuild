# Agent Proposal
*Stretch goal — ~1 page*

---

## Project

**[Your project name here]** — brief one-sentence description of what it does.

---

## The Feature

**[Feature name]** — describe the specific feature or workflow within the project that you're evaluating for an agent pattern.

---

## Why an Agent Pattern Would (or Would Not) Benefit This Feature

### Current Behavior
Describe how the feature works today. What does the user do? What does the system do? What are the steps involved?

### The Case For an Agent
Consider whether any of the following apply:

- **Multi-step reasoning** — Does the task require chaining multiple decisions or tool calls before arriving at a final result?
- **Dynamic tool selection** — Would the system benefit from choosing between different data sources, APIs, or operations based on context?
- **Ambiguity handling** — Is the input often ambiguous in ways that require the system to clarify, retry, or adapt mid-task?
- **Long-horizon tasks** — Does the task involve a workflow too complex to encode as a single prompt or function call?

If yes to two or more of the above, an agent pattern is likely a strong fit.

### The Case Against an Agent
Consider whether any of the following apply:

- **Deterministic flow** — The steps are always the same regardless of input.
- **Latency sensitivity** — The feature requires sub-second responses where multi-turn reasoning is too slow.
- **Simplicity** — A single well-crafted prompt or a conventional function already solves the problem reliably.
- **Cost** — The volume of calls makes multi-step LLM reasoning economically impractical.

### Verdict

**[Would benefit / Would not benefit]** — State your conclusion clearly.

Justify it in 2–3 sentences. Reference the specific characteristics of the feature (not just general statements about agents) to support your position.

---

## If Implementing: Proposed Architecture

*(Complete this section only if your verdict is "would benefit")*

**Tools the agent would need:**
- Tool 1 — purpose
- Tool 2 — purpose

**Memory requirements:**
- Session-only / persistent across sessions?
- What state needs to be retained between turns?

**Trigger:**
- When would the agent be invoked? (User action, scheduled, event-driven?)

**Success criteria:**
- How would you know the agent is working correctly?
- What does a good output look like vs. a bad one?

---

*This proposal should be ~1 page when filled in. Be specific — generic statements about "AI being helpful" don't demonstrate understanding of the agent pattern.*
