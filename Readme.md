# Greenfield Academy

## Mission
Create implementation-ready, token-driven UI guidance for Greenfield Academy that is optimized for consistency, accessibility, and fast delivery across documentation site.

## Brand
- Product/brand: Greenfield Academy
- URL: https://ems.stitbd.net/
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=Montserrat`, `font.family.stack=Montserrat, SolaimanLipiNormal, sans-serif`, `font.size.base=16px`, `font.weight.base=700`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=14px`, `font.size.sm=16px`, `font.size.md=16.5px`, `font.size.lg=17px`, `font.size.xl=18px`, `font.size.2xl=20px`, `font.size.3xl=40px`, `font.size.4xl=80px`
- Color palette: `color.surface.base=#000000`, `color.text.secondary=#555555`, `color.text.tertiary=#333333`, `color.text.inverse=#ffffff`, `color.surface.muted=#1c69b5`, `color.surface.raised=#e6f9fd`
- Spacing scale: `space.1=3px`, `space.2=4px`, `space.3=5px`, `space.4=7px`, `space.5=9px`, `space.6=10px`, `space.7=12px`, `space.8=14px`
- Radius/shadow/motion tokens: `radius.xs=22px` | `motion.duration.instant=300ms`, `motion.duration.fast=500ms`, `motion.duration.normal=800ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (198), buttons (23), lists (23), cards (1), navigation (1).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
