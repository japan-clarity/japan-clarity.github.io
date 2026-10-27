# e-Stat / MEXT Domestic Education Data Summary (Chapter 05: Education & Talent)

- **Task ID**: ch05-2-research. **Access dates**: 2026-10-27 (UTC in
  `notes/fetchlog.tsv`). This note was rebuilt after the 2026-10-27 sandbox
  environment reset; all raw files were re-fetched from official domains and
  every value below is quoted from the archived raw files under
  `research/chapter05/raw/` and the anchored extraction
  `notes/extracted-series.json` (re-run: **991 checks passed, 0 failures**;
  sha256-16 of the JSON = `DATA_SNAPSHOT_HASH` recorded in
  `src/chapters/chapter-05/data.ts`).
- Basis note that governs the whole chapter: MEXT education statistics run on
  the **school year** (April–March), so "2024" = 2024 school year (令和6年度).
  All chapter prose labels school-year series as 年度 where the distinction
  matters.
- e-Stat file-download URLs are of the form
  `https://www.e-stat.go.jp/stat-search/file-download?statInfId=…&fileKind=0`;
  13 of 17 first attempts returned HTTP 503 (throttling; identical 7,882-byte
  error body archived as `*.http503`, sha256-16 `6279903b6a3f1614`) — all
  succeeded on spaced retry. Full URL↔file↔hash mapping in `fetchlog.tsv`.

## A. 学校基本調査 — long-run series (nenji XLSX pack, 1948–2014)

Archived under `raw/estat/`: 17 XLSX files (nenji_01 … nenji_17) covering
進学率 (`nenji_01`, sha256-16 `5ce50c79cb99ea15`), 在籍学生数
(`nenji_02` `817eaea086fb18bd`), 学校数 (`nenji_03` `124255af1a6d6750`),
卒業者 (`nenji_04` `16f3836c07dd206f`), 就職者割合 (`nenji_05`
`aa43df5cab19f34d`), 高等教育機関入学 (`nenji_06` `b5b10f5c9db64a4d`),
小学校/中学校/高等学校/特別支援 (`nenji_07`–`nenji_10`), 専修学校
(`nenji_11` `cdbcb260b5a4b8f3`), 大学 (`nenji_12` `1fa3172580654da4`),
大学院 (`nenji_13` `93e5e6a79712fcba`), 短大 (`nenji_14`
`e36a6ae8d712f7fd`), 高専 (`nenji_15` `dd01ad96b709324f`), and the
reason-by-reason long-absence table 1959–2014 (`nenji_16_chouki_kesseki`
`fe611970a9d857e1`) plus the 不登校率 figure PDF (`nenji_17_futoukou_ratio_fig`
`552227e4e935fb71`, with pdftotext sidecar).

Extracted long-run series (era conversion Heisei H = 1988 + y, Reiwa R =
2018 + y; NFKC normalization for full-width digits/％/（）):

- **高等学校等への進学率:** 通信制除く（本科）系列 1950 42.5 → 1955 51.5 →
  1970 82.1 → 1974 90.7 → 1995 95.7 → 2005–2017 ≈96.4 plateau → 2024 92.9
  → 2025 **92.7**. 計（通信制含む）系列： 1984 94.0 → 2010 98.0 →
  2017–2021 peak 98.8–98.9 → 2025 **98.6** (chapter stats value). 現役の
  大学等進学率： 1984 29.5 → 2025 **61.4** (男 59.7 / 女 63.2).
- **大学（学部）在籍者数:** 1948 11,978 (1.2万) → 1970 140.7万 → 2005 286.5万
  → 2024 295.0万 → 2025 **297.2万** (2,972,412; chart from nenji_12 +
  schoolbasic_r7r8). 専修学校在籍: 1976 13.1万 → 2025 **62.2万** (621,626).
- **長期欠席（30日以上）旧系列, 1991–2014** (`nenji_16` reason table):
  病気・経済的理由を除く「不登校」区分 — 1991 66,817 → 1998 127,692 → 2000
  134,286 → **2001 138,722 (peak)** → 2007 129,124 → 2011 117,259 → 2013
  119,356 → 2014 (旧系列最終) 122,650.
  - K014 identity recomputation (Ch04 lesson: never trust row sums blindly):
    計 = 病気 + 経済 + 不登校 + その他 recomputed for all 24 years — matches
    the printed 計 (0 mismatches).
- **不登校新旧系列接続:** 2014 junction — old series 122,650 vs new
  (unified 生徒指導調査) 122,897; difference ≈ 0.2% → **no strict level
  continuity**; the chart note carries both numbers (guard N9: removing the
  junction disclosure fails the gate).

