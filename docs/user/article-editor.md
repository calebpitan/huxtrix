# Article editor

## Purpose

Write an article, read it back, and continue to the publish step. You can also switch the header to a short post and post from this page.

## Behavior

Open Create. The page uses the same sidebar as the rest of Huxtrix.

The channel, the cover, the title, the subtitle, and the writing sit on one left edge. The format bar is the same width as that column. Undo, redo, insert, text style, bold, italic, strikethrough, code, highlight, link, and lists are on the bar. More holds keyboard input, superscript, subscript, and indent. On a narrow screen the format buttons scroll sideways inside the bar.

While you are writing, two chips sit above the title. Each is about 40px tall. The channel chip reads “Choose a channel” until you pick one. Opening it shows a search box and up to twenty channels. Today those are Tech, Food, DIY, Productivity, Home, Life, and Maths & Science. Each one shows a member count. Maths & Science shows 115k members. Typing a name finds a channel even when it was not among those twenty. The chip then shows the name you picked, such as Tech.

Add cover picks an image from your computer and shows it on the chip. Choose the image again to replace it, or remove it. Reloading the page clears the image. It is not uploaded.

An empty line reads “Type / to insert a heading, image, code block…”. Typing / opens the insert menu. A code block is a rounded panel with the language and a copy icon in its top corner. Copy copies the code.

Preview hides the chips and shows the title, the subtitle, and the writing.

On a wide window, a header sits at the top of that column.

- Post and Article are a pair of choices. Article is selected when you open the page. Choosing Post changes the header to Save draft and Post, and the column stays the article editor.
- The status line counts words in the title, the subtitle, and the writing. With at least one word it also shows a read time, such as `168 words · 1 min read`. At zero words it shows `0 words`.
- Preview shows an eye beside the word and has no fill of its own. It hides the format bar and shows the title, the subtitle, and the writing as they read. The button changes to Edit. Save draft and Next stay.
- Save draft has no fill until you point at it. It shows Saved, with a green dot, until you change the draft.
- Next is a filled button with an arrow after the word. It opens the publish page. Coming back still shows what you typed. That page is a heading for now.

Choosing Post hides the status line and Preview. Save draft still marks the draft saved. Post asks “Post this?”. Confirming posts and leaves you on Create. Cancel leaves the draft as it is.

On a phone the top bar is Cancel and Next. After you choose Post, that button is Post and asks the same question. The mode choice, the word count, Preview, and Save draft stay on the wide header.

The right side of a wide window is empty of Preview, Save draft, and Next.

Leaving the page with writing in the body asks you to save a draft or discard it. Moving between Create and the publish page keeps the draft and does not ask.

## Decisions

- On a wide window, the mode choice and the actions sit in the column header with the article.
- Preview is the same column. Edit brings the format bar back.
- Next opens the publish page. Post asks first and stays on Create.

## Limits

Save draft and Post do not store the article. The cover image is not stored either. Choosing Post keeps the article editor. The publish page does not yet choose an audience or a time. Nothing is saved on its own. The outline and writing guidelines are not on this page yet.
