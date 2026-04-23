## UI Theme Specification

Theme Name: Warm Evidence

Purpose:
A warm, professional dashboard theme for an internal Evidence Collection System.
The palette emphasizes clarity, investigation workflows, and readable data-heavy UI.

Agents must only use colors defined in this palette.

---

# Brand Palette (Amber)

primary-50:  #FFFBEB
primary-100: #FEF3C7
primary-200: #FDE68A
primary-300: #FCD34D
primary-400: #FBBF24
primary-500: #F59E0B
primary-600: #D97706
primary-700: #B45309
primary-800: #92400E
primary-900: #78350F

Usage
- primary-500 → primary buttons
- primary-600 → hover states
- primary-100 → highlights / badges
- primary-200 → active navigation

---

# Neutral Palette (Primary UI Colors)

neutral-50:  #FAFAFA
neutral-100: #F5F5F5
neutral-200: #E5E7EB
neutral-300: #D1D5DB
neutral-400: #9CA3AF
neutral-500: #6B7280
neutral-600: #4B5563
neutral-700: #374151
neutral-800: #1F2937
neutral-900: #111827

Usage
- neutral-900 → sidebar background
- neutral-800 → dark panels
- neutral-600 → secondary text
- neutral-400 → muted text
- neutral-200 → borders

---

# Surface Layers

background: #FAFAF9
surface-1: #FFFFFF
surface-2: #F9FAFB
surface-3: #F3F4F6
surface-hover: #F1F5F9

Usage
- background → main page background
- surface-1 → cards / panels
- surface-2 → nested panels
- surface-hover → table row hover

---

# Text Colors

text-primary: #111827
text-secondary: #6B7280
text-muted: #9CA3AF
text-inverse: #F9FAFB

Usage
- text-primary → headings
- text-secondary → body text
- text-muted → metadata / labels

---

# Border Colors

border-default: #E5E7EB
border-strong: #D1D5DB

Usage
- border-default → card borders
- border-strong → table separators

---

# Status Colors

success: #22C55E
warning: #F59E0B
danger: #EF4444
info: #3B82F6

Usage
- success → verified evidence
- warning → processing / attention
- danger → suspicious / failed checks
- info → informational states

---

# Evidence Category Colors

system-evidence: #6366F1
network-evidence: #06B6D4
security-evidence: #EF4444
config-evidence: #F59E0B
identity-evidence: #8B5CF6

Usage
Displayed as badges or tags on evidence items.

---

# Investigation Status

collected: #3B82F6
processing: #F59E0B
verified: #22C55E
flagged: #EF4444
archived: #6B7280

Used in workflow indicators and timelines.

---

# Accent Colors

accent-orange: #FB923C
accent-blue: #60A5FA
accent-purple: #A78BFA

Use sparingly for highlights and UI emphasis.

---

# Data Visualization Palette

chart-1: #F59E0B
chart-2: #3B82F6
chart-3: #22C55E
chart-4: #8B5CF6
chart-5: #06B6D4

Used in charts, graphs, and analytics components.

---

# Sidebar Theme

sidebar-bg: #111827
sidebar-text: #E5E7EB
sidebar-active: #F59E0B
sidebar-hover: #1F2937

Usage
- sidebar-bg → navigation background
- sidebar-active → active menu item
- sidebar-hover → hover state

---

# Color Usage Rules

1. Always use semantic tokens instead of raw hex colors.
2. Do not introduce new colors outside this palette.
3. Primary color (amber) should be used sparingly for actions and highlights.
4. Most UI should rely on neutral and surface colors.
5. Evidence badges must use the defined evidence category colors.

Goal:
Maintain a consistent, professional investigation dashboard UI.

## Typography

Primary Font
- Inter

Monospace Font
- JetBrains Mono

Usage Rules

Headings
- font-weight: 600

Body text
- font-weight: 400

Labels
- font-weight: 500

Evidence IDs, hashes, logs
- JetBrains Mono

Line height
- relaxed for body text
- tight for headings