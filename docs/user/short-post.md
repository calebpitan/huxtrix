# Short post

## Purpose

Write a short post and publish it from Create, or turn it into an article when it needs more room.

## Behavior

On a wide window, choose Post in the header. Save draft and Post stay. The word count and Preview leave the header. The writing column becomes a card with your name, your picture, a channel, and the post. Without a picture, the avatar shows the first letter of your first name and the first letter of your last name.

The channel control is the same list as on an article. Until you pick one, it reads “Choose a channel”.

The post is one paragraph. Pressing Enter starts a new line in that paragraph. You can mark text as code, add a link, or attach a picture from your computer. The picture shows on the card and in the feed preview. Reloading the page clears it. It is not uploaded.

A ring beside the text counts toward 280. An emoji counts as one. A web address counts in full. Past 280 the ring and the count change color. Post still asks “Post this?”. Confirming posts and leaves you on Create. Cancel leaves the draft as it is.

Under the card, “Going long? Turn this into an article” opens the article editor. The post is the first paragraph. The channel and the picture stay, and any title or subtitle you already had stays too.

On a wide window the right side shows how the post will look in the feed, then Posting to and the channel guidelines. Preview on that panel shows the post as it reads, and the button changes to Edit. The picture, code, and link controls hide while you are previewing. Posting to and the guidelines match the article panel.

On a narrow window the right side is hidden. The card stays. The top bar is Cancel and Post.

## Decisions

- Post asks first and stays on Create.
- The count is what you see, including a full web address. Past 280 you can still post.
- Turning the post into an article keeps the channel, the picture, the title, and the subtitle.

## Limits

Save draft and Post do not store the post. The picture is not stored either. The post cannot hold a heading or a code block until you turn it into an article. On a narrow window there is no feed preview and no Preview button. Nothing is saved on its own.
