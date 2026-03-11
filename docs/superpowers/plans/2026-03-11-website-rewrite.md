# ApolloIQ Website Rewrite Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the entire ApolloIQ marketing website from a Webflow export (21 pages, 8,574-line CSS) to a clean Astro + Tailwind CSS project, preserving all content, brand identity, and URL paths while modernizing the design inspired by Heidi Health.

**Architecture:** Static site built with Astro 5.x using file-based routing that mirrors the existing URL structure. Shared layout components (Nav, Footer, CTA) eliminate duplication across 21 pages. Tailwind CSS v4 provides utility-first styling with a custom design token config matching the ApolloIQ brand. All existing images are reused from the current `images/` directory. The site deploys to GitHub Pages via a single GitHub Actions workflow. **Content-heavy product pages** (ScribeCraft and future products) use a **ProductDocsLayout** with a persistent left-hand sidebar navigation (inspired by Ascult.ai's help centre pattern) — collapsible category groups, icon-prefixed links, sticky sidebar, responsive mobile drawer. This layout is reusable across all products as they grow.

**Tech Stack:** Astro 5.x, Tailwind CSS v4, TypeScript, GitHub Actions (deployment)

---

## Chunk 1: Project Setup & Design System

### Task 1: Initialize Astro Project

**Files:**
- Create: `astro-site/package.json`
- Create: `astro-site/astro.config.mjs`
- Create: `astro-site/tsconfig.json`
- Create: `astro-site/tailwind.config.mjs`
- Create: `astro-site/src/styles/global.css`

- [ ] **Step 1: Create project directory and initialize Astro**

```bash
cd "C:\Apolloiq\Apolloiq website webflow\site"
mkdir astro-site && cd astro-site
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
cd "C:\Apolloiq\Apolloiq website webflow\site\astro-site"
npm install
npm install @astrojs/tailwind tailwindcss @astrojs/sitemap
```

- [ ] **Step 3: Configure astro.config.mjs**

```js
// astro-site/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vre23.github.io',
  base: '/apolloiq-website-preview',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  build: {
    assets: '_assets',
  },
});
```

- [ ] **Step 4: Configure Tailwind with ApolloIQ brand tokens**

```js
// astro-site/tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2c70eb',
          'blue-dark': '#1a5bc7',
          green: '#00c393',
          teal: '#04bb9c',
          'teal-dark': '#10a5b3',
          black: '#191d21',
          grey: '#4a4a4a',
          'grey-muted': '#667085',
          'grey-light': '#98a2b3',
          'grey-border': '#eaecf0',
          'grey-bg': '#f6f6f6',
          'grey-bg-subtle': '#f9fafb',
          dark: '#1d2939',
          'dark-medium': '#344054',
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      maxWidth: {
        'site': '1340px',
        'site-narrow': '1100px',
        'content': '800px',
      },
      borderRadius: {
        'card': '20px',
        'btn': '10px',
      },
      boxShadow: {
        'card': '4px 4px 30px 10px rgba(0, 0, 0, 0.06)',
        'card-lg': '4px 4px 30px 10px rgba(0, 0, 0, 0.08)',
        'hover': '4px 4px 30px 10px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(274deg, #00c393, #00c393 23%, #04bb9c 37%, #10a5b3 60%, #2381d9 88%, #2c70eb)',
        'hero-gradient': 'linear-gradient(135deg, rgba(29,41,57,0.03) 0%, rgba(44,112,235,0.06) 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1d2939, #344054)',
        'cta-gradient': 'linear-gradient(135deg, #2c70eb, #00c393)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'marquee': 'marquee 60s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Create global CSS**

```css
/* astro-site/src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    @apply font-roboto text-brand-black bg-white;
    font-size: 16px;
    line-height: 1.6;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-roboto;
  }
}

@layer components {
  /* Gradient text utility */
  .text-gradient {
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(274deg, #00c393, #00c393 23%, #04bb9c 37%, #10a5b3 60%, #2381d9 88%, #2c70eb);
    -webkit-background-clip: text;
    background-clip: text;
  }

  /* Primary button */
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white font-medium
           rounded-btn border-2 border-brand-blue transition-all duration-300 text-[17px] leading-6;
  }
  .btn-primary:hover {
    @apply bg-brand-blue-dark border-brand-blue-dark shadow-lg;
  }

  /* Secondary button */
  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-brand-blue font-medium
           rounded-btn border-2 border-brand-blue transition-all duration-300 text-[17px] leading-6;
  }
  .btn-secondary:hover {
    @apply bg-brand-blue text-white;
  }

  /* Section wrapper */
  .section {
    @apply py-20;
  }
  .section-sm {
    @apply py-12;
  }

  /* Container */
  .container-site {
    @apply max-w-site mx-auto px-[5%];
  }

  /* Card styles */
  .card {
    @apply bg-white rounded-card shadow-card p-8 transition-all duration-300;
  }
  .card:hover {
    @apply shadow-hover;
  }

  /* Dark card */
  .card-dark {
    @apply bg-dark-gradient rounded-card shadow-card-lg p-8 text-white;
  }
}

