# HAIROTICMEN Pricing & Offers Engine

## Status
Source file checked: `hairoticmen_product1.csv`

- Products: 89
- Currency: EUR
- Germany VAT: 19%
- Rule: **AI MUST NEVER INVENT PRICES**

## Source of Truth
Use the approved pricing files only:

1. `hairoticmen_pricing_master.csv` — product-level pricing table
2. `hairoticmen_pricing_rules.json` — machine-readable pricing logic
3. This document — human-readable pricing policy

## B2C / End Customer Pricing

Rule:
- B2C prices are **Brutto** prices.
- All prices shown to end customers include German VAT.
- Display price = final customer price.

Formula:

`Retail Netto = Retail Brutto / 1.19`

Example from uploaded CSV:
- BEARD OIL 50ML magnet box
- Retail Brutto: 17.99 EUR
- Retail Netto: 15.12 EUR approximately

## B2B / Dealer / Wholesale Pricing

Rule:
- Dealer and wholesale prices are **Netto** prices.
- VAT is added on invoice.
- Do not display B2B prices as tax-included customer prices.

Pricing tiers from the uploaded CSV:

| Tier | Threshold | CSV Field | VAT Treatment |
|---|---:|---|---|
| Dealer Basic | 500 EUR | Dealer Basic €500 | Netto |
| Dealer Plus | 1500 EUR | Dealer Plus €1500 | Netto |
| Authorizer | 3000 EUR | Authorizer €3000 | Netto |

## Stand / Affiliate / Sales Rep Commission

Rule:
- Commission rate: **25%**
- Commission base: **NETTO selling price**
- Never calculate commission from Brutto VAT-inclusive price.

Formula:

`Commission = Netto Selling Price × 25%`

## AI Safety Rules

The AI must follow these rules:

1. Never invent or estimate a missing price.
2. If a price is missing, return: `NEEDS_PRICING_REVIEW`.
3. Never create discounts, offers, bundles, coupons, or special terms unless they exist in an approved pricing/offers file.
4. Always distinguish B2C Brutto from B2B Netto.
5. Always calculate commissions from Netto price only.
6. Products marked `Needs Review` should not be treated as fully production-approved without manual approval.

## Required Upload Category

Upload/copy this pricing package into the system as:

- Asset type: `pricing_doc`
- Target folder: `content`
- Suggested path: `/opt/mh-assistant/data/brand-assets/hairoticmen/content/pricing/`

## Files in this pricing package

- `hairoticmen_pricing_master.csv`
- `hairoticmen_pricing_rules.json`
- `hairoticmen_pricing_engine.md`
