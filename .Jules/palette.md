## 2024-05-18 - Added form labels to Compiler and Compare views

**Learning:** The initial implementation relied on descriptive paragraphs to instruct users instead of semantic label tags, meaning screen readers would lack context for the textareas.

**Action:** Replaced descriptive text with associated `<label>` tags and added aria-labels to readonly inputs for better screen reader support.