/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');
```

- [ ] **Step 6: Copy images directory**

```bash
# Symlink or copy existing images into the Astro public folder
cp -r "C:\Apolloiq\Apolloiq website webflow\site\images" "C:\Apolloiq\Apolloiq website webflow\site\astro-site\public\images"
```

Also copy favicon and apple-touch-icon:

```bash
# These are already in images/ so they'll be copied above
```

- [ ] **Step 7: Commit**

```bash
cd "C:\Apolloiq\Apolloiq website webflow\site\astro-site"
git init
git add -A
git commit -m "feat: initialize Astro project with Tailwind CSS and brand tokens"
```

---

### Task 2: Create Base Layout

**Files:**
- Create: `astro-site/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create base layout with HTML boilerplate**

```astro
---
// astro-site/src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'AI & Automation for Modern Healthcare' } = Astro.props;
const base = import.meta.env.BASE_URL;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{title} | ApolloIQ</title>
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/png" href={`${base}images/686e911b4fffa681e585469e_creier-gradient.png`} />
  <link rel="apple-touch-icon" href={`${base}images/686e917cee44d5055d111740_creier-gradient_(1).png`} />
</head>
<body class="font-roboto text-brand-black bg-white">
  <slot name="nav" />
  <main>
    <slot />
  </main>
  <slot name="footer" />
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add base layout component"
```

---

### Task 3: Create Navigation Component

**Files:**
- Create: `astro-site/src/components/Nav.astro`

- [ ] **Step 1: Build navigation with dropdowns**

The navigation must include:
- Logo (links to home)
- Home link
- Merlin dropdown (Spells + Automated Workflows submenus)
- Services dropdown (3 services)
- Pricing link
- Case Studies link
- About Us link
- "Go to Merlin" CTA button

Build with Tailwind classes. Use a `<details>` element or CSS-only hover dropdown for the mega menus (no JS required). Mobile hamburger menu uses a checkbox toggle pattern.

Key design notes (inspired by Heidi Health):
- Sticky navbar with white background and subtle bottom border on scroll
- Clean, minimal nav links with hover color transition to brand-blue
- Generous spacing between nav items
- Mobile menu slides in from right with overlay

The nav should be responsive:
- Desktop: horizontal nav with hover dropdowns
- Mobile (< 960px): hamburger menu with slide-out drawer

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add navigation component with dropdowns"
```

---

### Task 4: Create Footer Component

**Files:**
- Create: `astro-site/src/components/Footer.astro`

- [ ] **Step 1: Build footer with 3-column link layout**

Footer structure:
- Logo + company tagline ("Choose the innovative services of ApolloIQ for your company")
- Quick Links column: Products, Services, Pricing, Case Studies, Testimonials, About us
- Social column: LinkedIn
- Other column: Privacy Policy, Email
- Credit line: "Created by: stencildesign.co.uk"

Design: generous padding (py-20), muted text colors, hover transitions to brand-blue.

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add footer component"
```

---

### Task 5: Create CTA Section Component

**Files:**
- Create: `astro-site/src/components/CTASection.astro`

- [ ] **Step 1: Build reusable CTA section**

This component appears on nearly every page. Contains:
- "Get in Touch" heading with gradient text on "Touch"
- Contact form (Name, Email, Message, Submit, Consent checkbox)
- Sidebar text with email link

Design: rounded-card container with subtle background, shadow-card.

- [ ] **Step 2: Commit**

```bash
git add src/components/CTASection.astro
git commit -m "feat: add CTA section component"
```

