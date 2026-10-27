# Article editor

## Purpose

`/create` and `/create/publish` share one in-memory draft. The header on `/create` switches that draft between an article and a short post, shows how long the article is, and previews it in the same column.

## Implementation

[`TextEditorProvider`](../../apps/www/src/compositions/editor/TextEditorProvider.tsx) lives on [`create/layout.tsx`](../../apps/www/src/app/create/layout.tsx), so both routes see the same draft, edit/preview mode, and saved snapshot. A refresh clears them. [`creator.tsx`](../../apps/www/src/app/create/creator.tsx) registers `controller.save()` and `controller.post()`; both log the current body.

`draft.body` is the serialized Plate value. An editor with no text stores `''`. Title and subtitle are `draft.title` and `draft.subtitle`. `channelId` is the category name from the writing-column menu, or null. `coverUrl` is a session object URL, or null.

[`ArticleEditor.tsx`](../../apps/www/src/compositions/editor/ArticleEditor.tsx) lays the channel chip, the cover chip, the title, the subtitle, and the body in one `max-w-3xl` column. [`ChannelChip`](../../apps/www/src/compositions/editor/channel-chip.tsx) and [`CoverChip`](../../apps/www/src/compositions/editor/cover-chip.tsx) render while editing. Preview hides them and keeps the title, subtitle, and body on that same left edge. The body is [`PlainEditor`](../../apps/www/src/compositions/editor/PlainEditor.tsx) with `variant="none"`, so the editor's centering padding is not applied. A shared `ps-6` is the gutter for the existing drag handle.

[`CreateHeader`](../../apps/www/src/app/create/create-header.tsx) is rendered from `creator.tsx`, so it exists on `/create` only, from the `lg` breakpoint up. It composes [`DraftTypeToggle`](../../apps/www/src/app/create/draft-type-toggle.tsx), [`DraftStatus`](../../apps/www/src/app/create/draft-status.tsx), [`PreviewButton`](../../apps/www/src/app/create/preview-button.tsx), [`SaveDraftButton`](../../apps/www/src/app/create/save-draft-button.tsx), and [`CreatePrimaryButton`](../../apps/www/src/app/create/create-primary-button.tsx). Below that, [`@appbar/page.tsx`](../../apps/www/src/app/create/@appbar/page.tsx) keeps Cancel and one primary button. On `/create` that button is Next or Post, matching `draft.type`. On `/create/publish` the button stays Next and calls `controller.post()`.

[`@sidebar/page.tsx`](../../apps/www/src/app/create/@sidebar/page.tsx) renders nothing. The layout aside stays in place for the context panel.

[`draft-text.ts`](../../apps/www/src/compositions/editor/draft-text.ts) turns the title, subtitle, and Plate body into a word count and the status string. Preview passes `readOnly` to Plate, hides [`PlainEditorToolbar`](../../apps/www/src/compositions/editor/PlainEditor.tsx), and renders the title and subtitle as text. [`ArticleEditor.tsx`](../../apps/www/src/compositions/editor/ArticleEditor.tsx) only does that while `type` is `article`.

[`ConfirmPostDialog`](../../apps/www/src/app/create/confirm-post-dialog.tsx) is the `AppDialog` the header and the phone bar both open before `controller.post()`.

[`CreateNavigationGuard`](../../apps/www/src/app/create/navigation-guard.tsx) uses `useNavigationGuard` from `next-navigation-guard`. It blocks leaving create while `draft.body` is non-empty. Routes under `/create` stay inside the draft, so `/create/publish` does not ask. [`NavigationGuardProvider`](../../apps/www/src/compositions/layout/Root.tsx) owns the interception.

## Decisions

