# Publish

## Purpose

An article draft opens a page that sets channel, cover, tags, visibility, rewards, and an optional
time, then confirms before the existing post handler. A short post does not stay on this page.

## Implementation

[`publish/page.tsx`](../../apps/www/src/app/create/publish/page.tsx) renders
[`PublishStep`](../../apps/www/src/app/create/publish/step.tsx) inside the create layout, so the
draft, `@appbar`, and `@sidebar` are the ones from `/create`. The step is a `max-w-4xl` column.
Below `xl` that column scrolls. At `xl` the window scrolls.

A post draft calls `router.replace('/create')` in a layout effect and renders nothing, so the form
does not paint.

[`PublishHeader`](../../apps/www/src/app/create/publish/header.tsx) is `hidden` below `lg`, the same
breakpoint as the create header. Back to editing routes to `/create`. Draft saved is the provider’s
`saved` snapshot: a green dot and those words, with no word count, and only while the live draft
still matches the last save.
[`SaveDraftButton`](../../apps/www/src/app/create/save-draft-button.tsx) is the same control as on
`/create`. Publish stays enabled and calls `requestPublish()`.

[`@appbar/page.tsx`](../../apps/www/src/app/create/@appbar/page.tsx) is the phone bar, via
[`@appbar/default.tsx`](../../apps/www/src/app/create/@appbar/default.tsx). On `/create/publish` the
left control is Back, which routes to `/create`, and the right control is Publish. Save draft and
the saved marker stay on the wide header.

[`PublishRequestProvider`](../../apps/www/src/app/create/publish/request.tsx) sits on the create
layout, inside `TextEditorProvider`, because the page and the phone bar are siblings.
`requestPublish()` reads `draftRef`. A non-article returns without posting. An empty trimmed title
or a null `channelId` sets `attempted` and does not call `controller.post()`. Both present opens
[`ConfirmPostDialog`](../../apps/www/src/app/create/confirm-post-dialog.tsx) with “Publish this?”
and a Publish label. Confirm still calls `controller.post()` and stays on the page. Cancel leaves
the draft as it is. The short-post call sites keep “Post this?” and Post.

Errors render only while `attempted` is set and the field is still invalid. The title message sits
under the intro in [`intro.tsx`](../../apps/www/src/app/create/publish/intro.tsx), because this page
has no title input. The channel message sits on the radio group.

The form, top to bottom:

- [`channel-field.tsx`](../../apps/www/src/app/create/publish/channel-field.tsx) is a `radiogroup`
  of [`channelChoices`](../../apps/www/src/compositions/editor/channel-menu.tsx). Each option is a
  `Button` at `font-semibold`. The selected one is `variant="default"` with a check. The others are
  `variant="outline"`. Arrow keys move the selection. The pills are names only. The heading is
  `text-base`. The helper says the article appears in this channel’s feed.
- [`cover-field.tsx`](../../apps/www/src/app/create/publish/cover-field.tsx) is a drop zone and a
  browse button. A chosen image is a session `blob:` URL on `coverUrl`, shown with `img`. Replace
  and remove call [`revokeBlob`](../../apps/www/src/app/create/post-composer/blob.ts). Nothing is
  uploaded.
- [`tags-field.tsx`](../../apps/www/src/app/create/publish/tags-field.tsx) is a combobox. Chips sit
  in the field, and each has a remove button. Typing filters
  [`tag-suggestions.ts`](../../apps/www/src/app/create/publish/tag-suggestions.ts). A typed tag that
  is not in that list, or already created this session, is offered as Create. Space commits the
  current text. A duplicate is ignored. A sixth tag is refused and the field says you can add up
  to 5. The counter reads `n of 5`.
- [`visibility-field.tsx`](../../apps/www/src/app/create/publish/visibility-field.tsx) is an inset
  `rounded-full` track with radio semantics. In dark mode the fill is `foreground/20`, lighter than
  the Post | Article track. Everyone and Channel members write `everyone` and `channel`.
- [`rewards-field.tsx`](../../apps/www/src/app/create/publish/rewards-field.tsx) binds the shadcn
  Switch to `rewardsEnabled`. The draft already defaults that on.
- [`schedule-field.tsx`](../../apps/www/src/app/create/publish/schedule-field.tsx) opens a popover
  with the existing Calendar and a time input. A date and a time together become an ISO string on
  `scheduledAt`. Clear sets it back to null. With a value, the row shows that local date and time.
  Nothing is sent to a scheduler.

