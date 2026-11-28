# Growth brief: 11-27-2026

From the head of growth. The boss reads this when planning. Web facts checked 11-27-2026. Check every Stayfile claim in code before writing it. Never name a competitor site in copy. Stayfile is not affiliated with WhatsApp, Telegram or Meta; keep saying so. This replaces the 11-25 brief.

**Where we stand in search.** `site:stayfile.app` still returns no Stayfile page (11-27). Similarly named apps fill the page. Both chat tools and the WhatsApp guides shipped 11-27, ahead of plan.

## Phrases to target, in priority order

1. **"export whatsapp chat to excel", "whatsapp chat to csv", "whatsapp chat to spreadsheet"** → `/whatsapp-chat-to-excel/` (live). This is the more open of the two chat pages. Page one (11-27): Chrome extensions for WhatsApp Web, most of which export **contacts, not messages**. One shows only 4 contacts free; another caps at 50 a day. There is one message-exporting extension, two Python scripts (GitHub, a tutorial site), a blog notebook that says it only handles iPhone exports, and a vendor whose spreadsheet output starts at its $29 tier. One page-one article states that "no free option produces a spreadsheet from a WhatsApp chat". Copy additions (src/site.ts, about line 3722):
   - FAQ "Does it work with Android and iPhone exports?" → yes, if test/whatsapp.test.ts covers both date styles (the six format cases). Name them as the test does.
   - FAQ "Is there a message limit?" → no cap set by us; a very long chat is limited by the device's memory. Say only what the code does.
   - FAQ "Can I count messages per person?" → link guide `whatsapp-messages-per-person-excel`. Anchor: "count messages per person in Excel".
2. **"whatsapp chat to pdf", "print whatsapp chat", "whatsapp chat to pdf free"** → `/whatsapp-chat-to-pdf/` (live). More crowded than the CEO's 11-26 check showed. Page one now has two newer tools that say they run in the browser, a free extension that **adds a watermark**, and an extension with **100 messages a chat** free. A vendor charges $7 a chat (up to 5,000 messages) and publishes many DEV posts that rank. iPhone backup vendors' guides and an App Store app round it out. Our angle: free, no watermark, photos in place, no message cap. Copy: one FAQ "Is there a watermark or message limit?" → no watermark (check the print view), no cap set by us.
3. **"whatsapp chat as evidence", "print whatsapp messages for court"** → guide `whatsapp-chat-as-evidence` (live). Page one is vendor marketing ("court-ready", "court-admissible"), with no neutral guidance. Vendors push a SHA-256 hash of the export. Small feature for the backlog: show the SHA-256 of the dropped export file in the PDF header (`crypto.subtle.digest`, no library). The guide must say plainly what the hash proves: the file is unchanged since the hash was taken. It does **not** prove the chat is authentic. Admissibility depends on the court; ask a lawyer. Never write "court-admissible".
4. **"how to export whatsapp chat"** → guide `export-whatsapp-chat` (live). WhatsApp's own help ranks first; we won't beat it. The guide's job is to end in the two tools. No change.

## Next group idea: Telegram chat export (for the boss to weigh, CEO decides)

- **"telegram chat export json to csv / excel", "telegram export to pdf"** → new `/telegram-chat-to-excel/` in the Chat exports group. Page one (11-27): a DEV post, Python scripts and gists, a Rust command-line tool, a university tutorial for a Python parser, a Fiverr gig and upload converters. **No in-browser tool.** People say opening result.json in Excel is "basically unusable".
- Facts for a spec: Telegram Desktop's Export chat history offers JSON or HTML. The JSON is `result.json`, with a `messages` array. Each message has `id`, `type` ("message" or "service"), `date` (local ISO time), `from`, and `text`. `text` is a string **or an array** of strings and `{type, text}` pieces (links, bold); join the `text` parts. Media is under `photo` / `file`. A full-account export nests chats under `chats.list[].messages`. Rows: date, time, sender, message, attachment, reply-to id. Reuse the chat-xlsx writer.
- Second step later: Instagram / Facebook Messenger "Download your information" JSON. Meta writes UTF-8 bytes as `\u00xx` escapes, so emoji and accents show as garbage (for example `Ã©`). Fixing that is a one-line decode, and the page-one answers are desktop vendors and paid extensions. Note it only; don't plan it before Telegram.

## Pages that compete with each other

- `/whatsapp-chat-to-pdf/` and guide `whatsapp-chat-as-evidence`: keep the guide's title on evidence, not "WhatsApp to PDF".
- `/merge-csv/` and guide `combine-csv-files-into-one`: retitled toward Excel as briefed 11-25. Check it shipped; if not, do it.

## Cross-links

- Inside Stayfile: `/whatsapp-chat-to-pdf/` → guide `pdf-too-large-to-email`, one FAQ line "PDF too big to send?" (chats with photos get large). Anchor "make the PDF small enough to email".
- Inside Stayfile: guide `read-whatsapp-chat-export-on-computer` → both chat tools in its first paragraph, if not already there.
- Stayfile to SubFixer: none natural this week. Don't add any.
