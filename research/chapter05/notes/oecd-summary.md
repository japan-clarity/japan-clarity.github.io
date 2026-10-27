# OECD / International Education Data Summary (Chapter 05: Education & Talent)

- **Task ID**: ch05-2-research. **Access dates**: 2026-10-27 (all fetches; UTC in
  `fetchlog.tsv`). This note was rebuilt byte-for-value after a sandbox
  environment reset on 2026-10-27 (see worklog `ch05-R-recovery`); every raw
  file was re-fetched from official domains and every value below is quoted
  from the archived raw files under `research/chapter05/raw/`. Nothing is
  recomputed, estimated, or drawn from memory.
- Fetch log: `notes/fetchlog.tsv` (79 rows: timestamp, HTTP status, bytes,
  sha256-16, URL, saved-as). Fetches that returned HTTP 503 (e-Stat throttling)
  were retried and the successful response is the archived file; the 503 body
  (identical 7,882-byte error page, sha256-16 `6279903b6a3f1614`) is archived
  as `*.http503` for transparency.
- API base: `https://sdmx.oecd.org/public/rest` (CSV-with-labels via
  `?format=csvfilewithlabels`; structure metadata as SDMX-JSON 2.0 via
  `Accept: application/vnd.sdmx.structure+json;version=2.0.0`) — the same
  pattern as Chapters 03/04.

## A. PISA (OECD Programme for International Student Assessment)

### A1. PISA 2025 — discovery and headline (NEW this cycle)

- **Published 2026-09-08 by NIER/MEXT.** Found via the NIER site restructure:
  the per-cycle report URLs now live under
  `https://www.nier.go.jp/05_kenkyu_seika/pisa/`.
- Archive: `raw/nier/pisa2025_point.pdf`
  (URL `https://www.nier.go.jp/05_kenkyu_seika/pisa/pdf/2025/01_point.pdf`,
  sha256-16 `c74870bee15b1a61`, 2,811,961 bytes) and
  `raw/nier/pisa2025_reference.pdf`
  (`…/pisa/pdf/2025/02_reference.pdf`, sha256-16 `9238b9a1c96b8499`,
  1,213,125 bytes). Index page `raw/nier/pisa-2025-index.html`
  (`…/pisa/index.html`, sha256-16 `3ba88bd10670f47d`).
- Japan 2025 mean scores (from the point report):
  **science ("科学コンピテンシー", renamed from 科学的リテラシー) 538; reading
  503; mathematics 525.** OECD averages (member average): science 482, reading
  461, mathematics 463.
- Japan's 2025 95% confidence intervals (report): mathematics 517–534, reading
  495–510, science 530–545.
- Japan is **first among the 38 OECD member countries in all three domains —
  the first time since the survey began** (report headline). Among all 91
  participants Japan ranks 5th (science), 4th (reading), 5th (math).
  Top scorers overall: Beijing-Shanghai-Jiangsu-Zhejiang (China) science 597 /
  math 612; Singapore reading 535.
