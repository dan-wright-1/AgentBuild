# PRD Addendum
*Append-only log of requirement changes after initial PRD sign-off.*
*Do not edit PRD.md directly — add entries here.*

---

## 2026-03-23 — Streaming added to scope
**Change:** Streaming responses are now in scope (previously deferred to stretch goals). The agent will stream tokens via SSE from the LangGraph `.stream()` API. The UI will render tokens as they arrive.
**Scope impact:** Minor — affects `app/api/chat/route.ts` and `components/ChatInterface.tsx`
**Roadmap impact:** Streaming tasks moved from Stretch Goals into Phase 2.

---