## B. 生徒指導調査 R6 (school year 2024) — 児童生徒の問題行動等

Primary archive: `raw/mext/shidou_r6_gaiyou.pdf` (結果概要;
`https://www.mext.go.jp/content/20260305-mxt_jidou02-100002753_3.pdf`,
sha256-16 `a9aee9ebccbbc4d3`, 819,057 bytes) and `shidou_r6_kekka.pdf`
(結果; `20260116-mxt_jidou02-100002753_1_3.pdf`, `9f66d2a56e61fa29`,
2,213,743 bytes) with pdftotext `-layout` sidecars. R5 (2023) versions also
archived (`shidou_r5_gaiyou.pdf` `46b1dc0e9a1ad256`, `shidou_r5_kekka.pdf`
`f424146dff30a153`). Survey-history page
`mext_shidou_gaiyou_chousa.html` (`48b6d4c39aa5c9e5`) documents the
definition and series breaks (30-day basis since H3/1991; unification with
学校基本調査 from H27/2015 reporting).

Verified series (identity checks: いじめ計 = 小 + 中 + 高 + 特別支援 × all
12 years; 不登校計 = 小 + 中 × all 11 years — 0 mismatches):

- **いじめ認知件数 (計):** 2013 185,803 → 2016 323,143 → 2019 612,496 →
  2021 615,351 → 2022 681,948 → 2023 732,568 → **2024 769,022 (record
  high)**. By school type 2024: 小学校 610,612 (rate 101.9 per 1,000);
  中学校 135,865 (42.6); 高等学校 18,891 (5.9); 特別支援 3,654 (23.8);
  計 rate 61.3 per 1,000 (2013: 13.4).
- **ネットいじめ:** 2013 8,788 → 2018 16,334 → 2022 23,920 → 2023 24,678 →
  **2024 27,365**.
- **不登校 (小中計):** 2014 122,897 → 2017 144,031 → 2019 181,272 → 2021
  244,940 → 2022 299,048 → 2023 346,482 → **2024 353,970** (小 137,704 /
  中 216,266; rates 23.0 / 67.9 / 計 38.6 per 1,000).
- **新規不登校 (nonattendance starting mid-year):** 2014 65,796 → 2022
  154,607 → 2023 165,300 → **2024 153,828 — first decline in 9 years**.
- **自殺 (school-reported):** 2023 397 → **2024 413** (小中高; treated with
  the source's own caution: detailed investigation conducted for only 5.6%,
  so backgrounds are not captured; no causal framing).
- **暴力行為 (計):** 2024 128,859 (小 82,997 / 中 40,039 / 高 5,823).
- **重大事態:** 2013 179 → 2021 705 → 2023 1,306 → **2024 1,404**.
- **中退 (高等学校卒業予定者の中途退学):** 2023 46,238 → 2024 44,571;
  reason breakdown (进路変更 etc.) in extraction `dropout_reason_changeroute`.
- **解消率 (いじめ, year-end judged resolved):** 2024 **76.1%** (report
  body; 進行中 21.6% / 解消未満 1.8% / 不詳 0.4% — quoted in chapter).
- MEXT's own reading, carried verbatim in the chapter: the rise in
  recognized cases reflects the spread of the legal definition (いじめ防止
  対策推進法) and proactive recognition/精緻化 — **not straightforwardly
  worsening reality** (guard: no claim equating count growth with actual
  deterioration).
- Definition notes (from the survey-history page): いじめ認知件数 counts
  incidents recognized under the law's definition; 不登校 = 30+ days absent
  excluding illness/finance; 重大事態 = Article 28 (life/body/property harm
  or相当期間の欠席).

## C. 学習費調査 R5 (school year 2023)

Archives: `raw/mext/gakushuuhi_r5_1.pdf` (ポイント;
`20260116-mxt_chousa01-000039333_1.pdf`, sha256-16 `c07853cbbcdbfe15`),
`_2.pdf` (概要, `ff2bbda83d3a4c88`), `_3.pdf` (結果, `fe8683df425cba78`),
plus H30 and R3 rounds (`gakushuuhi_h30_*.pdf`, `gakushuuhi_r3_*.pdf`) for
the kindergarten 6-round private/public history.

Verified (per-child annual total spending by guardians, school year 2023):

