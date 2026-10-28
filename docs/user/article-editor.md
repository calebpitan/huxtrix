# Article editor

## Purpose

Write an article, read it back, and continue to the publish step. You can also switch the header to a short post and post from this page.

## Behavior

Open Create. The page uses the same sidebar as the rest of Huxtrix.

On a wide window the header, the format pill, and the writing share one column. The pill sits just inside the header, and the channel, the cover, the title, the subtitle, and the writing sit further in, on one left edge. The title is large and tight. The subtitle is a medium weight and dimmer than the title. The pill has a faint fill. It holds undo, redo, insert, text style, bold, italic, strikethrough, code, highlight, link, the three lists, and indent. More holds keyboard input, superscript, and subscript, and sits at the pill’s right end. On a narrow screen the controls scroll sideways inside the pill.

While you are writing, two chips sit above the title. Each is about 40px tall, and the page color shows through them. The channel chip has a solid border. Add cover has a dashed border until you pick an image. The channel chip reads “Choose a channel” until you pick one. Opening it shows a search box and up to twenty channels. Today those are Tech, Food, DIY, Productivity, Home, Life, and Maths & Science. Each one shows a member count. Maths & Science shows 115k members. Typing a name finds a channel even when it was not among those twenty. The chip then shows the name you picked, such as Tech.

Add cover picks an image from your computer and shows it on the chip. Choose the image again to replace it, or remove it. Reloading the page clears the image. It is not uploaded.

An empty line reads “Type / to insert a heading, image, code block…”. Typing / opens the insert menu. A code block is a rounded panel with the language and a copy icon in its top corner. Copy copies the code.

Preview hides the chips and shows the title, the subtitle, and the writing.

On a wide window, a header sits at the top of that column.

- Post and Article sit in a light capsule with a thin border. Article is selected when you open the page. Choosing Post changes the header to Save draft and Post, and the column stays the article editor.
- The status line counts words in the title, the subtitle, and the writing. With at least one word it also shows a read time, such as `168 words · 1 min read`. At zero words it shows `0 words`.
- Preview shows an eye beside the word and has no fill of its own. It hides the format pill and shows the title, the subtitle, and the writing as they read. The button changes to Edit. Save draft and Next stay.
- Save draft has no fill until you point at it. It shows Saved, with a green dot, until you change the draft.
- Next is a filled button with an arrow after the word. It opens the publish page. Coming back still shows what you typed. That page is a heading for now.

Choosing Post hides the status line, Preview, and the format pill. Save draft still marks the draft saved. Post asks “Post this?”. Confirming posts and leaves you on Create. Cancel leaves the draft as it is.

On a phone the top bar is Cancel and Next. After you choose Post, that button is Post and asks the same question. The mode choice, the word count, Preview, and Save draft stay on the wide header.

On a wide window, the right side follows the article. That column is wider than the channel list on the home page.

- Posting to names the channel you picked. Tech through Life also show a member count, such as 289k members for Tech. Maths & Science shows the name and no count. Joined sits beside the name and does not ask to join. Change opens the same channel list as the chip above the title. Until you pick a channel, that row is empty.
- Tech shows three writing guidelines. Any other channel shows “Guidelines for this channel will go here.”
- Outline lists the headings in the article. A straight line runs beside them. The heading for the section you are writing in is marked in that line, and its words are stronger. Clicking a heading moves the cursor there and brings that heading into view. With no headings it says “No headings yet”.
- Drafts says “No drafts yet”.

Preview, Save draft, and Next stay in the column header.

Leaving the page with writing in the body asks you to save a draft or discard it. Moving between Create and the publish page keeps the draft and does not ask.

## Decisions

- On a wide window, the mode choice and the actions sit on the edges of the column header. The format pill sits just inside those edges and stays under the header while the writing scrolls. The writing sits further in.
- Preview is the same column. Edit brings the format pill back. Post hides the pill.
- Next opens the publish page. Post asks first and stays on Create.

## Limits

Save draft and Post do not store the article. The cover image is not stored either. Choosing Post keeps the article editor and hides this side panel. The publish page does not yet choose an audience or a time, and it does not show the panel. Nothing is saved on its own. Drafts are not listed. On a narrow window the panel is hidden.
