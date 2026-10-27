---
name: implement-design
description: >-
  Implements UI from a design by composing components already in the app, and by adding a shadcn
  component only when its look matches the design. Use when implementing a design, matching a mock
  or screenshot, building screen chrome, or deciding whether to pull a shadcn component.
---

# Implement a design

Before writing markup, match the design to components. Then split the screen into pieces that each
own one part of it.

## Existing components

Look in `apps/www/src/components/ui` and the compositions the screen already uses.

Prefer `Button` variants for actions:

- `default` is the primary fill.
- `secondary` is the muted fill.
- `ghost` is text with no resting fill.
- `outline` and `link` stay those shapes.

`className` is for the radius and an icon. Do not restyle hover, focus, or height. Do not hand-roll
a `<button>`, a focus ring, or a hover background. Do not change the shared `Button` variants to fit
one screen.

## shadcn

If nothing local matches, read [`apps/www/components.json`](../../../apps/www/components.json) and
the shadcn docs for that control. Compare the component's actual look with the design.

Add it with the shadcn CLI from `apps/www` only when that look is the design. Do not add a component
and then restyle it into a different control.

Toggle Group is a row of separate buttons with a gap. Radio Group is a list of circles. An inset
capsule, one track with the active option inside it, is neither of those.

## Composition

When the registry has no matching control, compose components that already exist. A local component
is only for the piece that still has no match, such as the inset track around two `Button`s.

## Split the design

Each distinct piece of the design is its own component. The screen composes them. One component does
not hold markup for unrelated pieces, such as a mode control, a status line, and several actions in
the same file.

## Create header

Post and Article are a local `rounded-full bg-muted p-1` track of `Button` `size="lg"`, the same
height as the action buttons, with 4px of track around them. The active option is
`variant="default"`. The inactive option is `variant="ghost"`.

Preview and Save draft are `Button` `variant="ghost"` at `h-11`, with an eye only on Preview.
Save draft has no resting fill. Next is `variant="default"` at `h-11` `rounded-full` with a
trailing arrow. The type track stays `size="lg"`.
