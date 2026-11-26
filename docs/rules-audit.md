# Ship-building rules audit

Reference: user-supplied Dark Matter Sci-Fi 5.5E v1.1 (June 13, 2026).
Page numbers below are printed page numbers, not PDF viewer indices. The source
book and extracted text are not included in this repository.

| Area | Reference | Result |
| --- | --- | --- |
| Crew grants, Pilot requirement, role prerequisites | 215 | Preserve starting crew-system grants; require an assigned mothership Pilot and at most two Pilot roles. |
| Level statistics and pooled credits | 218 | All 20 rows remain covered by regression tests; budget is 1,000 CR plus 150 CR per level after first, per player. |
| Hardpoint costs | 218-219 | Systems and weapons consume one slot; upgrades consume none. Purchase functions now enforce slots and pooled credits independently of UI buttons. |
| System prerequisites and repeat limits | 207-209 | Retain size gates and caps, including Fighter Bays, Pilot Seats and Teleporters. Direct system installation now respects these gates. |
| Upgrade prerequisites and repeat limits | 213-214 | Preserve size/engine gates and two-install Hypercapacitor exception. Expanded Shielding changes coverage, not shield capacity. |
| Weapon mounting | 211-213, 222 | Preserve fixed arc vs turret restrictions; changing a facing cannot bypass validation. Unknown fighter weapons are rejected. |
| Deployed fighters | 223 | Keep independent slots/loadouts and player MHP scaling; reject negative/fractional system counts and purchases beyond pooled credits. |
| Damage display | 223-224 | Show saved current MHP/SP independently of maximum values. A bay craft does not inherit carrier damage. Zero MHP is not automatically labeled destroyed. |

## Scope and limits

The audit covers builder arithmetic, purchase/validation boundaries, the above
prerequisites, and displayed damage telemetry. Existing fighter catalog and crew
action regression tests remain in place; this is not a certification of every
spell, NPC stat block, or optional rule in the book.

The app remains an editable build planner and dice aid. It does not enforce turn
order, range/line of sight, proficiency/mastery eligibility, ammunition/recharge,
shield facing, disabled systems, explosion saves or GM approvals. Imported builds
with gameplay errors remain editable and receive validation warnings. The crew
editor currently represents role types, rather than a separate roster entry for
every character sharing a role. Standalone custom fighter construction and manual
credit overrides remain explicitly GM options.

Schematic shield outlines represent charge only, not omnidirectional protection.
The amber/red hull thresholds are visual warnings, not additional game mechanics.
Untracked bay-fighter damage is not fabricated from the carrier's current MHP.
