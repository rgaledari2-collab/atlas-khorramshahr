# Invariant Lock: Services Registry & Multi-Tier Beneficiary Model

## Context
The user has strictly mandated that:
1. Every service record (رویداد دندانپزشکی، بسته‌های ارزاق، قربانی و سایر خدمات) must be rigorously linked to beneficiaries and households.
2. The beneficiary model must support multi-tier categories (ایتام، سرپرست خانوار، کم‌برخوردار، توان‌یاب، دانش‌آموز، عمومی، سایر) and dynamic multi-tagging.
3. Every person with a service record must be fully indexed in the smart search database (`searchableData`) so that searching their name, national ID, or phone opens their dossier with their service history.
4. The Person Dossier (`openPersonDossier`) must prominently display the Service History Card (`#pdServicesContainer`) with dates, exact values, and delivery status.
5. The top-level Services Registry (`#servicesRegistryDialog` and `#topServicesRegistryBtn`) must remain accessible and functional.

## Required Invariants
1. `window.servicesRegistryData` must be maintained and reflect all imported service records from provided spreadsheets.
2. `window.openPersonDossier` must always render `#pdServicesContainer` when services are present.
3. Every person (including general villager or orphan) in `servicesRegistryData` must be indexed in `window.searchableData`.
4. High-priority scoring boost for orphans must remain preserved.