- Reading fell a **significant 13 points from 2022** (516→503); mathematics
  (536→525) and science (547→538) declined **without statistical
  significance** (report's own significance table).
- First fully computer-based (CBT) cycle with multi-stage adaptive testing;
  ~760,000 students assessed. Countries failing at least one OECD sampling
  standard are flagged with ＊ in the source (Canada, New Zealand, USA,
  Netherlands, etc.) — carried into the chart note.
- 2025 questionnaire extras (same report, §3 質問調査): life satisfaction
  "satisfied+" Japan 68.9% (2018: 50.2; 2015: 61.1) vs OECD 70.6%; school
  belonging affirmative Japan 88.9% vs OECD 76.2%; family emotional-support
  index Japan −0.64 (37th of participating countries) vs OECD avg −0.19;
  ICT use at school 5th of 24 countries / outside school 2nd of 24.

### A2. PISA trend series (Japan + OECD average, 2000–2025)

Primary series source: MEXT's PISA 2022 national report chart labels
(`raw/mext/pisa-20240312-mxt_kokusai-000020406_3.pdf`, sha256-16
`289cd4e2f88dec83`, 5,267,466 bytes), decoded with pdfplumber coordinates and
cross-verified against the per-cycle NIER/MEXT reports fetched for every cycle:
2006 (`raw/nier/pisa2006_result.pdf`, `33759cb94e08ff52`), 2009
(`raw/nier/pisa2009_point.pdf`, `537165bdd77c4828`), 2012
(`raw/nier/pisa2012_point.pdf`, `68cb4b1ecf52e974`), 2015
(`raw/nier/pisa2015_point.pdf`, `6db0ab664d27b2c0`), 2018
(`raw/nier/pisa2018_point.pdf`, `6f5c1052da236c16`), plus the 2022-cycle
MEXT summary (`raw/mext/pisa-20240208-mxt_syoto01-000033870_4.pdf`,
`ee7e855918faccee`) and OECD-results press packs
(`pisa-oecd-results-ja.pdf` `0022dd83ce44129a` / `-en.pdf` `d4bd6d7a48a50bf9`).

Japan (trend-comparable design: math from 2003, reading from 2000, science
from 2006):

| Cycle | Math | Reading | Science |
|---|---|---|---|
| 2000 | — | 522 | — |
| 2003 | 534 | 498 | — |
| 2006 | 523 | 498 | 531 |
| 2009 | 529 | 520 | 539 |
| 2012 | 536 | 538 | 547 |
| 2015 | 532 | 516 | 538 |
| 2018 | 527 | 504 | 529 |
| 2022 | 536 | 516 | 547 |
| 2025 | 525 | 503 | 538 |

OECD average: math 500/498/496/494/490/489/472/463 (2003→2025); reading
500/494/492/493/496/493/487/476/461 (2000→2025); science 500/501/501/493/
489/485/482 (2006→2025; original-scale 2000=500, 2003=500 retained as
`_orig` keys, not charted as comparable).

- Science proficiency distribution (below Level 1 + Level 1 … Level 6+,
  science domain, 2006–2025): Japan low performers (≤L1) 12.0 (2006) → 8.0
  (2022) → **11.3 (2025, significant rise)**; OECD average 19.2 → 24.5 →
  25.7. Top performers (≥L5): Japan 15.0 (2022) → 13.9+3.2=17.2 (2025, no
  significant change); full 6-level arrays in `extracted-series.json`
  (`pisa2025_extra.proficiency_science`).
- Interpretive guard (Ch03 class): the −13 reading decline is significant per
  the report; math/science declines are not — narrative preserves both
  statements verbatim.

### A3. PISA 2025 international table (OECD-38 subset)

`extracted-series.json` `pisa.intl_2025_oecd38` — 11 areas (OECD + leading
members) × 3 domains, from the 2025 point report's international table:
e.g. math: EST 508, CHE 499, JPN 525, KOR 522, GBR 488, CAN 485, POL 484,
NLD 483, BEL 480, IRL 480, OECD 463. The chart displays these as levels, with
the CI-interchange caveat; the note states the OECD average is the **published
member average, not the average of displayed countries** (guard N12).

## B. PIAAC (Survey of Adult Skills)

### B1. Round 1 (2011–12 fieldwork) — verified

- Archive: `raw/mext/piaac2012_gaiyou.pdf`
  (`https://www.mext.go.jp/b_menu/toukei/data/Others/20220712-mxt_kouhou02-1.pdf`,
  sha256-16 `ee6456357bbbe893`, 1,233,256 bytes); portal page
  `piaac_portal.html` (`f066a1fe694747af`) and press release
  `piaac_houdou.html` (`caba17e76c54ec54`).
- Japan Round-1 means (0–500 scale): **literacy 296 (1st), numeracy 288
  (1st), problem-solving in technology-rich environments 294 (share at Level
  2+ = 35%).** OECD averages: 273 / 269 / 283 (34%).
- Equity gap (top-quintile minus bottom-quintile literacy): Japan **129 vs
  OECD 152** — the "high performance, high equity" finding used in the
  chapter.

### B2. Round 2 (2023 fieldwork, published 2024-12-10) — NOT OBTAINED (§D)

Not verified from any primary channel; the chapter discloses Round 2 as
INCONCLUSIVE and charts Round 1 only. Full failure record in §D below.

## C. Education at a Glance (EAG) via OECD SDMX

Five dataflows used (dataflow-definition JSONs archived under `raw/oecd/`):

| Dataflow | Purpose | Definition file (sha256-16) | Data file (sha256-16) |
|---|---|---|---|
| `OECD.EDU.IMEP,DSD_EAG_LSO_EA@DF_LSO_NEAC_DISTR,1.0` | attainment 25–64/25–34 | `dfdef-DF_LSO_NEAC_DISTR_EA1.0.json` `35e54cc09cd0f565` | `eag-attainment.csv` `a838a2234507ba92` |
| `OECD.EDU.IMEP,DSD_UOE_FIN@DF_UOE_INDIC_FIN_PERSTUD,3.2` | per-student spending | `dfdef-DF_UOE_INDIC_FIN_PERSTUD3.2.json` `810627b085afd3fd` | `eag-perstudent.csv` `27631503080ee423` |
| `OECD.EDU.IMEP,DSD_EAG_LSO_EA@DF_LSO_NEAC_EMP,1.0` | employment by attainment | `dfdef-DF_LSO_NEAC_EMP1.0.json` `1531a10799d8edad` | `eag-employment.csv` `120d7390b326ef52` |
| `OECD.EDU.IMEP,DSD_UOE_NF@DF_UOE_NF_ENRL_RATE,1.1` | ECEC participation | `dfdef-DF_UOE_NF_ENRL_RATE1.1.json` `caf21ca2431796cf` | `eag-ecec.csv` `40129e6d0bf4bedd` |
| `OECD.EDU.IMEP,DSD_LLS@DF_TRAINING,2.5` | adult training (fetched, not charted) | `dfdef-DF_TRAINING2.5.json` `125b621249220458` | `eag-adult-training.csv` `d8ad4caf1d97b763` |

**Key-syntax discovery (per-student flow):** full-length dimension keys with
`Q_SHEET=SOURCE` select the per-student data sheet — discovered from the
dataflow's actual content constraint (`dfdef-…PERSTUD…json`); without it the
query returns other sheets. OECD-average rows carry `REF_AREA=OECD` (not
"OECD38").

Verified values (extracted in `extracted-series.json` `eag_*` blocks):

- **Tertiary attainment (ISCED 5–8), Japan:** 25–34: 45.74 (1997) → 61.51
  (2019) → 66.01 (2024) → 67.53 (2025); 25–64: 30.53 (1997) → 57.02 (2024) →
  57.93 (2025). Comparators in extraction: KOR 25–34 2025 = 71.13; OECD
  25–34 2025 = 48.84 (exact series in `extracted-series.json`).
- **Per-FTE-student spending, current-price USD-PPP, core services, all
  funding sources:** Japan 2023 — ISCED 1: $10,995.5; ISCED 2–3: $12,968.6;
  **ISCED 5–8: $21,662.2** (vs OECD $14,906.0); all levels 1–8: $14,212.0 vs
  OECD $14,064.5. Reference years straddle 2022–2023 by country (disclosed).
- **Employment rate by attainment (2025):** Japan ISCED 3–4: 83.1; ISCED
  5–8: 88.3 (gap 5.2 pp); series 2015–2025 (82.3 → 88.3). **Japan's ISCED
  0–2 rows are ABSENT from the LSO-NEAC collection** — disclosed as a
  limitation, never interpolated.
- **ECEC participation (ISCED 0 enrolment, ages 3–5):** Japan 91.0 (2015) →
  95.2 (2022) → 95.9 (2023) → **95.2 (2024)** vs OECD 81.5 → 86.0. France
  ~99.8; Canada 32.2 (2024) — definitional variance disclosed (Japan's
  6-year-olds enter primary school, so ISCED-0 covers 3–5 only).

## D. Failure register (access attempts that did NOT yield data)

All attempted 2026-10-27 (UTC), recorded so that "not obtained" is auditable:

1. **PIAAC 2023 (Round 2) — all channels failed:**
   - NIER results page for PIAAC 2023: HTTP 404 (page removed/renamed in the
     site restructure; WARP collections for nict.go.jp/nier CDN blocked by
     CloudFront).
   - OECD.org country notes + OECD iLibrary data files: Cloudflare
     verification loop (challenge pages, no data body).
   - OECD SDMX API: no PIAAC dataflow exists (checked the full dataflow
     list — 1,552 flows, zero PIAAC matches).
   - OECD Data Explorer (data-explorer.oecd.org): reachable, but no PIAAC
     dataset appears in its catalog search.
   - Internet Archive (web.archive.org): network blocked from this
     environment.
   - Search engines: CAPTCHA walls before any result snippet.
   → Chapter treatment: **INCONCLUSIVE** — Round 1 charted, Round 2 disclosed
   as unverifiable with pointers to OECD/MEXT primary publications. No
   remembered or secondhand Round-2 numbers are used anywhere.
2. **E-Stat 503 throttling:** 13 of 17 nenji XLSX first attempts returned
   HTTP 503 (7,882-byte identical error page); all succeeded on retry after
   ~30 s spacing. Archived `.http503` bodies prove the retries were needed.
3. **PISA 2009 report URL scheme:** the modern NIER path pattern returns 404
   for 2009; the report was fetched via the archived mext.go.jp
   `a_menu/education/detail/__icsFiles/…1284443_05.pdf` URL (HTTP 200,
   sha256-16 `537165bdd77c4828`).

## E. Provenance discipline applied to chapter data

- Every chart's `sourceIds` resolves to a `SourceRecord` in
  `src/chapters/chapter-05/sources.ts` (11 records) whose URL matches a
  fetchlog row; archive sha256-16 values are recorded in this note and in the
  sources file.
- The OECD average is always labeled 加盟国平均/公表された加盟国平均 (member
  average), never as an average of displayed countries (guard N12).
- PISA scores are always 点 (scale points), never %; the three domains are
  never compared to each other (different scales); trend-comparable windows
  are stated per domain (guard: math 2003+ / science 2006+ / reading 2000+).
- Japan's PISA 2025 "first among OECD-38" is distinguished from "5th/4th/5th
  among all 91 participants" in both languages (population-base guard).
