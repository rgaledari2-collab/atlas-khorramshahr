# Invariant Lock: Village Services & Projects Module & Multi-Tier Beneficiary Model

## Context
Per user mandate:
1. Services live directly inside each village's window (`#servicesDialog`), accessible when clicking on a village and choosing Card 02 («کارپوشه اقدامات: خدمات، زیرساخت و پروژه‌ها» / `#servicesButton`).
2. There is NO standalone top-navbar button or floating registry dialog; all services functionality belongs inside `#servicesDialog` for that village (with an internal switcher to view other villages or the aggregate region).
3. The beneficiary model supports multi-tier categories (ایتام، سرپرست خانوار، کم‌برخوردار، توان‌یاب، دانش‌آموز، عمومی، سایر) and dynamic multi-tagging.
4. Every person with a service record must be fully indexed in the smart search database (`searchableData`) so that searching their name, national ID, or phone opens their dossier with their service history.
5. The Person Dossier (`openPersonDossier`) must prominently display the Service History Card (`#pdServicesContainer`) with dates, exact values, and delivery status.
6. Card 02 in the village sidebar (`#servicesMetricsPreview`) must dynamically display the real service metrics for the selected village.

## Required Invariants
1. `window.servicesRegistryData` must be maintained and reflect all imported service records from provided spreadsheets.
2. `window.openVillageServices(villageId)` must open `#servicesDialog` and populate it for the requested village.
3. `window.openPersonDossier` must always render `#pdServicesContainer` when services are present.
4. Every person (guardian or child) in `servicesRegistryData` must be indexed in `window.searchableData`.
5. High-priority scoring boost for orphans must remain preserved.