---

### Task 6: Create Shared UI Components

**Files:**
- Create: `astro-site/src/components/SectionHeader.astro`
- Create: `astro-site/src/components/FeatureCard.astro`
- Create: `astro-site/src/components/StatsBar.astro`
- Create: `astro-site/src/components/TestimonialCard.astro`
- Create: `astro-site/src/components/PricingCard.astro`

- [ ] **Step 1: Create SectionHeader component**

Props: `title` (string with HTML for gradient spans), `subtitle` (optional), `centered` (boolean).

- [ ] **Step 2: Create FeatureCard component**

Props: `icon` (SVG string), `title`, `description`, `link` (optional).

- [ ] **Step 3: Create StatsBar component**

Props: `stats` (array of {value, label}).

- [ ] **Step 4: Create TestimonialCard component**

Props: `quote`, `author`, `role`, `image`.

- [ ] **Step 5: Create PricingCard component**

Props: `title`, `price`, `period`, `features` (array), `cta` (text + link), `highlighted` (boolean).

- [ ] **Step 6: Commit all shared components**

```bash
git add src/components/
git commit -m "feat: add shared UI components (SectionHeader, FeatureCard, StatsBar, etc.)"
```

---

### Task 6.5: Create ProductDocsLayout (Left-Hand Sidebar Pattern)

**Files:**
- Create: `astro-site/src/layouts/ProductDocsLayout.astro`
- Create: `astro-site/src/components/DocsSidebar.astro`

- [ ] **Step 1: Create DocsSidebar component**

This is the Ascult.ai-style left-hand sidebar used on all content-heavy product pages. Structure:

```
┌─────────────────────┬──────────────────────────────────────┐
│  SIDEBAR (290px)    │  CONTENT AREA (flex-1, max 900px)    │
│                     │                                      │
│  Product Name       │  [Section content shows/hides        │
│  ─────────────      │   based on sidebar selection]        │
│  📖 Guides          │                                      │
│    ▸ Quick Start    │  Currently visible section content   │
│    ▸ Accuracy Tips  │  with headings, text, tips,          │
│                     │  interactive elements, etc.           │
│  ❓ FAQs            │                                      │
│    ▸ About          │                                      │
│    ▸ How It Works   │                                      │
│    ▸ Security       │                                      │
│    ...              │                                      │
│                     │                                      │
│  📊 ROI Calculator  │                                      │
│  📋 Practice Audit  │                                      │
└─────────────────────┴──────────────────────────────────────┘
```

Props:
- `productName` (string) - shown at top of sidebar
- `categories` (array) - list of sidebar categories, each with:
  - `id` (string) - unique section id
  - `label` (string) - display name
  - `icon` (string) - SVG icon
  - `children` (optional array) - sub-links within this category

Features:
- Sticky sidebar (position: sticky, top: 0, height: 100vh)
- Collapsible category groups with chevron rotation
- Active link highlighting (brand-blue left border + bg tint)
- Subtle hover states on category headers (icon bg changes to brand-blue)
- Scrollbar styling (thin, custom thumb)
- Mobile: hidden by default, shown via floating toggle button (bottom-left, gradient bg)
- Mobile: slide-in drawer with backdrop overlay
- Mobile: close button in sidebar header

CSS classes: Use Tailwind utilities. Sidebar bg: `bg-gray-50`, border: `border-r border-gray-200`.

- [ ] **Step 2: Create ProductDocsLayout**

This layout wraps the sidebar + content area. Used by ScribeCraft (and future products).

