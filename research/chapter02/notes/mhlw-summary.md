# MHLW 毎月勤労統計調査 — Chapter 02 research summary

## Source identity

- **Agency:** 厚生労働省 (Ministry of Health, Labour and Welfare) — 政策統括官付参事官付雇用・賃金福祉統計室
- **Series:** 毎月勤労統計調査（全国調査）賃金指数・実質賃金指数 (調査産業計, 事業所規模5人以上, 現金給与総額)
- **Access/verification date:** 2026-10-25
- **License:** MHLW publication; extracted facts and fragment-length quotes with attribution;
  raw files NOT redistributed (research/DATA-LICENSES.md).

## Release chain used (vintages)

| Vintage file | Release | Base | Coverage used |
|---|---|---|---|
| 19t01r.xls / 19t06r.xls | 平成19年分結果確報 | 2005年平均=100 | nominal levels+YoY 1995–2007; real levels+YoY 1997–2007 |
| 27t01r.xls / 27t06r.xls | 平成27年分結果確報 | 2010年平均=100 | cross-check only (YoY overlaps) |
| 29ct01r.xls / 29ct06r.xls | 平成29年分結果確報 | 2015年平均=100 | nominal/real YoY 2005–2017 |
| 25ct01r.xlsx | 2025年分結果確報 (pub 2026-02-25) | 2020年平均=100 | levels 2018–2025; YoY + 実質前年比 2018–2025 |
| 2608t01r.xlsx / 2608t06p.xlsx | 2026年8月分結果確報 (pub 2026-10-23) | 2020年平均=100 | monthly 2026-01–08; annual levels verified unrevised; 国際比較表 |

Publication dates from the MHLW pages (saikin index, saved as raw/mhlw/saikin.html):
2025年分確報 2026-02-25掲載; 2026年8月分速報 2026-10-07; 2026年8月分確報 2026-10-23.
Response rate Aug-2026 survey: 22,241 / 33,045 establishments = 67.3% (概況 PDF p1).

## CRITICAL methodology notes (verbatim from MHLW 利用上の注意, mls-2608p-gaiyo.pdf p17)

- **Note 9 (2024 benchmark update):** 「2024（令和６）年１月分確報公表時に、労働者数推計を当時利用できる
  最新のデータ（2021（令和３）年経済センサス－活動調査）に基づき更新（ベンチマーク更新）した。…
  賃金・労働時間及びパートタイム労働者比率の2024（令和６）年（１月分確報以降）の前年同月比等については、
  2023（令和５）年にベンチマーク更新を行った参考値を作成し、この参考値と2024（令和６）年の値を比較する
  ことによりベンチマーク更新の影響を取り除いて算出しているため、指数から算出した場合と一致しない。」
  → The published 2024 YoY (+2.8% nominal) intentionally does NOT equal the raw index-level
  change (103.5 → 109.2 = +5.5%); the ~+2.6% level jump is the worker-count reweighting.
- **Note 6:** 「前年比などの増減率は、指数等により算出しており、実数で計算した場合と必ずしも一致しない。」
- **Note 8 (2018 部分入替え):** sample rotation since 2018; no retroactive level revisions.
- **Note ※ (2026-01 rotation):** 「2026（令和８）年１月に標本の部分入替えを行った際の新旧事業所の結果を
  比較したところ、現金給与総額では-1,582円（-0.5％）…の断層が生じている。」
- **実質賃金 definition (用語の説明 6):** 名目賃金指数を消費者物価指数（持家の帰属家賃を除く総合）で除して算出.

## Chain method used on this site (documented in extract-series.py)

Growth-chain anchored at 2020=100 (index base year) built from **published YoY only**:
- nominal YoY 1996–2004 (19t) / 2005–2017 (29ct) / 2018–2025 (25ct);
- real YoY 1998–2004 (19t06) / 2005–2017 (29ct06) / 2018–2025 (25ct 実質前年比).
Validations: YoY overlaps between vintages ≤0.35pp (revision noise, worst 0.3pp in 2007 real);
chained levels reproduce published levels 2018–2023 exactly (±0.06); chained YoY reproduce
published YoY ≤0.05pp; cumulative changes match vintage levels (±0.002) in 1995–2005,
1997–2005, 2005–2017 windows; raw 2024–2025 levels sit +2.59%/+2.58% above the chain =
the documented benchmark-update jump.

## Verbatim value quotes (annual, 調査産業計 現金給与総額)

- 25ct01r.xlsx rows (2020年平均=100): 2018 = 101.6 (前年比 1.4, 実質前年比 0.2);
  2020 = 100.0 (−1.2, −1.2); 2023 = 103.5 (1.2, −2.5); 2024 = 109.2 (2.8, −0.3);
  2025 = 111.7 (2.3, −1.3).
- 2608t01r.xlsx (確報): 2026年８月 index 97.9, 前年比 +3.9, 実質前年比 +1.6.
- 29ct06r.xls (2015年平均=100): 2005 = 110.3; 2017 = 100.5.
- 19t06r.xls (2005年平均=100): 1997 = 104.9; 2007 = 99.1.
- 概況 PDF 付表 (前年比): 2022年 +2.0 / 2023年 +1.2 / 2024年 +2.8 / 2025年 +2.3 (名目);
  実質: 2022 −1.0 / 2023 −2.5 / 2024 −0.3 / 2025 −1.3.
- 国際比較表 (各国公表による主要国の実質賃金, 前年比 %): 2023年 日本 −2.0, アメリカ +0.5,
  イギリス 0.0, ドイツ +0.2; 2024年 日本 0.0, アメリカ +1.0, イギリス +0.6, ドイツ +2.0;
  2025年 日本 −0.8, アメリカ +1.2, イギリス +1.2, ドイツ +0.9. Sources cited by MHLW:
  US BLS CES (real average hourly earnings, CPI-U deflated); UK ONS MWSS (A3WV);
  Germany Destatis Verdienstindex (VPI deflated). Japan = MLS nominal deflated by 総合 CPI.

## Known limitations

- Real-wage index levels post-2018 are not published as levels (only 実質前年比); our
  chained index is a derived series (labeled as such on the site).
- The 2018 survey-frame change (個人業主等の算入除外) and the 2024 benchmark update are
  crossed via published YoY — growth rates are comparable, levels embed breaks.
- Coverage: establishments ≥5 employees, 常用労働者 (incl. part-time); excludes
  proprietors, civil servants' special categories and agriculture/forestry/fisheries
  establishments not in the survey frame (per survey design).
