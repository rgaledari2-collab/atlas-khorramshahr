# Invariant Lock: Orphan & Beneficiary Instant Search

## Context
The user has strictly requested that typing the name of orphans (ایتام) must ALWAYS instantly bring up their records at the top of the search results, directly from the main header search bar without hijacking the input.

## Required Invariants
1. `#smartSearchInput` must never have focus/click interceptors that blur it or redirect to dialogs without user input.
2. In `performSmartSearch()`, items with `personType === 'orphan'` or `badge === 'ایتام'` must have highest scoring precedence (+120 boost, +200 on orphan keyword).
3. `window.openPersonDossier` must remain exported and open `#personDossierDialog` on item selection.
4. Command Palette (Ctrl+K) must continue to include the orphans group as the primary result section.