```astro
---
// astro-site/src/layouts/ProductDocsLayout.astro
import BaseLayout from './BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import DocsSidebar from '../components/DocsSidebar.astro';

interface Props {
  title: string;
  description?: string;
  productName: string;
  heroTitle: string;
  heroDescription: string;
  breadcrumb: { label: string; href: string }[];
  categories: {
    id: string;
    label: string;
    icon: string;
    children?: { id: string; label: string }[];
  }[];
}

const props = Astro.props;
---

<BaseLayout title={props.title} description={props.description}>
  <Nav slot="nav" />

  <!-- Hero Banner -->
  <section class="py-16 bg-hero-gradient">
    <div class="container-site text-center">
      <nav class="text-sm text-brand-grey-muted mb-4">
        {props.breadcrumb.map((item, i) => (
          <>
            {i > 0 && <span class="mx-1">/</span>}
            <a href={item.href} class="text-brand-blue hover:text-brand-blue-dark font-medium">{item.label}</a>
          </>
        ))}
      </nav>
      <h1 class="text-4xl md:text-5xl font-light text-brand-black mb-4">
        {props.heroTitle}
      </h1>
      <p class="text-lg text-brand-grey-muted max-w-xl mx-auto">{props.heroDescription}</p>
    </div>
  </section>

  <!-- Sidebar + Content Layout -->
  <div class="flex min-h-[calc(100vh-80px)] relative">
    <DocsSidebar
      productName={props.productName}
      categories={props.categories}
    />
    <div class="flex-1 max-w-[900px] mx-auto px-6 md:px-12 py-10 min-w-0">
      <slot />
    </div>
  </div>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/ProductDocsLayout.astro src/components/DocsSidebar.astro
git commit -m "feat: add ProductDocsLayout with left-hand sidebar navigation"
```

**Important:** This layout is designed to be reusable. When other products (Blood Pressure Scroll, Locate Elixir, CDM, etc.) grow more content, they simply switch from the standard BaseLayout to ProductDocsLayout and define their own `categories` array.

---

## Chunk 2: Core Pages

### Task 7: Homepage

**Files:**
- Create: `astro-site/src/pages/index.astro`

- [ ] **Step 1: Build homepage**

Sections to include (same content as current site, modernized layout):

1. **Hero**: "AI & Automation for Modern Healthcare" with gradient text, stats row (practices, patients, hours saved), two CTAs (View Products, Get in Touch). Design: full-width with subtle gradient background, clean typography, inspired by Heidi Health's hero pattern.

2. **Logo Marquee**: Scrolling client logos + UKCA/ISO badges. CSS animation (no JS).

3. **Our Mission**: Centered text block about transforming healthcare with automation.

4. **Testimonials**: Grid of 4 testimonial cards with client photos, quotes, names, practices.

5. **What We Do**: "Digital Process Automation" section with icon + description.

6. **Why ApolloIQ**: 3-column feature grid (Clinical Expertise, Proven Results, Trusted by Practices).

7. **Case Studies**: 2-column grid showing Forestside and Taunton Vale case study cards with images.

