# HAIROTICMEN Required Files to Add

## Priority 1 — Pricing blocker

Add these files first:

| File | System category | Target path | Purpose |
|---|---|---|---|
| hairoticmen_pricing_engine.md | pricing_doc | /opt/mh-assistant/data/brand-assets/hairoticmen/content/pricing/ | Human-readable pricing policy |
| hairoticmen_pricing_rules.json | pricing_doc | /opt/mh-assistant/data/brand-assets/hairoticmen/content/pricing/ | Machine-readable pricing rules |
| hairoticmen_pricing_master.csv | pricing_doc | /opt/mh-assistant/data/brand-assets/hairoticmen/content/pricing/ | Product-level price list |

## Priority 2 — Legal and compliance

| File needed | System category | Target path | Purpose |
|---|---|---|---|
| terms_and_conditions_de.md/pdf | legal_doc | /opt/mh-assistant/data/brand-assets/hairoticmen/content/legal/ | Website and sale terms |
| privacy_policy_de.md/pdf | legal_doc | /opt/mh-assistant/data/brand-assets/hairoticmen/content/legal/ | GDPR privacy policy |
| imprint_de.md/pdf | legal_doc | /opt/mh-assistant/data/brand-assets/hairoticmen/content/legal/ | German Impressum |
| returns_refunds_policy_de.md/pdf | legal_doc | /opt/mh-assistant/data/brand-assets/hairoticmen/content/legal/ | Returns/refunds |
| marketing_claims_rules.md | legal_doc | /opt/mh-assistant/data/brand-assets/hairoticmen/content/legal/ | Prevents unsafe product claims |

## Priority 3 — Proof and trust

| File needed | System category | Target path | Purpose |
|---|---|---|---|
| certificates.pdf/png | certificates | /opt/mh-assistant/data/brand-assets/hairoticmen/content/certificates/ | ISO/lab/quality claims |
| customer_reviews.csv/pdf | testimonials_reviews | /opt/mh-assistant/data/brand-assets/hairoticmen/content/reviews/ | Social proof |

## Priority 4 — Campaign and social

| File needed | System category | Target path | Purpose |
|---|---|---|---|
| campaign_brief_beard_launch.md | campaign_assets | /opt/mh-assistant/data/brand-assets/hairoticmen/campaigns/beard_launch/ | First campaign brief |
| social_templates.zip/png/mp4 | social_assets | /opt/mh-assistant/data/brand-assets/hairoticmen/campaigns/social-assets/ | Reusable social assets |

## Priority 5 — Partner system

| File needed | System category | Target path | Purpose |
|---|---|---|---|
| dealer_terms_de.md/pdf | partner_docs | /opt/mh-assistant/data/brand-assets/hairoticmen/content/partners/ | Händler rules |
| stand_partner_terms_de.md/pdf | partner_docs | /opt/mh-assistant/data/brand-assets/hairoticmen/content/partners/ | Stand rules |
| affiliate_terms_de.md/pdf | partner_docs | /opt/mh-assistant/data/brand-assets/hairoticmen/content/partners/ | Affiliate rules |
| sales_rep_terms_de.md/pdf | partner_docs | /opt/mh-assistant/data/brand-assets/hairoticmen/content/partners/ | Sales rep rules |

## Copy commands

```bash
mkdir -p /opt/mh-assistant/data/brand-assets/hairoticmen/content/pricing
cp hairoticmen_pricing_engine.md /opt/mh-assistant/data/brand-assets/hairoticmen/content/pricing/
cp hairoticmen_pricing_rules.json /opt/mh-assistant/data/brand-assets/hairoticmen/content/pricing/
cp hairoticmen_pricing_master.csv /opt/mh-assistant/data/brand-assets/hairoticmen/content/pricing/

KEY="$(grep '^MH_CONTROL_CENTER_WRITE_KEY=' /opt/mh-assistant/.env | cut -d= -f2-)"
curl -X POST http://localhost:3000/media-manager/project/hairoticmen/library/refresh -H "x-mh-control-key: $KEY"
```
