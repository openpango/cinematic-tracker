## [LRN-20260306-001] correction

**Logged**: 2026-03-06T02:28:09+01:00
**Priority**: high
**Status**: promoted
**Area**: tests

### Summary
Always test the application at the end of a phase.

### Details
The user corrected my workflow, pointing out that I was completing phases without formally verifying the application's runtime state. As an autonomous agent building premium software, I must ensure that features actually work before moving on.

### Suggested Action
Mandate a strict `Verification Mode` test run (e.g., executing `npm run build`, testing the app in the browser, or capturing screenshots) at the end of every task or phase checklist. Promote this to the `soul.md`.

### Metadata
- Source: user_feedback
- Related Files: .agent/soul.md
- Promoted: .agent/soul.md

---