8. **CTA Section**: Reuse CTASection component.

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage"
```

---

### Task 8: About Page

**Files:**
- Create: `astro-site/src/pages/about/index.astro`

- [ ] **Step 1: Build about page**

Sections:
1. **Hero**: "Who We Are: Innovators in Healthcare Automation"
2. **Who We Are**: Taunton-based team description
3. **Why ApolloIQ**: 3 differentiators
4. **Our Story**: Founded due to admin burden in GP practices
5. **Our Mission**: Access to advanced automation tools
6. **Team Grid**: 5 team members with photos, names, titles, LinkedIn links
   - Razvan Valcu (CEO), Vlad Repede (COO), Radu Ancas (CTO), Claudiu Tugui (Lead Eng), Andreea Tugui (SW Eng)
7. **Values**: 5 core values in card grid
8. **Journey**: Timeline from 2023 founding to present
9. **Testimonials**: 4 client testimonials
10. **CTA Section**

- [ ] **Step 2: Commit**

```bash
git add src/pages/about/index.astro
git commit -m "feat: add about page"
```

---

### Task 9: Contact Page

**Files:**
- Create: `astro-site/src/pages/contact-us/index.astro`

- [ ] **Step 1: Build contact page**

Sections:
1. **Hero**: "Get In Touch with ApolloIQ"
2. **Contact Form**: Full-width form with Name, Email, Message, Submit
3. **Direct Contact**: Email link, phone number if available
4. **CTA blurb**: "We're here to help"

- [ ] **Step 2: Commit**

```bash
git add src/pages/contact-us/index.astro
git commit -m "feat: add contact page"
```

---

### Task 10: Pricing Page

**Files:**
- Create: `astro-site/src/pages/pricing/index.astro`

- [ ] **Step 1: Build pricing page with tabs**

Two tabs: "Spells" and "Automated Workflows"

**Spells Tab** (4 products):
- Blood Pressure Scroll: £15/£10/Custom
- Locate Elixir: £20/£13/Custom
- Scribe Craft: £24.99/£16.99/Custom
- All Services Bundle: £59.99/£39.99/Custom
Tiers: Individual User, Organisation (min 5 users), Enterprise

**Automated Workflows Tab** (4 products):
- Pathology Automation: £0.30/patient/year
- Clinical Document Management: £0.30/patient/year
- Clinical Calculator QRisk3: £150/1,000 patients
- GP List Reallocation: £225/GP full, £75/GP partial

Tab switching via CSS `:checked` radio buttons (no JS needed).

- [ ] **Step 2: Commit**

```bash
git add src/pages/pricing/index.astro
git commit -m "feat: add pricing page with tabs"
```

---

### Task 11: Privacy Policy Page

**Files:**
- Create: `astro-site/src/pages/privacy-policy/index.astro`

- [ ] **Step 1: Build privacy policy page**

Preserve all existing privacy policy content. Use clean typographic styles for long-form legal text.

- [ ] **Step 2: Commit**

```bash
git add src/pages/privacy-policy/index.astro
git commit -m "feat: add privacy policy page"
```

---

## Chunk 3: Product Pages

### Task 12: Products Overview Page

**Files:**
- Create: `astro-site/src/pages/products/index.astro`

- [ ] **Step 1: Build products overview**

Two sections:
1. **Spells**: Cards for ScribeCraft, Blood Pressure Scroll, Locate Elixir
2. **Automated Workflows**: Cards for Pathology Automation, Clinical Document Management, QRisk3 Calculator, GP List Reallocation

Each card: icon, title, short description, link to product page.
Inspired by Heidi Health's product feature grid layout.

- [ ] **Step 2: Commit**

```bash
git add src/pages/products/index.astro
git commit -m "feat: add products overview page"
```

---

### Task 13: ScribeCraft Product Page (Uses ProductDocsLayout)

**Files:**
- Create: `astro-site/src/pages/products/scribecraft/index.astro`

- [ ] **Step 1: Build ScribeCraft page using ProductDocsLayout with left-hand sidebar**

This page uses the **ProductDocsLayout** with sidebar navigation, similar to the Ascult.ai help centre pattern. The sidebar persists as the user navigates through the content-heavy sections. This structure will also be reused as other products grow.

**Sidebar categories for ScribeCraft:**
```
📖 Overview
   ▸ What is ScribeCraft
   ▸ Key Features
   ▸ How It Works
🔒 Safety & Compliance
   ▸ Security Architecture
   ▸ Patient Consent
   ▸ Compliance Badges
📊 Evidence
   ▸ Stats & Results
   ▸ Case Studies
🚀 Getting Started
   ▸ Setup Guide (15-min)
   ▸ Templates & Formats
📖 Help Centre
   ▸ Quick Start Guide
   ▸ Accuracy Optimisation
   ▸ FAQs
   ▸ Explainers & Materials
   ▸ ROI Calculator
   ▸ Practice Readiness Audit
```

**Content sections to preserve:**
1. **What is ScribeCraft**: "Listen. Understand. Document." hero content + Class I Medical Device badge + 70% time savings claim
2. **Key Features** (5): Live Capture, Flexible Formats, Multi-Specialty, EPR-Ready, No Install
3. **How It Works**: 6-step visual process (Login → Choose Format → Start → Speak → Structure → Review)
4. **Security Architecture**: Zero-retention, UK GDPR, AES-256 encryption, AI training guarantee
5. **Patient Consent**: Guidelines for clinician-led consent process
6. **Compliance Badges**: Class I MDR, UK GDPR, ISO 27001, AI Act Ready, Microsoft Azure
7. **Stats & Results**: 70% time saved, 2hrs reclaimed daily, 100% GDPR compliant, 24/7
8. **Getting Started**: 15-minute setup walkthrough
9. **Help Centre sections**: All 6 Help Centre sections (Quick Start, Accuracy, FAQs, Explainers, ROI Calculator, Practice Audit) — migrated from the existing help-centre page into the sidebar-navigated structure

**Key design decisions:**
- The Help Centre is **merged into the ScribeCraft product page** as sidebar sections, not a separate page. This eliminates the separate `/products/scribecraft/help-centre/` path.
- Add a redirect from `/products/scribecraft/help-centre/` to `/products/scribecraft/#help-quick-start` for backward compatibility.
- Interactive elements (ROI Calculator sliders, Practice Audit quiz, FAQ accordions) use client-side `<script>` tags within the Astro page.
- Content shows/hides based on sidebar selection using the same JS toggle pattern as the current help centre.

