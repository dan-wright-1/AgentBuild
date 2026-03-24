---
name: ai-project-docs
description: Initialize and maintain a structured set of AI-readable project documents for Salesforce development projects. Use this skill whenever starting a new project, generating a PRD, roadmap, changelog, QA task, UAT guide, or any project documentation. Trigger on phrases like "start a new project", "init project", "create project docs", "generate a PRD", "set up project structure", "create a roadmap", "write a UAT guide", or when the user wants to document a new feature or initiative. Always use this skill when the user asks to create ANY of the documents in the hierarchy below — even if they only ask for one.
---

# AI Project Docs

A skill for generating and maintaining a structured document hierarchy for Salesforce development projects. All documents are designed to be consumed by Claude Code across sessions, with a clear separation between immutable requirements and living operational docs.

---

## Document Hierarchy

### Design-Build Tier
*Created at project kickoff. Generated in sequence — each doc informs the next.*

| File | Purpose | Mutability |
|------|---------|------------|
| `ai/init.md` | Raw client conversation / discovery notes | Reference only |
| `CLAUDE.md` | SF project context — auto-loaded by Claude Code | Updated as needed |
| `ai/index.md` | Navigation map of all project files and current status | Living doc |
| `ai/prd.md` | Product Requirements — What & Why | **Immutable** |
| `ai/prd-addend.md` | Mutable log of requirement changes post sign-off | Append-only |
| `ai/mvp.md` | Minimum viable scope definition | Immutable after agreement |
| `ai/architecture.md` | Technical design overview | Updated as needed |
| `ai/roadmap.md` | Phase-based task checklist | Living doc |
| `ai/changelog.md` | Human-readable audit trail | Append-only |

### QA-Delivery Tier
*Created when the build is ready for review — not at kickoff.*

| File | Purpose |
|------|---------|
| `ai/delivery/qa-task.md` | Offshore QA walkthrough — fine-grained UI verification |
| `ai/delivery/uat-guide.md` | Client UAT smoke test — business outcome validation |

---

## Initialization Workflow

When the user asks to initialize a new project:

### Step 1: Gather init.md

If `ai/init.md` does not exist, ask the user to paste their initial client conversation, discovery notes, or requirements dump. Create the file immediately. **Do not generate any other docs until this exists** — it is the source of truth for everything else.

### Step 2: Generate Design-Build docs in order

Read `ai/init.md` thoroughly, then generate in this sequence:

1. `CLAUDE.md`
2. `ai/prd.md`
3. `ai/prd-addend.md` (empty shell with header)
4. `ai/mvp.md`
5. `ai/architecture.md`
6. `ai/roadmap.md`
7. `ai/changelog.md` (empty shell with header)
8. `ai/index.md` — **generated last**; maps all files above

---

## Document Templates

### CLAUDE.md
```markdown
# [Project Name] — Claude Context
*This file is auto-loaded by Claude Code at session start.*

## Salesforce Environment
- **Org Type**: [Production / Sandbox / Scratch Org]
- **API Version**: [e.g., 62.0]
- **Sandbox Name(s)**: [e.g., DEV, QA, UAT]
- **Deployment Method**: [SFDX / Metadata API / Change Sets]
- **Key Packages / Namespaces**: [list or "none"]

## Project Summary
[1–2 sentences from PRD problem statement]

## Session Start Checklist
When starting any new session on this project:
1. Read `ai/index.md` to orient
2. Check `ai/roadmap.md` for current phase and open tasks
3. Check `ai/prd-addend.md` for any requirement changes since last session

## AI Guidelines
- PRD is immutable — log any requirement changes to `ai/prd-addend.md`
- Append completed work summaries to `ai/changelog.md`
- Update checkbox status in `ai/roadmap.md` as tasks complete
- When working with unfamiliar SF APIs, LWC patterns, or packages, use Context7 MCP to pull current Salesforce documentation
```

---

### ai/init.md
```markdown
# Project Initialization Notes
*Created: YYYY-MM-DD*
*Source: [Client call / Slack thread / Email / Workshop]*

---

[Paste raw client conversation, discovery notes, or requirements dump here — unedited]
```

---

### ai/prd.md
```markdown
# Product Requirements Document
*Created: YYYY-MM-DD*
*Status: IMMUTABLE — Do not edit after sign-off. Log changes in ai/prd-addend.md*

---

## 1. Problem Statement
[What problem are we solving, and why does it matter now?]

## 2. Target Users
[Who is this for? Salesforce roles, personas, org context]

## 3. Goals & Success Metrics
[What does success look like? Measurable outcomes]

## 4. Key Features
### P0 — Must Have
-

### P1 — Should Have
-

### P2 — Nice to Have
-

## 5. User Stories
- As a [role], I want to [action] so that [outcome].

## 6. Out of Scope
-

## 7. Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|

## 8. Timeline & Milestones
| Milestone | Target Date | Notes |
|-----------|------------|-------|
```

---

### ai/prd-addend.md
```markdown
# PRD Addendum
*Append-only log of requirement changes after initial PRD sign-off.*
*Do not edit the PRD directly — add entries here.*

---

## [YYYY-MM-DD] — [Brief title of change]
**Requested by:** [name / role]
**Change:** [What changed and why]
**Scope impact:** None / Minor / Significant
**Roadmap impact:** [Which roadmap tasks are affected, if any]

---
```

---

### ai/mvp.md
```markdown
# MVP Definition
*Created: YYYY-MM-DD*
*Status: IMMUTABLE after team agreement*

---

## The One Core Problem We're Solving
[Single sentence — brutally specific]

## Minimum Feature Set (P0 only)
-

## Explicitly Cut for Now
-

## Simplest Technical Approach
[How we'll build the minimum — Salesforce-specific stack decisions]

## Validation Criteria
[How we'll know it's working for users before calling it done]
```

