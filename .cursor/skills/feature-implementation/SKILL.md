---
name: feature-implementation
description: >-
  Requires documentation for every feature implementation and for every later change to a feature in
  huxtrix. Internal technical docs are always required. A user doc is required only when the feature
  is something a person using the app can see or do. Use when implementing a feature, adding
  behavior, modifying an existing feature, or when the user asks to build or change product or
  library behavior.
---

# Feature implementation

Ship the documentation in the same change as the code. Leave nothing for a follow-up.

## When this applies

Apply when implementing a feature, adding behavior, or modifying an existing feature.

A new doc, or an update to the existing one, is required when the change alters how a feature
behaves, its API, or a decision already recorded.

Formatting, comments, and refactors that change none of those do not get a new doc.

## Audiences

Internal documentation is always required. That includes libraries, infrastructure, and other
technical development features a person using the app never encounters.

A user doc is required only for an app-facing feature: something a person using the product can see
or do. The reader of that doc is that person. A calling developer is not that reader. Do not write a
user doc to explain an API, a package, or an implementation choice.

The logger is the internal-only example.
[`docs/internal/logger.md`](../../../docs/internal/logger.md) is the depth to match. It has no user
doc.

## Paths

- Internal: `docs/internal/<feature>.md`
- User, app-facing features only: `docs/user/<feature>.md`

One file per feature per audience that applies. Use a directory only when a single file stops being
readable. When the feature already has a file, update that file.

Add a link to each new file from [`docs/README.md`](../../../docs/README.md).

## What to update

| Change                          | Internal doc | User doc                                                       |
| ------------------------------- | ------------ | -------------------------------------------------------------- |
| New technical feature           | Create       | Do not create                                                  |
| New app-facing feature          | Create       | Create                                                         |
| Change to a technical feature   | Update       | Leave absent                                                   |
| Change to an app-facing feature | Update       | Update when what the person using the app observes has changed |

A behavior change, an API change, or a changed decision belongs in the internal doc, including the
decision and why it was made. Update the user doc when the person using the app would see or do
something different.

## Internal template

```markdown
# <Feature>

## Purpose

What the feature is for.

## Implementation

How it runs, and which files own each part.

## Decisions

- **<Choice>.** Why, and what follows from it.

## Limits

What the implementation does not cover.
```

## User template

Use this only for an app-facing feature. Omit it for a technical development feature.

```markdown
# <Feature>

## Purpose

What the person using the app can do with this.

## Behavior

What they see, and what happens in the cases they hit.

## Decisions

Choices that change what they observe. Omit this section when there are none.

## Limits

What the feature does not do for them.
```

## Pull requests

Opening a PR still follows [create-pr](../create-pr/SKILL.md). The docs belong in that PR. The pull
request body is not a substitute for `docs/`.