- [ ] **Step 2: Create redirect for old Help Centre URL**

```astro
---
// astro-site/src/pages/products/scribecraft/help-centre/index.astro
return Astro.redirect('/apolloiq-website-preview/products/scribecraft/#help-quick-start');
---
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/products/scribecraft/
git commit -m "feat: add ScribeCraft product page with sidebar docs layout and integrated help centre"
```

---

### Task 14: Blood Pressure Calculator Page

**Files:**
- Create: `astro-site/src/pages/products/blood-pressure-average-calculator/index.astro`

- [ ] **Step 1: Build Blood Pressure Scroll page**

Content from existing page: AI digitization of handwritten blood pressure records.
Structure: Hero + Features + How It Works + CTA.

- [ ] **Step 2: Commit**

```bash
git add src/pages/products/blood-pressure-average-calculator/index.astro
git commit -m "feat: add Blood Pressure Scroll product page"
```

---

### Task 15: Locate Elixir Page

**Files:**
- Create: `astro-site/src/pages/products/locate-elixir/index.astro`

- [ ] **Step 1: Build Locate Elixir page**

Content: Real-time pharmacy medication availability checker.
Structure: Hero + Features + How It Works + CTA.

- [ ] **Step 2: Commit**

```bash
git add src/pages/products/locate-elixir/index.astro
git commit -m "feat: add Locate Elixir product page"
```

---

### Task 16: Clinical Document Management Page

**Files:**
- Create: `astro-site/src/pages/products/clinical-document-management/index.astro`

- [ ] **Step 1: Build CDM page (second most complex product page)**

Sections to preserve:
1. **Hero**: "Clinical Document Management"
2. **The Problem**: 100 letters/day overhead with before/after comparison
3. **The Solution**: RPA + self-hosted AI
4. **Features** (5): Date ID, SNOMED CT, AI Titles, Secure, 24/7
5. **Business Case**: Cost comparison table (manual £0.53 vs automated £0.08)
6. **Pricing**: £0.30/patient/year
7. **Why You'll Love It**
8. **CTA Section**

Include the before/after tables with same styling (.cdm-table pattern).

- [ ] **Step 2: Commit**

```bash
git add src/pages/products/clinical-document-management/index.astro
git commit -m "feat: add Clinical Document Management product page"
```

---

### Task 17: Pathology Automation Page

**Files:**
- Create: `astro-site/src/pages/products/pathology-automation/index.astro`

- [ ] **Step 1: Build Pathology Automation page**

Content: 80% blood test filing automation.
Structure: Hero + Problem + Solution + Features + Business Case + CTA.

- [ ] **Step 2: Commit**

```bash
git add src/pages/products/pathology-automation/index.astro
git commit -m "feat: add Pathology Automation product page"
```

---

### Task 18: QRisk3 Calculator Page

**Files:**
- Create: `astro-site/src/pages/products/clinical-calculator-qrisk3/index.astro`

- [ ] **Step 1: Build QRisk3 Calculator page**

Content: Cardiovascular risk assessment tool.
Structure: Hero + Features + CTA.

- [ ] **Step 2: Commit**

```bash
git add src/pages/products/clinical-calculator-qrisk3/index.astro
git commit -m "feat: add QRisk3 Calculator product page"
```

---

### Task 19: GP List Reallocation Page

**Files:**
- Create: `astro-site/src/pages/products/gp-list-reallocation/index.astro`

- [ ] **Step 1: Build GP List Reallocation page**

Content: Patient list redistribution tool.
Structure: Hero + Features + CTA.

- [ ] **Step 2: Commit**

```bash
git add src/pages/products/gp-list-reallocation/index.astro
git commit -m "feat: add GP List Reallocation product page"
```

---

## Chunk 4: Case Studies & Services

### Task 20: Case Studies Listing Page

**Files:**
- Create: `astro-site/src/pages/case-study/index.astro`

- [ ] **Step 1: Build case studies listing**

Grid of case study cards linking to individual case studies.
Currently 2: Forestside Medical Practice, Taunton Vale Healthcare.

