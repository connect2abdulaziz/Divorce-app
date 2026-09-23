# Document generation

## Template packs
| Folder | Track | Status |
|--------|--------|--------|
| `Divorce WOC/` | Without children | **Active** — AcroForm PDFs |
| `Divorce WC/` | With children | **Active** — 33 AcroForm PDFs, ~3826 fields |

Old flat PDFs under XAMPP `Divorce ALL PDFS` are **not** used.

## How Generate works
1. Selects pack via `selectDocumentPack()` (default: **filing** step)
2. Fills AcroForm fields from questionnaire data (`pdf-lib`)
3. Merges filled PDFs into one download

- **Filing packet (WOC)** — coversheet, petition, summons, injunction, notices  
- **Filing packet (WC)** — coversheet, petition, summons, injunction, notices, parent info order, affidavit re children, parenting plan  
- **Full pack** — filing + service + default + decree (admin)

## Key files
| File | Role |
|------|------|
| `catalog.ts` | WOC + WC template paths + pack selection |
| `case-values.ts` | Questionnaire → fill values (incl. children/parenting) |
| `fill-maps.ts` | Field-name maps (DRDA10FZ / DRDC15FZ richest) |
| `fill-acroform.ts` | pdf-lib fill + merge |
| `generate.ts` | Orchestration |
| `app/api/cases/[caseId]/documents/generate` | Download endpoint |

## Scripts
```bash
npm run docs:export-woc        # refresh WOC field inventory
npm run docs:export-wc         # refresh WC field inventory
npm run docs:generate-test     # both packs
npm run docs:generate-test -- wc   # with-children only
```
