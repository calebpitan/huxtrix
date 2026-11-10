---
name: component-files
description: >-
  Names a React component file after its component and places it in components, components/ui,
  compositions, or app in huxtrix. Use when adding, editing, moving, or splitting a component,
  when a file exports more than one component, or when deciding where a component belongs.
---

# Component files

A file that exports a component exports that one component. Name the file after that component, in the same casing: `FeaturedHackCard` lives in `FeaturedHackCard.tsx`.

Another component that needs to be exported gets its own file. The parent imports the files and composes them.

A helper that is not a component can stay in the file, or in a file that exports no component. A component that is not exported can stay beside the one component that renders it.

## Where it lives

A component that must be reusable lives in `apps/www/src/components/`.

`apps/www/src/components/ui/` is for shadcn components, including Plate components fetched through shadcn. Leave those files with the names the CLI wrote. Do not add an app component there.

Reusable bases live in `apps/www/src/components/`, outside `ui/`. A family can share a folder there, such as `images/` or `dialog/`.

A domain component that composes those bases lives in `apps/www/src/compositions/`, collected with the others of its kind under a common folder. `apps/www/src/compositions/card/` is built on the shadcn card and sits in compositions because those cards are for posts, featured posts, and post previews. Keep that kind of component in compositions rather than in `apps/www/src/app/`.

A component stays in `apps/www/src/app/` only when it is overly specific to one page and the chance of reuse outside that page or its subpages is extremely low.