- [ ] **Step 2: Commit**

```bash
git add src/pages/case-study/index.astro
git commit -m "feat: add case studies listing page"
```

---

### Task 21: Forestside Case Study

**Files:**
- Create: `astro-site/src/pages/case-study/apolloiq-capitalising-on-ai/index.astro`

- [ ] **Step 1: Build Forestside case study**

Full content preservation:
1. **Hero**: "Forestside Medical Practice - Clinical Document Management Automation"
2. **Intro**: 11,000 patients, 100 letters/day context
3. **Photo + Solution**: Image with solution highlights (Date ID, SNOMED CT, AI Titles, Secure, 24/7)
4. **Before & After Tables**: Full comparison tables with patient data
5. **Results**: 5,100 docs, 2hrs/day saved, £10,552 savings, 100% accuracy
6. **Quote**: Andy Lopez testimonial
7. **CTA Section**

- [ ] **Step 2: Commit**

```bash
git add src/pages/case-study/apolloiq-capitalising-on-ai/index.astro
git commit -m "feat: add Forestside Medical Practice case study"
```

---

### Task 22: Taunton Vale Case Study

**Files:**
- Create: `astro-site/src/pages/case-study/apolloiq-new-website/index.astro`

- [ ] **Step 1: Build Taunton Vale case study**

Full content: Pathology automation case study with 30,234 tests processed, £4,901 in 3-month savings, Dr. Christian Hornung quote.

- [ ] **Step 2: Commit**

```bash
git add src/pages/case-study/apolloiq-new-website/index.astro
git commit -m "feat: add Taunton Vale Healthcare case study"
```

---

### Task 23: Services Pages

**Files:**
- Create: `astro-site/src/pages/service/index.astro`
- Create: `astro-site/src/pages/services/custom-automation-processes-copy/index.astro`
- Create: `astro-site/src/pages/services/custom-software-solutions/index.astro`
- Create: `astro-site/src/pages/services/digitalisation-consultancy/index.astro`

- [ ] **Step 1: Build services listing page**

Overview page linking to 3 service pages.

- [ ] **Step 2: Build Custom Automation Processes page**

Preserve URL: `/services/custom-automation-processes-copy/`

- [ ] **Step 3: Build Custom Software Solutions page**

- [ ] **Step 4: Build Digitalisation Consultancy page**

- [ ] **Step 5: Commit all service pages**

```bash
git add src/pages/service/ src/pages/services/
git commit -m "feat: add all service pages"
```

---

## Chunk 5: Help Centre & Deployment

### Task 24: ScribeCraft Help Centre

**Files:**
- Create: `astro-site/src/pages/products/scribecraft/help-centre/index.astro`

- [ ] **Step 1: Build Help Centre page**

This is the most interactive page (850 lines in current version). Must preserve:
1. **Hero Banner**: Breadcrumb + gradient title
2. **Sidebar Navigation**: 6 categories with collapsible links
3. **Quick Start Guide**: Step-by-step setup
4. **Accuracy Optimisation**: Tips for best results
5. **FAQ Section**: Accordion-style questions grouped by category
6. **Explainers & Materials**: Downloadable resources info
7. **ROI Calculator**: Interactive sliders calculating time/cost savings
8. **Practice Readiness Audit**: Multi-question assessment with scoring

Interactive elements use `<script>` tags within the Astro page (client-side JS).
Sidebar navigation, FAQ accordions, ROI calculator, and audit quiz all require JS.

Use Astro's `<script>` tag for client-side interactivity (vanilla JS, no framework needed).

- [ ] **Step 2: Commit**

```bash
git add src/pages/products/scribecraft/help-centre/index.astro
git commit -m "feat: add ScribeCraft Help Centre with interactive elements"
```

---

### Task 25: GitHub Actions Deployment

**Files:**
- Create: `astro-site/.github/workflows/deploy.yml`

- [ ] **Step 1: Create GitHub Actions workflow for Astro**

```yaml
# astro-site/.github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: astro-site/package-lock.json
      - name: Install dependencies
        working-directory: astro-site
        run: npm ci
      - name: Build
        working-directory: astro-site
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: astro-site/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Update package.json scripts**

Ensure `package.json` has:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 3: Commit deployment config**

```bash
git add .github/workflows/deploy.yml package.json
git commit -m "feat: add GitHub Actions deployment workflow"
```

---

### Task 26: Local Development Server

**Files:**
- Create: `astro-site/.claude/launch.json`

- [ ] **Step 1: Create launch config for preview server**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "astro-dev",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 4321
    }
  ]
}
```