[`option-row.tsx`](../../apps/www/src/app/create/publish/option-row.tsx) is the shared icon, title,
and description row for visibility, rewards, and schedule.

[`@sidebar/publish/page.tsx`](../../apps/www/src/app/create/@sidebar/publish/page.tsx) renders
[`PublishAside`](../../apps/www/src/app/create/publish/aside.tsx).
[`@sidebar/default.tsx`](../../apps/www/src/app/create/@sidebar/default.tsx) and the `/create`
sidebar are unchanged. The aside slot stays hidden below `xl`.

The aside stacks [`FeedPreviewCard`](../../apps/www/src/compositions/card/FeedPreview.tsx) and
[`PublishChecklist`](../../apps/www/src/app/create/publish/checklist.tsx). The heading row is “In
the feed” and
[`PublishPreviewButton`](../../apps/www/src/app/create/publish/PublishPreviewButton.tsx), an outline
pill. Preview turns the draft to preview mode if it is not already, then routes to `/create`, so the
article column is the read-only view. The card uses the signed-in author, `draftExcerpt`,
`previewChannelLabel`, and `coverUrl`.
[`PublishFeedNote`](../../apps/www/src/app/create/publish/feed-note.tsx) sits under the card when
the subtitle is empty or `coverUrl` is null, and hides when both are set. The same checklist renders
under the form with `xl:hidden`. The card and the note stay in the aside.

The checklist is a status list. A done row is a filled green disc with a check. An open row is a
dashed circle. A row is done only when its value is present. Title and subtitle are both non-empty.
Channel names the choice. Tags show the count once there is at least one. Cover is done only when
`coverUrl` is set, and an empty cover is not an error.

## Decisions

- **Publish confirms, and the button stays enabled.** The missing title or channel is an inline
  message after the press. Disabling Publish would hide that press. Confirm is the existing dialog,
  with article labels, and it still calls `controller.post()`.
- **The attempt lives on the layout.** The phone bar and the column header are siblings, so neither
  can own the other’s error flag. The provider holds `attempted` and the dialog. Errors are derived
  from that flag and the live draft, so a field clears its message as soon as it becomes valid.
- **The title message sits under the intro.** This page does not edit the title. The channel message
  sits on the radio group, which is the field.
- **Channel pills are buttons with radio semantics.** shadcn Radio Group is a list of circles. The
  design is a wrap of name pills, with a check on the selected one. The names are semibold. The list
  is `channelChoices`, in that order, and the pills do not repeat the menu’s member counts.
- **Section titles sit above the helpers.** Channel, Cover image, Tags, and Options are `text-base`.
  The helper, the tag count, and Required or Optional stay `text-sm`.
- **Visibility reuses the inset track.** It is the same capsule of buttons as the Post | Article
  control, with `role="radiogroup"`. Its dark-mode fill is lighter, so the track reads against the
  page. Rewards use the shadcn Switch as the CLI wrote it. The checked color is the switch’s own
  primary, not a one-off green.
- **A schedule needs a date and a time.** The calendar is date-only. The time input sits in the same
  popover. The draft changes only when both are set. `scheduledAt` is the ISO string of that local
  selection. Clear writes null. No job reads it.
- **Preview on this aside opens the article.** The chip matches the design, an outline pill beside
  “In the feed”. This page has no editor, so the button sets preview mode and returns to `/create`,
  where that mode already hides the writing controls. The short-post Preview button still toggles in
  place.
- **The checklist under the form is the same component.** The aside is already hidden below `xl`.
  There is no second mobile layout. The feed card stays in the aside.
- **Tags are a combobox with a fixed suggestion list.** There is no tag catalog. The list in
  `tag-suggestions.ts` is what autocomplete searches. Space commits the typed text. An exact
  suggestion uses that spelling. Anything else is created on the draft and stays suggestable for the
  session. A sixth tag is an inline limit, not a silent drop.
- **A short post leaves before paint.** The step replaces to `/create` and returns null.
  `requestPublish()` also ignores a non-article, so the phone bar cannot post one from this URL.

## Limits

Nothing is uploaded, stored, or scheduled. Publish logs through `controller.post()`. There is no
highlights control and no membership check. The inline errors are the title, the channel, and a
sixth tag. The phone bar is Back and Publish. Save draft, the saved marker, and the feed card are on
the wide layout only. Below `xl` the aside is hidden and the checklist sits under the form.
