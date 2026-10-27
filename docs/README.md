# Documentation

Feature documentation is split by audience.

## Internal

[`docs/internal/`](internal/) is for people changing the code. Every feature has a file here. It
records how the feature is implemented and the decisions behind that implementation. Libraries and
other technical work a person using the app never sees belong here.

- [Logger](internal/logger.md)
- [Article editor](internal/article-editor.md)

## User

[`docs/user/`](user/) is for a person using the app. A file belongs here only when the feature is
something that person can see or do. A technical development feature does not get a user doc.

- [Article editor](user/article-editor.md)

One file per feature: `docs/internal/<feature>.md` and, when the feature is app-facing,
`docs/user/<feature>.md`. Use a directory only when a single file stops being readable. When a
feature changes, update its docs in the same change. Add the new file to the list above.