| Stage | Public | Private |
|---|---|---|
| 幼稚園 | 184,646 円 | 347,338 円 |
| 小学校 | 366,599 円 | 1,741,516 円 |
| 中学校 | 542,450 円 | 1,560,359 円 |
| 高等学校（全日制） | 596,954 円 | 1,179,261 円 |

- Private-share context from the report body: 私立学校に通う者の割合 —
  幼稚園 88.3% / 小学校 1.3%. The chapter's note: spending differences
  reflect sector composition as well as prices (支出≠質 guard).
- 幼稚園 6-round history (公立/私立) extracted for the long-run chart.

## D. 学校基本調査 R7 確報 / R8 速報 (2025 / 2026)

- R7 確報 概要: `raw/mext/kihon_r7_kakuhou_gaiyou.pdf`
  (`20251226-mxt_chousa01-000044291_01.pdf`, sha256-16 `aefb21b8ed966379`,
  926,321 bytes) + e-Stat R7 tables (`raw/estat/r7_*.xlsx`: 高校卒業後状況
  `r7_jhs_sotsugo_joukyou` `879fd46eae006c20`, `r7_hs_sotsugo_joukyou`
  `e754c347a2498b09`, 外国人学生 国籍/学科/大学院 tables
  `r7_univ_gaikokujin_kokuseki` `24299bbeeba5b511` etc., 高等教育機関まとめ
  `r7_kotou_soukatsu` `5f05246687995f99`). R7 確報 ページ
  `mext_kihon_r7_kekka.html` (`dcb5ea2a8af1a838`).
- R8 速報 概要: `raw/mext/kihon_r8_sokuhou_gaiyou.pdf`
  (`20260826-mxt_chousa01-000050842_01.pdf`, sha256-16
  `9067324d03623430`, 524,384 bytes) + `raw/estat/r8_sokuhou_*.xlsx`
  (soukatsu `922ee52915c8a7c0`, chuugaku `ffe566699c7043c1`, koutou_seito
  `8f54772fc01609d5`, koutou_tsuushin `7be33ae8732e0c56`). Page
  `mext_kihon_r8sokuhou.html` (`6cf457d9c9333a72`).
  **R8 = 速報値 (preliminary; final due 2026-12)** — labeled as such in the
  chapter; only school counts (幼稚園 7,922 / 小 18,383 / 中 9,761 for 2026)
  are cited from it.
- R7 headline values (used in chapter stats): 高校等卒業後 **大学等進学率
  (現役) 61.4%** (大学 58.3% + 短大等 3.1%); 専門学校進学 14.4%; 就職 13.8%;
  高等教育機関進学率 (過去卒業者含む) **85.4%**; 高等学校等進学率 (中卒)
  **98.6%** (from nenji/R7 series).
- **外国人学生 (大学等, 国籍・地域ベース):** 2024 101,357 → **2025
  107,206**. Definition disclosure (guard N4): this is the 学校基本調査's
  nationality basis — **not** the same as JASSO's 留学生 statistics, which
  use 在留資格 basis; the chapter never equates them.
- 大学在籍 R3–R7: 2,917,998 (2021) → 2,949,795 (2024) → **2,972,412
  (2025)**.

## E. PISA domestic archive (MEXT mirror)

MEXT-hosted copies fetched as cross-verification for the NIER cycle reports
(see oecd-summary.md §A2): `pisa-20240312-…_3.pdf` (2022 full national
report; trend chart source), `pisa-20240208-…_4.pdf` (2022 survey
explanation), `pisa-oecd-results-ja/-en.pdf` (2022 OECD-results press packs).

## F. Limitations & disclosure register (domestic)

1. 生徒指導調査 latest published round = R6 (2024 school year); **R7 results
   not yet published as of 2026-10-27** — nothing from R7 生徒指導 appears.
2. Inner tables of the full 結果 report garble under embedded fonts; trend
   series were taken from the 結果概要 tables and cross-checked against body
   text. The high-school nonattendance trend table could not be machine
   extracted → **not charted** (transparency over fabrication).
3. 不登校 series joins two bases (1991–2013 K014-based, 2014+ unified) with
   a ≈0.2% junction gap — disclosed on the chart, never smoothed.
4. 自殺 numbers are school-reported with 5.6% detailed-investigation rate —
   framed as counts, not causes; no trend extrapolation.
5. R8 (2026) 学校基本調査 values are 速報 (preliminary).
6. 外国人学生 = nationality basis; JASSO 留学生 = residence-status basis —
   stated wherever the figure appears.
7. 学習費調査 measures guardian spending (school year 2023); it is not a
   quality measure — the chapter's "支出≠質" note.