- [ ] **Step 2: Test local dev server**

```bash
cd "C:\Apolloiq\Apolloiq website webflow\site\astro-site"
npm run dev
```

Verify all pages load correctly at http://localhost:4321/apolloiq-website-preview/

- [ ] **Step 3: Commit**

```bash
git add .claude/launch.json
git commit -m "feat: add local dev server configuration"
```

---

### Task 27: Final Integration & Deployment

- [ ] **Step 1: Build the site locally and verify**

```bash
cd "C:\Apolloiq\Apolloiq website webflow\site\astro-site"
npm run build
npx astro preview
```

Verify all 21 pages render correctly.

- [ ] **Step 2: Move the astro-site to replace the current site structure**

The repo structure should become:
```
apolloiq-website-preview/
├── astro-site/           (Astro source)
│   ├── src/
│   ├── public/images/
│   ├── astro.config.mjs
│   └── package.json
├── .github/workflows/deploy.yml
└── README.md
```

The GitHub Actions workflow builds from `astro-site/` and deploys the `dist/` folder.

- [ ] **Step 3: Push to GitHub and verify deployment**

```bash
git push origin main
```

Monitor deployment at https://github.com/vre23/apolloiq-website-preview/actions

Verify live site at https://vre23.github.io/apolloiq-website-preview/

- [ ] **Step 4: Cross-page link verification**

Manually check all navigation links, footer links, and internal page links work correctly.

---

## Sidebar-First Product Pages (Growth Pattern)

The **ProductDocsLayout** with left-hand sidebar is the standard structure for all content-heavy product pages. Currently only ScribeCraft has enough content to use it, but the same layout will be activated for other products as they grow:

| Product | Current Layout | Future Layout (when content grows) |
|---------|---------------|-----------------------------------|
| ScribeCraft | **ProductDocsLayout** (sidebar) | Already using sidebar |
| Blood Pressure Scroll | Standard product page | → ProductDocsLayout with Help, Guides, FAQs |
| Locate Elixir | Standard product page | → ProductDocsLayout with Help, Guides, FAQs |
| Clinical Doc Management | Standard product page | → ProductDocsLayout with Help, Guides, FAQs |
| Pathology Automation | Standard product page | → ProductDocsLayout with Help, Guides, FAQs |
| QRisk3 Calculator | Standard product page | → ProductDocsLayout with Help, Guides, FAQs |
| GP List Reallocation | Standard product page | → ProductDocsLayout with Help, Guides, FAQs |

To upgrade a product page to the sidebar layout, simply:
1. Change the page's layout from `BaseLayout` to `ProductDocsLayout`
2. Define the `categories` array with the product's sections
3. Wrap content in `data-section` divs that match the category IDs

---

## Design Principles (Reference for All Pages)

### Inspired by Heidi Health:
1. **Generous whitespace** — Large section padding (py-20), ample spacing between elements
2. **Clean typography** — Roboto at readable sizes, clear hierarchy (h1 3rem → body 1rem)
3. **Subtle animations** — Fade-in on scroll, smooth hover transitions
4. **Warm, professional color palette** — Brand blue/green gradient as accent, not overwhelming
5. **Card-based layouts** — Rounded corners (20px), subtle shadows, white backgrounds
6. **Mobile-first responsive** — Stack to single column gracefully, touch-friendly targets
7. **Clear CTAs** — Primary blue buttons stand out, secondary outlined buttons for alternatives
8. **Accessible** — Proper heading hierarchy, focus states, color contrast ratios, semantic HTML

### ApolloIQ Brand Preserved:
- Primary Blue: #2c70eb
- Accent Green: #00c393
- Brand Gradient: linear-gradient(274deg, #00c393 → #2c70eb)
- Font: Roboto (300-700)
- Logo: Existing ApolloIQ gradient logo
- Shadow pattern: 4px 4px 30px 10px rgba(0,0,0,0.06)
- Border radius: 20px cards, 10px buttons
- "Merlin" platform branding with spell/wizard terminology
