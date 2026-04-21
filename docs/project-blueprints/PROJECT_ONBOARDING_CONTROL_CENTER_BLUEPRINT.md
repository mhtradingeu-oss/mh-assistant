# Project Onboarding & Control Center Blueprint

## 1. Objective

This blueprint defines how any new project is:

- Created
- Structured
- Ingested into the system
- Connected to data sources
- Prepared for marketing operations

It also defines the Control Center UI structure.

---

## 2. Project Onboarding Flow

### Step 1 — Create Project

Required fields:

- Project Name
- Legal Entity Name
- Project Type (Ecommerce, Service, B2B, etc.)
- Market (Country)
- Primary Language
- Website URL
- Target Channels
- Execution Mode (default: semi_auto)

---

### Step 2 — System Initialization

Automatically create:

- brand-assets/
- products/
- content/
- campaigns/
- launch/
- execution/
- optimization/
- reports/
- integrations/

---

### Step 3 — Data Upload

Upload structured data into:

#### Brand Assets
- Logo (PNG + SVG)
- Brand Guidelines (PDF)
- Colors, Fonts, Tone

#### Product Data
- Product list (CSV/XLSX)
- Images (PNG/JPG)
- Videos (MP4)
- Specifications (PDF/DOCX)

#### Content Library
- Images
- Videos
- UGC
- Testimonials
- Scripts
- Emails

#### Commercial Docs
- Pricing
- Offers
- Policies
- B2B docs

#### Legal & Trust
- Company documents
- Certifications
- Compliance rules

---

### Step 4 — Source Integration

Connect:

- Website (WooCommerce / Shopify)
- Social Channels (Instagram, Facebook, TikTok)
- Email systems
- Marketplaces (Amazon, eBay)
- Analytics (GA, Pixel, etc.)

---

### Step 5 — Readiness Check

System evaluates:

- Missing brand assets
- Missing product data
- Missing integrations
- Missing legal/compliance elements
- Missing content assets

Output:
- Readiness Score
- Actionable Fix List

---

## 3. Control Center UI Structure

### Dashboard
- Project status
- Readiness score
- Execution mode
- Active campaigns
- Scheduled jobs

---

### Data & Assets
- Upload files
- View assets
- Source of truth
- Missing assets detection

---

### Products / Services
- Product list
- Intelligence status
- Prompt packs
- Channel packs
- Launch readiness

---

### Content Factory
- Content calendar
- Posts
- Blogs
- Emails
- Media generation

---

### Campaigns
- Campaign packages
- Launch waves
- Offers
- Channels

---

### Scheduler & Execution
- Scheduled jobs
- Execution results
- Mode switching

---

### Optimization
- Reviews
- Improvements
- Performance logs
- Learning insights

---

### Reports
- Weekly
- Campaign
- Product
- Channel

---

### Integrations
- Platforms
- APIs
- Connected services

---

## 4. System Rules

- No duplicate data sources
- Always prioritize Source of Truth
- Maintain structured data
- Ensure legal compliance before publishing
- Validate readiness before launch

---

## 5. Expected Outcome

A fully prepared project that is:

- Data-complete
- System-integrated
- Marketing-ready
- Execution-ready