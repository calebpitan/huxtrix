# Feed preview

## Purpose

The short-post panel and the publish step share a compact card in the shape of a feed post. The
short-post aside mounts it. The publish step does not yet.

## Implementation

[`FeedPreviewCard`](../../apps/www/src/compositions/card/FeedPreview.tsx) is the compact card. The
header is a smaller avatar, `author.name`, and, when `channel` is non-empty, that channel. The
middle dot is drawn only when the name is non-empty too. The title renders only when it has text.
The excerpt is `summary`, with no lorem paragraph. A title makes that excerpt muted. An empty title,
as on a short post, makes the excerpt the body text. `coverUrl` is one 16:9 image. An empty cover
renders no image. The three action buttons use the same classes as the home card and show no counts.
The footer is `inert`. The overflow menu lists Share, Copy link, and Report, and those items do
nothing.

[`PostCard`](../../apps/www/src/compositions/card/Post.tsx) is only the home feed card: full-bleed,
the lorem paragraph after `summary`, and `media` through
[`PostImage`](../../apps/www/src/components/images/PostImage.tsx).
[`LatestHacks.tsx`](../../apps/www/src/compositions/section/LatestHacks.tsx) still renders it. It
does not take a channel, a cover, or a preview flag.

[`preview.ts`](../../apps/www/src/compositions/card/preview.ts) is what the later screens import
alongside the card:

- `draftExcerpt` returns the trimmed subtitle when it is non-empty. Otherwise it returns the plain
  text of the first Plate `p` that has text, using `platePlainText` from
  [`draft-text.ts`](../../apps/www/src/compositions/editor/draft-text.ts).
- `previewAuthorName` returns the trimmed first name, then the trimmed username, then `''`.
- `previewAuthorInitials` returns the first letter of the first name and the first letter of the last name. When one of those is missing, it returns the first two characters of the remaining name, then of the username.
- `previewChannelLabel` returns `null` when `channelId` is null, and the id otherwise.

The preview card does not read the session. Callers pass `author.name` from `previewAuthorName`. An empty avatar uses `author.initials` when the caller passes it, and otherwise the first two characters of `author.name`.

## Decisions

- **The preview is its own component.** The home card and the compact card are different layouts. A
  `preview` flag on `PostCard` kept both in one return and made the feed props carry channel and
  cover. `FeedPreviewCard` owns the compact card. `PostCard` stays the home card.
- **The cover is a plain image.** `coverUrl` is a session `blob:` URL. `PostImage` uses
  `next/image`, which does not render those URLs. The preview uses `img`. The feed still uses
  `PostImage`.
- **Preview actions are inert without `disabled`.** `disabled` fades a button to half opacity. The
  footer uses `inert`, so Works for me, Bookmark, and Reward stay at full color and cannot be
  activated. Counts stay off the preview. The overflow items have no handlers.
- **The excerpt skips empty paragraphs.** Plate often stores an empty `p` before the text the person
  wrote. The first paragraph with text is the excerpt. Headings and other blocks are not. A subtitle
  that trims to something wins over the body. Empty or invalid JSON yields `''`.
- **The author is a first name, then a username.** The design’s sample name is not stored on the
  card. Channel ids are already the display names, so the label is the id, and a null id omits the
  channel segment. The middle dot is only the separator between a name and a channel, so an empty
  name leaves the channel with no leading dot.

## Limits

The card is mounted in the short-post aside. It is not mounted on the publish step. Nothing here removes the
lorem paragraph from the home feed. The overflow menu does not share, copy, report, or open a post.
Counts are not live.