- **Saved is a snapshot on the provider.** `markSaved()` copies the draft after `controller.save()`. The header shows Saved while the live draft still matches that copy, so a write of the same body keeps the marker, and a trip to `/create/publish` keeps it too. Any real field change drops it. Nothing is written to storage.
- **Words come from plain text.** Title, subtitle, and the text nodes in the Plate body are joined, then split on whitespace. Adjacent blocks are separated so two paragraphs stay separate words. Read time is `max(1, round(words / 200))` once there is a word, and omitted at zero.
- **Preview stays on `/create`.** The same column is read-only, and the button label switches to Edit. Choosing Post while previewing returns the column to edit, because the Post header has no Preview control.
- **Article Next opens `/create/publish`.** The navigation guard already treats that path as staying inside create, so the draft remains and the unsaved-changes dialog stays closed. `controller.post()` belongs to the Post button.
- **The guard package is `next-navigation-guard` 0.2.** 0.1.2 only wrapped `router.push`. Next.js 15.3 `Link` no longer navigates that way, so those clicks left create without asking. 0.2 intercepts them in the provider. The create page only decides when the guard is enabled. The 0.1.2 `crypto.randomUUID` patch is gone; 0.2 already uses `Math.random` for history tokens.
- **Post confirms first.** Confirm calls `controller.post()` and stays on `/create`. Cancel leaves the draft in place.
- **Title and subtitle are draft fields.** The status line and the preview both read them.
- **One inset lines the column up.** Chips, title, subtitle, and the first body line share `max-w-3xl` and `ps-6`. That inset is wide enough for the drag handle, which sits `absolute` and fully to the left of each block, inside an editor that clips overflow on x. The old split between `max-w-3xl` and `max-w-[896px]` is gone.
- **The slash hint is two placeholders with one sentence.** On an empty body, Plate’s editor placeholder is the only hint, so that prop carries “Type / to insert a heading, image, code block…”. The block placeholder uses the same sentence, and Plate only shows it on an empty paragraph once the body already has text and that paragraph is focused. Typing `/` still opens `SlashKit`.
- **Code block chrome shares the panel grid.** The language control and the copy button occupy the same cell as the code, aligned to the top end. Safari drops `top` on an absolutely positioned control inside the editable and paints those controls under the panel. The overlay ignores pointer events except on the two controls.
- **`channelId` is the category name.** The combobox copies the six home-category member strings and adds Maths & Science as `115k members`. That count is a menu label, not a membership record. An empty search shows the first twenty in that written order, which stands in for frequently used, because nothing records access. A search filters the whole list, so a name past those twenty can still be chosen. It is not a membership catalog, and it does not import the home page.
- **The channel and cover chips are 40px.** Both triggers are `Button` `size="lg"` (`h-10`) with `rounded-full`. The empty cover chip stays dashed. The remove control stays a ghost icon button.
- **The cover is a session object URL.** Choosing a file stores `URL.createObjectURL` on `coverUrl`. Nothing is uploaded. Replace and clear revoke the previous `blob:` URL. Unmount does not: preview remounts the editor while the draft still holds the URL. A refresh drops it with the rest of the draft.
- **Header chrome uses `Button`.** The mode control is a local inset track, because shadcn Toggle Group is a row of separate buttons and Radio Group is a circle list. The active option is `variant="default"` `size="lg"` inside a muted capsule, 40px tall, with 4px of track around it. The inactive option is `variant="ghost"`. Preview, Edit, and Save draft are `variant="ghost"` at 44px (`h-11`), with an eye only on Preview. Save draft has no resting fill; the ghost variant supplies the hover fill. Next and Post are `variant="default"` at that same 44px, and Next has a trailing arrow. The format bar under the header is still the floating-toolbar ticket.

## Limits

There is no autosave, `localStorage`, or network save. The cover is not uploaded. The short-post composer is not in the column. `/create/publish` is a placeholder heading. The format bar is unchanged. Placeholder guidelines and the outline are not in this column. The phone bar has Cancel and Next, or Cancel and Post, and leaves out the mode choice, the word count, Preview, and Save draft.
