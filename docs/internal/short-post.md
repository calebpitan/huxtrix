# Short post

## Purpose

Post mode on `/create` is a compact composer. Confirming Post stays on this page. It does not open the publish step.

## Implementation

[`creator.tsx`](../../apps/www/src/app/create/creator.tsx) renders [`PostComposer`](../../apps/www/src/app/create/post-composer/composer.tsx) when `draft.type` is `post`, and the article editor otherwise. The header stays in the `max-w-4xl` column. The composer is a `max-w-xl` stack under it: the writing card, then the convert control.

The card is [`card.tsx`](../../apps/www/src/app/create/post-composer/card.tsx). The header is the signed-in user’s avatar and name, from [`useSignedInAuthor`](../../apps/www/src/app/create/signed-in-author.ts), and the existing channel chip. The name is `previewAuthorName`: first name, then username. The avatar is `user.avatar`. When it is empty, the letters are `previewAuthorInitials`: the first letter of the first name and the first letter of the last name.

[`plate.tsx`](../../apps/www/src/app/create/post-composer/plate.tsx) is the Plate editor: a paragraph, the inline `code` mark, and the article editor’s link kit. It does not mount the article toolbar. `readOnly` follows `mode === 'preview'`. Enter and Shift+Enter insert a newline in that paragraph. A paste of several blocks is flattened into the paragraph, and link nodes and code marks are kept. [`field.tsx`](../../apps/www/src/app/create/post-composer/field.tsx) is the editable inside that editor.

[`body.ts`](../../apps/www/src/app/create/post-composer/body.ts) reads and writes `draft.body` as one Plate paragraph, the same JSON string the article editor stores. An empty paragraph is stored as `''`. The editor shows the first paragraph that has text. Opening Post does not replace `body` until that text changes.

[`count.tsx`](../../apps/www/src/app/create/post-composer/count.tsx) is an SVG ring and `used / 280`. `used` is [`graphemeCount`](../../apps/www/src/compositions/editor/draft-text.ts) on the editor’s plain text. `Intl.Segmenter` uses `{ granularity: 'grapheme' }`. Past 280 the ring and the numbers use the destructive color, and the ring stays full. Post stays enabled. The count is a fixed box as wide as the ring plus `280 / 280`. The visible label is placed inside that box, so typing cannot change its width. The count uses the mono face.

[`actions.tsx`](../../apps/www/src/app/create/post-composer/actions.tsx) is image, code, and link. Those buttons hide while the text is read-only. Code toggles the `code` mark. Link opens the existing floating link editor. Both use `Button`. [`image-button.tsx`](../../apps/www/src/app/create/post-composer/image-button.tsx) stores a session `blob:` URL on `draft.coverUrl`. [`image-preview.tsx`](../../apps/www/src/app/create/post-composer/image-preview.tsx) shows it on the card. Replace and clear revoke the previous blob. Nothing is uploaded.

[`turn-into-article.tsx`](../../apps/www/src/app/create/post-composer/turn-into-article.tsx) sets `type` to `article` and sets `body` to that single paragraph. Title, subtitle, channel, tags, cover, visibility, rewards, and `scheduledAt` stay.

[`@sidebar/page.tsx`](../../apps/www/src/app/create/@sidebar/page.tsx) renders [`PostContextPanel`](../../apps/www/src/app/create/post-context/panel.tsx) for a post. From `xl`, that panel stacks [`InTheFeed`](../../apps/www/src/app/create/post-context/in-the-feed.tsx), the existing Posting to row, and the existing channel guidelines. In the feed is a Preview button that calls `toggleMode`, then [`FeedPreviewCard`](../../apps/www/src/compositions/card/FeedPreview.tsx). The excerpt is `draftExcerpt`: the subtitle when it has text, otherwise the post paragraph. The aside stays hidden below `xl`.

The header is still Save draft and Post. Post confirms, then `controller.post()`, and does not route to `/create/publish`. Below `lg`, the top bar is still Cancel and Post.

## Decisions

- **Avatar letters come from the first and last name.** The name shown on the card is still the first name, then the username. The letters in an empty avatar are the first letter of each name. When one of those names is missing, the letters are the first two characters of the name that is shown.
- **The author query does not force sign-in.** `useSession({ required: true })` leaves Create for the sign-in page when the session is missing. This page already renders without that redirect. The name and avatar stay empty until the session is known.
- **The post is one paragraph in `draft.body`.** The article editor already stores Plate JSON in that field, so turning the post into an article does not need a second format. The composer writes a single `p`, including code marks and link nodes.
- **Opening Post does not rewrite the body.** The editor shows the first paragraph that has text. `body` changes when that text changes, or when Turn this into an article is used. The header’s Article control still only sets `type`, so an article that was not edited in the composer comes back intact.
- **Enter stays in the paragraph.** A new block would make the stored body more than one paragraph. Enter and Shift+Enter insert a newline. A pasted fragment of blocks is flattened into inline nodes, with a newline between blocks. Link nodes and code marks are copied through. Other block types become their text.
- **The count is graphemes of the visible text.** `Intl.Segmenter` with `{ granularity: 'grapheme' }` counts an emoji and an accented character as one. A URL counts in full. The ring reads the editor, so it matches the paragraph on screen before `body` is rewritten. At or under 280 the ring is cyan and the numbers are muted. Past 280 both use the destructive color, the ring stays full, and Post still opens the confirmation.
- **The count is a fixed-width box.** The ring is the leading item in an end-aligned row, so a wider label slides it. A minimum width on the number still lets the row grow. The box is as wide as the ring plus `280 / 280`, and the visible label is placed inside it, so the width stays that size while typing. The count uses the mono face because the loaded DM Sans face keeps proportional digits.
- **The image is the cover.** One `coverUrl` already feeds the feed card and the article cover. The file is a session object URL. `next/image` does not render `blob:` URLs, so the composer uses `img`, as the feed preview does. Nothing is uploaded.
- **Code is the inline mark.** The article code block is a different node, and this composer does not include it. The code button toggles the same `code` mark the article toolbar uses. The link button uses the link kit’s floating editor. Neither mounts the article toolbar.
- **Preview lives on the aside.** The post header has no Preview button. The aside control toggles the same `mode`, and the composer text becomes read-only. The label is Preview, and Edit while previewing. Image, code, and link hide in that state. The count stays.
- **The excerpt follows the feed helper.** A subtitle that has text wins. Otherwise the card shows the post paragraph. An empty title leaves that text as the body of the card.

## Limits

There is no autosave, upload, or alt text. URLs are not shortened. The composer has no headings, lists, or code blocks, and it does not mount the article toolbar. Confirming Post logs through `controller.post()` and stays on `/create`. The aside, including Preview, is hidden below `xl`. The phone bar is Cancel and Post.
