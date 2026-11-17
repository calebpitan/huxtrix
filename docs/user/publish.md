# Publish

## Purpose

Choose where an article appears, then publish it. A short post stays on Create and does not use this
page.

## Behavior

Next on an article opens this page. What you already wrote is still there. Back to editing returns
to the article. On a phone the top bar says Back and Publish. On a wide window the column header
also has Save draft, and Draft saved after you have saved and not changed the draft since.

The page asks where the article appears.

- Channel is required. The choices are Tech, Food, DIY, Productivity, Home, Life, and Maths &
  Science. The one you pick is filled and shows a check.
- Cover image is optional. You can drop a picture or browse for one. It shows in the box. You can
  replace it or remove it. Reloading the page clears it. It is not uploaded. 16:9 works best.
- Tags take up to five. The field suggests tags as you type, and you can create one that is not in
  the list. Press space to finish a tag. Each tag has an X that removes it. The count reads how many
  of five you have used. A sixth tag is refused.
- Visibility is Everyone or Channel members.
- Allow rewards is on when you arrive. You can turn it off.
- Publish now is immediate. Schedule picks a date and a time. Clear removes that time. Nothing is
  sent out on a timer.

Publish stays available. If the title or the channel is missing, the page says so next to that part
and does not publish. The title message sits under the introduction, because the title is edited on
the previous page. When both are present, Publish asks “Publish this?”. Publish confirms and stays
on the page. Cancel leaves the draft as it is.

On a wide window the right side shows the article as a feed card, then a checklist. Preview, beside
“In the feed”, opens the article as it reads. The card uses the subtitle as the excerpt, or the
first paragraph when the subtitle is empty, and it shows the cover when you added one. A line under
the card reminds you of that while the subtitle or the cover is missing. The checklist marks title
and subtitle, the channel, the tags, and the cover only when those are filled in. A finished row is
a green circle with a check. An open row is a dashed circle. The cover can stay empty. Below that
width the card is hidden and the same checklist sits under the form.

There is no control for sharing the article as a highlight.

## Decisions

- Publish asks before it posts, and it stays available even when a required field is empty.
- Schedule stores a date and a time on the draft. It does not publish later by itself.
- A short post sent to this page returns to Create.

## Limits

Save draft and Publish do not store the article. The cover is not stored either. The chosen time is
not sent to a scheduler. On a narrow window there is no feed card, and Save draft stays on the wide
header.
