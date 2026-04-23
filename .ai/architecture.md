# Project Architecture

## Directory Layout

/app
Next.js routes and pages.

Example:
app/login/page.tsx
app/dashboard/page.tsx


/components
Reusable UI components.

Example:
components/ui/button.tsx
components/forms/login-form.tsx


/lib
Shared logic and utilities.

lib/api.ts
All API requests must go through here.

lib/mock.ts
Mock data for development.


/styles
Global styling.

globals.css


## UI Framework

We use **shadcn/ui** for base components.

Common primitives:
- Button
- Input
- Card
- Form
- Label

Prefer composition instead of building UI primitives from scratch.

## Design System

Spacing scale: Tailwind default

Layout rules:
- Container width: `max-w-6xl`
- Card radius: `rounded-xl`
- Standard shadow: `shadow-sm`

## Forms

Forms should use:

- React state
or
- react-hook-form if complex

Always include:

- labels
- validation
- accessible error messages

## Data Fetching

All data must go through:

lib/api.ts

Never call fetch directly inside components.

## State Management

Prefer:

- React local state
- Server components when possible

Avoid heavy client-side state libraries unless necessary.