---

### ai/architecture.md
```markdown
# Architecture Document
*Created: YYYY-MM-DD | Last updated: YYYY-MM-DD*

---

## System Overview
[High-level description of what's being built]

## Salesforce Components
- **Objects**: [Standard/custom objects involved]
- **Flows**: [Flow names and purposes]
- **Apex**: [Classes, triggers if any]
- **LWC**: [Components if any]
- **Integrations**: [External systems, APIs, middleware]

## Data Model
[Key objects, relationships, key fields]

## Deployment Notes
[Sandbox strategy, org dependencies, metadata considerations, deployment order]

## Diagrams
[Mermaid diagrams can be embedded here — see optional section below]
```

---

### ai/roadmap.md
```markdown
# Project Roadmap
*Created: YYYY-MM-DD | Living document — update checkboxes as work completes*

---

## Phase 1: [Name]
- [ ] Task description
- [ ] Task description

## Phase 2: [Name]
- [ ] Task description

## Completed
<!-- Move checked items here when a phase is done -->
- [x] [Task] — completed YYYY-MM-DD
```

---

### ai/changelog.md
```markdown
# Changelog
*Append-only. Most recent entries at top.*
*Format: what was done, in plain English, by whom, deployed where.*

---

## [YYYY-MM-DD] — [Feature or Fix Title]
**Type:** Added | Changed | Fixed | Removed
**Summary:** [What was built or changed — one paragraph, plain English]
**Salesforce components affected:** [Objects, Flows, Apex classes, LWCs, etc.]
**Deployed to:** [Sandbox name, or "not yet deployed"]

---
```

---

### ai/index.md
*Generate this last, after all other files exist.*
```markdown
# Project Index
*Last updated: YYYY-MM-DD*

---

## What This Project Is
[1-sentence description]

## Current Phase
**[Phase name]** — [brief status note]

## Open Blockers
- [none]

## Document Map

| Document | Path | Purpose | Status |
|----------|------|---------|--------|
| Init Notes | `ai/init.md` | Raw discovery / client conversation | Reference |
| Claude Context | `CLAUDE.md` | SF environment + session guidelines | Active |
| PRD | `ai/prd.md` | Requirements & goals | Immutable |
| PRD Addendum | `ai/prd-addend.md` | Requirement change log | Active |
| MVP Definition | `ai/mvp.md` | Minimum viable scope | Immutable |
| Architecture | `ai/architecture.md` | Technical design | Active |
| Roadmap | `ai/roadmap.md` | Task checklist by phase | Active |
| Changelog | `ai/changelog.md` | Audit trail | Active |
| QA Task | `ai/delivery/qa-task.md` | Offshore QA walkthrough | [Not yet created / Active] |
| UAT Guide | `ai/delivery/uat-guide.md` | Client smoke test | [Not yet created / Active] |
```

---

### ai/delivery/qa-task.md
*Created when build is ready for QA — not at project init.*
```markdown
# QA Verification Task
*Created: YYYY-MM-DD*
*Assigned to: Offshore QA Team*
*Sandbox: [name] | Login as: [profile/user]*

---

## What Was Built
[Plain English summary of the feature or fix being tested]

## Prerequisites
- [ ] Logged into sandbox: [name]
- [ ] Using profile/user: [name]
- [ ] Test data in place: [instructions or "see setup steps below"]

## Test Scenarios

### Scenario 1: [Descriptive name]
**Steps:**
1. Navigate to [location in Salesforce]
2. [Action — be specific: field names, button labels, etc.]
3. [Action]

**Pass:** [What correct looks like]
**Fail:** [What incorrect looks like — be specific]

### Scenario 2: [Name]
[Repeat structure]

---

## Reporting Issues
[How to report: doc comment / Slack channel / email]
```

---

### ai/delivery/uat-guide.md
*Created based on QA task results — not at project init.*
```markdown
# Client UAT Guide
*Created: YYYY-MM-DD*
*Prepared by: [Your name / team]*

---

## Purpose
Confirm that what was delivered meets your business expectations. This is a high-level walkthrough — you don't need technical knowledge to complete it.

## What's Included in This Release
[Plain English: what was built and what it's supposed to do]

## How to Test

### Scenario 1: [Business outcome name — not technical]
**You are:** [role]
**Your goal:** [What you're trying to accomplish]

**Steps:**
1. Go to [location]
2. [Action in plain business language]
3. [Expected outcome]

**You should see:** [Plain English description]

### Scenario 2: [Name]
[Repeat structure]

---

## Submitting Feedback
[Contact / form / doc comment instructions]
```

---

## Ongoing Maintenance Rules

### When requirements change
- Add an entry to `ai/prd-addend.md`
- **Never edit `ai/prd.md`**
- Update `ai/roadmap.md` if tasks are affected
- Update `ai/index.md` if the current phase changes

### When work completes
- Check off the task in `ai/roadmap.md`
- Append a summary to `ai/changelog.md`
- Update "Current Phase" in `ai/index.md` if phase changed

### When starting a new Claude Code session
- `CLAUDE.md` loads automatically
- Read `ai/index.md` to orient
- Read `ai/roadmap.md` for open tasks

### When ready for QA / delivery
- Create `ai/delivery/qa-task.md` from the roadmap + changelog
- After QA is complete and issues resolved, create `ai/delivery/uat-guide.md`

---

## Optional: Mermaid Diagrams

For complex architecture or flow documentation, embed Mermaid diagrams directly in `ai/architecture.md`. They are text-based, version-controllable, and Claude Code can read and modify them.

Example prompt:
> "Create a Mermaid diagram showing the system architecture for [project] and embed it in ai/architecture.md"

Use for: data model relationships, process flows, integration diagrams, deployment pipeline.