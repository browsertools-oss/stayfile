// Reference notes on every file format the tools read or write. Each tool page shows the
// formats it deals with (see formatsFor), so a visitor gets the background on what the file
// actually is, not only the button. Keep facts checkable: dates, standards and limits only.

export interface Format {
  id: string;
  name: string; // short name as people say it
  full: string; // full or formal name
  facts: { kind: string; since: string; by: string; goodFor: string; watch: string; opens: string };
  paras: string[];
}

export const FORMATS: Record<string, Format> = {
  pdf: {
    id: 'pdf',
    name: 'PDF',
    full: 'Portable Document Format',
    facts: {
      kind: 'Fixed page layout with text, fonts, vector drawing and images',
      since: '1993, an open ISO standard (ISO 32000) since 2008',
      by: 'Adobe',
      goodFor: 'Documents that must look the same on every screen and printer',
      watch: 'Hard to edit; scanned PDFs hold pictures of text, not text',
      opens: 'Every browser, Preview on Mac, Edge on Windows, phones',
    },
    paras: [
      'A PDF describes pages, not paragraphs. Each page says exactly where every letter, line and picture sits, and the fonts are usually embedded in the file. That is why a PDF looks the same on a phone, a laptop and a printer, and also why it is awkward to edit: there is no flowing text to reflow, only marks placed at coordinates.',
      'A page in a PDF can hold real text (which you can select and search), vector drawing, and images. A scanned document is the exception that trips people up. A scanner makes a picture of each page and wraps it in a PDF, so there is no text inside at all until an OCR program reads the picture and adds a hidden text layer.',
      'Because pages are independent objects, PDFs can be split, merged, reordered and rotated without touching the content of each page. That kind of job loses nothing. Converting a page to an image, or an image to a page, is a different kind of job, and the result depends on the resolution chosen.',
    ],
  },
  jpg: {
    id: 'jpg',
    name: 'JPG',
    full: 'JPEG image (.jpg or .jpeg)',
    facts: {
      kind: 'Raster photo format with lossy compression',
      since: '1992',
      by: 'Joint Photographic Experts Group',
      goodFor: 'Photos, anything going to an upload form or an email',
      watch: 'No transparency; each re-save loses a little more detail',
      opens: 'Everything: every browser, phone, editor and upload form',
    },
    paras: [
      'JPG is the default photo format of the web and of most cameras. It saves space by throwing away detail the eye is bad at noticing, mostly fine colour variation and high frequency texture, and it lets you choose how much to throw away with a quality setting. Around 80 to 90 looks the same as the original to most people at a fraction of the size.',
      'The compression works in 8 by 8 pixel blocks. Push the quality too low and those blocks start to show, along with halos around sharp edges. That is why JPG suits photos but not screenshots, logos or text: flat colour and crisp lines are exactly what it handles worst.',
      'JPG has no transparency. Anything that was transparent in the source has to be filled with a colour, usually white. It also loses a little each time it is opened and saved again, so keep an original if you plan to edit a picture more than once.',
    ],
  },
  png: {
    id: 'png',
    name: 'PNG',
    full: 'Portable Network Graphics',
    facts: {
      kind: 'Raster image format with lossless compression',
      since: '1996, a W3C recommendation',
      by: 'An open group of developers, as a patent-free replacement for GIF',
      goodFor: 'Screenshots, logos, diagrams, anything with text or transparency',
      watch: 'Photos come out several times larger than the same photo as JPG',
      opens: 'Everything: every browser, phone, editor and upload form',
    },
    paras: [
      'PNG stores every pixel exactly. Nothing is thrown away, so a PNG can be opened and saved any number of times with no loss. It compresses by finding repeated patterns, which works very well on flat colour and sharp edges, and badly on photos, where almost no two neighbouring pixels match.',
      'PNG supports full alpha transparency: each pixel can be anything from solid to fully see-through. That is why logos, icons and interface graphics are so often PNG. A PNG can also be a small 256 colour palette image, which is how it replaced GIF for simple graphics.',
      'If a PNG photo is too big to send, changing the compression level will not help much. The fix is a lossy format: JPG for photos without transparency, or WebP and AVIF, which keep transparency and are still small.',
    ],
  },
  webp: {
    id: 'webp',
    name: 'WebP',
    full: 'WebP image',
    facts: {
      kind: 'Raster image format, lossy or lossless, with transparency and animation',
      since: '2010',
      by: 'Google',
      goodFor: 'Images on websites, where size matters and browsers support it',
      watch: 'Some older programs, print shops and upload forms refuse it',
      opens: 'All current browsers (Safari since 2020), most current editors',
    },
    paras: [
      'WebP was made to replace JPG, PNG and GIF on websites with one smaller format. In lossy mode it typically makes files a quarter to a third smaller than a JPG of similar quality. In lossless mode it beats PNG on size. It also handles transparency and animation, which neither JPG nor PNG does on its own.',
      'The catch is the world outside the browser. Many websites now serve WebP, so a picture saved from a page often arrives as .webp even if it looked like a JPG. Older desktop software, some upload forms and many print services still do not accept it, which is why converting WebP back to JPG or PNG is such a common job.',
    ],
  },
  avif: {
    id: 'avif',
    name: 'AVIF',
    full: 'AV1 Image File Format',
    facts: {
      kind: 'Raster image format based on the AV1 video codec',
      since: '2019',
      by: 'Alliance for Open Media (Google, Mozilla, Netflix, Apple and others)',
      goodFor: 'The smallest high quality images for websites',
      watch: 'Slow to encode; older apps, Windows tools and upload forms may not open it',
      opens: 'Chrome since 2020, Firefox since 2021, Safari since 2022',
    },
    paras: [
      'AVIF takes a single frame of AV1 video compression and uses it for still pictures. The result is usually smaller than WebP and far smaller than JPG at the same visual quality, especially for photos with smooth areas such as sky and skin. It supports transparency, animation, and more than 8 bits of colour per channel, which allows HDR images.',
      'The price is encoding time. Making an AVIF takes much more computing than making a JPG, so a large photo can take a few seconds. It is also young enough that plenty of software outside the browser cannot open it yet, so it is best kept for websites, with a JPG or PNG copy for anything else.',
    ],
  },
  heic: {
    id: 'heic',
    name: 'HEIC',
    full: 'High Efficiency Image Container (HEIF with HEVC)',
    facts: {
      kind: 'Image container using HEVC (H.265) video compression',
      since: '2015 standard; the iPhone default since iOS 11 in 2017',
      by: 'MPEG; adopted by Apple',
      goodFor: 'Saving phone storage: about half the size of a JPG at the same quality',
      watch: 'Windows needs an extra codec, and most upload forms reject it',
      opens: 'Apple devices, Safari 17 and later, Windows with the HEIF and HEVC extensions',
    },
    paras: [
      'HEIC is what an iPhone saves photos as unless you change the camera setting. It uses the same compression as HEVC video, which squeezes a photo to roughly half the size of the equivalent JPG. It can hold 10 bit colour, depth data for portrait mode, and several images in one file for bursts and Live Photos.',
      'The compression is covered by patents, and that is the reason support is patchy. Windows needs the HEIF Image Extensions plus a paid HEVC codec from the Microsoft Store before it can show the photos. Chrome and Firefox do not display HEIC at all. Most job sites, government forms and print shops only accept JPG or PNG, which is why so many people end up converting.',
    ],
  },
  gif: {
    id: 'gif',
    name: 'GIF',
    full: 'Graphics Interchange Format',
    facts: {
      kind: 'Raster image format limited to 256 colours, with animation',
      since: '1987',
      by: 'CompuServe',
      goodFor: 'Short simple animations and tiny graphics',
      watch: 'Only 256 colours per frame; photos look grainy and files get large',
      opens: 'Everything',
    },
    paras: [
      'GIF is one of the oldest image formats still in daily use. Each frame can use at most 256 colours picked from a palette, and a pixel is either fully transparent or fully solid, with nothing in between. That is fine for simple graphics and terrible for photos, which come out speckled with dithering.',
      'GIF survived because it animates everywhere. An animated GIF is a stack of frames with delays between them. Most image formats and most converters only take the first frame, so converting an animated GIF to a still format gives you a single picture.',
    ],
  },
  bmp: {
    id: 'bmp',
    name: 'BMP',
    full: 'Windows Bitmap',
    facts: {
      kind: 'Raster image format, usually uncompressed',
      since: 'Mid 1980s, with early Windows',
      by: 'Microsoft',
      goodFor: 'Old Windows software, some scanners and industrial equipment',
      watch: 'Huge files: a photo can be ten times the size of the same JPG',
      opens: 'Windows, browsers, most editors; rarely accepted by upload forms',
    },
    paras: [
      'A BMP usually stores raw pixel values one after another with almost no compression. That made it simple and fast on 1990s hardware, and it makes the files enormous today. A 12 megapixel photo as a 24 bit BMP is about 36 megabytes.',
      'BMP files still turn up from old Windows programs, scanners, medical and industrial devices, and screenshots taken by legacy tools. Nothing is gained by keeping them as BMP: PNG stores the same pixels exactly at a fraction of the size, and JPG is smaller again for photos.',
    ],
  },
  svg: {
    id: 'svg',
    name: 'SVG',
    full: 'Scalable Vector Graphics',
    facts: {
      kind: 'Vector drawing written as XML text',
      since: '2001, a W3C recommendation',
      by: 'W3C',
      goodFor: 'Logos, icons, diagrams and charts that must stay sharp at any size',
      watch: 'Not a photo format; many upload forms and office apps will not take it',
      opens: 'Every browser, Illustrator, Inkscape, Figma',
    },
    paras: [
      'An SVG is not made of pixels. It is a text file describing shapes: lines, curves, fills and text, with coordinates. A browser draws those shapes fresh at whatever size it needs, so an SVG logo is just as sharp on a phone as on a billboard, and the file is often only a few kilobytes.',
      'Turning an SVG into PNG, JPG or WebP means choosing a size and drawing it once into pixels. After that the picture is fixed: scale it up later and it blurs like any photo. If the SVG uses web fonts or links to outside images, those may not come along, because the drawing has to be self-contained to render the same everywhere.',
    ],
  },
  ico: {
    id: 'ico',
    name: 'ICO',
    full: 'Windows icon file',
    facts: {
      kind: 'Container holding one picture at several sizes',
      since: '1985, with Windows 1.0',
      by: 'Microsoft',
      goodFor: 'Website favicons and Windows shortcut and program icons',
      watch: 'Small sizes need simple artwork; detail disappears at 16 pixels',
      opens: 'Browsers (as a favicon), Windows, most image editors',
    },
    paras: [
      'An ICO file is a small bundle of the same picture at different sizes, typically 16, 32 and 48 pixels square, sometimes up to 256. Whatever displays the icon picks the size that fits: a browser tab wants 16 or 32, a Windows desktop shortcut wants 48 or larger. Since Windows Vista the images inside can be stored as PNG, so transparency works.',
      'Browsers still look for a file called favicon.ico at the root of every website, which is why the format refuses to die. A good favicon is simple: a letter or a bold shape that is still readable at 16 pixels, where a detailed logo turns into a smudge.',
    ],
  },
  txt: {
    id: 'txt',
    name: 'Text',
    full: 'Plain text (.txt)',
    facts: {
      kind: 'Characters only, with no formatting',
      since: 'As old as computers; UTF-8 encoding since 1993',
      by: 'No owner',
      goodFor: 'Notes, logs, copying words into any other program',
      watch: 'Encoding mix-ups show accents as odd symbols',
      opens: 'Everything',
    },
    paras: [
      'A plain text file is just characters and line breaks. There is no bold, no fonts, no page size. That makes it the most durable and portable format there is: a text file from 1980 still opens today, and any program that takes words will take text.',
      'The one thing a text file does carry is an encoding, the rule for turning bytes into letters. Today that is almost always UTF-8, which covers every language. When accented letters turn into pairs of odd symbols, a program has read UTF-8 text using an older encoding.',
    ],
  },
  md: {
    id: 'md',
    name: 'Markdown',
    full: 'Markdown (.md)',
    facts: {
      kind: 'Plain text with light formatting marks',
      since: '2004; CommonMark specification since 2014',
      by: 'John Gruber, with Aaron Swartz',
      goodFor: 'README files, notes, documentation, chat and AI tool output',
      watch: 'Tables and some features vary between flavours',
      opens: 'Any text editor; rendered by GitHub, Obsidian, Notion and many others',
    },
    paras: [
      'Markdown is plain text written with a few conventions: a # at the start of a line makes a heading, *stars* mark emphasis, a dash starts a list item. It reads fine as raw text and turns into clean formatted documents when a program renders it.',
      'Tables are written with pipes between cells and a row of dashes under the header. That table syntax came from GitHub Flavored Markdown, not the original design, which is why converting between Markdown tables and spreadsheets is a common job: the tables are easy to read but tedious to edit by hand.',
    ],
  },
  csv: {
    id: 'csv',
    name: 'CSV',
    full: 'Comma-separated values',
    facts: {
      kind: 'Table as plain text, one row per line, cells split by a separator',
      since: 'Early 1970s; described in RFC 4180 in 2005',
      by: 'No single owner',
      goodFor: 'Moving tables between spreadsheets, databases and programs',
      watch: 'Separator and encoding differ by country; no data types, one sheet only',
      opens: 'Excel, Numbers, Google Sheets, every database and programming language',
    },
    paras: [
      'A CSV file is a table written as text. Each line is a row and each comma starts a new cell. A cell that contains a comma, a quote or a line break is wrapped in double quotes, and a quote inside it is doubled. That is nearly the whole format, which is why almost every program can read and write it.',
      'The simplicity has a cost. There are no data types, so a program has to guess whether 02134 is a number or a zip code, and whether 3/4 is a date. There is one table per file, no formatting and no formulas. And the separator is not always a comma: in much of Europe it is a semicolon, because the comma is the decimal mark there, which is the usual reason a CSV opens in a single column.',
    ],
  },
  ics: {
    id: 'ics',
    name: 'ICS',
    full: 'iCalendar (.ics)',
    facts: {
      kind: 'Calendar data in plain text (iCalendar)',
      since: '1998, RFC 2445; current rules RFC 5545 from 2009',
      by: 'IETF',
      goodFor: 'Moving events between calendar apps',
      watch: 'Repeating events and time zones are handled differently by each app',
      opens: 'Apple Calendar, Google Calendar, Outlook, most phone calendars',
    },
    paras: [
      'An .ics file holds a calendar, or a piece of one: events with a title, start and end, and optional place and notes. Each event is a block of lines between BEGIN:VEVENT and END:VEVENT, and the whole file sits between BEGIN:VCALENDAR and END:VCALENDAR. A calendar app can import the file, and a single event can be sent as an invitation.',
      'Times can be written without a time zone, in UTC, or with a named zone. With no zone, the app that opens the file places the event in its own time zone, which is what a personal import usually wants. Repeating events carry a rule instead of a copy for every date, and apps do not all expand that rule the same way.',
    ],
  },
  vcf: {
    id: 'vcf',
    name: 'VCF',
    full: 'vCard (.vcf)',
    facts: {
      kind: 'Contact cards in plain text (vCard)',
      since: '1995, versit consortium; current rules RFC 6350 from 2011',
      by: 'versit consortium, then IETF',
      goodFor: 'Moving contacts between phones, mail apps and accounts',
      watch: 'Versions 2.1, 3.0 and 4.0 differ, and apps drop fields they do not know',
      opens: 'iPhone and Android Contacts, iCloud, Google Contacts, Outlook',
    },
    paras: [
      'A .vcf file holds one or more contact cards. Each card sits between BEGIN:VCARD and END:VCARD and lists fields such as the name, phone numbers, email addresses, a postal address and a note. The whole thing is plain text, so most address books can read it, and a single card can be sent as an attachment or a text message.',
      'The format exists in three versions that still turn up. 2.1 is the oldest and uses quoted-printable text for accented letters; 3.0 is what most address books read and write; 4.0 is newer and stricter, and older apps may refuse it. A file written as 3.0 is the safe choice when the cards have to import somewhere you cannot check first.',
    ],
  },
  tsv: {
    id: 'tsv',
    name: 'TSV',
    full: 'Tab-separated values',
    facts: {
      kind: 'Table as plain text, cells split by tab characters',
      since: 'Registered as a media type with IANA in 1993',
      by: 'No single owner',
      goodFor: 'Data copied from spreadsheets; text that itself contains commas',
      watch: 'A tab or line break inside a cell breaks the table',
      opens: 'Excel, Google Sheets, databases, most data tools',
    },
    paras: [
      'TSV is CSV with a tab instead of a comma between cells. Because tabs almost never appear in ordinary text, most TSV files need no quoting at all, which makes them easier to read and harder to break. When you copy cells out of Excel or Google Sheets, what lands on the clipboard is TSV.',
      'Bioinformatics, linguistics and many database export tools default to TSV for the same reason. The weak spot is the opposite of CSV\'s: there is no agreed way to put a real tab or line break inside a cell.',
    ],
  },
  json: {
    id: 'json',
    name: 'JSON',
    full: 'JavaScript Object Notation',
    facts: {
      kind: 'Structured data as text: objects, lists, strings, numbers, true, false, null',
      since: 'Early 2000s; standardised as ECMA-404 and RFC 8259',
      by: 'Douglas Crockford',
      goodFor: 'APIs, configuration, exports from web apps',
      watch: 'Nested data does not map neatly onto rows and columns; no comments allowed',
      opens: 'Every programming language, code editors, browsers',
    },
    paras: [
      'JSON is the language web services talk in. It has objects (named fields in curly braces), arrays (lists in square brackets), and simple values: text in double quotes, numbers, true, false and null. Almost every API returns JSON, and most apps that offer a data export offer it as JSON.',
      'JSON can nest without limit: a customer can hold an address, which holds a list of phone numbers. A spreadsheet cannot. Turning JSON into a table means deciding how to flatten that structure, usually by giving nested fields dotted column names such as address.city, and writing lists into a single cell.',
    ],
  },
  jsonl: {
    id: 'jsonl',
    name: 'JSON Lines',
    full: 'JSON Lines (.jsonl or .ndjson)',
    facts: {
      kind: 'One complete JSON value per line',
      since: 'Early 2010s',
      by: 'Community convention',
      goodFor: 'Logs, large exports and machine learning datasets',
      watch: 'Not valid as a single JSON document, so some tools reject it',
      opens: 'Code editors, data tools, most programming languages',
    },
    paras: [
      'A JSON Lines file puts one JSON record on each line, with no surrounding array and no commas between records. A program can read it one line at a time, which matters when the file is gigabytes long, and new records can be appended without rewriting the file.',
      'Logging systems, analytics exports and AI training sets use it heavily. Each line usually has the same fields, so it converts to a table cleanly: one line becomes one row.',
    ],
  },
  yaml: {
    id: 'yaml',
    name: 'YAML',
    full: "YAML Ain't Markup Language",
    facts: {
      kind: 'Structured data written with indentation instead of brackets',
      since: '2001; version 1.2 in 2009',
      by: 'Clark Evans, Ingy döt Net and Oren Ben-Kiki',
      goodFor: 'Configuration files people edit by hand: CI, Docker Compose, Kubernetes',
      watch: 'Indentation errors; older parsers read no, yes and on as true or false',
      opens: 'Code editors and most programming languages',
    },
    paras: [
      'YAML holds the same kinds of data as JSON (YAML 1.2 is in fact a superset of JSON) but is written for people. Nesting is shown by indentation, lists start with a dash, and quotes are usually optional. It also allows comments, which JSON does not.',
      'The friendliness has traps. A misplaced space changes the structure silently. Older YAML 1.1 parsers read unquoted words such as no, yes, on and off as booleans, so the country code NO for Norway can become false. When YAML has to feed a program that expects JSON or a table, converting it makes those surprises visible.',
    ],
  },
  xlsx: {
    id: 'xlsx',
    name: 'Excel',
    full: 'Excel workbook (.xlsx)',
    facts: {
      kind: 'Spreadsheet workbook: a zip of XML files',
      since: '2007 (Office Open XML, ECMA-376 and ISO/IEC 29500)',
      by: 'Microsoft',
      goodFor: 'Tables people read, sort and edit, with types, formatting and several sheets',
      watch: 'Limit of 1,048,576 rows and 16,384 columns per sheet',
      opens: 'Excel, Numbers, Google Sheets, LibreOffice',
    },
    paras: [
      'An .xlsx file is a zip archive of XML documents: one per sheet, plus shared text, styles and settings. Unlike CSV it records what each cell is, so a number stays a number, a date stays a date, and 02134 can stay as text with its leading zero.',
      'A workbook can hold several sheets, formulas, formatting, charts and comments. Exporting to CSV, JSON or another plain format keeps only the values, from one sheet at a time, which is usually what a program or database wants anyway.',
    ],
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    full: 'SQL INSERT statements (.sql)',
    facts: {
      kind: 'Database commands written as text',
      since: 'SQL dates from the 1970s; an ANSI and ISO standard since 1986',
      by: 'IBM originally; now a shared standard',
      goodFor: 'Loading rows into MySQL, MariaDB, Postgres or SQLite',
      watch: 'The table has to exist first; quoting rules matter',
      opens: 'Any database client, code editors',
    },
    paras: [
      'An INSERT statement adds one row to a database table: INSERT INTO people (name, city) VALUES (\'Ada\', \'London\');. A .sql file of these statements can be pasted into a database client or run from the command line, and every relational database understands the basic form.',
      'Text values go in single quotes, and a single quote inside the text is written twice, so O\'Hara becomes \'O\'\'Hara\'. Numbers go without quotes and missing values are NULL. Getting those three rules right is most of what makes a generated script run cleanly.',
    ],
  },
};

const ALIAS: Record<string, string> = {
  excel: 'xlsx',
  markdown: 'md',
  text: 'txt',
  jpeg: 'jpg',
};

// Formats a page deals with, read from its slug: "png-to-jpg" gives png then jpg,
// "merge-pdf" gives pdf, "compress-image" gives the three common web image formats.
export function formatsFor(slug: string): Format[] {
  if (/-image$/.test(slug)) return ['jpg', 'png', 'webp'].map((id) => FORMATS[id]);
  const ids: string[] = [];
  for (const raw of slug.split('-')) {
    const id = ALIAS[raw] ?? raw;
    if (FORMATS[id] && !ids.includes(id)) ids.push(id);
  }
  return ids.map((id) => FORMATS[id]);
}
