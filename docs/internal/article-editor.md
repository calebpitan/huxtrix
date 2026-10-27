# Article editor

## Purpose

`/create` and `/create/publish` share one in-memory draft. The header on `/create` switches that draft between an article and a short post, shows how long the article is, and previews it in the same column.

## Implementation

[`TextEditorProvider`](../../apps/www/src/compositions/editor/TextEditorProvider.tsx) lives on [`create/layout.tsx`](../../apps/www/src/app/create/layout.tsx), so both routes see the same draft, edit/preview mode, and saved snapshot. A refresh clears them. [`creator.tsx`](../../apps/www/src/app/create/creator.tsx) registers `controller.save()` and `controller.post()`; both log the current body.

`draft.body` is the serialized Plate value. An editor with no text stores `''`. Title and subtitle are `draft.title` and `draft.subtitle`.

[`CreateHeader`](../../apps/www/src/app/create/create-header.tsx) is rendered from `creator.tsx`, so it exists on `/create` only, from the `lg` breakpoint up. It composes [`DraftTypeToggle`](../../apps/www/src/app/create/draft-type-toggle.tsx), [`DraftStatus`](../../apps/www/src/app/create/draft-status.tsx), [`PreviewButton`](../../apps/www/src/app/create/preview-button.tsx), [`SaveDraftButton`](../../apps/www/src/app/create/save-draft-button.tsx), and [`CreatePrimaryButton`](../../apps/www/src/app/create/create-primary-button.tsx). Below that, [`@appbar/page.tsx`](../../apps/www/src/app/create/@appbar/page.tsx) keeps Cancel and one primary button. On `/create` that button is Next or Post, matching `draft.type`. On `/create/publish` the button stays Next and calls `controller.post()`.

[`@sidebar/page.tsx`](../../apps/www/src/app/create/@sidebar/page.tsx) renders nothing. The layout aside stays in place for the context panel.

[`draft-text.ts`](../../apps/www/src/compositions/editor/draft-text.ts) turns the title, subtitle, and Plate body into a word count and the status string. Preview passes `readOnly` to Plate, hides [`PlainEditorToolbar`](../../apps/www/src/compositions/editor/PlainEditor.tsx), and renders the title and subtitle as text. [`ArticleEditor.tsx`](../../apps/www/src/compositions/editor/ArticleEditor.tsx) only does that while `type` is `article`.

[`ConfirmPostDialog`](../../apps/www/src/app/create/confirm-post-dialog.tsx) is the `AppDialog` the header and the phone bar both open before `controller.post()`.

## Decisions

- **Saved is a snapshot on the provider.** `markSaved()` copies the draft after `controller.save()`. The header shows Saved while the live draft still matches that copy, so a write of the same body keeps the marker, and a trip to `/create/publish` keeps it too. Any real field change drops it. Nothing is written to storage.
- **Words come from plain text.** Title, subtitle, and the text nodes in the Plate body are joined, then split on whitespace. Adjacent blocks are separated so two paragraphs stay separate words. Read time is `max(1, round(words / 200))` once there is a word, and omitted at zero.
- **Preview stays on `/create`.** The same column is read-only, and the button label switches to Edit. Choosing Post while previewing returns the column to edit, because the Post header has no Preview control.
- **Article Next opens `/create/publish`.** The navigation guard already treats that path as staying inside create, so the draft remains and the unsaved-changes dialog stays closed. `controller.post()` belongs to the Post button.
- **Post confirms first.** Confirm calls `controller.post()` and stays on `/create`. Cancel leaves the draft in place.
- **Title and subtitle are draft fields.** The status line and the preview both read them. Column alignment, the channel chip, and the cover chip stay with the writing-column work.
- **Header chrome uses `Button`.** The mode control is a local inset track, because shadcn Toggle Group is a row of separate buttons and Radio Group is a circle list. The active option is `variant="default"` `size="lg"` inside a muted capsule, 40px tall, with 4px of track around it. The inactive option is `variant="ghost"`. Preview, Edit, and Save draft are `variant="ghost"` at 44px (`h-11`), with an eye only on Preview. Save draft has no resting fill; the ghost variant supplies the hover fill. Next and Post are `variant="default"` at that same 44px, and Next has a trailing arrow. The format bar under the header is still the floating-toolbar ticket.

## Limits

There is no autosave, `localStorage`, or network save. The short-post composer is not in the column. `/create/publish` is a placeholder heading. The format bar is unchanged. The phone bar has Cancel and Next, or Cancel and Post, and leaves out the mode choice, the word count, Preview, and Save draft.
