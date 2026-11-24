export const SITE = {
  name: 'Stayfile',
  tagline: 'File tools that run on your own device',
  // Placeholder until the owner picks and buys a domain. Change here, in astro.config.mjs and public/robots.txt.
  url: 'https://stayfile.app',
};

export type Tool =
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-rotate'
  | 'pdf-to-jpg'
  | 'pdf-to-png'
  | 'pdf-to-text'
  | 'pdf-numbers'
  | 'text-to-pdf'
  | 'img-to-pdf'
  | 'img-convert'
  | 'img-compress'
  | 'img-resize'
  | 'img-ico'
  | 'csv-to-json'
  | 'csv-to-markdown'
  | 'json-to-csv'
  | 'json-to-tsv'
  | 'csv-to-xlsx'
  | 'xlsx-to-csv'
  | 'xlsx-to-json'
  | 'xlsx-to-markdown'
  | 'xlsx-to-tsv'
  | 'xlsx-to-yaml'
  | 'json-to-xlsx'
  | 'json-to-markdown'
  | 'tsv-to-csv'
  | 'csv-to-tsv'
  | 'md-to-csv'
  | 'md-to-json'
  | 'md-to-xlsx'
  | 'yaml-to-json'
  | 'yaml-to-csv'
  | 'yaml-to-xlsx'
  | 'csv-to-ics'
  | 'ics-to-csv'
  | 'csv-to-vcf'
  | 'vcf-to-csv'
  | 'csv-to-yaml'
  | 'csv-to-sql'
  | 'xlsx-to-sql'
  | 'json-to-yaml';

export type Group = 'PDF' | 'Images' | 'Spreadsheets and data';

export interface Preset {
  split?: 'extract' | 'ranges' | 'every' | 'remove';
  out?: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
  accept?: string; // narrows the file picker on single-format pages
}

export interface ToolPage {
  slug: string;
  tool: Tool;
  group: Group;
  card: string; // short label for the home grid and footer
  blurb: string; // one line under the card label
  title: string;
  h1: string;
  lede: string;
  description: string;
  preset?: Preset;
  steps: string[];
  faq: { q: string; a: string }[];
  more?: { h2: string; paras: string[]; sample?: { before: string; after: string } };
  guide?: string | string[];
}

const PRIVATE = {
  q: 'Do my files get uploaded?',
  a: 'No. The page does the work inside your browser, and your files are never sent to a server. That makes it fine to use with private documents such as contracts or bank statements.',
};

const LIMIT = {
  q: 'Is there a file size limit?',
  a: 'There is no set limit. Because the work happens on your device, the ceiling is your memory. A laptop handles files of a few hundred megabytes; an older phone may give up sooner.',
};

export const PAGES: ToolPage[] = [
  // ---------- PDF ----------
  {
    slug: 'merge-pdf',
    tool: 'pdf-merge',
    group: 'PDF',
    guide: 'combine-pdf-files',
    card: 'Merge PDF',
    blurb: 'Combine several PDFs into one file',
    title: 'Merge PDF files online without uploading them',
    h1: 'Merge PDF files',
    lede: 'Put several PDFs into one file in the order you choose. The merging happens in your browser, so the documents stay on your computer.',
    description: 'Combine PDF files into one document in your browser. Drag to set the order, then download. Nothing is uploaded and there is no sign-up.',
    more: {
      h2: 'What merging does to the file',
      paras: [
        'The merge copies each page into a brand new document with the pages left exactly as they are: no rasterising, no pass through the printer routine. Text stays selectable, images keep their resolution and compressed streams stay as the original encoder wrote them. Page size, page boxes and rotation carry over too, so an A4 landscape page in one source stays landscape in the result.',
        'The output is a fresh document, so properties such as author, title and the application that made the sources are not carried in. The merged file has its own properties and no history.',
        'Nothing is recompressed, which is the point: quality is identical to the sources, and the file you get is close to the sum of the files you gave it. If the result is too large to send, shrinking it means shrinking one of the sources first, not merging harder.',
      ],
    },
    steps: [
      'Drop in two or more PDF files, or click to pick them.',
      'Use the arrows to put them in the order you want.',
      'Click Merge and save the combined PDF.',
    ],
    faq: [
      {
        q: 'Are links, bookmarks and form fields kept?',
        a: 'Each page is copied as it is, links included. The bookmark list from the source files is not carried over, and fillable forms may lose their fields, so fill them in before you merge.',
      },
      {
        q: 'Can I merge a password-protected PDF?',
        a: 'Not directly. Open it in your PDF reader, remove the password or print it to a new PDF, and merge that copy.',
      },
      PRIVATE,
      LIMIT,
    ],
  },
  {
    slug: 'split-pdf',
    tool: 'pdf-split',
    group: 'PDF',
    guide: ['pdf-too-large-to-email', 'save-one-page-of-a-pdf'],
    card: 'Split PDF',
    blurb: 'Break a PDF into several files',
    preset: { split: 'ranges' },
    title: 'Split a PDF into separate files online',
    h1: 'Split a PDF',
    lede: 'Cut one PDF into several smaller ones, either by page ranges you type or one file per page. You get a zip when there is more than one file.',
    description: 'Split a PDF by page ranges or into single pages, right in your browser. Your file is not uploaded. Download the parts as a zip.',
    more: {
      h2: 'What splitting does and does not change',
      paras: [
        'Every range you type becomes its own PDF. Pages are copied into a new document exactly as they are, so text stays selectable, images keep their resolution and nothing is re-compressed. The output files are about as large as the pages they hold, no smaller.',
        'The range syntax is flexible. Parts are separated by commas or semicolons, and a dash with no end, like 8-, runs to the last page. A range written backwards, like 10-1, walks backwards and reverses those pages. A single part is saved as a plain PDF; several parts come back as a zip named after your file, with each part labelled by its page numbers.',
        'Each output is a fresh file rather than a chapter of the original. The original document properties, such as title and author, are not carried over, and the bookmark list is not carried over either. A password-protected PDF is refused until you remove the password in your PDF reader first.',
      ],
    },
    steps: [
      'Drop in the PDF you want to split.',
      'Type the ranges you want as separate files, such as 1-3, 4-10, 11-, or choose one file per page.',
      'Click Split and save the zip.',
    ],
    faq: [
      {
        q: 'How do I write the page ranges?',
        a: 'Separate each part with a comma. 1-3 is pages one to three, 5 is page five on its own, and 8- runs from page eight to the end. Each range you type becomes its own file.',
      },
      {
        q: 'Does splitting lower the quality?',
        a: 'No. Pages are copied over exactly as they are. Nothing is re-compressed.',
      },
      PRIVATE,
      LIMIT,
    ],
  },
  {
    slug: 'extract-pages-from-pdf',
    guide: 'save-one-page-of-a-pdf',
    tool: 'pdf-split',
    group: 'PDF',
    card: 'Extract PDF pages',
    blurb: 'Save only the pages you need',
    preset: { split: 'extract' },
    title: 'Extract pages from a PDF online and save them as a new PDF',
    h1: 'Extract pages from a PDF',
    lede: 'Pick the pages you need and save them as a new, smaller PDF. You can also use this to reorder or drop pages.',
    description: 'Save selected pages of a PDF as a new file. Type pages like 1, 3, 7-9 and download. Works in your browser with no upload.',
    more: {
      h2: 'How the page selection works',
      paras: [
        'The pages you type are saved in the order you type them, so 3, 1, 2 puts page three first, and a backwards range like 10-1 reverses those pages. Commas or semicolons separate entries, "to" works as well as a dash, and 8- runs to the end of the file.',
        'The pages are copied into a fresh document exactly as they are: text stays selectable, images keep their resolution and nothing is re-compressed. The output is about as large as the pages it holds, so trimming a long scan gives you a genuinely smaller file.',
        'Each output is a fresh PDF rather than a slice of the original. Document properties such as title and author are not carried over, and neither is the bookmark list, so an extracted chapter from an indexed report loses its outline. The file is named after your source with a -pages suffix.',
      ],
    },
    steps: [
      'Drop in your PDF.',
      'Type the pages to keep, for example 2, 5-7. They are saved in the order you type them.',
      'Click Extract and save the new PDF.',
    ],
    faq: [
      {
        q: 'How do I delete a page from a PDF?',
        a: 'Extract every page except that one. To drop page 4 from a 10-page file, type 1-3, 5-10.',
      },
      {
        q: 'Can I change the page order?',
        a: 'Yes. The new file follows the order you type, so 3, 1, 2 puts page three first. A range written backwards, like 10-1, reverses those pages.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'remove-pages-from-pdf',
    tool: 'pdf-split',
    group: 'PDF',
    guide: 'pdf-too-large-to-email',
    card: 'Remove PDF pages',
    blurb: 'Delete the pages you do not need',
    preset: { split: 'remove' },
    title: 'Remove pages from a PDF online and save the rest as a new PDF',
    h1: 'Remove pages from a PDF',
    lede: 'Take out the pages you do not want and save everything else as a new PDF. Your original file is not changed.',
    description: 'Delete pages from a PDF in your browser. Type the pages to remove and download the rest. Your files are never uploaded.',
    more: {
      h2: 'How the new file is built',
      paras: [
        'The pages you list are dropped from the copy, and everything else is kept in the original order. So 2, 5-7 out of ten pages gives you pages 1, 3, 4 and 8 through 10, unchanged. The original file is never modified.',
        'Pages are copied into a fresh document rather than re-rendered, so text stays selectable, images keep their resolution and nothing is re-compressed. The removed pages are really gone from the output, which also makes it as small as the pages it keeps.',
        'Removing every page is refused, because a PDF needs at least one page; leave one in and save again. The output is named after your source with a -removed suffix. Document properties and the bookmark list from the original are not carried over, so check the result if the outline mattered.',
      ],
    },
    steps: ['Drop in your PDF.', 'Type the pages to remove, for example 2, 5-7.', 'Click Remove pages and save the new PDF.'],
    faq: [
      {
        q: 'Does this change my original PDF?',
        a: 'No. The new file is a copy with those pages left out. The file you dropped stays as it was.',
      },
      {
        q: 'Can I remove a range of pages?',
        a: 'Yes. Type 5-7 to remove pages 5, 6 and 7. You can list single pages and ranges together, like 2, 5-7.',
      },
      {
        q: 'What if I remove every page?',
        a: 'This page stops you, because a PDF needs at least one page. Leave one page in and save again.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'rotate-pdf',
    tool: 'pdf-rotate',
    group: 'PDF',
    card: 'Rotate PDF',
    blurb: 'Turn sideways or upside-down pages',
    title: 'Rotate PDF pages online and save the result',
    h1: 'Rotate PDF pages',
    lede: 'Turn every page, or only the ones that came out of the scanner sideways, and save the PDF that way for good.',
    description: 'Rotate all pages or selected pages of a PDF by 90, 180 or 270 degrees and save it. Runs in your browser, so the file is not uploaded.',
    more: {
      h2: 'What rotation actually changes',
      paras: [
        'The page content is not redrawn. Only the rotation setting stored on each page changes, added to whatever the page already had, wrapped around 360. A page stored at 90 degrees that you turn 90 again ends up at 180, the way you would expect.',
        'Because nothing is re-rendered, text stays selectable, images keep their resolution and the file gains no new pages or layers. The PDF is simply resaved with the new flags.',
        'The page box is not swapped either. A turned portrait page keeps its original width and height in the file, and the rotation flag tells the reader to show it sideways. Rotation is measured in right angles only, so pages can never end up at an odd angle, and pages you do not list are passed through unchanged.',
      ],
    },
    steps: [
      'Drop in the PDF.',
      'Choose which way to turn it, and type page numbers if only some pages need it.',
      'Click Rotate and save the fixed PDF.',
    ],
    faq: [
      {
        q: 'My PDF reader already lets me rotate. Why use this?',
        a: 'Most readers only rotate the view, and the file opens sideways again next time. This changes the rotation stored in the file, so it opens the right way everywhere.',
      },
      {
        q: 'Is the page re-rendered?',
        a: 'No. Only the rotation setting of each page changes. Text stays selectable and image quality is untouched.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'add-page-numbers-to-pdf',
    tool: 'pdf-numbers',
    guide: 'add-page-numbers-to-pdf',
    group: 'PDF',
    card: 'Add Page Numbers',
    blurb: 'Stamp a number on every page',
    title: 'Add page numbers to a PDF online',
    h1: 'Add page numbers to a PDF',
    lede: 'Stamp a number on every page of a PDF: plain numbers, "3 of 12", or "Page 3 of 12". The number sits centred at the bottom or the top, and the file keeps everything it had.',
    description: 'Add page numbers to a PDF in your browser. Every page is numbered, the text stays selectable and the file is never uploaded.',
    more: {
      h2: 'How the stamp is drawn',
      paras: [
        'Numbers are stamped in Courier 10 point, centred on the page width, 22 points from the bottom edge or from the top edge when you pick the top option. Courier is built into every PDF viewer, so nothing is embedded and the file grows by only a few bytes per page.',
        'Three formats are available: a plain number such as 3, that number with the total such as 3 of 12, and the word Page in front such as Page 3 of 12. The total counts from your start number, so a 30-page document stamped from 10 ends at 39 rather than 30.',
        'The stamp is drawn over whatever is already on the page; existing page numbers printed elsewhere on the page are not found or removed. The stamp text stays selectable, and anything outside basic Latin characters is replaced with a question mark rather than failing the file.',
      ],
    },
    steps: [
      'Drop in the PDF.',
      'Pick where the number goes, the format, and the number to start at.',
      'Click Add page numbers and save the PDF.',
    ],
    faq: [
      {
        q: 'Can I start at a page number other than 1?',
        a: 'Yes. Set "Start at" and the first page of this file gets that number. The "of" part then counts to that number plus the page count minus one, so "Page 5 of 20" works for a file that is pages 5 to 20 of something longer.',
      },
      {
        q: 'Does this change the pages themselves?',
        a: 'No. A number is drawn onto each page and nothing else is touched. Text stays selectable and images keep their quality.',
      },
      {
        q: 'Where exactly does the number sit?',
        a: 'Centred, near the bottom or near the top of the page, in Courier 10 pt. Pick bottom for reports and top for legal filings or letterheads.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'pdf-to-jpg',
    tool: 'pdf-to-jpg',
    group: 'PDF',
    card: 'PDF to JPG',
    blurb: 'Turn each PDF page into a picture',
    title: 'PDF to JPG: turn each page into an image',
    h1: 'Convert PDF to JPG',
    lede: 'Turn each page of a PDF into a JPG picture, for sending, pasting into a form or putting in a slide. A one-page PDF gives one JPG; a longer one comes back as a zip of numbered JPGs.',
    description: 'Convert every page of a PDF to a JPG image in your browser, at 96, 150 or 300 dpi. The PDF is not uploaded.',
    more: {
      h2: 'What happens to the page',
      paras: [
        'Each page is drawn onto a white canvas by pdf.js at the resolution you pick. The canvas scale is the dpi divided by 72, which is the unit PDF pages are measured in, so 150 dpi gives a page about twice the pixel size of 96 dpi without any extra work on your side.',
        'JPG has no transparency, so anything transparent on the page is flattened onto white instead of black. The page is saved at quality 0.92, which keeps text edges clean while making the file much smaller than a lossless image would be.',
        'A one-page PDF downloads as a single JPG named after the PDF. A longer PDF comes back as a zip named after the PDF with a -jpg suffix, holding one JPG per page numbered in order, padded to the width of the page count.',
        'The text on the page becomes pixels, so it can no longer be selected, searched or copied out. Keep the original PDF if you need the words. pdf.js and its worker are downloaded only when you click Convert, not when the page opens.',
      ],
    },
    steps: [
      'Drop in the PDF.',
      'Pick a resolution. 150 dpi suits most screens, and 300 dpi is better for printing.',
      'Click Convert to JPG and save the image, or the zip of images for a longer PDF.',
    ],
    faq: [
      {
        q: 'Why does each page become its own JPG?',
        a: 'A JPG holds one picture, so every page needs a file of its own. A PDF with several pages comes back as a zip file, with one JPG per page numbered in order.',
      },
      {
        q: 'Can I still read the text?',
        a: 'Yes, at 150 dpi or higher. The page is saved as a picture, though, so the text can no longer be selected or searched. Keep the original PDF if you need that.',
      },
      {
        q: 'Which resolution should I choose?',
        a: '150 dpi is plenty for reading on a screen or sending in a message. Choose 300 dpi when the pages will be printed. Higher numbers give bigger files.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'pdf-to-png',
    tool: 'pdf-to-png',
    group: 'PDF',
    card: 'PDF to PNG',
    blurb: 'Turn each PDF page into a sharp PNG image',
    title: 'PDF to PNG: turn each page into an image',
    h1: 'Convert PDF to PNG',
    lede: 'Turn each page of a PDF into a PNG picture. PNG keeps text and lines sharp, so it suits pages with small print or diagrams. A one-page PDF gives one PNG; a longer one comes back as a zip of numbered PNGs.',
    description: 'Convert every page of a PDF to a PNG image in your browser, at 96, 150 or 300 dpi. The PDF is not uploaded.',
    more: {
      h2: 'What the PNG copy of a PDF page keeps',
      paras: [
        'Each page is drawn onto a white canvas by pdf.js at the dpi you pick and saved as a lossless PNG. Unlike the JPG pages, the quality slider is not involved, and nothing is thrown away after the draw, so small text, hairline rules and flat colour in diagrams stay crisp.',
        'Because PNG stores every pixel exactly, these files come out larger than JPGs of the same page, sometimes much larger for busy scans. Pick 96 dpi for on-screen use and 150 dpi as the default; reach for 300 dpi only when the pages will be printed.',
        'A one-page PDF saves as a single PNG named after the PDF. A longer one comes back as a zip named with a -png suffix, holding one PNG per page numbered in order. The words become pixels, so they can no longer be selected or searched, and pdf.js is downloaded only when you click Convert, not when the page opens.',
      ],
    },
    steps: [
      'Drop in the PDF.',
      'Pick a resolution. 150 dpi suits most screens, and 300 dpi is better for printing.',
      'Click Convert to PNG and save the image, or the zip of images for a longer PDF.',
    ],
    faq: [
      {
        q: 'Why does each page become its own PNG?',
        a: 'A PNG holds one picture, so every page needs a file of its own. A PDF with several pages comes back as a zip file, with one PNG per page numbered in order.',
      },
      {
        q: 'PNG or JPG: which should I choose?',
        a: 'PNG keeps text and lines sharp, so it is the better choice for documents and diagrams. JPG makes smaller files, which suits photos or pages you only need to send.',
      },
      {
        q: 'Why are the PNG files bigger?',
        a: 'PNG stores every pixel exactly, which is why a page of text makes a larger file than the same page as a JPG. Choose 96 or 150 dpi unless the pages will be printed.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'pdf-to-text',
    tool: 'pdf-to-text',
    group: 'PDF',
    card: 'PDF to text',
    blurb: 'Get the words out of a PDF as a .txt file',
    title: 'PDF to text: extract text from a PDF online',
    h1: 'Convert PDF to text',
    lede: 'Pull the text out of a PDF and save it as a plain .txt file you can paste into anything. It works on PDFs with real text in them, and it cannot read scanned pages.',
    description: 'Extract the text from a PDF in your browser and download it as a .txt file. Your PDF never leaves your device.',
    more: {
      h2: 'How the text comes out',
      paras: [
        'The text is pulled out with pdf.js, the same engine browsers use to show PDFs, and it follows the reading order of the file. Pages are separated by a blank line in the output, and the .txt download holds every page. The preview box stops at 200,000 characters when the text is longer than that; the download still has everything.',
        'A scan has no text in this sense. If the pages are pictures, there are no words for the page to find, and the page tells you so instead of handing you an empty file. Tables and multi-column layouts lose their structure: you get lines of words in reading order, not cells.',
        'pdf.js loads only when you click Extract, and only on this page. The file is read inside the tab, and nothing is uploaded. Because the words are copied out rather than redrawn, the output is plain text with no fonts, no styles and no images, ready to paste into any editor.',
      ],
    },
    steps: [
      'Drop in the PDF.',
      'Click Extract text and read the result in the box.',
      'Save the .txt file and open it in any editor.',
    ],
    faq: [
      {
        q: 'Why did I get no text?',
        a: 'The PDF was probably made by scanning pages to images. A scan holds pictures, not words, so there is no text to extract. Use the PDF to JPG page and an OCR program for those files.',
      },
      {
        q: 'Does the layout come through?',
        a: 'The words come through in reading order, with the line breaks. Tables lose their columns and become lines of words. For tables, open the PDF in a spreadsheet-capable program instead.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'text-to-pdf',
    tool: 'text-to-pdf',
    group: 'PDF',
    card: 'Text to PDF',
    blurb: 'Turn a plain text file into a PDF',
    title: 'Text to PDF: convert a text or Markdown file to PDF online',
    h1: 'Convert text to PDF',
    lede: 'Make a PDF from a plain text file, such as a .txt note, a Markdown file or a log. The text keeps its line breaks, long lines are wrapped to fit the page, and the fixed-width font keeps any columns lined up.',
    description: 'Convert a plain text or Markdown file to a PDF in your browser. The file never leaves your device.',
    more: {
      h2: 'How the PDF is laid out',
      paras: [
        'The PDF is one column of Courier 10 point on A4 with 72 point margins. Courier is built into every PDF viewer, so no font is embedded and the file stays small. Each line holds 75 characters, wrapped to fit the page, and a word longer than a line is cut in half.',
        'A page holds about 49 lines, so a long log produces many pages with no headings or breaks inserted. The text keeps its line breaks exactly as written, and short lines are not stretched to fill the width.',
        'Latin-1 characters pass through; anything else, such as Chinese, Cyrillic or emoji, is replaced with a question mark rather than failing the file. UTF-8 text files with either LF or CRLF line endings read the same, and empty lines are preserved.',
      ],
    },
    steps: [
      'Drop in the text file.',
      'Click Make PDF.',
      'Save the PDF and open it anywhere.',
    ],
    faq: [
      {
        q: 'Which files can I convert?',
        a: 'Plain text files, such as .txt, .md and .log. A Word .docx file is not plain text, so it will not work here. Save it as .txt first, then convert it.',
      },
      {
        q: 'How is the text laid out?',
        a: 'The PDF uses a fixed-width font at 10 points, like a typewriter, so columns in the text line up. Each line is wrapped to fit the page width. A word longer than a full line is cut in half.',
      },
      {
        q: 'What happens to unusual characters?',
        a: 'The built-in font covers basic Latin letters, digits and common punctuation. Other characters, such as Chinese or Cyrillic letters, come out as question marks.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'markdown-to-pdf',
    tool: 'text-to-pdf',
    group: 'PDF',
    card: 'Markdown to PDF',
    blurb: 'Turn a .md file into a PDF',
    preset: { accept: '.md,.markdown,text/markdown,text/plain' },
    title: 'Markdown to PDF converter online',
    h1: 'Convert Markdown to PDF',
    lede: 'Make a PDF from a Markdown file. The text keeps its line breaks, long lines are wrapped to fit the page and the fixed-width font keeps any columns lined up. The PDF holds the Markdown as plain text, not restyled formatting.',
    description: 'Convert Markdown (.md) to PDF in your browser. Fixed-width layout, line wrapping, and no upload. Good for archiving and sharing .md files.',
    more: {
      h2: 'What the PDF keeps from your Markdown',
      paras: [
        'The PDF holds the Markdown source as written, with the heading markers and asterisks visible. Headings are not restyled, links are not clickable and tables stay as pipes and dashes lined up in the fixed-width font. The text is selectable and searchable in any PDF viewer, so the file doubles as a plain record of exactly what the source contained.',
        'Because the font is Courier at 10 points, fenced code blocks and ASCII tables keep their alignment. Long prose lines are hard-wrapped at 75 characters rather than reflowed, so comparing the PDF text with the .md file reads almost line for line, which helps when you are archiving a spec, a changelog or a README as it was.',
        'This is not a typesetter. If you want headings rendered large with real styling, paste the Markdown into an editor that exports to PDF. It is the right tool for filing a document exactly as it was written, with nothing silently restyled, and because no font is embedded the file stays small.',
      ],
    },
    steps: [
      'Drop in your .md or .markdown file.',
      'Click Make PDF.',
      'Save the PDF and open it anywhere.',
    ],
    faq: [
      {
        q: 'Does it render the Markdown?',
        a: 'No. The PDF shows the Markdown source as text, the same way it shows any other plain text file. Headings, bold and links appear as written, not as styled output. If you want rendered output, copy the Markdown into a viewer that exports to PDF.',
      },
      {
        q: 'How is the text laid out?',
        a: 'The PDF uses a fixed-width font at 10 points, like a typewriter. Long lines are wrapped to fit the page. A word longer than a full line is cut in half.',
      },
      {
        q: 'What characters come through?',
        a: 'The built-in font covers basic Latin letters, digits and common punctuation. Other characters, such as Chinese or Cyrillic letters, come out as question marks.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'jpg-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'Images to PDF',
    blurb: 'Turn JPG or PNG images into a PDF',
    title: 'JPG to PDF: convert images to a PDF online',
    h1: 'Convert images to PDF',
    lede: 'Make one PDF from photos or scans, one image per page. Works with JPG, PNG, WebP and GIF, and you choose the page size.',
    description: 'Turn JPG, PNG or WebP images into a single PDF with one image per page. Pick A4, Letter or image size. Nothing is uploaded.',
    more: {
      h2: 'What happens to your images',
      paras: [
        'JPG and PNG files go into the PDF exactly as they are, with no re-encoding, so what you see is the quality you picked the file for. WebP and GIF cannot sit in a PDF directly, so each is redrawn as a JPG at quality 0.92 before it goes in, which is nearly lossless for photos and slightly soft on fine line art.',
        '"Same as image" makes each page exactly the size of its image. A4 and Letter give standard pages, and wide images are placed on landscape pages instead of being squeezed. Images are never scaled up; they are only scaled down to fit inside the margins, and each is centred on its page.',
        'The margin setting applies to A4 and Letter pages. "Same as image" always uses a zero margin, since the page is the picture. Each image becomes one page, so the page count equals the number of pictures you add, and a single image downloads under its own name rather than in a zip.',
      ],
    },
    steps: [
      'Drop in your images. Phone photos and scans both work.',
      'Put them in order and pick a page size and margin.',
      'Click Make PDF and save it.',
    ],
    faq: [
      {
        q: 'Will my photos lose quality?',
        a: 'JPG and PNG files are placed in the PDF unchanged. Other formats such as WebP are converted to high-quality JPG first, because PDF cannot hold them directly.',
      },
      {
        q: 'Which page size should I choose?',
        a: 'Use "Same as image" for a PDF that looks exactly like your pictures. Use A4 or Letter if you plan to print it or a form asks for a standard page; wide images are placed on landscape pages.',
      },
      {
        q: 'Can I add iPhone HEIC photos?',
        a: 'Yes. Browsers other than Safari download a small decoder the first time a HEIC file is added, so that file takes a little longer. You can also have the iPhone save JPG instead under Settings, Camera, Formats, Most Compatible.',
      },
      PRIVATE,
    ],
  },

  {
    slug: 'png-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'PNG to PDF',
    blurb: 'Put PNG screenshots or scans into one PDF',
    title: 'PNG to PDF converter: put PNG images in a PDF online',
    h1: 'Convert PNG to PDF',
    lede: 'Make one PDF from PNG images, one image per page. PNG files go into the PDF as they are, so screenshots and scanned text keep their sharp edges.',
    description: 'Convert PNG images to a PDF in your browser, one image per page. Pick A4, Letter or the image size. Your files are never uploaded.',
    more: {
      h2: 'How the PNGs go into the PDF',
      paras: [
        'PNG files are embedded in the PDF byte for byte, with no re-encoding, so a screenshot keeps every pixel and the text on it stays sharp at any zoom. Nothing is resaved as JPG, which is the usual cause of fuzzy screenshots from other converters.',
        'PNG transparency is kept, so a logo or a screenshot with a transparent background stays transparent instead of gaining a white or black box. If you need a solid white page behind the picture, flatten the PNG on white first.',
        'The trade-off is size. A PNG is not compressed again inside the PDF, so the PDF is about as large as the PNGs you drop in, and photographic PNGs make heavy files. When the PDF size matters, save photos as JPG and use the JPG to PDF page; text-heavy screenshots are better left as PNG.',
      ],
    },
    steps: ['Drop in your PNG files.', 'Put them in order and pick a page size and margin.', 'Click Make PDF and save it.'],
    faq: [
      {
        q: 'Will my PNG screenshots still be sharp?',
        a: 'Yes. PNG files are placed in the PDF without being resaved as JPG, so text and lines keep their sharp edges.',
      },
      {
        q: 'Can I mix PNG and JPG files in one PDF?',
        a: 'Yes. Drop them all in at once. Each image becomes one page, in the order shown in the list.',
      },
      PRIVATE,
    ],
  },

  {
    slug: 'webp-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'WebP to PDF',
    blurb: 'Put WebP images into one PDF',
    title: 'WebP to PDF converter: put WebP images in a PDF online',
    h1: 'Convert WebP to PDF',
    lede: 'Make one PDF from WebP images, one image per page. PDF cannot hold WebP directly, so each file is redrawn as a high-quality JPG before it goes in.',
    description: 'Convert WebP images to a PDF in your browser, one image per page. Pick A4, Letter or the image size. Your files are never uploaded.',
    more: {
      h2: 'What happens to each WebP',
      paras: [
        'A PDF cannot hold a WebP, so each file is decoded and drawn onto a white page, then re-encoded as a JPG at quality 0.92 and embedded as a picture. Photos come through nearly unchanged; fine line art and small text can soften slightly.',
        'WebP transparency is painted white before the JPG is written, since JPG has no alpha channel. If the background matters, convert the WebP to PNG first and use the PNG to PDF page, which embeds the file as it is.',
        'No WebP metadata travels into the PDF, and an animated WebP gives up only the frame the decoder draws. Pages default to the image\'s own dimensions, or A4 or Letter with wide images turned landscape, and each picture becomes one page, in the order shown.',
      ],
    },
    steps: ['Drop in your WebP files.', 'Put them in order and pick a page size and margin.', 'Click Make PDF and save it.'],
    faq: [
      {
        q: 'Will the WebP images lose quality?',
        a: 'Slightly, if they have fine detail. Each WebP is redrawn as a JPG at quality 92 before it goes into the PDF. If you need the pixels exactly, save the files as PNG first and use the PNG to PDF page.',
      },
      {
        q: 'Can I mix WebP and JPG files in one PDF?',
        a: 'Yes. Drop them all in at once. Each image becomes one page, in the order shown in the list.',
      },
      PRIVATE,
    ],
  },

  {
    slug: 'heic-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'HEIC to PDF',
    blurb: 'Put iPhone photos into one PDF',
    preset: { accept: 'image/heic,image/heif,.heic,.heif' },
    title: 'HEIC to PDF converter for iPhone photos',
    h1: 'Convert HEIC to PDF',
    lede: 'Turn iPhone HEIC photos into one PDF, one photo per page. Useful for applications, records and printing.',
    description: 'Convert HEIC photos from an iPhone to a PDF in your browser, one per page, in the order you choose. Your photos are never uploaded.',
    more: {
      h2: 'What happens to each photo',
      paras: [
        'A HEIC is neither a JPG nor a PNG, so it is decoded first. Safari reads HEIC itself; other browsers download a small decoder the first time, which is the wait on the first photo. The photo is drawn onto a canvas at its own size on a white background and encoded as a JPG at quality 0.92, and that JPG is what goes into the PDF.',
        'Because the PDF is built from the redrawn pixels, the date, camera and location details in the HEIC do not survive, and burst or live-photo files give up only their primary image. Pages are the photo size by default, or A4 or Letter with the image fitted inside and never upscaled; wide photos turn the page landscape.',
        'Each photo becomes one page, in the order shown in the list, and you can mix in other image formats in the same drop. If an exact copy of the pixels matters more than convenience, convert the photos to PNG first and use the PNG to PDF page, which embeds them as they are.',
      ],
    },
    steps: ['Drop in your .heic files.', 'Put them in order and pick a page size and margin.', 'Click Make PDF and save it.'],
    faq: [
      {
        q: 'Why does the first photo take longer?',
        a: "Most browsers can't read HEIC on their own, so the page downloads a decoder the first time you convert. Safari reads HEIC itself and skips this step.",
      },
      {
        q: 'Do the photos lose quality?',
        a: 'They are redrawn as JPG inside the PDF, at high quality. For an exact copy of a photo, convert it to PNG first and use the PNG to PDF page.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'gif-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'GIF to PDF',
    blurb: 'Put GIF images into one PDF',
    preset: { accept: 'image/gif,.gif' },
    title: 'GIF to PDF converter that works in your browser',
    h1: 'Convert GIF to PDF',
    lede: 'Make one PDF from GIF images, one per page. Only the first frame of an animated GIF is kept, since PDF can hold a picture but not the animation.',
    description: 'Convert GIF images to a PDF in your browser, one per page. Animated GIFs keep their first frame. Your files are never uploaded.',
    more: {
      h2: 'What ends up in the PDF from a GIF',
      paras: [
        'A GIF is neither a JPG nor a PNG, so each one is decoded first, the first frame is drawn on a white background and re-encoded as a JPG at quality 0.92. That JPG is what is placed in the PDF. Only files that are already real JPG or PNG bytes get embedded as they are; everything else goes through the redraw.',
        'The default page matches the picture\'s own size. Pick A4 or Letter and wide pictures turn the page landscape, with the image fitted inside the margins and never enlarged. Margins default to medium and can be set to none, small or large. Pages come one to an image, in the order shown in the list.',
        'The animation is dropped with everything except the first frame, and transparency comes out white, so a GIF cut out on transparency gets a solid page background. If the picture is a logo that has to stay exact, convert it to PNG first and use the PNG to PDF page, which embeds the pixels unchanged.',
      ],
    },
    steps: ['Drop in your .gif files.', 'Put them in order and pick a page size and margin.', 'Click Make PDF and save it.'],
    faq: [
      {
        q: 'What happens to the animation?',
        a: 'It is dropped. Each GIF keeps only its first frame as a picture in the PDF. To keep the motion, use the GIF file itself.',
      },
      {
        q: 'Do the GIFs lose quality?',
        a: 'They are redrawn as JPG inside the PDF, at high quality. GIFs with few colors or flat shapes can look soft on the edges. Save them as PNG first and use the PNG to PDF page for an exact copy.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'svg-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'SVG to PDF',
    blurb: 'Put vector drawings into one PDF',
    preset: { accept: 'image/svg+xml,.svg' },
    title: 'SVG to PDF converter that works in your browser',
    h1: 'Convert SVG to PDF',
    lede: 'Make one PDF from SVG drawings, one drawing per page. Each SVG is drawn and saved inside the PDF as a picture.',
    description: 'Convert SVG vector drawings to a PDF in your browser, one per page. Pick image size, A4 or Letter. Your file is never uploaded.',
    more: {
      h2: 'What to expect from an SVG here',
      paras: [
        'The SVG is drawn onto a canvas at its intrinsic size, taken from the width and height attributes or the viewBox when those are missing, and saved inside the PDF as a JPG picture. It is not embedded as vector art, so the PDF is not infinitely zoomable: enlarge the page and the edges soften like a photo.',
        'An SVG with no size information at all is drawn at 1024 by 768, and a drawing whose long side exceeds 8192 pixels is scaled down to that cap. If you need a bigger picture in the PDF, give the SVG explicit width and height attributes before converting.',
        'Transparent areas come out white, because the picture inside the PDF is a JPG. Flat colour shapes and line art survive the trip well; gradients and fine type can band slightly at the edges, which is the re-encode rather than the drawing.',
      ],
    },
    steps: ['Drop in your .svg files.', "Pick a page size and margin, or keep the SVG's own size.", 'Click Make PDF and save it.'],
    faq: [
      {
        q: 'Is the SVG still vector in the PDF?',
        a: "No. Each SVG is drawn onto a canvas and saved as a JPG picture inside the PDF. It is drawn at the SVG's own size, so a small SVG will look soft if the PDF is scaled up. Use the Resize page to enlarge the drawing first if you need a bigger one.",
      },
      {
        q: 'What happens to transparent areas?',
        a: 'They come out white, because the SVG is saved as a JPG inside the PDF. If you need transparency, save the drawing as a PNG first and use the PNG to PDF page.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'bmp-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'BMP to PDF',
    blurb: 'Put BMP pictures into one PDF',
    preset: { accept: 'image/bmp,.bmp' },
    title: 'BMP to PDF converter that works in your browser',
    h1: 'Convert BMP to PDF',
    lede: 'Make one PDF from BMP pictures, one picture per page, in the order you choose. The converting happens in your browser, so the files stay on your own device.',
    description: 'Convert BMP files to a PDF in your browser, one per page, in the order you choose. Pick a page size and margin. Your files are never uploaded.',
    more: {
      h2: 'What ends up in the PDF from a BMP',
      paras: [
        'BMP bytes cannot go into a PDF directly, so each picture is decoded, drawn on a white background and re-encoded as a JPG at quality 0.92. A BMP that starts out huge will still produce a much leaner PDF, because the JPG step drops the uncompressed bulk before anything is embedded.',
        'The default page is the picture\'s own size. A4 or Letter turns the page landscape for wide pictures, and the image is fitted inside the margins, centred, and never upscaled past its own pixel size. Margins default to medium and can be set to none, small or large.',
        'One picture makes one page, in the order listed, and JPGs and PNGs can be mixed into the same drop; those are embedded byte for byte instead of redrawn. If the picture has to stay exact, save it as a PNG first and use the PNG to PDF page.',
      ],
    },
    steps: ['Drop in your .bmp files.', 'Put them in order and pick a page size and margin.', 'Click Make PDF and save it.'],
    faq: [
      {
        q: 'Do the pictures lose quality?',
        a: 'They are redrawn as JPG inside the PDF at high quality, because PDF cannot hold a BMP as is. Flat colors and sharp edges can look soft. For an exact copy, convert each BMP to PNG first and use the PNG to PDF page.',
      },
      {
        q: 'Why is my BMP file so big?',
        a: 'BMP stores every pixel uncompressed, so even an ordinary picture can be several megabytes. The PDF keeps each page as a JPG, which is usually much smaller than the BMP it came from.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'avif-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'AVIF to PDF',
    blurb: 'Put AVIF pictures into one PDF',
    preset: { accept: 'image/avif,.avif' },
    title: 'AVIF to PDF converter that works in your browser',
    h1: 'Convert AVIF to PDF',
    lede: 'Make one PDF from AVIF pictures, one picture per page, in the order you choose. The converting happens in your browser, so the files stay on your own device.',
    description: 'Convert AVIF files to a PDF in your browser, one per page, in the order you choose. Pick a page size and margin. Your files are never uploaded.',
    more: {
      h2: 'How the pictures go into the PDF',
      paras: [
        'Each AVIF is decoded by the browser, drawn onto a canvas and re-encoded as a JPG at quality 0.92, because PDF cannot embed AVIF bytes directly. The JPG is then placed on its own page. Transparency is lost in the JPG step, so transparent areas become white.',
        'Choose "Fit" for the page size and the page matches the image dimensions exactly, with the margin you set. Choose A4 or Letter and the page is that size; wide images are rotated to landscape automatically, and the image is scaled down to fit inside the margins without ever being upscaled.',
        'Only the first frame of an animated AVIF is used. Metadata such as EXIF is not kept. The output is a raster PDF, so text in the picture is not selectable and the file size is roughly the sum of the JPG sizes plus a small PDF overhead. If the pictures are screenshots or diagrams, convert them to PNG first and use the PNG to PDF page, which keeps the edges exact instead of running them through the JPG step.',
      ],
    },
    steps: ['Drop in your .avif files.', 'Put them in order and pick a page size and margin.', 'Click Make PDF and save it.'],
    faq: [
      {
        q: 'Do the pictures lose quality?',
        a: 'They are redrawn as JPG inside the PDF at high quality, because PDF cannot hold an AVIF as is. Fine detail can soften. For an exact copy of a picture, convert it to PNG first and use the PNG to PDF page.',
      },
      {
        q: 'Can every browser open AVIF?',
        a: 'Current Chrome, Firefox, Edge and Safari can. Older ones cannot, which is the usual reason to turn AVIFs into one PDF somebody else can open anywhere.',
      },
      PRIVATE,
    ],
  },

  // ---------- Images ----------
  {
    slug: 'convert-image',
    tool: 'img-convert',
    guide: 'jpg-png-webp-or-avif',
    group: 'Images',
    card: 'Convert image',
    blurb: 'Switch between image formats',
    title: 'Image converter: JPG, PNG, GIF, WebP and AVIF online',
    h1: 'Convert images',
    lede: 'Change images between JPG, PNG, WebP and AVIF. You can drop in JPG, PNG, WebP, GIF, AVIF, SVG, BMP or ICO files. Convert one file or a whole batch, with a quality setting for the formats that use one.',
    description: 'Convert images between JPG, PNG, WebP and AVIF in your browser. GIFs, SVGs, BMPs and ICO files can be read too. Batch conversion, adjustable quality, and no uploads.',
    more: {
      h2: 'What changes between formats',
      paras: [
        'Converting redraws your image through a canvas, so the result is built from the pixels rather than patched from the original file. JPG and WebP come out at the quality you set, 85 by default; PNG is lossless and ignores the quality slider. WebP keeps transparency, and JPG fills it with white.',
        'AVIF is encoded by a bundled codec instead of the browser, with the slider mapped to AVIF\'s own scale, so a middle setting still gives a good photo. Encoding takes longer than the other formats, a few seconds for a large photo.',
        'Animated GIFs keep only their first frame, SVGs are drawn at the size their markup requests, and ICOs decode the way your browser reads them, usually the largest size stored. Drop in several files at once and they all convert; the Save button downloads one images.zip when more than one file is ready.',
      ],
    },
    steps: [
      'Drop in one or more images.',
      'Pick the format you want and, for JPG, WebP or AVIF, a quality level.',
      'Click Convert, then save each file or all of them as a zip.',
    ],
    faq: [
      {
        q: 'Which format should I pick?',
        a: 'JPG works everywhere and suits photos. PNG keeps sharp edges and transparency, which is good for screenshots and logos. WebP and AVIF make much smaller files that all current browsers can show, which helps on websites.',
      },
      {
        q: 'What happens to transparent areas when I convert to JPG?',
        a: 'JPG has no transparency, so transparent areas become white.',
      },
      {
        q: 'Can I convert a GIF or an SVG?',
        a: 'Yes. Drop in a GIF, SVG, BMP or ICO and pick the format you want. Animated GIFs keep only their first frame, and an SVG is drawn onto a canvas at its own size. An ICO icon is read at the largest size it stores. HEIC photos need their own page: use HEIC to JPG or HEIC to PNG.',
      },
      {
        q: 'Why does AVIF take longer?',
        a: 'AVIF squeezes images harder than the other formats, so encoding takes more work. A large photo can take a few seconds.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'png-to-jpg',
    tool: 'img-convert',
    group: 'Images',
    card: 'PNG to JPG',
    blurb: 'Smaller files from PNG photos',
    preset: { out: 'image/jpeg', accept: 'image/png,.png' },
    title: 'PNG to JPG converter that works in your browser',
    h1: 'Convert PNG to JPG',
    lede: 'Turn PNG images into JPG files, which are usually far smaller for photos. Transparent areas are filled with white.',
    description: 'Convert PNG to JPG online, one file or many at once. Adjustable quality, white background for transparent areas. Files stay on your device.',
    more: {
      h2: 'What the JPG conversion does',
      paras: [
        'The PNG is decoded to raw pixels, drawn onto a canvas at the same dimensions and encoded as a fresh JPG. No part of the original PNG is reused, and no metadata travels: date, camera and location details are dropped, and the pixel size stays exactly what it was.',
        'JPG cannot hold transparency, so pixels that were transparent in the PNG are painted white before the JPG is written. If the transparent areas are the point of the image, convert to WebP or keep the PNG instead.',
        'PNG files storing photos are usually far larger than the JPG made from them, often by 70 percent or more, because PNG keeps every pixel exactly. For screenshots, flat graphics and text, JPG trades crisp edges for artifacts, so WebP or PNG stay the better home for those.',
      ],
    },
    steps: ['Drop in your PNG files.', 'JPG is already selected. Move the quality slider if you want smaller files.', 'Click Convert and save.'],
    faq: [
      {
        q: 'Why is my JPG so much smaller than the PNG?',
        a: 'PNG stores every pixel exactly, while JPG drops detail your eye barely notices. For photos that usually cuts the size by 70 percent or more.',
      },
      {
        q: 'Should I convert screenshots to JPG?',
        a: 'Usually not. Text and flat color can look smudgy in JPG. WebP keeps them crisp and is still small.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'jpg-to-png',
    tool: 'img-convert',
    group: 'Images',
    card: 'JPG to PNG',
    blurb: 'Lossless PNG files from JPG photos',
    preset: { out: 'image/png', accept: 'image/jpeg,.jpg,.jpeg' },
    title: 'JPG to PNG converter that works in your browser',
    h1: 'Convert JPG to PNG',
    lede: 'Turn JPG photos into PNG files. PNG stores every pixel exactly as it is, which some apps and websites ask for. It cannot bring back detail that JPG has already thrown away.',
    description: 'Convert JPG to PNG online, one file or many at once. Saves lossless PNG files. Your photos stay on your device.',
    more: {
      h2: 'What the conversion can and cannot fix',
      paras: [
        'The JPG is decoded to raw pixels, drawn onto a canvas at the same dimensions and saved as a lossless PNG. Every pixel in the output is the pixel the JPG showed, byte for byte, which is why apps and websites that ask for PNG get exactly what they asked for.',
        'Nothing is repaired. The detail JPG discarded when the photo was saved is gone for good, and turning it into a PNG only stores the lossy version without further change. Edges that looked fuzzy stay fuzzy; the PNG just stops the damage from getting worse.',
        'Expect the PNG to be much larger than the JPG it came from, often several times larger for photos, because PNG stores every pixel exactly. The quality slider does nothing here. Reach for this page when a destination specifically wants PNG, not as a way to make a JPG better.',
      ],
    },
    steps: ['Drop in your JPG files.', 'PNG is already selected. Change it only if you need another format.', 'Click Save to download the PNG files.'],
    faq: [
      {
        q: 'Will the PNG look better than the JPG?',
        a: 'No. The pixels are the same, so the picture looks the way the JPG did. Converting does not add back the detail JPG removed when it was saved.',
      },
      {
        q: 'Why is the PNG so much bigger?',
        a: 'PNG stores every pixel exactly, while JPG throws away detail to save space. Photos saved as PNG are usually larger than the JPG they came from.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'webp-to-jpg',
    tool: 'img-convert',
    guide: 'open-webp-images',
    group: 'Images',
    card: 'WebP to JPG',
    blurb: 'Open WebP images anywhere',
    preset: { out: 'image/jpeg', accept: 'image/webp,.webp' },
    title: 'WebP to JPG converter: save WebP images as JPG',
    h1: 'Convert WebP to JPG',
    lede: 'Images saved from websites often come down as WebP, which some apps still refuse to open. Turn them into ordinary JPG files.',
    description: 'Convert WebP images to JPG so they open in any app. Batch convert in your browser with no upload and no sign-up.',
    more: {
      h2: 'What the JPG keeps and drops',
      paras: [
        'The WebP is decoded to raw pixels, drawn onto a canvas and encoded as a fresh JPG. Because the conversion starts from pixels, no date, camera or location metadata comes along, and none of the original file bytes are reused. The default quality is 85, which you can move with the slider.',
        'JPG has no transparency, so transparent areas in the WebP fill with white. If the image relies on a transparent background, saving as PNG keeps it instead. Animated WebP files come out as a still image, so motion is not kept.',
        'WebP decodes through the browser itself, so no extra library is downloaded for the conversion. The work happens in the tab, in batches, and the files never leave your device. The JPG you get is an ordinary one that older apps and upload forms accept.',
      ],
    },
    steps: ['Drop in your .webp files.', 'JPG is already selected. Pick PNG instead if the image has a transparent background.', 'Click Convert and save.'],
    faq: [
      {
        q: 'Why do websites use WebP?',
        a: 'WebP files are smaller than JPG at the same quality, so pages load faster. The catch is that some older apps and upload forms still reject them.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'heic-to-jpg',
    tool: 'img-convert',
    guide: ['iphone-heic-photos-to-jpg', 'photo-under-100kb-for-a-form'],
    group: 'Images',
    card: 'HEIC to JPG',
    blurb: 'Turn iPhone photos into JPG',
    preset: { out: 'image/jpeg', accept: 'image/heic,image/heif,.heic,.heif' },
    title: 'HEIC to JPG converter for iPhone photos',
    h1: 'Convert HEIC to JPG',
    lede: "iPhones save photos as HEIC, which many Windows apps and upload forms won't open. Turn them into ordinary JPG files, one photo or a whole batch.",
    description: 'Convert iPhone HEIC photos to JPG in your browser, one at a time or in a batch. Your photos are never uploaded.',
    more: {
      h2: 'What happens to the photo',
      paras: [
        'Safari reads HEIC on its own. Other browsers download a small HEIC decoder the first time you convert. It is served from this site, kept in memory for the rest of the visit, and fetched only when a HEIC file is actually converted, so a batch of ten photos does not pay for it ten times.',
        'Each photo is decoded to raw pixels, drawn onto a canvas and encoded as a new JPG. HEIC files hold 10 bits of colour per channel; the canvas path works in 8-bit channels, so very smooth gradients can band slightly that the HEIC did not. At the default quality of 85 this is hard to see in normal photos.',
        'Only the primary image is taken from files that hold several pictures, such as burst or sequence HEIC, so live-photo motion is not carried over. And because the JPG is encoded fresh from the pixels, the date, camera and location details are dropped. If you need those, keep the originals on the phone; converting to keep a backup throws them away.',
      ],
    },
    steps: [
      'Drop in your .heic files.',
      'JPG is already selected. Move the quality slider if you want smaller files.',
      'Click Convert, then save each photo or all of them as a zip.',
    ],
    faq: [
      {
        q: 'Why does my iPhone save HEIC photos?',
        a: "A HEIC file is about half the size of a JPG at the same quality, so it takes less room on the phone. Many apps outside Apple's still can't open them, though.",
      },
      {
        q: 'Will the JPG look worse?',
        a: 'Slightly, as with any JPG. At the default quality of 85 the difference is hard to see. Move the slider up to 95 to keep more detail.',
      },
      {
        q: 'Does the JPG keep the location and camera details?',
        a: 'No. The JPG is drawn fresh from the pixels, so the date, location and camera details are left out.',
      },
      {
        q: 'Why does the first photo take longer?',
        a: "Most browsers can't read HEIC on their own, so the page downloads a decoder the first time you convert. Safari reads HEIC itself and skips this step.",
      },
      PRIVATE,
    ],
  },
  {
    slug: 'heic-to-png',
    tool: 'img-convert',
    guide: 'iphone-heic-photos-to-jpg',
    group: 'Images',
    card: 'HEIC to PNG',
    blurb: 'Turn iPhone photos into PNG',
    preset: { out: 'image/png', accept: 'image/heic,image/heif,.heic,.heif' },
    title: 'HEIC to PNG converter for iPhone photos',
    h1: 'Convert HEIC to PNG',
    lede: 'Turn iPhone HEIC photos into PNG files. PNG keeps every pixel, but its files are usually larger than HEIC or JPG, so use it when an app asks for PNG or when you plan to edit the photo.',
    description: 'Convert iPhone HEIC photos to PNG in your browser, one at a time or in a batch. Your photos are never uploaded.',
    more: {
      h2: 'What the PNG keeps from the HEIC',
      paras: [
        'Safari reads HEIC on its own. Other browsers fetch a small decoder from this site the first time you convert, only when a HEIC file is actually opened, and a batch of ten photos does not pay for it ten times.',
        'Each photo is decoded to raw pixels, drawn to a canvas and written as a PNG. HEIC holds 10 bits of colour per channel while the canvas works in 8 bits, so very smooth gradients can band slightly. Resolution and framing carry over exactly, and because PNG is lossless, nothing further is lost after the decode.',
        'The date, camera and location details are dropped, the same as on the JPG page, because the PNG is encoded fresh from the pixels. Sequence HEIC files such as burst shots give up only their primary image. PNG files are usually larger than the HEIC they came from, so pick JPG when size matters more than exactness.',
      ],
    },
    steps: ['Drop in your .heic files.', 'PNG is already selected.', 'Click Convert, then save each photo or all of them as a zip.'],
    faq: [
      {
        q: 'Is PNG better than JPG for photos?',
        a: 'It depends on the photo. PNG is exact, so it suits screenshots, text and sharp graphics. For a photo you only want to share, JPG is usually the smaller choice.',
      },
      {
        q: 'Does the PNG keep the location and camera details?',
        a: 'No. The PNG is drawn fresh from the pixels, so the date, location and camera details are left out.',
      },
      {
        q: 'Why does the first photo take longer?',
        a: "Most browsers can't read HEIC on their own, so the page downloads a decoder the first time you convert. Safari reads HEIC itself and skips this step.",
      },
      PRIVATE,
    ],
  },
  {
    slug: 'heic-to-webp',
    tool: 'img-convert',
    group: 'Images',
    card: 'HEIC to WebP',
    blurb: 'WebP files from iPhone photos',
    preset: { out: 'image/webp', accept: 'image/heic,image/heif,.heic,.heif' },
    title: 'HEIC to WebP converter for iPhone photos',
    h1: 'Convert HEIC to WebP',
    lede: 'Turn iPhone HEIC photos into WebP, which keeps files small and opens in every current browser.',
    description: 'Convert iPhone HEIC photos to WebP in your browser, one at a time or in a batch. Your photos are never uploaded.',
    more: {
      h2: 'What you get from the WebP',
      paras: [
        'The HEIC is decoded first: Safari reads it directly, and other browsers fetch a small decoder on first use. The photo is drawn onto a canvas at its own size and re-encoded as a WebP, so the file you get is built from the pixels rather than converted in place.',
        'Date, location and camera details do not carry over, and burst or live-photo files give up only their primary frame. Ten-bit HEIC colour is flattened to 8-bit, which is invisible in normal photos.',
        'Every current browser displays WebP, which makes it the natural target for a website. If you need maximum compatibility with older apps and upload forms instead, HEIC to JPG is the safer choice; WebP wins on size at the same visible quality.',
      ],
    },
    steps: ['Drop in your .heic files.', 'WebP is already selected. Move the quality slider if you want smaller files.', 'Click Convert, then save each photo or all of them as a zip.'],
    faq: [
      {
        q: 'Will older apps open WebP?',
        a: 'Current browsers and newer apps can. Some older programs and upload forms still reject WebP. If one does, convert to JPG with the HEIC to JPG page instead.',
      },
      {
        q: 'Does the WebP keep the location and camera details?',
        a: 'No. The WebP is drawn fresh from the pixels, so the date, location and camera details are left out.',
      },
      {
        q: 'Why does the first photo take longer?',
        a: "Most browsers can't read HEIC on their own, so the page downloads a decoder the first time you convert. Safari reads HEIC itself and skips this step.",
      },
      PRIVATE,
    ],
  },
  {
    slug: 'avif-to-jpg',
    tool: 'img-convert',
    group: 'Images',
    card: 'AVIF to JPG',
    blurb: 'Save AVIF images as JPG',
    preset: { out: 'image/jpeg', accept: 'image/avif,.avif' },
    title: 'AVIF to JPG converter: save AVIF images as JPG online',
    h1: 'Convert AVIF to JPG',
    lede: 'Save AVIF images as JPG files, which almost every app and upload form accepts. AVIF is a newer format, and many older programs still cannot open it.',
    description: 'Convert AVIF images to JPG in your browser, one at a time or in a batch. Your images are never uploaded.',
    more: {
      h2: 'What happens to the pixels',
      paras: [
        'Your browser decodes the AVIF itself and the page draws it onto a canvas at the same dimensions, then encodes a new JPG from the pixels. The default quality is 85. No part of the AVIF file is reused, and no metadata, such as date or camera details, comes along.',
        'AVIF can hold 10 bits per colour channel; the canvas path works in 8-bit, so very smooth gradients can band slightly that the AVIF did not. This is hard to see in normal photos at quality 85.',
        'AVIF can also carry transparency, and JPG cannot, so transparent pixels are painted white before the JPG is written. If the background matters, use AVIF to PNG instead. The JPG you get is an ordinary one that older apps, editors and upload forms accept.',
      ],
    },
    steps: ['Drop in your .avif files.', 'JPG is already selected. Move the quality slider if you want smaller files.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'Why will my AVIF file not open?',
        a: 'AVIF is newer than JPG and PNG, so older photo viewers, email apps and upload forms may not read it. A JPG opens nearly everywhere.',
      },
      {
        q: 'Will the JPG look worse?',
        a: 'Slightly, as with any JPG. At the default quality of 85 the difference is hard to see. Move the slider up to 95 to keep more detail.',
      },
      {
        q: 'Does my browser need to open AVIF?',
        a: 'Yes. The page draws the image with your browser, so it works in browsers that can show AVIF files. If a file does not open, try the newest version of your browser.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'avif-to-png',
    tool: 'img-convert',
    group: 'Images',
    card: 'AVIF to PNG',
    blurb: 'Open AVIF images anywhere',
    preset: { out: 'image/png', accept: 'image/avif,.avif' },
    title: 'AVIF to PNG converter that works in your browser',
    h1: 'Convert AVIF to PNG',
    lede: 'Turn AVIF images into PNG files that open anywhere. Transparency is kept.',
    description: 'Convert AVIF images to PNG in your browser so they open in any app. Transparency is kept. Your file is never uploaded.',
    more: {
      h2: 'What the PNG ends up holding',
      paras: [
        'The AVIF is decoded by the browser, drawn through a canvas and saved as a PNG. PNG is lossless, so the conversion itself adds no damage, and the alpha channel AVIF stores is kept. The quality slider has no effect on a PNG, because there is no lossy step for it to tune.',
        'AVIF compresses hard, so expect the PNG to be much larger than the AVIF you started with. That size jump is normal. PNG is the right target when the image has to open in apps that cannot read AVIF yet, or to go through an editor that does not understand the format.',
        'Date, camera and location metadata recorded inside the AVIF do not survive, because the image passes through a canvas redraw and only the pixels are carried into the PNG. If the original came off a phone and the metadata matters, keep the AVIF and work on a copy.',
      ],
    },
    steps: ['Drop in your .avif files.', 'PNG is already selected.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'What if the page cannot read my AVIF?',
        a: 'Your browser has to open the AVIF first. Chrome, Firefox, Edge and recent Safari can. An older browser cannot, and the page says so instead of failing quietly.',
      },
      {
        q: 'Will the PNG be bigger than the AVIF?',
        a: 'Yes, usually. AVIF compresses photos hard, and PNG keeps every pixel. Expect the PNG to be larger than the AVIF.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'jpg-to-avif',
    guide: 'jpg-png-webp-or-avif',
    more: {
      h2: 'What the AVIF keeps from the JPG',
      paras: [
        'AVIF encoding is done by jSquash, the Squoosh codecs, fetched only when you convert. The quality slider maps to AVIF\'s 0 to 100 scale shifted down by 25, because AVIF reaches the same visual quality at a lower number than JPG or WebP. The default of 85 becomes 60 inside the encoder, at speed 8, which trades a little size for much faster encodes.',
        'The JPG is decoded by the browser and drawn onto a canvas before encoding, so EXIF data such as the date, the location and the camera model is dropped, along with any comment metadata the JPG carries. A burst or Live Photo pair is treated as a single still frame.',
        'JPG has no alpha channel, so there is no transparency to carry over, and the canvas works in 8-bit channels, matching the source. The result is a real AVIF file, not a renamed JPG, so any tool with an AVIF decoder reads it. Colour data is kept at the canvas\'s precision rather than upscaled to 10-bit.',
      ],
    },
    tool: 'img-convert',
    group: 'Images',
    card: 'JPG to AVIF',
    blurb: 'Make AVIF images from JPG photos',
    preset: { out: 'image/avif', accept: 'image/jpeg,image/png,.jpg,.jpeg,.png' },
    title: 'JPG to AVIF converter: save JPG photos as AVIF online',
    h1: 'Convert JPG to AVIF',
    lede: 'Save JPG photos as AVIF, a newer format that often makes smaller files. Check that the site or app you will upload to accepts AVIF first.',
    description: 'Convert JPG and PNG photos to AVIF in your browser, one at a time or in a batch. Your photos are never uploaded.',
    steps: ['Drop in your .jpg or .png files.', 'AVIF is already selected. Move the quality slider to change the file size.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'Will every app open AVIF?',
        a: 'No. Many older programs and some upload forms still reject AVIF. If a site rejects the file, convert it back to JPG with the AVIF to JPG page.',
      },
      {
        q: 'What does the quality slider do?',
        a: 'Lower numbers make smaller files with more softening in fine detail. The default is set where most photos look good. Move the slider up if faces or text look soft.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'png-to-avif',
    more: {
      h2: 'What survives the move to AVIF',
      paras: [
        'The PNG is decoded by the browser and the pixels are re-encoded as AVIF with jSquash, fetched only when you convert. Transparency is kept: the canvas holds the PNG\'s alpha channel and AVIF stores one, so transparent areas stay transparent without a white fill behind them.',
        'The quality slider maps to AVIF\'s 0 to 100 scale shifted down by 25, and the default of 85 becomes 60 in the encoder at speed 8. AVIF is lossy at every setting, so this is the one step where detail is actually discarded. Keep the PNG original if you may need it later.',
        'The canvas works in 8-bit channels, so a 16-bit PNG is rounded to 8 bits. Text chunks and other metadata inside the PNG are dropped by the re-encode. If the PNG is a screenshot with flat colour and sharp text, compare the saved size against the original before replacing it. Current browsers open AVIF, but older desktop programs and some upload forms still refuse it, so keep the PNG until you know the place you are sending the file accepts AVIF.',
      ],
    },
    tool: 'img-convert',
    group: 'Images',
    card: 'PNG to AVIF',
    blurb: 'Smaller AVIF files from PNG images',
    preset: { out: 'image/avif', accept: 'image/png,.png' },
    title: 'PNG to AVIF converter: save PNGs as AVIF online',
    h1: 'Convert PNG to AVIF',
    lede: 'Turn PNG images into AVIF, which often makes smaller files than PNG. Transparency is kept. Check that the site or app you will upload to accepts AVIF first.',
    description: 'Convert PNG images to AVIF in your browser, one at a time or in a batch. Transparency is kept. Your images are never uploaded.',
    steps: ['Drop in your PNG files.', 'AVIF is already selected. Move the quality slider to change the file size.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'Will every app open AVIF?',
        a: 'No. Many older programs and some upload forms still reject AVIF. If a site rejects the file, convert it back to PNG with the AVIF to PNG page.',
      },
      {
        q: 'Does the AVIF keep the transparency?',
        a: 'Yes. AVIF stores an alpha channel, so transparent areas stay transparent.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'webp-to-avif',
    tool: 'img-convert',
    group: 'Images',
    card: 'WebP to AVIF',
    blurb: 'Save WebP images as AVIF',
    preset: { out: 'image/avif', accept: 'image/webp,.webp' },
    title: 'WebP to AVIF converter that works in your browser',
    h1: 'Convert WebP to AVIF',
    lede: 'Turn WebP images into AVIF, which often compresses photos further. Transparency is kept. Check that the place you will use the file opens AVIF first.',
    description: 'Convert WebP to AVIF online, one file or many at once. Transparency is kept. Your images stay on your device.',
    more: {
      h2: 'What the AVIF conversion does to the file',
      paras: [
        'The WebP is decoded in your browser, drawn onto a canvas at the same dimensions and encoded as AVIF by a bundled codec (jSquash), not by the browser. The quality slider is mapped to AVIF\'s own scale: the slider value times 100, minus 25, so the default 85 becomes 60. That keeps files small. AVIF\'s scale is different from WebP\'s, so the same slider position gives a different file.',
        'Transparency is kept. AVIF supports an alpha channel, so a WebP with a transparent background stays transparent. The encoder runs at speed 8, which trades a little size for much faster encodes; large photos still take a few seconds. Animated WebP files keep only their first frame.',
        'This is a lossy-to-lossy conversion. Both WebP and AVIF throw away detail the eye is less likely to notice, so each hop softens fine detail a little. If you have the original photo, convert that instead of a WebP you already saved.',
      ],
    },
    steps: ['Drop in your WebP files.', 'AVIF is already selected. Move the quality slider to change the file size.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'Will every app open AVIF?',
        a: 'No. Many older programs and some upload forms still reject AVIF. If a site rejects the file, convert it back to WebP with the AVIF to WebP page.',
      },
      {
        q: 'Is AVIF always smaller than WebP?',
        a: 'Often a bit smaller for photos, but not always. The two formats make similar trade-offs, so compare the sizes before replacing the original.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'avif-to-webp',
    more: {
      h2: 'What the WebP keeps from the AVIF',
      paras: [
        'AVIF is decoded by the browser itself. If the browser cannot decode AVIF, the page shows an error instead of a file. Ten-bit AVIF is flattened to the canvas\'s 8-bit channels, EXIF metadata is not kept, and animation is not kept either; the still frame is converted.',
        'WebP is written by the browser\'s canvas when it can. Safari\'s canvas silently returns a PNG instead, so the page detects the wrong output type and switches to jSquash\'s WebP encoder, fetched only when it is needed. Transparency is kept either way, with no white fill behind transparent areas.',
        'The quality slider is passed to the encoder as 0 to 100, and the default of 85 becomes 85. This is a lossy-to-lossy conversion, so fine detail softens a little at each hop. Starting from the original AVIF is better than re-saving an already converted copy.',
      ],
    },
    tool: 'img-convert',
    group: 'Images',
    card: 'AVIF to WebP',
    blurb: 'Save AVIF images as WebP',
    preset: { out: 'image/webp', accept: 'image/avif,.avif' },
    title: 'AVIF to WebP converter that works in your browser',
    h1: 'Convert AVIF to WebP',
    lede: 'Turn AVIF images into WebP for apps and upload forms that do not take AVIF yet. Transparency is kept.',
    description: 'Convert AVIF to WebP online, one file or many at once. Transparency is kept. Your images stay on your device.',
    steps: ['Drop in your AVIF files.', 'WebP is already selected. Move the quality slider if you want smaller files.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'Why convert AVIF to WebP?',
        a: 'Some older programs and upload forms reject AVIF but accept WebP. Converting keeps the transparency and usually keeps the file small.',
      },
      {
        q: 'Does anything get lost?',
        a: 'Both formats are lossy at the default quality, so each conversion can soften fine detail a little. Start from the original AVIF when you can, not from a re-saved copy.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'svg-to-png',
    tool: 'img-convert',
    group: 'Images',
    card: 'SVG to PNG',
    blurb: 'Turn vector files into PNG images',
    preset: { out: 'image/png', accept: 'image/svg+xml,.svg' },
    title: 'SVG to PNG converter that works in your browser',
    h1: 'Convert SVG to PNG',
    lede: 'Turn SVG files into plain PNG images. Handy when an app or form refuses the SVG itself.',
    description: 'Convert SVG vector files to PNG in your browser. The PNG is made at the SVG\'s own size, transparency is kept. Your file is never uploaded.',
    more: {
      h2: 'How the PNG is drawn',
      paras: [
        'The SVG is drawn through a canvas at its own size, which comes from its width and height attributes, or from its viewBox when it has none. An SVG with no size information at all is drawn at 1024 by 768. The long side is capped at 8192 pixels, so a huge poster SVG does not produce a gigantic PNG.',
        'Drawing through a canvas rather than relying on createImageBitmap avoids the disagreements browsers have about SVG sizes, and keeps the result identical across browsers. Transparency in the SVG is kept as transparency in the PNG.',
        'The quality slider has no effect here, because PNG is lossless. If the SVG relies on fonts installed on your computer or on images hosted elsewhere, the PNG can show fallback text or miss those pieces, since the SVG is loaded as a standalone document. To get a different size, convert first, then use the Resize page on the PNG.',
      ],
    },
    steps: ['Drop in your .svg files.', 'PNG is already selected. Change it only if you need another format.', 'Click Convert and save.'],
    faq: [
      {
        q: 'What size is the PNG?',
        a: 'The size from the SVG\'s width and height, or its viewBox when it has none. An SVG with no size at all is drawn at 1024 by 768. Use the Resize page if you need a different size.',
      },
      {
        q: 'Why does the SVG look different here than in my editor?',
        a: 'The page draws the SVG the way a browser draws it. SVGs that rely on fonts installed on your computer, or on outside images, may show fallback text or miss pieces.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'svg-to-jpg',
    tool: 'img-convert',
    group: 'Images',
    card: 'SVG to JPG',
    blurb: 'Turn vector files into JPG images',
    preset: { out: 'image/jpeg', accept: 'image/svg+xml,.svg' },
    title: 'SVG to JPG converter that works in your browser',
    h1: 'Convert SVG to JPG',
    lede: 'Turn SVG files into JPG images. Transparent areas come out white, since JPG has no transparency.',
    description: 'Convert SVG vector files to JPG in your browser. Transparent areas are filled with white. Your file is never uploaded.',
    more: {
      h2: 'Sizing and quality',
      paras: [
        'The SVG is drawn onto a canvas at the size in its markup: the width and height attributes, or the viewBox when those are missing. If neither is present it is drawn at 1024 by 768, and anything whose long side exceeds 8192 pixels is scaled down to that cap.',
        'Units are converted to CSS pixels, so an SVG sized in centimetres or inches comes out at the same physical size on screen. To get a larger JPG than the SVG specifies, enlarge the width and height attributes in the SVG before converting.',
        'Transparent areas are painted white and the JPG is encoded at the quality you set, 85 by default. Text renders with whatever fonts the browser has, so a typeface the machine lacks is substituted before the picture is taken.',
      ],
    },
    steps: ['Drop in your .svg files.', 'JPG is already selected. Move the quality slider if you want smaller files.', 'Click Convert and save.'],
    faq: [
      {
        q: 'What happens to transparent areas?',
        a: 'JPG cannot hold transparency, so those pixels are painted white underneath. Pick PNG instead if the image needs to stay on a transparent background.',
      },
      {
        q: 'What size is the JPG?',
        a: 'The size from the SVG\'s width and height, or its viewBox when it has none. An SVG with no size at all is drawn at 1024 by 768. Use the Resize page if you need a different size.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'svg-to-webp',
    tool: 'img-convert',
    group: 'Images',
    card: 'SVG to WebP',
    blurb: 'Turn vector files into WebP images',
    preset: { out: 'image/webp', accept: 'image/svg+xml,.svg' },
    title: 'SVG to WebP converter that works in your browser',
    h1: 'Convert SVG to WebP',
    lede: 'Turn SVG files into WebP images, with transparency kept. The WebP is made at the SVG\'s own size and is usually smaller than a PNG of the same picture.',
    description: 'Convert SVG vector files to WebP in your browser. Transparency is kept and the WebP is made at the SVG\'s own size. Your file is never uploaded.',
    more: {
      h2: 'What the WebP is made from',
      paras: [
        'The SVG is drawn at its own size, taken from the width and height attributes, or the viewBox when those are missing. An SVG with no size information at all is drawn at 1024 by 768, and anything whose long side passes 8192 pixels is scaled down to that cap. The result is pixels, not vector art.',
        'The page draws the SVG the way the browser draws it. Fonts your computer has but the page cannot load fall back to defaults, and outside images or stylesheets the SVG references may be missing or blocked, which is why a drawing can look different here than it did in the editor.',
        'Transparency is kept, and the quality slider sets the WebP compression, 85 by default; a WebP at 85 is usually far smaller than a PNG of the same drawing. Browsers whose canvas cannot write WebP get the bundled encoder instead, so the output is always WebP. Metadata from the SVG is not carried into the image.',
      ],
    },
    steps: ['Drop in your .svg files.', 'WebP is already selected. Move the quality slider if you want smaller files.', 'Click Convert and save.'],
    faq: [
      {
        q: 'What size is the WebP?',
        a: 'The size from the SVG\'s width and height, or its viewBox when it has none. An SVG with no size at all is drawn at 1024 by 768. Use the Resize page if you need a different size.',
      },
      {
        q: 'Why does the SVG look different here than in my editor?',
        a: 'The page draws the SVG the way a browser draws it. SVGs that rely on fonts installed on your computer, or on outside images, may show fallback text or miss pieces.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'png-to-ico',
    tool: 'img-ico',
    guide: 'make-a-favicon',
    group: 'Images',
    card: 'PNG to ICO',
    blurb: 'Make a .ico favicon file from a PNG',
    title: 'PNG to ICO converter: make a .ico favicon from a PNG',
    h1: 'Convert PNG to ICO',
    lede: 'Turn a PNG into a .ico file, the format browsers and desktops use for favicons and shortcuts. The file holds 16, 32 and 48 px versions of the image, and transparency is kept.',
    description: 'Convert a PNG to a .ico favicon file in your browser. The file holds 16, 32 and 48 px sizes. Your image stays on your device.',
    more: {
      h2: 'How the ICO is built from a PNG',
      paras: [
        'The PNG is decoded to a bitmap, and three square frames are drawn from it: 16, 32 and 48 pixels, each with high-quality smoothing. Each frame is stored inside the .ico as a 32-bit PNG with an alpha channel, so the frames look clean on light and dark tab bars. Nothing of the original PNG container is reused; only the pixels are.',
        'If the PNG is not square, the image is scaled to fit inside each square and centred on a transparent background rather than stretched. Start from a square image of at least 48 pixels so the 16 pixel frame still has something to work with. A source much larger than 48 pixels is fine, since the smaller frames are made by scaling down.',
        'Several files dropped together are converted one by one and saved as a single images.zip. Each .ico inside keeps the name of its source file, so icon.png becomes icon.ico. No metadata is written into the .ico beyond the images themselves.',
      ],
    },
    steps: ['Drop in your PNG files.', 'Nothing to set. The three sizes are made from your image.', 'Click Save to download the .ico file, or all of them as a zip.'],
    faq: [
      {
        q: 'What sizes end up in the file?',
        a: '16 by 16, 32 by 32 and 48 by 48 pixels. Each app picks the size it needs. If the PNG is not square, the image is centered on a transparent square instead of being stretched.',
      },
      {
        q: 'Where does the .ico file go on my site?',
        a: 'Save it as favicon.ico in the root folder of your site. Browsers that look for /favicon.ico will use it. A link tag that points at the file works too.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'ico-to-png',
    tool: 'img-convert',
    group: 'Images',
    card: 'ICO to PNG',
    blurb: 'Save a .ico favicon as a PNG',
    preset: { out: 'image/png', accept: 'image/x-icon,image/vnd.microsoft.icon,.ico' },
    title: 'ICO to PNG converter: save a .ico file as PNG online',
    h1: 'Convert ICO to PNG',
    lede: 'Open a .ico favicon file and save it as a PNG. An ICO can hold several sizes of the same picture; the page uses the image your browser decodes, which is usually the largest size in the file.',
    description: 'Convert a .ico favicon to a PNG image in your browser. Transparency is kept. The file never leaves your device.',
    more: {
      h2: 'What happens to the sizes inside the .ico',
      paras: [
        'An .ico file is a container. It can hold one picture or several, commonly 16, 32 and 48 pixels, stored either as BMP data or as PNG payloads, usually 32 bit with transparency. Your browser decodes the container when the page reads the file, normally giving you the largest image stored.',
        'Only that one decoded image survives. The container header, the smaller entries and any cursor hotspot data are dropped, so the PNG is a single picture at the decoded size, not a set of files.',
        'Transparency carries over, because the frames in the container hold a real alpha channel and PNG keeps it. That is usually the point of pulling a favicon out of a site or a desktop shortcut, where you want the artwork without the wrapper.',
      ],
    },
    steps: ['Drop in your .ico files.', 'PNG is already selected.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'What happens to the other sizes in the file?',
        a: 'An ICO can hold several sizes of the same picture. The page keeps the one your browser decodes from the file, which is usually the largest. The smaller sizes are dropped.',
      },
      {
        q: 'Will transparency survive?',
        a: 'Yes. ICO files hold 32 bit color with an alpha channel, and PNG keeps it. That is the usual reason to convert a favicon this way.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'jpg-to-ico',
    tool: 'img-ico',
    group: 'Images',
    card: 'JPG to ICO',
    blurb: 'Make a .ico favicon file from a JPG',
    preset: { accept: 'image/jpeg,.jpg,.jpeg' },
    title: 'JPG to ICO converter: make a .ico favicon from a JPG',
    h1: 'Convert JPG to ICO',
    lede: 'Turn a JPG into a .ico file, the format browsers and desktops use for favicons and shortcuts. The file holds 16, 32 and 48 px versions of the image.',
    description: 'Convert a JPG to a .ico favicon file in your browser. The file holds 16, 32 and 48 px sizes. Your image stays on your device.',
    more: {
      h2: 'How the ICO is built from a JPG',
      paras: [
        'The JPG is decoded to a bitmap, and three square frames are drawn from it: 16, 32 and 48 pixels. Each frame is scaled with high-quality smoothing and centred on the square. The frames are stored inside the .ico as 32-bit PNGs with an alpha channel, so the file stays small and looks clean on light and dark tab bars.',
        'A JPG has no transparency of its own, so the pixels it covers are opaque. A non-square JPG is letterboxed inside the square frames, and that bare canvas area stays transparent because the canvas starts clear. The corners of a non-square icon come out see-through, not white.',
        'The 16 pixel frame is where a detailed picture falls apart; thin strokes vanish at that size. Start from a bold, simple source at least 48 pixels across. Several JPGs dropped together are converted one by one and saved as a zip, each .ico named after its source file.',
      ],
    },
    steps: ['Drop in your JPG files.', 'Nothing to set. The three sizes are made from your image.', 'Click Save to download the .ico file, or all of them as a zip.'],
    faq: [
      {
        q: 'What sizes end up in the file?',
        a: '16 by 16, 32 by 32 and 48 by 48 pixels. Each app picks the size it needs. If the JPG is not square, the image is centered on a square canvas instead of being stretched.',
      },
      {
        q: 'Where does the .ico file go on my site?',
        a: 'Save it as favicon.ico in the root folder of your site. Browsers that look for /favicon.ico will use it. A link tag that points at the file works too.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'webp-to-ico',
    tool: 'img-ico',
    group: 'Images',
    card: 'WebP to ICO',
    blurb: 'Make a .ico favicon file from a WebP',
    preset: { accept: 'image/webp,.webp' },
    title: 'WebP to ICO converter: make a .ico favicon from a WebP',
    h1: 'Convert WebP to ICO',
    lede: 'Turn a WebP into a .ico file, the format browsers and desktops use for favicons and shortcuts. The file holds 16, 32 and 48 px versions of the image.',
    description: 'Convert a WebP to a .ico favicon file in your browser. The file holds 16, 32 and 48 px sizes. Your image stays on your device.',
    more: {
      h2: 'How the ICO is built from a WebP',
      paras: [
        'The WebP is decoded by the browser, drawn at its intrinsic size and then scaled into 16, 32 and 48 pixel pictures at high smoothing quality. All three are packed into one .ico file as 32-bit PNG frames, which current Windows and every current browser read. Each app picks the entry that matches the space it has, from a 16 pixel tab icon to a 48 pixel desktop shortcut.',
        'If the WebP is not square, the image is centered on a square canvas and padded with transparency instead of being stretched, so a wide logo keeps its proportions. The alpha channel is kept, so a transparent background stays transparent in the .ico file.',
        'Each of the three sizes is drawn from the decoded WebP at high smoothing rather than scaled from one of the others, so the 16 pixel icon keeps its own edge detail. The saved file takes the source name, so logo.webp becomes logo.ico, and the .ico holds only these three sizes. No metadata from the WebP is written into it.',
      ],
    },
    steps: ['Drop in your WebP files.', 'Nothing to set. The three sizes are made from your image.', 'Click Save to download the .ico file, or all of them as a zip.'],
    faq: [
      {
        q: 'What sizes end up in the file?',
        a: '16 by 16, 32 by 32 and 48 by 48 pixels. Each app picks the size it needs. If the WebP is not square, the image is centered on a square canvas instead of being stretched.',
      },
      {
        q: 'Will the transparency survive?',
        a: 'Yes. WebP holds an alpha channel and ICO files store 32 bit color with alpha, so a transparent background stays transparent.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'svg-to-ico',
    tool: 'img-ico',
    guide: 'make-a-favicon',
    group: 'Images',
    card: 'SVG to ICO',
    blurb: 'Make a .ico favicon file from an SVG',
    preset: { accept: 'image/svg+xml,.svg' },
    title: 'SVG to ICO converter: make a .ico favicon from an SVG',
    h1: 'Convert SVG to ICO',
    lede: 'Turn an SVG into a .ico file, the format browsers and desktops use for favicons and shortcuts. The file holds 16, 32 and 48 px versions of the image.',
    description: 'Convert an SVG to a .ico favicon file in your browser. The file holds 16, 32 and 48 px sizes. Your image stays on your device.',
    more: {
      h2: 'How the ICO is drawn from the SVG',
      paras: [
        'The SVG is drawn at its own size first, then scaled into 16, 32 and 48 pixel pictures at high smoothing quality, and all three are packed into one .ico file. Browsers and Windows pick the size they need.',
        'Start from an SVG with a real width and height, or at least a viewBox. An SVG with no size at all is drawn at 1024 by 768, which squashes square artwork into a wide frame. Non-square art is scaled to fit the square canvas and padded, never stretched.',
        'An SVG that points at outside images or fonts can fail to draw; keep everything inside the file and it converts cleanly. The three pictures are stored as PNGs inside the .ico container, which current Windows and every current browser read.',
      ],
    },
    steps: ['Drop in your .svg files.', 'Nothing to set. The three sizes are made from your image.', 'Click Save to download the .ico file, or all of them as a zip.'],
    faq: [
      {
        q: 'Will the icon be sharp?',
        a: 'The SVG is drawn at its own size first, then scaled into the 16, 32 and 48 px pictures. An SVG with a large or no width and height gives the cleanest small icons. An SVG drawn at 16 px will look soft.',
      },
      {
        q: 'Why did my SVG fail to convert?',
        a: 'An SVG that references outside images or fonts can be blocked. The usual fix is an SVG with everything inside it. If the SVG has no size information, it is drawn at 1024 by 768.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'ico-to-jpg',
    tool: 'img-convert',
    group: 'Images',
    card: 'ICO to JPG',
    blurb: 'Save an ICO icon as a JPG image',
    preset: { out: 'image/jpeg', accept: '.ico,image/x-icon,image/vnd.microsoft.icon' },
    title: 'ICO to JPG converter that works in your browser',
    h1: 'Convert ICO to JPG',
    lede: 'Save an ICO icon as a JPG image. The largest size stored in the icon is used, and transparent areas are filled with white.',
    description: 'Convert ICO icons to JPG in your browser. The largest size in the file is kept. Transparent areas turn white. Your files are never uploaded.',
    more: {
      h2: 'How the ICO becomes a JPG',
      paras: [
        'The browser decodes the .ico file and uses the largest picture stored in it, usually 16 to 256 pixels on a side. The smaller entries are dropped. That picture is drawn onto a canvas at the size it already has, never enlarged, and saved as a JPG at the quality on the slider. A 32 pixel icon gives a 32 pixel JPG, so the output stays small.',
        'JPG has no transparency, so every transparent pixel is painted white before the save. A white mark on a transparent background disappears, and an icon cut out for a dark panel gets a plain white surround. If the see-through part matters, the ICO to PNG and ICO to WebP pages keep the alpha channel.',
        'This is the page for places that take a picture but refuse an .ico file, such as a profile photo field or a document. The browser reads the .ico container itself, and if it cannot decode a particular icon the page shows an error instead of saving a broken file. The quality slider starts at 85; lowering it makes the JPG smaller and softer.',
      ],
    },
    steps: ['Drop in your .ico files.', 'JPG is already selected. Move the quality slider if you want a smaller file.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'Why is the JPG so small?',
        a: 'An ICO file holds small pictures, usually 16 to 256 pixels on a side. This page uses the largest one it finds, so the JPG is never bigger than that.',
      },
      {
        q: 'What happens to the transparency?',
        a: 'JPG cannot store it, so transparent areas are filled with white. If you need the transparent background, use the ICO to PNG page instead.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'ico-to-webp',
    tool: 'img-convert',
    group: 'Images',
    card: 'ICO to WebP',
    blurb: 'Save an ICO icon as a WebP image',
    preset: { out: 'image/webp', accept: '.ico,image/x-icon,image/vnd.microsoft.icon' },
    title: 'ICO to WebP converter that works in your browser',
    h1: 'Convert ICO to WebP',
    lede: 'Save an ICO icon as a WebP image. The largest size stored in the icon is used, and transparency is kept. WebP files open in every current browser.',
    description: 'Convert ICO icons to WebP in your browser. The largest size in the file is kept, transparency is kept, and nothing leaves your device.',
    more: {
      h2: 'How the ICO becomes a WebP',
      paras: [
        'The browser decodes the .ico file and uses the largest picture stored in it, usually 16 to 256 pixels on a side. The other size entries are dropped, and the picture is drawn at the size it already has without enlargement.',
        'WebP supports an alpha channel, so a transparent icon stays transparent, which is the reason to pick this page over ICO to JPG. The canvas writes the WebP at the quality on the slider. In Safari, whose canvas cannot write WebP, the page switches to its own WebP encoder with the same quality value, so the saved file is a real WebP either way.',
        'Every current browser opens WebP, so the result can go straight into a web page, a chat or a document. If you need a lossless copy with transparency, ICO to PNG writes a PNG instead. The quality slider starts at 85, and the page reports an error rather than saving anything when the icon cannot be decoded.',
      ],
    },
    steps: ['Drop in your .ico files.', 'WebP is already selected. Move the quality slider if you want a smaller file.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'Why is the WebP so small?',
        a: 'An ICO file holds small pictures, usually 16 to 256 pixels on a side. This page uses the largest one it finds, so the WebP is never bigger than that.',
      },
      {
        q: 'Does the WebP keep the transparent background?',
        a: 'Yes. WebP supports transparency, so the icon keeps its clear background. If you need the icon itself as an image with a transparency channel, ICO to PNG works the same way.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'bmp-to-jpg',
    tool: 'img-convert',
    group: 'Images',
    card: 'BMP to JPG',
    blurb: 'Save a BMP image as a JPG',
    preset: { out: 'image/jpeg', accept: 'image/bmp,.bmp' },
    title: 'BMP to JPG converter: save a BMP as a JPG online',
    h1: 'Convert BMP to JPG',
    lede: 'Save a BMP image as a JPG. BMP stores every pixel uncompressed, so the file is usually very large. JPG shrinks it a lot, at the cost of some fine detail.',
    description: 'Convert BMP images to JPG in your browser. JPG has no transparency, so transparent areas are filled with white. Your files are never uploaded.',
    more: {
      h2: 'Why the file gets so much smaller',
      paras: [
        'A BMP stores every pixel in full, row by row, with no compression at all, so even modest pictures start large. The browser decodes it directly and the pixels are re-encoded as a JPG at the quality on the slider, 85 by default. That re-encode is where the size drop comes from.',
        'Some 32-bit BMP files carry an alpha channel. JPG has no way to hold it, so those pixels are painted white underneath before saving. If the picture needs a transparent background kept, the BMP to PNG page writes a lossless file instead.',
        'Flat-color artwork is a poor fit for JPG, because sharp transitions pick up a faint halo. Photos shrink the most and stay clean. For large flat fields of one color, the PNG page keeps the edges crisp and is usually small enough on its own.',
      ],
    },
    steps: ['Drop in your .bmp files.', 'JPG is already selected.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'What happens to transparent areas?',
        a: 'Some 32 bit BMP files carry transparency. JPG cannot hold it, so those pixels are painted white underneath. Pick PNG if the image needs to stay on a transparent background.',
      },
      {
        q: 'Why is the JPG so much smaller than the BMP?',
        a: 'BMP writes out every pixel with no compression. JPG throws away detail your eye is not likely to notice, which is why a photo that takes 10 MB as a BMP ends up under a megabyte as a JPG.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'bmp-to-png',
    tool: 'img-convert',
    group: 'Images',
    card: 'BMP to PNG',
    blurb: 'Save a BMP image as a PNG',
    preset: { out: 'image/png', accept: 'image/bmp,.bmp' },
    title: 'BMP to PNG converter: save a BMP as a PNG online',
    h1: 'Convert BMP to PNG',
    lede: 'Save a BMP image as a PNG. PNG keeps every pixel and compresses without losing anything, so the picture stays exact and the file usually shrinks.',
    description: 'Convert BMP images to PNG in your browser. The picture stays pixel for pixel and transparency is kept. Your files are never uploaded.',
    more: {
      h2: 'What stays exact',
      paras: [
        'PNG compression is lossless, so the picture you get is pixel for pixel the BMP. Line art, logos and scans with dithering come out with every pixel intact, and the file is still smaller than the BMP, because PNG squeezes the runs of repeated pixels that BMP writes out in full.',
        'If the BMP carries an alpha channel, it is kept. PNG stores transparency as a true alpha channel, so cutouts stay smooth instead of being clipped against one background color. The quality slider has no effect here; PNG has no lossy step for it to tune.',
        'Photos save less dramatically from this page than from the JPG one, because PNG refuses to throw pixels away. For a photo that will only be viewed on screen, the JPG page usually produces a much smaller file. For anything that needs to stay exact, PNG is the right stop.',
      ],
    },
    steps: ['Drop in your .bmp files.', 'PNG is already selected.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'Is anything lost in the conversion?',
        a: 'No. PNG compresses without loss, so the picture you get is pixel for pixel the same as the BMP. The file is smaller because BMP writes every pixel uncompressed.',
      },
      {
        q: 'Will transparency survive?',
        a: 'Yes. If the BMP carries an alpha channel, PNG keeps it. PNG is the safer choice for logos and screenshots that come from a BMP source.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'gif-to-png',
    tool: 'img-convert',
    group: 'Images',
    card: 'GIF to PNG',
    blurb: 'Save a GIF as a PNG image',
    preset: { out: 'image/png', accept: 'image/gif,.gif' },
    title: 'GIF to PNG converter: save a GIF as PNG online',
    h1: 'Convert GIF to PNG',
    lede: 'Save a GIF as a PNG image. Only the first frame of an animated GIF is kept, because PNG holds a single picture.',
    description: 'Convert GIF images to PNG in your browser. Only the first frame of an animated GIF is kept. Your files are never uploaded.',
    more: {
      h2: 'What the PNG keeps and what it drops',
      paras: [
        'A GIF stores at most 256 colors chosen from a palette, and those pixels pass into the PNG unchanged, so the picture does not shift. PNG compresses losslessly, so nothing is softened in the transfer the way a JPG would soften it.',
        'Only the first frame is kept. PNG has no idea of frames, so an animated GIF becomes a still of wherever the loop started. To keep the motion, the file has to stay a GIF or become a video.',
        'GIF transparency is one palette entry flagged as transparent; the PNG keeps it as a true alpha channel, so the edges of the picture stay smooth instead of being cut against a single background color. File size can go either way depending on how noisy the frame is.',
      ],
    },
    steps: ['Drop in your .gif files.', 'PNG is already selected.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'What happens to the animation?',
        a: 'It is dropped. The PNG is the first frame of the GIF, and PNG cannot store the other frames. To keep the animation, use the GIF file itself.',
      },
      {
        q: 'Does PNG keep the colors exactly?',
        a: 'PNG keeps every pixel of the frame exactly. A GIF has at most 256 colors, and PNG keeps those colors as they are, so the picture does not change. The file size can go either way.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'gif-to-jpg',
    tool: 'img-convert',
    group: 'Images',
    card: 'GIF to JPG',
    blurb: 'Save a GIF as a JPG image',
    preset: { out: 'image/jpeg', accept: 'image/gif,.gif' },
    title: 'GIF to JPG converter: save a GIF as JPG online',
    h1: 'Convert GIF to JPG',
    lede: 'Save a GIF as a JPG image. Only the first frame of an animated GIF is kept, and transparent areas are filled with white, since JPG holds a single opaque picture.',
    description: 'Convert GIF images to JPG in your browser. The first frame is kept and transparency is filled with white. Your files are never uploaded.',
    more: {
      h2: 'What the JPG keeps and what it drops',
      paras: [
        'The browser decodes the GIF and hands over a single picture, the first frame. JPG holds no animation and no palette, so the frame is re-rendered as a JPG at the quality on the slider, 85 by default. Flat areas with hard edges can pick up ringing, the faint halo JPG puts around sharp transitions.',
        'Transparent pixels are painted white before saving, because JPG has no transparent color. A GIF cut out on transparency comes out with a solid white background instead. If the picture has to sit on another color, use the GIF to PNG page, which keeps the transparency and the exact source pixels.',
        'GIF pixels were already held to 256 colors, so gradients arrived as stepped bands. The JPG re-encode smooths some of that stepping and adds its own softness in exchange. Saved files keep the original name with a .jpg extension, and several at once are saved one by one or bundled into a zip.',
      ],
    },
    steps: ['Drop in your .gif files.', 'JPG is already selected. Move the quality slider if you want smaller files.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'What happens to the animation?',
        a: 'It is dropped. The JPG is the first frame of the GIF, and JPG cannot store the other frames. To keep the animation, use the GIF file itself.',
      },
      {
        q: 'Is the JPG smaller than the GIF?',
        a: 'For photos, usually. For flat graphics with few colors the GIF can come out smaller, so check the result before you replace the original.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'gif-to-ico',
    tool: 'img-ico',
    group: 'Images',
    card: 'GIF to ICO',
    blurb: 'Make a .ico favicon file from a GIF',
    preset: { accept: 'image/gif,.gif' },
    title: 'GIF to ICO converter: make a .ico favicon from a GIF',
    h1: 'Convert GIF to ICO',
    lede: 'Turn a GIF into a .ico file, the format browsers use for favicons. The first frame of an animated GIF is kept, and the file holds 16, 32 and 48 px versions of the image.',
    description: 'Convert a GIF to a .ico favicon file in your browser. Only the first frame of an animated GIF is used. Transparency is kept. Your file is never uploaded.',
    more: {
      h2: 'How the ICO takes the first frame',
      paras: [
        'The GIF is decoded by the browser and only its first frame is used. That frame is drawn at its intrinsic size, then scaled into 16, 32 and 48 pixel pictures at high smoothing quality. All three are packed into one .ico file as 32-bit PNG frames, which current Windows and every current browser read.',
        'A GIF uses a 256-color palette, so the decoded frame has at most 256 distinct colors. The ICO stores each size as a full 32-bit PNG, so the palette limit does not expand but the file can hold transparency cleanly. If the GIF is not square, the image is centered on a square canvas and padded with transparency instead of being stretched.',
        'The GIF\'s palette is not carried into the icon: each PNG frame is written at 32 bits, so the icon can hold more colours than the GIF source did. The saved file takes the source name and ends in .ico, and no metadata from the GIF is written into it.',
      ],
    },
    steps: ['Drop in your GIF files.', 'Nothing to set. The three sizes are made from your image.', 'Click Save to download the .ico file, or all of them as a zip.'],
    faq: [
      {
        q: 'What happens to the animation?',
        a: 'It is dropped. A favicon is one still picture, so the .ico holds the first frame of the GIF. To keep the animation, use the GIF file itself.',
      },
      {
        q: 'What sizes end up in the file?',
        a: '16 by 16, 32 by 32 and 48 by 48 pixels. If the GIF is not square, the image is centered on a transparent square instead of being stretched.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'gif-to-webp',
    tool: 'img-convert',
    group: 'Images',
    card: 'GIF to WebP',
    blurb: 'Save a GIF as a WebP image',
    preset: { out: 'image/webp', accept: 'image/gif,.gif' },
    title: 'GIF to WebP converter: save a GIF as WebP online',
    h1: 'Convert GIF to WebP',
    lede: 'Save a GIF as a WebP image. Only the first frame of an animated GIF is kept, because WebP on this page holds a single picture. Transparency is kept.',
    description: 'Convert GIF images to WebP in your browser. The first frame is kept and transparency is kept. Your files are never uploaded.',
    more: {
      h2: 'What the WebP conversion does to the file',
      paras: [
        'The GIF is decoded by the browser and only its first frame is used. That frame is drawn onto a canvas and encoded as WebP at the quality you set, 85 by default. A GIF uses a 256-color palette, so the decoded frame has at most 256 distinct colors; the WebP can look softer on photos but is usually smaller.',
        'Transparency is kept. WebP supports an alpha channel, so a GIF with a transparent background stays transparent. In browsers whose canvas cannot write WebP (Safari), the page uses its own WebP encoder (jSquash) with the same quality value, so the output is WebP either way.',
        'Animated GIFs keep only their first frame. The quality slider starts at 85 and applies to the WebP encode, so a GIF that begins with a blank frame gives a blank WebP. The animation timing and the other frames are dropped, the saved file takes the source name and ends in .webp, and no metadata from the GIF is carried over.',
      ],
    },
    steps: ['Drop in your .gif files.', 'WebP is already selected. Move the quality slider if you want smaller files.', 'Click Convert, then save each image or all of them as a zip.'],
    faq: [
      {
        q: 'What happens to the animation?',
        a: 'It is dropped. The WebP is the first frame of the GIF, since WebP stores one picture here. To keep the animation, use the GIF file itself.',
      },
      {
        q: 'Is the WebP smaller than the GIF?',
        a: 'For photos, usually. For flat graphics with few colors the GIF can come out smaller, so check the result before you replace the original.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'webp-to-png',
    tool: 'img-convert',
    guide: 'open-webp-images',
    group: 'Images',
    card: 'WebP to PNG',
    blurb: 'Turn WebP images into PNG files',
    preset: { out: 'image/png', accept: 'image/webp,.webp' },
    title: 'WebP to PNG converter that works in your browser',
    h1: 'Convert WebP to PNG',
    lede: 'Turn WebP images into PNG files that open in almost any program, including older ones that cannot read WebP. Transparent areas stay transparent.',
    description: 'Convert WebP to PNG online, one file or many at once. Transparency is kept. Your images stay on your device.',
    more: {
      h2: 'How the pixels move across',
      paras: [
        'The WebP is decoded in your browser, drawn onto a canvas at the same dimensions and encoded as a PNG, so the picture keeps exactly the pixels the WebP held. PNG is lossless, and that path changes nothing after the draw. Detail a lossy WebP already dropped does not come back.',
        'Transparency is the main reason to pick this page. WebP can carry an alpha channel, and PNG keeps it, so a WebP logo or icon with transparent background stays transparent. The quality slider has no effect on PNG because PNG is lossless; moving it changes nothing.',
        'PNG is the format the most programs can open, which is why this page exists even though WebP is smaller. The trade is size: expect the PNG to be larger than the WebP you started with, worth it when the file has to open somewhere specific.',
      ],
    },
    steps: ['Drop in your WebP files.', 'PNG is already selected. Change it only if you need another format.', 'Click Save to download the PNG files.'],
    faq: [
      {
        q: 'Why would I want PNG instead of WebP?',
        a: 'Some older programs and upload forms accept only PNG or JPG. If you are not sure what will open the file, PNG is the safer choice.',
      },
      {
        q: 'Does converting lose quality?',
        a: 'The pixels are copied as they are, so the picture does not change in the conversion. Detail that a lossy WebP already dropped does not come back.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'png-to-webp',
    tool: 'img-convert',
    guide: 'jpg-png-webp-or-avif',
    group: 'Images',
    card: 'PNG to WebP',
    blurb: 'Smaller WebP files from PNG images',
    preset: { out: 'image/webp', accept: 'image/png,.png' },
    title: 'PNG to WebP converter that works in your browser',
    h1: 'Convert PNG to WebP',
    lede: 'Turn PNG images into WebP files, which are often smaller and still keep sharp edges. Transparency is kept.',
    description: 'Convert PNG to WebP online, one file or many at once. Adjustable quality and transparency kept. Your images stay on your device.',
    more: {
      h2: 'What happens to your pixels',
      paras: [
        'Each PNG is decoded, drawn and re-encoded as WebP at the quality you pick. This page writes lossy WebP, which is where the big savings on photos come from. Flat colors and sharp edges can pick up slight ringing at low quality settings, so raise the slider if edges look dirty.',
        'Transparency is kept. WebP supports an alpha channel, so a PNG logo on a transparent background stays transparent in the output. Single-color gradients and flat artwork often compress better in a lossless format, so if the WebP looks worse than the PNG, raise the quality slider.',
        'In browsers whose canvas cannot write WebP, this site encodes the file with its own WebP encoder instead, using the same quality value, so the output is WebP either way. Either path re-encodes from pixels, so detail already lost in a JPG source stays lost.',
      ],
    },
    steps: ['Drop in your PNG files.', 'WebP is already selected. Move the quality slider if you want smaller files.', 'Click Save to download the WebP files.'],
    faq: [
      {
        q: 'Are WebP files smaller than PNG?',
        a: 'Often, yes, especially for photos. The quality slider sets how much detail is kept. Lower values make smaller files.',
      },
      {
        q: 'Will every program open WebP?',
        a: 'Current browsers and most modern apps can. Some older programs and upload forms cannot, so keep the PNG if you are not sure.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'jpg-to-webp',
    tool: 'img-convert',
    guide: 'jpg-png-webp-or-avif',
    group: 'Images',
    card: 'JPG to WebP',
    blurb: 'Lighter images for your website',
    preset: { out: 'image/webp' },
    title: 'Convert JPG and PNG to WebP online',
    h1: 'Convert images to WebP',
    lede: 'WebP files are often a quarter to a third smaller than JPG at about the same quality, which makes web pages load faster.',
    description: 'Convert JPG and PNG images to WebP in your browser. Batch convert, set the quality, and download a zip. Nothing is uploaded.',
    more: {
      h2: 'Why and how much smaller',
      paras: [
        'WebP typically makes files a quarter to a third smaller than JPG at the same visible quality, which is why websites serve it. A quality setting of 75 to 80 is a reasonable default for photos; go lower only when the page weight matters more than the pixels.',
        'Converting a JPG to WebP is a lossy step on top of a lossy file, since the pixels are decoded and encoded again, so some detail is lost twice over. At 85 this is rarely visible; at 60 and below it becomes easier to spot on smooth gradients.',
        'Every current browser displays WebP, and transparent PNGs keep their transparency through the conversion. On browsers whose canvas cannot write WebP, a bundled encoder is used instead, so the output is always WebP rather than a PNG with a different name.',
      ],
    },
    steps: ['Drop in JPG or PNG images.', 'WebP is already selected. A quality of 75 to 80 looks good for most photos.', 'Click Convert and save the files.'],
    faq: [
      {
        q: 'Do all browsers show WebP?',
        a: 'Yes. Every current version of Chrome, Safari, Firefox and Edge displays WebP.',
      },
      {
        q: 'Does WebP keep transparency?',
        a: 'Yes. Transparent PNGs stay transparent when converted to WebP.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'compress-image',
    tool: 'img-compress',
    guide: ['make-a-photo-smaller-to-email', 'pdf-too-large-to-email'],
    group: 'Images',
    card: 'Compress image',
    blurb: 'Shrink photos for email and upload forms',
    title: 'Compress images online: make JPG, PNG and WebP smaller',
    h1: 'Compress images',
    lede: 'Make photos small enough for an email, an upload form or a website. You see the new size before you download, and the original is never changed.',
    description: 'Reduce the file size of JPG, PNG and WebP images in your browser. Set quality and maximum width, compare sizes, and save. No upload.',
    more: {
      h2: 'How the compression works',
      paras: [
        'Each image is decoded, optionally scaled down to the maximum width you pick, and re-encoded in the same format by default. The default quality is 70, which usually looks the same as the original on screen but shrinks photos a good deal. Large downscales go in halving steps, which keeps edges sharper than one big jump.',
        'PNG is lossless, so a PNG barely shrinks at any quality setting; pick WebP, or JPG for photos without transparency, for real savings. JPG has no transparency, so any transparent pixels are flattened onto white.',
        'If the result in the same format at the same width would be larger than the original, you get the original file back unchanged instead of a bigger "compressed" file. Saved files carry a -small suffix, and the before and after size is shown next to each image so you can see the difference before you keep it.',
      ],
    },
    steps: [
      'Drop in one or more images.',
      'Pick a quality level. Setting a maximum width as well saves the most space on large phone photos.',
      'Click Compress, check the new sizes, and save.',
    ],
    faq: [
      {
        q: 'How small can I get a photo without it looking worse?',
        a: 'A quality around 70 usually looks the same as the original on screen. Limiting the width to 1920 pixels shrinks a 12-megapixel phone photo from several megabytes to a few hundred kilobytes.',
      },
      {
        q: 'Why did my PNG barely shrink?',
        a: 'PNG is lossless, so there is little to remove without changing the format. Choose WebP, or JPG if the image has no transparency, for a much smaller file.',
      },
      {
        q: 'What if the compressed file comes out bigger?',
        a: 'That can happen when an image was already well compressed. If the format and size stay the same and the result would be larger, you get your original file back unchanged.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'compress-jpg',
    tool: 'img-compress',
    guide: ['make-a-photo-smaller-to-email', 'photo-under-100kb-for-a-form'],
    group: 'Images',
    card: 'Compress JPG',
    blurb: 'Shrink JPG photos for email and upload forms',
    preset: { accept: 'image/jpeg,.jpg,.jpeg' },
    title: 'Compress JPG online: make JPG files smaller in your browser',
    h1: 'Compress JPG',
    lede: 'Make JPG photos small enough for an email, an upload form or a website. You see the new size before you download, and the original is never changed.',
    description: 'Reduce JPG file size in your browser. Set quality and maximum width, compare sizes, and save. No upload, and no sign-up.',
    more: {
      h2: 'Where the savings come from',
      paras: [
        'The photo is decoded, optionally scaled down to a width limit you pick, and re-encoded as a JPG at the quality setting. The default quality here is 70, which is usually indistinguishable from the original on screen but a good deal smaller.',
        'If the result in the same format and at the same width would be larger than the original, you get the original file back unchanged instead of a bigger "compressed" file. That happens most often with photos already saved at low quality.',
        'JPG has no transparency, so any transparent pixels are flattened onto white, like every other JPG output on this site. Compressed files are saved with a -small suffix, and the new size is shown next to the old one before you save.',
      ],
    },
    steps: [
      'Drop in one or more JPG files.',
      'Pick a quality level. Setting a maximum width as well saves the most space on large phone photos.',
      'Click Compress, check the new sizes, and save.',
    ],
    faq: [
      {
        q: 'What quality should I use?',
        a: 'Around 70 usually looks the same as the original on screen. Go lower, around 50, for an upload form with a strict size limit. The first thing to soften is fine detail, such as text and fabric.',
      },
      {
        q: 'Why did my JPG barely shrink?',
        a: 'It was probably already well compressed, for example a photo saved at low quality by a phone. Lower the quality slider or set a maximum width of 1920 pixels to save the most space.',
      },
      {
        q: 'What if the compressed file comes out bigger?',
        a: 'That can happen when an image was already well compressed. If the result would be larger, you get your original file back unchanged.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'compress-png',
    tool: 'img-compress',
    group: 'Images',
    card: 'Compress PNG',
    blurb: 'Shrink PNGs for the web and upload forms',
    preset: { accept: 'image/png,.png' },
    title: 'Compress PNG online: make PNG files smaller in your browser',
    h1: 'Compress PNG',
    lede: 'Make a PNG small enough for a website, a README or an upload form. Set a maximum width and quality, and see the new size before you download. For a much smaller file, save as WebP instead; the page tells you when the PNG will barely shrink.',
    description: 'Reduce PNG file size in your browser. Cap the width, compare sizes, and save. Optionally save as WebP for a much smaller file. Nothing leaves your device.',
    more: {
      h2: 'Why a PNG barely shrinks',
      paras: [
        'PNG is lossless, so re-saving a PNG removes almost nothing. The real savings here come from the maximum width, 1920 pixels by default, which scales the image down proportionally using halving steps that keep edges sharp. A 4000 pixel screenshot re-saved at 1920 comes out far smaller.',
        'The quality slider only matters if you switch Save as to WebP or JPG. Left on PNG it does nothing, because PNG has no quality to trade. The page shows the size change next to each file before you save, so you can see when a re-save bought nothing.',
        'If the output would be bigger than the original while staying the same format and width, the original file is handed back unchanged instead. For genuinely big reductions, save as WebP, which keeps transparency; pick JPG only for photos with no transparency.',
      ],
    },
    steps: [
      'Drop in one or more PNG files.',
      'Set a maximum width. Re-saving at 1920 pixels or less is where most of the savings come from.',
      'Click Compress, check the new sizes, and save. Switch "Save as" to WebP if you need the smallest file.',
    ],
    faq: [
      {
        q: 'Why did my PNG barely shrink?',
        a: 'PNG is a lossless format, so there is little to remove without changing it. Setting a maximum width helps on large images. For a real size drop, pick WebP in "Save as", or JPG if the image has no transparency.',
      },
      {
        q: 'Can I keep the file as a PNG and still shrink it?',
        a: 'Yes. The tool re-saves the PNG with the maximum width you set. That is lossless, and it helps most on screenshots and images saved at very large dimensions.',
      },
      {
        q: 'What if the compressed file comes out bigger?',
        a: 'That can happen when an image was already well compressed. If the format and size stay the same and the result would be larger, you get your original file back unchanged.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'resize-image',
    tool: 'img-resize',
    guide: 'make-a-photo-smaller-to-email',
    group: 'Images',
    card: 'Resize image',
    blurb: 'Set exact pixel sizes or a percentage',
    title: 'Resize images online by pixels or percentage',
    h1: 'Resize images',
    lede: 'Change the width and height of one image or many. Type exact pixels or a percentage, and the proportions stay locked unless you unlock them.',
    description: 'Resize JPG, PNG and WebP images to exact pixel dimensions or a percentage, in batches, right in your browser. Files are not uploaded.',
    more: {
      h2: 'How the new size is worked out',
      paras: [
        'Type a percentage and both sides scale together. Type a width or a height, and with proportions locked the other side is computed to match; the image is scaled to fit inside your box, so nothing is stretched. Unlock the proportions to force the exact width and height you typed.',
        'Large downscales go in halving steps rather than one jump, with high-quality smoothing at each step. That keeps edges noticeably sharper than a single big reduction. Dimensions round to whole pixels, and never below one pixel on a side.',
        'Making an image bigger is off unless you tick "Allow enlarging" or type a percentage above 100. Enlarging cannot add detail the file does not have, so expect softness. Leaving both boxes empty keeps the dimensions as they are, which is rarely what you want, so one side is always required for a real change.',
      ],
    },
    steps: [
      'Drop in your images.',
      'Type a width, a height or a percentage. Leave one side empty to keep the proportions.',
      'Click Resize and save the files.',
    ],
    faq: [
      {
        q: 'What happens if I enter both width and height?',
        a: 'With proportions locked, the image is scaled to fit inside that box without stretching. Unlock proportions to force the exact size.',
      },
      {
        q: 'Can I make an image bigger?',
        a: 'Use a percentage above 100, or tick "Allow enlarging". Enlarging cannot add detail, so expect some softness.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'resize-jpg',
    tool: 'img-resize',
    guide: ['make-a-photo-smaller-to-email', 'photo-under-100kb-for-a-form'],
    group: 'Images',
    card: 'Resize JPG',
    blurb: 'Set exact pixel sizes on JPGs',
    preset: { accept: 'image/jpeg,.jpg,.jpeg' },
    title: 'Resize JPG online: exact pixels or a percentage',
    h1: 'Resize JPG',
    lede: 'Change the width and height of one JPG or many. Type exact pixels or a percentage, and the proportions stay locked unless you unlock them.',
    description: 'Resize JPG images to exact pixel dimensions or a percentage, in batches, right in your browser. Files are not uploaded.',
    more: {
      h2: 'How the JPG is resized',
      paras: [
        'The size is worked out before any pixels are drawn. Whole pixels are kept and no side ends up smaller than one pixel. When both width and height are typed with proportions locked, the picture is scaled to fit inside that box without stretching, so one side can land smaller than you typed.',
        'Reducing a picture is done in halving steps instead of one jump, which keeps edges and fine text much cleaner on big shrinks. The last pass uses high-quality smoothing, and the file is saved as a JPG at the quality shown on the slider, 85 by default. Saving as JPG is lossy even when the size barely moves, so a round trip through this page is not free.',
        'Enlarging happens only through a percentage above 100 or the "Allow enlarging" option. A larger width or height typed on its own is clamped back down to the picture\'s own size. Enlarging invents no detail, it re-renders softly. The saved file keeps the original name with the new dimensions added, like photo-1600x1200.jpg, so nothing is overwritten by accident.',
      ],
    },
    steps: [
      'Drop in your JPG files.',
      'Type a width, a height or a percentage. Leave one side empty to keep the proportions.',
      'Click Resize and save the files.',
    ],
    faq: [
      {
        q: 'What happens if I enter both width and height?',
        a: 'With proportions locked, the image is scaled to fit inside that box without stretching. Unlock proportions to force the exact size.',
      },
      {
        q: 'Where does keeping proportions locked matter?',
        a: 'For faces and products, where a stretched image is obvious. Keep proportions locked and type only the width you want, such as 1600 pixels for a website.',
      },
      {
        q: 'Can I make a JPG bigger?',
        a: 'Use a percentage above 100, or tick "Allow enlarging". Enlarging cannot add detail, so expect some softness.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'resize-png',
    tool: 'img-resize',
    group: 'Images',
    card: 'Resize PNG',
    blurb: 'Set exact pixel sizes on PNGs',
    preset: { accept: 'image/png,.png' },
    title: 'Resize PNG online: exact pixels or a percentage',
    h1: 'Resize PNG',
    lede: 'Change the width and height of one PNG or many. Type exact pixels or a percentage, and the proportions stay locked unless you unlock them.',
    description: 'Resize PNG images to exact pixel dimensions or a percentage, in batches, right in your browser. Files are not uploaded.',
    more: {
      h2: 'How the PNG is resized',
      paras: [
        'The size is worked out before any pixels are drawn. Whole pixels are kept and no side ends up smaller than one pixel. With proportions locked and both sides typed, the picture is fitted inside that box without stretching, so one side can land smaller than you typed.',
        'Large shrinks are drawn in halving steps with high-quality smoothing, which keeps line art and text readable. PNG is lossless and keeps the alpha channel, so a transparent background stays transparent and no color shifts appear anywhere, including flat one-color areas where JPG would ring.',
        'The quality slider has no effect on a PNG, because PNG has no lossy step for it to tune. Enlarging needs a percentage above 100 or the "Allow enlarging" option; a bigger width or height typed on its own is clamped to the picture\'s own size, and none of it adds detail. The saved file keeps the original name with the new dimensions added at the end.',
      ],
    },
    steps: [
      'Drop in your PNG files.',
      'Type a width, a height or a percentage. Leave one side empty to keep the proportions.',
      'Click Resize and save the files.',
    ],
    faq: [
      {
        q: 'Are the pixels exactly as I set them?',
        a: 'Yes, when you unlock proportions. With proportions locked, the PNG is scaled to fit inside the box without stretching, so one side may end up smaller.',
      },
      {
        q: 'Does resizing keep transparency?',
        a: 'Yes. PNG keeps its alpha channel, so a transparent background stays transparent.',
      },
      {
        q: 'Can I make a PNG bigger?',
        a: 'Use a percentage above 100, or tick "Allow enlarging". Enlarging cannot add detail, so expect some softness.',
      },
      PRIVATE,
    ],
  },

  // ---------- Data ----------
  {
    slug: 'csv-to-json',
    tool: 'csv-to-json',
    group: 'Spreadsheets and data',
    card: 'CSV to JSON',
    blurb: 'Rows into a JSON array of objects',
    title: 'CSV to JSON converter online',
    h1: 'Convert CSV to JSON',
    lede: 'Turn a CSV file or pasted rows into JSON. The header row becomes the keys, and numbers come out as numbers unless you ask for text.',
    description: 'Convert CSV to JSON in your browser. Detects commas, semicolons and tabs, handles quoted fields, and keeps your data on your device.',
    more: {
      h2: 'What the typing does to your data',
      paras: [
        'Numbers come out as JSON numbers, and true and false come out as booleans. Values that would change if they were turned into numbers are kept as text: anything with a leading zero like 02134, and integers longer than 15 digits. Typing is applied per column, so if any value in a column must stay text, the whole column stays text and no cell silently changes.',
        'Empty cells come out as empty strings, and the separator is detected automatically unless you pick one by hand. If the first row holds column names, they become the keys, with blank headings renamed column_1, column_2 and so on. Turn on "Keep all values as text" if you want no typing at all.',
        'The output is indented with two spaces. A UTF-8 BOM at the start of the file is stripped before parsing, so files saved by Excel read cleanly.',
      ],
      sample: {
        before: 'code,qty,note\n00123,4,in stock\n00456,,out of stock\n00789,12,in stock',
        after: '[\n  {\n    "code": "00123",\n    "qty": 4,\n    "note": "in stock"\n  },\n  {\n    "code": "00456",\n    "qty": "",\n    "note": "out of stock"\n  },\n  {\n    "code": "00789",\n    "qty": 12,\n    "note": "in stock"\n  }\n]',
      },
    },
    steps: [
      'Drop in a .csv file or paste the rows.',
      'Check the options: whether the first row is a header, and whether numbers should stay as text.',
      'Copy the JSON or download it as a file.',
    ],
    faq: [
      {
        q: 'Will zip codes and IDs keep their leading zeros?',
        a: 'Yes. Values that start with a zero, like 02134, and numbers too long to store exactly, like card or order numbers, are kept as text. Tick "Keep all values as text" if you want no numbers at all.',
      },
      {
        q: 'My file uses semicolons, not commas.',
        a: 'The separator is detected automatically. If the preview still looks wrong, pick it by hand from the list.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'csv-to-markdown',
    tool: 'csv-to-markdown',
    group: 'Spreadsheets and data',
    card: 'CSV to Markdown',
    blurb: 'A Markdown table for READMEs and issues',
    title: 'CSV to Markdown table converter online',
    h1: 'Convert CSV to Markdown',
    lede: 'Turn a CSV file or pasted rows into a Markdown table you can paste into a README, an issue or a pull request. Numbers come out right-aligned, and pipes inside cells are escaped so the table keeps its shape.',
    description: 'Convert CSV to a Markdown table in your browser. Paste rows or drop a file, set the separator, and copy the table for GitHub or any Markdown editor. Nothing is uploaded.',
    more: {
      h2: 'How the table is written',
      paras: [
        'The output is a GitHub-flavored Markdown table: a header line, an alignment row, then one line per row of the file. Columns that hold only numbers get right-aligned with ---: in the alignment row, and everything else stays left-aligned.',
        'A pipe inside a cell is written as \\| so it does not split the cell, and a line break inside a cell becomes <br>. Other characters pass through unchanged, which is why a table pasted from Excel keeps its shape.',
        'With the header option off, the table gets generated Column 1, Column 2 cells, because Markdown tables need a header row to render. The separator is detected automatically or picked by hand, and values are not typed, so 00789 keeps its leading zeros.',
      ],
      sample: {
        before: 'tool,uses,score\npdf-merge,12,9\ncsv-to-json,8,7\nmerge-pdf,3,10',
        after: '| tool | uses | score |\n| --- | ---: | ---: |\n| pdf-merge | 12 | 9 |\n| csv-to-json | 8 | 7 |\n| merge-pdf | 3 | 10 |\n',
      },
    },
    steps: [
      'Drop in a .csv file or paste the rows.',
      'Check the separator and whether the first row holds the column names.',
      'Copy the Markdown or download it as a .md file.',
    ],
    faq: [
      {
        q: 'Will the table render on GitHub?',
        a: 'Yes. The output is a GitHub-flavored Markdown table. Paste it into a README, an issue or a pull request and it renders as a table. Columns that hold only numbers are right-aligned.',
      },
      {
        q: 'What if a cell contains a pipe or a line break?',
        a: 'A pipe is written as \\| so it does not split the cell, and a line break inside a cell becomes <br>. Other text is left as it is.',
      },
      {
        q: 'My CSV has no header row.',
        a: 'Untick "First row is column names". The table gets generated header cells, Column 1, Column 2 and so on, because Markdown tables need a header row to render.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'tsv-to-csv',
    tool: 'tsv-to-csv',
    group: 'Spreadsheets and data',
    card: 'TSV to CSV',
    blurb: 'Tab-separated rows into CSV',
    title: 'TSV to CSV converter online',
    h1: 'Convert TSV to CSV',
    lede: 'Turn a tab-separated file into a CSV that opens cleanly in Excel and every data tool. Cells with commas or quotes are quoted for you, and line endings are set for Windows.',
    description: 'Convert TSV to CSV in your browser. Quoting is handled for you, and the file never leaves your device.',
    more: {
      h2: 'What passes through, and what changes',
      paras: [
        'The file is parsed as tab-separated, with no guessing about the source: a tab is a tab. Rows and columns pass through exactly as they are, and nothing is retyped, so a leading zero like 00123 stays text, and numbers are not reformatted.',
        'On the way out, cells are quoted only when they need it. A cell holding a comma is wrapped in quotes; a cell holding a quote gets its quotes doubled, the standard CSV escape. The output uses Windows line endings, which older Excel expects.',
        'If a dropped file is comma-separated rather than tab-separated, the page says so instead of producing one-column output you would have to redo. For the reverse direction, use the CSV to TSV page, which quotes cells that hold a tab or a quote.',
      ],
    },
    steps: [
      'Drop in a .tsv file, or paste the rows.',
      'Check the preview.',
      'Download the CSV.',
    ],
    faq: [
      {
        q: 'Why not just rename the file?',
        a: 'Because the columns would not line up. The tab characters have to become commas, and any cell that holds a comma or a quote has to be wrapped in quotes with its quotes doubled. That is what this page does.',
      },
      {
        q: 'Where do TSV files come from?',
        a: 'Pasting cells from a spreadsheet gives you tab-separated text, and so do many database exports and log files. This page is the bridge between that and tools that only read CSV.',
      },
      {
        q: 'What if my file is already comma-separated?',
        a: 'Then you do not need this page. Use CSV to JSON to convert it, or open it in Excel and save it again.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'csv-to-tsv',
    tool: 'csv-to-tsv',
    group: 'Spreadsheets and data',
    card: 'CSV to TSV',
    blurb: 'Comma-separated rows into TSV',
    title: 'CSV to TSV converter online',
    h1: 'Convert CSV to TSV',
    lede: 'Turn a CSV file into a tab-separated file for tools that paste better with tabs. The separator is detected on its own, and cells are quoted when they hold a tab or a quote.',
    description: 'Convert CSV to TSV in your browser. Quoting is handled for you, and the file never leaves your device.',
    more: {
      h2: 'What changes on the way to TSV',
      paras: [
        'The source separator is detected automatically, so comma, semicolon or tab files all read the same way, and the output is written strictly tab-separated. Rows and columns pass through untouched apart from the delimiter change, and nothing is retyped: a value like 00123 stays text, and numbers keep their written form.',
        'Cells are quoted only when they hold a tab or a quote, mirroring the CSV rule with the characters swapped. A cell with a tab is wrapped in quotes, a cell with a quote gets its quotes doubled. A cell with just a comma needs no quoting in TSV at all, which is the usual reason to switch.',
        'The output uses Windows line endings. Some strict TSV readers are unhappy with quoted fields, but nothing is lost from the file itself, and spreadsheets pasting tab-separated text land one value per cell every time. If the dropped file is already tab-separated, the page says so instead of converting twice.',
      ],
    },
    steps: [
      'Drop in a .csv file, or paste the rows.',
      'Check the preview.',
      'Download the TSV.',
    ],
    faq: [
      {
        q: 'Why switch from CSV to TSV?',
        a: 'Some tools expect tabs, and pasting tab-separated text into a spreadsheet lands one value per cell every time. TSV also lets cells hold commas without quoting.',
      },
      {
        q: 'What happens to cells that contain a tab?',
        a: 'They are wrapped in quotes, the same rule CSV uses for commas. Some strict TSV readers may not read quoted tabs back perfectly, but nothing is lost from the file itself.',
      },
      {
        q: 'Will my columns stay in order?',
        a: 'Yes. Rows and columns pass through untouched apart from the delimiter change.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'tsv-to-json',
    tool: 'csv-to-json',
    group: 'Spreadsheets and data',
    card: 'TSV to JSON',
    blurb: 'Tab-separated rows into JSON',
    preset: { accept: '.tsv,text/tab-separated-values,text/plain' },
    title: 'TSV to JSON converter online',
    h1: 'Convert TSV to JSON',
    lede: 'Turn a tab-separated file into JSON. This is the format you get from pasting cells out of a spreadsheet, and from many database exports. The tab separator is detected on its own.',
    description: 'Convert TSV to JSON in your browser. Paste rows or drop a .tsv file, keep leading zeros as text, and download the result. Nothing is uploaded.',
    more: {
      h2: 'How the TSV becomes JSON',
      paras: [
        'Each line of the file becomes one row, and the tab between cells is the only separator, so a comma inside a cell is just part of its text. The first row is treated as column names unless you untick "First row is column names", in which case keys become column_1, column_2 and so on. Values are typed column by column: if any value in a column must stay text (a zip code like 02134), the whole column stays text, so one column never mixes "02134" and 10001. Plain numbers become JSON numbers, true and false become booleans.',
        'The JSON is written with two-space indentation. Keys appear in the order they first occur across all rows, matching the column order of the TSV. Empty cells become null in the output. The preview shows the first 50 rows; the downloaded file has everything.',
        'Copying cells out of Excel or Google Sheets and pasting them here works, because the clipboard puts tabs between columns. The page shares the CSV to JSON tool, so the same typing rules and the "Keep all values as text" option apply. The saved file is JSON, so no byte order mark is added; a BOM matters for CSV and TSV that go into a spreadsheet, not for JSON.',
      ],
    },
    steps: [
      'Drop in a .tsv file, or copy cells from a spreadsheet and paste them into the box.',
      'Check the options: header row, and whether numbers should stay as text.',
      'Copy the JSON or download it as a file.',
    ],
    faq: [
      {
        q: 'Can I paste straight from Excel or Google Sheets?',
        a: 'Yes. Copy the cells, paste them into the box, and the tabs between the columns are picked up as the separator. You will see a preview of the table before you convert.',
      },
      {
        q: 'Why not just use the CSV converter?',
        a: 'It works too. The TSV page exists so you land here from a search, and its picker is narrowed to .tsv files. The conversion, the options and the output are the same.',
      },
      {
        q: 'Will zip codes and IDs keep their leading zeros?',
        a: 'Yes. Values that start with a zero are kept as text. Tick "Keep all values as text" if you want no numbers at all.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'tsv-to-excel',
    guide: 'excel-csv-leading-zeros',
    more: {
      h2: 'How the workbook is built',
      paras: [
        'The tab-separated grid is written straight into a sheet, first row included, as plain cells with no styling. SheetJS builds a real .xlsx with compression, so the file opens in Excel, LibreOffice and Google Sheets with no delimiter to fight with. The sheet is named after the file you dropped in, cleaned of characters Excel forbids and capped at 31 characters.',
        'Values are typed on the way in: plain numbers become real numbers Excel can sum, true and false become booleans, and a value with a leading zero stays text under the same column-wide rule the CSV pages use. Untick "First row is column names" if your data has no header row.',
        'Long numbers that would lose precision keep their text instead of rounding, and date-like values such as 2026-11-06 stay as text, because only plain numbers become numbers. Cells that are empty in the file stay empty in the sheet. Everything, numbers included, can be forced to text with the "Keep all values as text" option.',
      ],
    },
    tool: 'csv-to-xlsx',
    group: 'Spreadsheets and data',
    card: 'TSV to Excel',
    blurb: 'Tab-separated rows into an .xlsx workbook',
    preset: { accept: '.tsv,text/tab-separated-values,text/plain' },
    title: 'TSV to Excel converter online',
    h1: 'Convert TSV to Excel',
    lede: 'Turn a tab-separated file into a real Excel workbook. This is the format you get from many database exports and from copying cells out of a spreadsheet. Numbers become numbers, and the first row becomes the header.',
    description: 'Convert TSV to Excel in your browser. Drop a .tsv file or paste the rows, and download an .xlsx workbook. Nothing is uploaded.',
    steps: [
      'Drop in a .tsv file, or paste cells copied from a spreadsheet.',
      'Check the options: whether the first row is column names, and whether numbers should stay as text.',
      'Click Download .xlsx to save the workbook.',
    ],
    faq: [
      {
        q: 'How do I open the result?',
        a: 'Double-click it. Excel, Google Sheets and LibreOffice all read .xlsx. The numbers arrive as numbers and the first row as the header, so you can filter and sum right away.',
      },
      {
        q: 'Why not just save the file as .csv?',
        a: 'A CSV with tabs inside the cells opens badly in Excel, and a comma-separated copy needs the tabs replaced first. This page writes a proper .xlsx, so there is no delimiter to fight with.',
      },
      {
        q: 'Will zip codes and IDs keep their leading zeros?',
        a: 'Yes. Values that start with a zero are written as text, so a zip code like 02134 stays 02134. If everything must stay text, tick "Keep all values as text".',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'tsv-to-markdown',
    tool: 'csv-to-markdown',
    group: 'Spreadsheets and data',
    card: 'TSV to Markdown',
    blurb: 'Tab-separated rows into a Markdown table',
    preset: { accept: '.tsv,text/tab-separated-values,text/plain' },
    title: 'TSV to Markdown table converter online',
    h1: 'Convert TSV to Markdown',
    lede: 'Turn a tab-separated file or pasted spreadsheet cells into a Markdown table you can paste into a README, an issue or a pull request. Numbers come out right-aligned, and pipes inside cells are escaped so the table keeps its shape.',
    description: 'Convert TSV to a Markdown table in your browser. Drop a .tsv file or paste rows, and copy the table for GitHub or any Markdown editor. Nothing is uploaded.',
    more: {
      h2: 'How the TSV becomes a Markdown table',
      paras: [
        'Each tab marks a new cell, and the first row becomes the table header. If you untick "First row is column names", headers become Column 1, Column 2 and so on, because Markdown tables require a header row. Pipes inside a cell become \\| and line breaks become <br>, so the table keeps its shape when pasted into GitHub or any Markdown editor.',
        'Columns whose values are all numbers get a right-aligned marker (---:) in the separator row, so columns of figures line up. The output uses LF line endings, one line per row. The preview shows the first 50 rows; the downloaded .md file has everything.',
        'Copying cells out of a spreadsheet and pasting them here works, because the clipboard puts tabs between columns. The table follows the same escaping and alignment rules as the CSV to Markdown page. The saved .md file is UTF-8 with no byte order mark and LF line endings.',
      ],
    },
    steps: [
      'Drop in a .tsv file, or copy cells from a spreadsheet and paste them into the box.',
      'Check whether the first row holds the column names.',
      'Copy the Markdown or download it as a .md file.',
    ],
    faq: [
      {
        q: 'Will the table render on GitHub?',
        a: 'Yes. The output is a GitHub-flavored Markdown table. Paste it into a README, an issue or a pull request and it renders as a table. Columns that hold only numbers are right-aligned.',
      },
      {
        q: 'What if a cell contains a pipe or a line break?',
        a: 'A pipe is written as \\| so it does not split the cell, and a line break inside a cell becomes <br>. Other text is left as it is.',
      },
      {
        q: 'My TSV has no header row.',
        a: 'Untick "First row is column names". The table gets generated header cells, Column 1, Column 2 and so on, because Markdown tables need a header row to render.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'jsonl-to-csv',
    more: {
      h2: 'How the lines are read',
      paras: [
        'The whole file is parsed as JSON first. When that fails, each line is parsed as its own JSON object, which is what a JSON Lines file is. A line that is not valid JSON fails the conversion with an error instead of being skipped, so a truncated export errors out loudly rather than quietly dropping rows.',
        'Nested objects flatten into dotted columns, so an object like address with a city inside becomes a column called address.city. A list inside a record is written into one cell as JSON text. Columns are the union of keys across every row, in the order the keys first appear, and a record missing a key gets an empty cell.',
        'JSON numbers are written as numbers and JSON strings stay strings, so a zip code stored as "02134" keeps its zeros. The output uses CRLF line endings and quotes cells that hold commas or quotes, the same rules Excel and Google Sheets read. This page shares the JSON to CSV tool, so the "For Excel: add a UTF-8 BOM" checkbox is available here too, off by default.',
      ],
    },
    tool: 'json-to-csv',
    group: 'Spreadsheets and data',
    card: 'JSONL to CSV',
    blurb: 'JSON Lines into a spreadsheet',
    preset: { accept: '.jsonl,.ndjson,application/x-ndjson,text/plain' },
    title: 'JSONL to CSV converter online',
    h1: 'Convert JSONL to CSV',
    lede: 'Turn a JSON Lines file into a CSV that opens in Excel or Google Sheets. Each line of the file becomes one row, and nested fields get their own columns with dotted names like address.city.',
    description: 'Convert JSON Lines (.jsonl, .ndjson) to CSV in your browser. Nested fields become dotted columns, lists stay as JSON text. Nothing leaves your device.',
    steps: [
      'Drop in a .jsonl or .ndjson file, or paste the lines.',
      'Check the preview. Every line becomes one row.',
      'Download the CSV or copy it.',
    ],
    faq: [
      {
        q: 'What is a JSONL file?',
        a: 'A text file with one JSON object per line, also called newline-delimited JSON or NDJSON. It is the common output shape of API exports, log pipelines and LLM batch jobs.',
      },
      {
        q: 'What happens to nested objects?',
        a: 'They flatten into dotted columns, so {"address": {"city": "London"}} becomes a column called address.city. Lists are written into one cell as JSON text so nothing is lost.',
      },
      {
        q: 'Can I paste a regular JSON array instead?',
        a: 'Yes, the tool also accepts an array of objects and an object wrapping a single array, such as {"data": [...]}.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'markdown-to-csv',
    more: {
      h2: 'How the table is found and unwound',
      paras: [
        'When the file has an alignment row such as | --- | --- |, the table is read as the header line directly above it plus the pipe lines below it, and the rest of the file, prose, headings and other tables, is ignored. Without an alignment row, every line containing a pipe is read as a row, which suits loose tables pasted from anywhere.',
        'The header row survives as the first line of the CSV and the alignment row is dropped. Cells are trimmed, \\| becomes | again, and <br> becomes a real line break inside the cell. A line break inside a quoted CSV cell is legal, so cell text with breaks round-trips back to the Markdown page unchanged.',
        'Cells containing commas, quotes or line breaks are quoted when the CSV is written, and line endings are CRLF. The download carries a UTF-8 BOM, so Excel shows accented characters correctly instead of showing mojibake. If the file holds no table, you get an error saying so rather than an empty download.',
      ],
    },
    tool: 'md-to-csv',
    group: 'Spreadsheets and data',
    card: 'Markdown to CSV',
    blurb: 'A Markdown table into a CSV file',
    title: 'Markdown to CSV converter online',
    h1: 'Convert Markdown to CSV',
    lede: 'Turn a Markdown table into a CSV that opens in Excel or any data tool. The first table in the file is read, prose around it is ignored, and escaped pipes and <br> cells are unwound.',
    description: 'Convert Markdown tables to CSV in your browser. Prose lines are skipped, the alignment row is dropped, and nothing is uploaded.',
    steps: [
      'Drop in a .md file, or paste the Markdown.',
      'Check the preview of the table.',
      'Download the CSV or copy it.',
    ],
    faq: [
      {
        q: 'Which table is converted?',
        a: 'The first table in the file. Other Markdown around it, headings, paragraphs and code blocks, is skipped. If the file holds no table, you get an error that says so.',
      },
      {
        q: 'What happens to escaped pipes and line breaks in cells?',
        a: '\\| becomes | again, and <br> becomes a line break inside the cell, the reverse of what the CSV to Markdown page does.',
      },
      {
        q: 'Is the header row kept?',
        a: 'Yes. The first row of the table stays as the first line of the CSV, and the alignment row (| --- | --- |) is dropped.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'markdown-to-json',
    tool: 'md-to-json',
    group: 'Spreadsheets and data',
    card: 'Markdown to JSON',
    blurb: 'A Markdown table into JSON rows',
    title: 'Markdown to JSON converter online',
    h1: 'Convert Markdown to JSON',
    lede: 'Turn a Markdown table into JSON rows you can feed to a script or an API call. The first table in the file is read, prose around it is ignored, and the header row becomes the keys.',
    description: 'Convert a Markdown table to JSON in your browser. The first GitHub-flavored table is used, the header row becomes the keys, and nothing is uploaded.',
    more: {
      h2: 'How the table becomes JSON',
      paras: [
        'A Markdown table is read line by line: the header line, the | --- | --- | alignment row under it, and the pipe rows below. Only the first table in the file is used. Prose, headings, code blocks and later tables are skipped, so a README with one table and a lot of writing converts cleanly. Escaped pipes (\\|) return to plain | and <br> turns back into a line break inside the string.',
        'The header row becomes the JSON keys. Cells are typed like CSV cells: plain numbers become JSON numbers, true and false become booleans, and values with leading zeros (zip codes) stay text. The output is a JSON array of objects, written with two-space indentation. The preview is capped at 200,000 characters; the downloaded .json file has everything.',
        'A file with no table gives an error that says so rather than an empty result. The Markdown to CSV and Markdown to Excel pages share this parser, so all three read the same rows and columns.',
      ],
    },
    steps: [
      'Drop in a .md file, or paste the Markdown.',
      'Check the preview of the table.',
      'Download the .json file or copy it.',
    ],
    faq: [
      {
        q: 'Which table is converted?',
        a: 'The first table in the file. Other Markdown around it, headings, paragraphs and code blocks, is skipped. If the file holds no table, you get an error that says so.',
      },
      {
        q: 'Are numbers kept as numbers?',
        a: 'Yes. Plain numbers come out as JSON numbers and true and false as booleans, so the rows are ready to use. Values with leading zeros, such as zip codes, stay text.',
      },
      {
        q: 'What do escaped pipes and line breaks in cells become?',
        a: '\\| becomes | again, and <br> becomes a line break inside the string, the reverse of what the CSV to Markdown page does.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'markdown-to-excel',
    tool: 'md-to-xlsx',
    group: 'Spreadsheets and data',
    card: 'Markdown to Excel',
    blurb: 'A Markdown table into an .xlsx workbook',
    title: 'Markdown to Excel converter online',
    h1: 'Convert Markdown to Excel',
    lede: 'Turn a Markdown table into an .xlsx workbook. The first table in the file is read, prose around it is ignored, and numbers come out as numbers so you can sum them in Excel.',
    description: 'Convert Markdown tables to Excel .xlsx in your browser. The first table is used, prose is skipped, and nothing is uploaded.',
    more: {
      h2: 'How the table becomes an Excel workbook',
      paras: [
        'The first table in the Markdown file supplies the rows and columns, and everything around it is skipped. Escaped pipes and <br> line breaks are turned back into | and real line breaks before the cells are written, so what renders on GitHub is what lands in the sheet, including a line break inside a cell.',
        'The parsed table is converted to CSV text and then SheetJS builds a real .xlsx workbook with compression. Plain numbers are written as numbers so you can sum and sort them; values with leading zeros stay text. The sheet is named after the file name, with characters Excel forbids replaced by spaces and the name capped at 31 characters.',
        'Merged cells in the Markdown are not represented, because Markdown tables do not support them. The Markdown to CSV and Markdown to JSON pages share this parser, so the row and column count match across the three pages. The preview shows the first 50 rows, the downloaded workbook has everything, and the .xlsx opens in Excel, Google Sheets and LibreOffice.',
      ],
    },
    steps: [
      'Drop in a .md file, or paste the Markdown.',
      'Check the preview of the table.',
      'Download the .xlsx workbook.',
    ],
    faq: [
      {
        q: 'Which table is converted?',
        a: 'The first table in the file. Other Markdown around it is skipped. If the file holds no table, you get an error that says so.',
      },
      {
        q: 'Are numbers kept as numbers?',
        a: 'Yes, plain numbers come out as numbers, so you can sum and sort them in Excel. Leading-zero values such as zip codes stay text.',
      },
      {
        q: 'How is the sheet named?',
        a: 'After the file name, the same as every other page here that saves an Excel workbook.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'json-to-csv',
    tool: 'json-to-csv',
    guide: ['open-json-in-excel-or-sheets', 'csv-garbled-characters-excel'],
    group: 'Spreadsheets and data',
    card: 'JSON to CSV',
    blurb: 'Open JSON data in a spreadsheet',
    title: 'JSON to CSV converter online',
    h1: 'Convert JSON to CSV',
    lede: 'Turn a JSON array, an API response or JSON Lines into a CSV file that opens in Excel, Numbers or Google Sheets. Nested fields get their own columns.',
    description: 'Convert JSON to CSV in your browser. Flattens nested objects into columns and accepts JSON Lines. Nothing leaves your device.',
    more: {
      h2: 'How nested data is flattened',
      paras: [
        'Nested objects are flattened into dotted keys, so {"address":{"city":"London"}} becomes a column called address.city. Lists are written into a single cell as JSON text, for example ["red","blue"], so nothing in the record is lost.',
        'The tool accepts a JSON array, a single object, an object with exactly one array inside it such as {"data": [...]}, or JSON Lines with one object per line. Anything else gives a clear error instead of a half-converted file.',
        'Columns are the union of every key in the rows, in the order the keys first appear. A row that is missing a key gets an empty cell, so a ragged export still produces a rectangular CSV. Line endings are CRLF, the same as a file saved by Excel.',
      ],
      sample: {
        before: '[\n  { "name": "Ada", "address": { "city": "London", "zip": "E1 6AN" } },\n  { "name": "Grace", "role": "admin" }\n]',
        after: 'name,address.city,address.zip,role\r\nAda,London,E1 6AN,\r\nGrace,,,admin',
      },
    },
    steps: ['Drop in a .json file or paste the JSON.', 'Check the preview. Nested fields show up as columns like address.city.', 'Download the CSV or copy it.'],
    faq: [
      {
        q: 'What JSON shapes does it accept?',
        a: 'An array of objects, a single object, an object with one array inside (such as {"data": [...]}), or JSON Lines with one object per line.',
      },
      {
        q: 'What happens to lists inside a record?',
        a: 'They are written into a single cell as JSON text, for example ["red","blue"], so nothing is lost.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'json-to-tsv',
    tool: 'json-to-tsv',
    group: 'Spreadsheets and data',
    card: 'JSON to TSV',
    blurb: 'JSON into tab-separated values',
    title: 'JSON to TSV converter online',
    h1: 'Convert JSON to TSV',
    lede: 'Turn a JSON array, an API response or JSON Lines into a tab-separated file. TSV is what you get when you copy cells out of a spreadsheet, and every table import reads it. Nested fields get their own columns.',
    description: 'Convert JSON to TSV in your browser. Flattens nested objects into columns and accepts JSON Lines. Nothing leaves your device.',
    more: {
      h2: 'How the JSON becomes TSV',
      paras: [
        'The JSON is parsed into rows: an array of objects, a single object, an object wrapping one array, or JSON Lines (one object per line). Nested objects are flattened into dotted keys, so address.city becomes a column. Lists inside a record are written into one cell as JSON text, for example ["red","blue"].',
        'Columns are the union of keys across all rows, in the order the keys first appear. Plain numbers are written as numbers, true and false as TRUE and FALSE, and empty cells are empty. The TSV always uses CRLF line endings and carries a UTF-8 BOM so Excel opens it as UTF-8 without a separate import step.',
        'The preview shows the first 50 rows; the downloaded file has everything. If you need comma-separated output instead, the JSON to CSV page uses the same flattening logic with commas.',
      ],
    },
    steps: ['Drop in a .json file or paste the JSON.', 'Check the preview. Nested fields show up as columns like address.city.', 'Download the TSV or copy it.'],
    faq: [
      {
        q: 'Can I open the result in Excel?',
        a: 'Yes. Double-click the saved .tsv file, or paste the copied table straight into a sheet. Excel, Google Sheets and LibreOffice all read tab-separated values, and numbers arrive as numbers.',
      },
      {
        q: 'What JSON shapes does it accept?',
        a: 'An array of objects, a single object, an object with one array inside (such as {"data": [...]}), or JSON Lines with one object per line.',
      },
      {
        q: 'What happens to lists inside a record?',
        a: 'They are written into a single cell as JSON text, for example ["red","blue"], so nothing is lost.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'csv-to-excel',
    tool: 'csv-to-xlsx',
    group: 'Spreadsheets and data',
    guide: ['csv-opens-in-one-column-in-excel', 'excel-csv-leading-zeros'],
    card: 'CSV to Excel',
    blurb: 'Save a CSV as a real .xlsx workbook',
    title: 'CSV to Excel converter: save CSV as XLSX online',
    h1: 'Convert CSV to Excel',
    lede: 'Save a CSV as a proper .xlsx workbook. Numbers are stored as numbers, so you can sum and sort them as soon as the file opens in Excel.',
    description: 'Convert CSV files to Excel .xlsx in your browser. Handles commas, semicolons and tabs and keeps numbers as numbers. No upload.',
    more: {
      h2: 'What the workbook keeps',
      paras: [
        'The CSV is parsed first, with the separator detected or picked by you, and the numbers are stored as real numbers so you can sum and average them as soon as the file opens. Values with leading zeros and integers longer than 15 digits are stored as text, so Excel will not round them or drop the zeros.',
        'Every row goes in as it is, including the first row: nothing restyles or freezes the header, and empty cells stay empty. The sheet is named after the file you dropped in, with the characters Excel forbids in a sheet name replaced by spaces and the name capped at 31 characters.',
        'The workbook is written with compression, so the .xlsx is usually smaller than the equivalent CSV would suggest, and it opens in Excel, Numbers and Google Sheets without any import step or separator guessing.',
      ],
    },
    steps: ['Drop in a .csv file or paste the rows.', 'Check the preview and the options.', 'Click Download to save the .xlsx file.'],
    faq: [
      {
        q: 'Why not just open the CSV in Excel?',
        a: 'Excel guesses how a CSV is laid out and often guesses wrong. A file separated by semicolons can end up in a single column, and long ID numbers get rounded. Converting first avoids both problems.',
      },
      {
        q: 'Will long ID numbers be kept exactly?',
        a: 'Yes. Numbers longer than 15 digits and values with leading zeros are stored as text, so Excel will not round them or show them in scientific notation.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'excel-to-csv',
    tool: 'xlsx-to-csv',
    guide: 'csv-garbled-characters-excel',
    group: 'Spreadsheets and data',
    card: 'Excel to CSV',
    blurb: 'Save the first sheet of a workbook as CSV',
    title: 'Excel to CSV converter: save XLSX as CSV online',
    h1: 'Convert Excel to CSV',
    lede: 'Save the first sheet of an Excel workbook as a CSV file. Each cell is written the way it is shown in the sheet, so a formatted date or number comes out as you see it.',
    description: 'Convert Excel .xlsx files to CSV in your browser. Saves the first sheet as comma-separated text. Your workbook is never uploaded.',
    more: {
      h2: 'What the CSV keeps from the workbook',
      paras: [
        'Only the first sheet is converted. The page reports how many other sheets the workbook has, and to convert one of those you drag its tab to the front in Excel and drop the file here again. Each cell is written the way Excel shows it, so a date formatted as 2026-11-06 comes out as that text, not as a serial number.',
        'Cells that contain commas, quotes or line breaks are wrapped in quotes, which is how CSV holds those characters inside one value. Numbers come out as plain digits, and an empty cell comes out as nothing between the separators.',
        'Formulas are not carried over; the CSV holds the value each cell displayed when the workbook was last saved. If you need the calculation itself, keep the .xlsx. The saved file can carry a UTF-8 BOM if you tick the Excel option, so accented characters open correctly in Excel.',
      ],
    },
    steps: ['Drop in an .xlsx file.', 'Check the preview. Only the first sheet is converted.', 'Download the CSV or copy it.'],
    faq: [
      {
        q: 'What happens to the other sheets?',
        a: 'Only the first sheet is converted, and the page tells you how many other sheets the workbook has. To get another sheet, drag its tab to the front in Excel, save, and drop the file here again.',
      },
      {
        q: 'Are formulas kept?',
        a: 'No. The CSV holds the value each cell shows when the workbook was last saved, not the formula behind it.',
      },
      {
        q: 'What about commas and line breaks inside a cell?',
        a: 'The cell is wrapped in quotes, which is how CSV keeps a comma or a line break inside one value.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'excel-to-json',
    tool: 'xlsx-to-json',
    group: 'Spreadsheets and data',
    card: 'Excel to JSON',
    blurb: 'First sheet of a workbook as a JSON array',
    title: 'Excel to JSON converter: XLSX to JSON online',
    h1: 'Convert Excel to JSON',
    lede: 'Turn the first sheet of an Excel workbook into a JSON array. The column headings become the keys, and each row after the heading becomes one object.',
    description: 'Convert Excel .xlsx files to JSON in your browser. Uses the first sheet and its header row as keys. Your workbook is never uploaded.',
    more: {
      h2: 'How the sheet becomes JSON',
      paras: [
        'The sheet is first read as CSV text in your browser, the same way the Excel to CSV page reads it. Each cell arrives as the text Excel shows, so a date formatted as 2026-11-06 in the sheet comes out as that string, not as a serial number.',
        'Typing happens column by column. If any cell in a column has to stay text, such as a zip code like 02134 or an ID longer than 15 digits, the whole column stays text so no cell silently changes. Numbers that fit come out as JSON numbers, and true and false come out as booleans.',
        'Headings are trimmed, and a blank heading becomes column_1, column_2 and so on, so every key in the output is present and named. The result is indented with two spaces and can be copied or saved as a .json file.',
      ],
    },
    steps: ['Drop in an .xlsx file.', 'Check the preview. Only the first sheet is converted.', 'Download the JSON or copy it.'],
    faq: [
      {
        q: 'Do the column headings have to be in the first row?',
        a: 'Yes. The first row of the sheet is read as the keys, so the headings should sit in row one with the data underneath. If your sheet has a title above the table, delete it or cut the table into a new sheet.',
      },
      {
        q: 'How are dates and formatted numbers written?',
        a: 'Each cell is read the way Excel shows it. A date formatted as 2026-11-06 comes out as that text. Plain numbers come out as numbers.',
      },
      {
        q: 'What happens to the other sheets?',
        a: 'Only the first sheet is converted, and the page lists the other sheet names. To get another sheet, drag its tab to the front in Excel, save, and drop the file here again.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'excel-to-tsv',
    tool: 'xlsx-to-tsv',
    group: 'Spreadsheets and data',
    card: 'Excel to TSV',
    blurb: 'A sheet as a tab-separated file',
    title: 'Excel to TSV converter online',
    h1: 'Convert Excel to TSV',
    lede: 'Turn the first sheet of an .xlsx workbook into a tab-separated file that pastes or pipes into other tools. Rows and columns pass through untouched apart from the delimiter change.',
    description: 'Convert Excel .xlsx to TSV in your browser. The first sheet is read, quoting is handled for you, and nothing is uploaded.',
    more: {
      h2: 'How the sheet becomes TSV',
      paras: [
        'SheetJS reads the first sheet of the workbook, and the tab-separated output is built from those cell values. Cells come out the way Excel shows them: a date formatted as 2026-11-06 stays that text, plain numbers stay plain numbers, and text stays text. The page says how many sheets were left out when the workbook has more than one.',
        'Cells containing tabs or quotes are quoted in the output. The TSV uses CRLF line endings and always carries a UTF-8 BOM so Excel and other tools read it as UTF-8 without an import step. There are no delimiter options on this page because the tab is the point of the format.',
        'Hidden rows and hidden columns are still written, because the converter reads the stored cell values rather than what is on screen. Tabs also survive commas inside a cell without the quoting CSV needs, which makes this the format to use when the next tool expects pasted spreadsheet cells. The CSV to TSV page does the same conversion starting from a CSV file.',
      ],
    },
    steps: [
      'Drop in an .xlsx file. Its first sheet is read.',
      'Check the preview.',
      'Download the TSV.',
    ],
    faq: [
      {
        q: 'Which sheet is converted?',
        a: 'Only the first sheet. Drag the tab you want to the front in Excel, save, and drop the file here again. Other sheets are not read.',
      },
      {
        q: 'Why TSV and not CSV?',
        a: 'Tabs survive commas inside cells without quoting, and some tools and pastes expect tab-separated text. If you want CSV instead, the Excel to CSV page does the same thing with commas.',
      },
      {
        q: 'Are numbers and dates kept?',
        a: 'Cells are read the way Excel shows them. A date formatted as 2026-11-06 comes out as that text, and plain numbers come out as plain numbers.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'excel-to-yaml',
    tool: 'xlsx-to-yaml',
    group: 'Spreadsheets and data',
    card: 'Excel to YAML',
    blurb: 'A sheet as a YAML list of records',
    title: 'Excel to YAML converter online',
    h1: 'Convert Excel to YAML',
    lede: 'Turn the first sheet of an .xlsx workbook into a YAML list of records, the format CI configs and Kubernetes manifests use. Numbers arrive as numbers and the first row becomes the keys.',
    description: 'Convert Excel .xlsx to YAML in your browser. The first sheet is read, values are typed, and nothing is uploaded.',
    more: {
      h2: 'How the sheet becomes YAML',
      paras: [
        'SheetJS reads the first sheet, and the cell values go through the same typed CSV parser the other sheet pages use: numbers as numbers, leading zeros as text, true/false as booleans. js-yaml then writes a block-style YAML sequence with one mapping per row, keyed by the header row and indented by two spaces. Anchors and aliases are resolved before writing, so the output is plain YAML.',
        'Values are typed column by column: if any value in a column must stay text (a zip code like 02134), the whole column stays text, so one column never mixes "02134" and 10001. A date formatted as 2026-11-06 comes out as that text. The page says how many sheets were left out when the workbook has more than one.',
        'The preview is capped at 200,000 characters; the downloaded .yaml file has everything. Keys are written in the order they appear in the sheet\'s first row, so the YAML follows the column order of the workbook. The saved file takes the name of the workbook you dropped in, with .yaml at the end. The CSV to YAML page does the same conversion starting from a CSV file.',
      ],
    },
    steps: [
      'Drop in an .xlsx file. Its first sheet is read.',
      'Check the preview. The first row becomes the keys.',
      'Download the .yaml file or copy it.',
    ],
    faq: [
      {
        q: 'Which sheet is converted?',
        a: 'Only the first sheet. Drag the tab you want to the front in Excel, save, and drop the file here again. Other sheets are not read, and the page says when they were left out.',
      },
      {
        q: 'What does the output look like?',
        a: 'A YAML sequence with one mapping per row, keyed by the header. For example - name: Ada followed by age: 36.',
      },
      {
        q: 'Are numbers and dates kept?',
        a: 'A date formatted as 2026-11-06 comes out as that text, plain numbers stay plain numbers, and strings that start with a zero stay text.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'excel-to-markdown',
    more: {
      h2: 'How the sheet becomes a table',
      paras: [
        'The workbook\'s first sheet is read cell by cell and turned into rows, then those rows are written as the same GitHub-flavored table the CSV to Markdown page makes. A date formatted as 2026-11-06 arrives as that text, and a column of numbers is right-aligned. When a workbook has several sheets, the page says so, naming the first sheet and how many were left out, so nothing is silently missed.',
        'A cell that is empty produces nothing between the pipes, so the table keeps its column count even when a row is sparse. A column whose cells are all numbers is right-aligned and gets a numeric marker in the separator row. Pipes inside cells are written as \\| and line breaks become <br>, so pasted tables hold together on GitHub.',
        'Formatting does not carry over: the table holds values, not fonts, colours or column widths. Merged cells are read as stored, so the top-left cell has the value and the rest come out empty. The download is a plain UTF-8 .md file, and the preview can be cut short at 200,000 characters on very large sheets.',
      ],
    },
    tool: 'xlsx-to-markdown',
    group: 'Spreadsheets and data',
    card: 'Excel to Markdown',
    blurb: 'A sheet as a Markdown table',
    title: 'Excel to Markdown table converter online',
    h1: 'Convert Excel to Markdown',
    lede: 'Turn the first sheet of an .xlsx workbook into a Markdown table for a README, an issue or a pull request. Numbers in a column are right-aligned, and the table is ready to paste.',
    description: 'Convert Excel .xlsx to a Markdown table in your browser. The first sheet is used, nested content stays as text, and nothing is uploaded.',
    steps: [
      'Drop in an .xlsx file. Its first sheet is read.',
      'Check the preview of the table.',
      'Copy the Markdown or download it as a .md file.',
    ],
    faq: [
      {
        q: 'Which sheet is converted?',
        a: 'Only the first sheet. Drag the tab you want to the front in Excel, save, and drop the file here again. Other sheets are not read.',
      },
      {
        q: 'Will the table render on GitHub?',
        a: 'Yes. The output is a GitHub-flavored Markdown table, and columns that hold only numbers are right-aligned. Pipes in cells are escaped so the table keeps its shape.',
      },
      {
        q: 'How are dates and formatted numbers written?',
        a: 'Each cell is read the way Excel shows it. A date formatted as 2026-11-06 comes out as that text. Plain numbers come out right-aligned, so columns of figures line up.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'json-to-excel',
    tool: 'json-to-xlsx',
    guide: 'open-json-in-excel-or-sheets',
    group: 'Spreadsheets and data',
    card: 'JSON to Excel',
    blurb: 'Save JSON rows as an .xlsx workbook',
    title: 'JSON to Excel converter: save JSON as XLSX online',
    h1: 'Convert JSON to Excel',
    lede: 'Turn a JSON array or an API response into an Excel workbook. Each key becomes a column heading, and numbers stay numbers so you can sum them in Excel.',
    description: 'Convert JSON to Excel .xlsx in your browser. Nested fields become columns and numbers stay numbers. Nothing leaves your device.',
    more: {
      h2: 'What the workbook looks like',
      paras: [
        'Columns are the union of keys across every row, in the order they first appear. A key that shows up only in the tenth row still gets its own column, and rows missing that key get an empty cell, so mixed shapes still produce a tidy sheet.',
        'Values are retyped on the way in: numbers become real Excel numbers you can sum, and true and false become booleans. Text that only looks like a number, such as 02134, stays text. Nested objects were already flattened to dotted columns like address.city, and a list inside a record is written as JSON text in one cell.',
        'The result is a genuine .xlsx workbook written by SheetJS, not a renamed CSV, so types open correctly in Excel, LibreOffice and Google Sheets. The sheet is named Sheet1; rename it after opening if you need something else.',
      ],
    },
    steps: ['Drop in a .json file or paste the JSON.', 'Check the preview. Nested fields show up as columns like address.city.', 'Click Download to save the .xlsx file.'],
    faq: [
      {
        q: 'What JSON shapes does it accept?',
        a: 'An array of objects or a single object works. So does an object with one array inside, such as {"data": [...]}. JSON Lines, with one object per line, is accepted too.',
      },
      {
        q: 'Are nested fields kept?',
        a: 'They are flattened into columns like address.city, the same as on the JSON to CSV page. A list inside a record is written into one cell as JSON text.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'json-to-markdown',
    more: {
      h2: 'How the table is built',
      paras: [
        'An array of objects, a single object, an object wrapping one array such as {"data": [...]}, or JSON Lines all work here. Everything nests down to dotted columns, so {"a": {"b": 1}} becomes a column called a.b. A list inside a record stays as JSON text in one cell rather than being split across columns.',
        'Columns are the union of keys across every row in first-appearance order, and a record missing a key gets an empty cell. Pipes inside a value are written as \\| so the table keeps its shape, and line breaks inside a value become <br>, so one record renders as one row on GitHub.',
        'A column whose non-empty cells are all numbers gets a numeric marker in the separator row, so GitHub right-aligns it. Empty JSON throws an error instead of producing a bare header. A single object becomes a one-row table, with its keys as the columns. The preview can be cut short at 200,000 characters on very large files; the download always holds the full table.',
      ],
    },
    tool: 'json-to-markdown',
    group: 'Spreadsheets and data',
    card: 'JSON to Markdown',
    blurb: 'A Markdown table from JSON rows',
    title: 'JSON to Markdown table converter online',
    h1: 'Convert JSON to Markdown',
    lede: 'Turn a JSON array, an API response or JSON Lines into a GitHub-flavored Markdown table. Nested objects become dotted columns, numbers are right-aligned, and the table is ready to paste into a README or an issue.',
    description: 'Convert JSON to a Markdown table in your browser. Nested fields become dotted columns, lists stay as JSON text. Nothing is uploaded.',
    steps: ['Drop in a .json file or paste the JSON.', 'Check the preview. Nested fields show up as columns like address.city.', 'Copy the Markdown or download it as a .md file.'],
    faq: [
      {
        q: 'What JSON shapes does it accept?',
        a: 'An array of objects, a single object, an object with one array inside (such as {"data": [...]}), or JSON Lines with one object per line.',
      },
      {
        q: 'What happens to lists inside a record?',
        a: 'They are written into a single cell as JSON text, for example ["red","blue"], so nothing is lost. Pipes inside values are escaped as \\| so the table keeps its shape.',
      },
      {
        q: 'Will the table render on GitHub?',
        a: 'Yes. The output is a GitHub-flavored Markdown table, and columns that hold only numbers are right-aligned. Paste it into a README, an issue or a pull request.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'yaml-to-json',
    tool: 'yaml-to-json',
    group: 'Spreadsheets and data',
    card: 'YAML to JSON',
    blurb: 'Turn YAML config files into JSON',
    title: 'YAML to JSON converter online',
    h1: 'Convert YAML to JSON',
    lede: 'Turn a YAML file into JSON. Handy for CI configs, Kubernetes manifests and app settings you need as JSON for a script or an API. Everything runs in your browser.',
    description: 'Convert YAML to JSON in your browser, including multi-document files. Your file is never uploaded.',
    more: {
      h2: 'What the JSON looks like',
      paras: [
        'The YAML is parsed with js-yaml and written as JSON indented with two spaces. Keys keep the order they have in the file, nested maps become nested objects, and lists become JSON arrays. Anchors and aliases are resolved by the parser before the JSON is written, so you never see an &ref in the output.',
        'A file with several documents separated by --- becomes a JSON array with one entry per document; a single-document file gives you the document itself, not a one-element array. Custom tags are not supported, so export those by hand.',
        'Types carry over as JSON scalars: YAML numbers become JSON numbers, true and false become booleans, and null becomes null. Plain JSON parses as YAML, so a .json file converts fine here too. js-yaml loads only when the page runs, in its own chunk.',
      ],
      sample: {
        before: 'name: stayfile\nplugins:\n  - pdf\n  - csv\nlimits:\n  pages: 50\n  pro: false',
        after: '{\n  "name": "stayfile",\n  "plugins": [\n    "pdf",\n    "csv"\n  ],\n  "limits": {\n    "pages": 50,\n    "pro": false\n  }\n}',
      },
    },
    steps: [
      'Drop in a .yaml or .yml file, or paste the YAML.',
      'Check the preview of the parsed rows.',
      'Download the .json file or copy it.',
    ],
    faq: [
      {
        q: 'Does it handle multi-document YAML?',
        a: 'Yes. A file with several documents separated by --- becomes a JSON array with one entry per document.',
      },
      {
        q: 'Is YAML actually a superset of JSON?',
        a: 'Mostly. Plain JSON parses as YAML, so a .json file converts fine here as well. YAML-specific features like anchors and aliases are resolved by the parser before the JSON is written.',
      },
      {
        q: 'What YAML does it support?',
        a: 'Maps, lists, strings, numbers, booleans and null, with anchors and aliases resolved before the JSON is written. Tags with custom meaning are not supported, and keys keep their order from the file.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'json-to-yaml',
    tool: 'json-to-yaml',
    group: 'Spreadsheets and data',
    card: 'JSON to YAML',
    blurb: 'Turn JSON into YAML config',
    title: 'JSON to YAML converter online',
    h1: 'Convert JSON to YAML',
    lede: 'Turn a JSON file into YAML, the format CI systems and app manifests use. Nesting, lists and quoted strings all come out as clean block YAML. Everything runs in your browser.',
    description: 'Convert JSON to YAML in your browser. Keys keep their order from the JSON file, and nothing is uploaded.',
    more: {
      h2: 'What the YAML looks like',
      paras: [
        'The JSON is parsed, then written as block-style YAML with two-space indentation. Keys keep the order they have in your JSON file, and lists come out as plain dash sequences. Strings that need quoting are quoted, and everything else is written plain.',
        'Types come through as YAML scalars: numbers stay numbers, true and false stay booleans, and null is written as null. Empty objects and empty lists are preserved rather than dropped, which matters for config files where the key has to exist.',
        'js-yaml does the parsing, loaded only on this page. Invalid JSON, such as a trailing comma or a comment, is rejected with the parser\'s message instead of being silently repaired. If you need anchors for repeated blocks, write those by hand; the tool does not generate them.',
      ],
    },
    steps: [
      'Drop in a .json file, or paste the JSON.',
      'Check the preview of the parsed rows.',
      'Download the .yaml file or copy it.',
    ],
    faq: [
      {
        q: 'Does the key order survive?',
        a: 'Yes. js-yaml keeps the order the keys have in your JSON file. Reordering for alphabetical keys is not done, which is usually what you want for config files.',
      },
      {
        q: 'What about big or deeply nested JSON?',
        a: 'The parser handles nesting fine. The limit is your memory, the same as every other page here. If you need YAML anchors for repeated blocks, write those by hand; the page does not generate them.',
      },
      {
        q: 'What YAML does it write?',
        a: 'Block-style YAML 1.2 with two-space indentation. Strings that need quoting are quoted; everything else comes out plain.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'yaml-to-csv',
    more: {
      h2: 'How the rows are made',
      paras: [
        'js-yaml parses the file, the result is flattened to dotted columns and written as CSV, the same path the YAML to JSON page uses. A list of maps gives one row per record; nested maps give dotted columns like address.city, and a list inside a record is written as JSON text in one cell.',
        'Columns are the union of keys across all rows in first-appearance order, and a record missing a key gets an empty cell, so a YAML list whose records have different keys still comes out as a tidy sheet. A YAML file with several documents separated by --- becomes one set of rows in the same table.',
        'Numbers arrive as numbers and true and false arrive as booleans. A value with a leading zero stays text under the same column-wide rule the CSV to JSON page uses, and strings are quoted when they hold commas or quotes. Line endings are CRLF, js-yaml loads only on the YAML pages, and the "For Excel: add a UTF-8 BOM" checkbox here is off by default.',
      ],
    },
    tool: 'yaml-to-csv',
    group: 'Spreadsheets and data',
    card: 'YAML to CSV',
    blurb: 'YAML rows into a CSV file',
    title: 'YAML to CSV converter online',
    h1: 'Convert YAML to CSV',
    lede: 'Turn a YAML list of records into a CSV you can open in any spreadsheet. Nested fields get their own columns with dotted names, and values that look like numbers arrive as numbers. Everything runs in your browser.',
    description: 'Convert YAML to CSV in your browser. A list of maps becomes rows, nested keys flatten to dotted columns. Nothing is uploaded.',
    steps: [
      'Drop in a .yaml or .yml file, or paste the YAML.',
      'Check the preview of the flattened rows.',
      'Download the .csv file or copy it.',
    ],
    faq: [
      {
        q: 'What YAML shape works best?',
        a: 'A list of maps, for example a list of users or line items. Each map becomes one row, and every key becomes a column, so nested keys like address.city get their own column. A single map produces one row.',
      },
      {
        q: 'What happens to lists inside a record?',
        a: 'They are written into a single cell as JSON text, for example ["red","blue"], the same as the JSON to CSV page does. So nothing is lost.',
      },
      {
        q: 'Will my YAML booleans and nulls come through?',
        a: 'Yes. true and false stay booleans and null stays empty in the CSV. Strings that look like numbers, such as zip codes with a leading zero, are kept as text.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'yaml-to-excel',
    tool: 'yaml-to-xlsx',
    group: 'Spreadsheets and data',
    card: 'YAML to Excel',
    blurb: 'YAML rows into an .xlsx workbook',
    title: 'YAML to Excel converter online',
    h1: 'Convert YAML to Excel',
    lede: 'Turn a YAML list of records into a real Excel workbook. Numbers arrive as numbers and the first row holds the keys, so you can filter and sum as soon as the file opens. Everything runs in your browser.',
    description: 'Convert YAML to an Excel .xlsx workbook in your browser. A list of maps becomes one row per record. Nothing is uploaded.',
    more: {
      h2: 'How the YAML becomes an Excel workbook',
      paras: [
        'The YAML is parsed by js-yaml (loaded only on the YAML pages). Several YAML documents (separated by ---) become a JSON array, then each mapping in the list becomes one row. Nested keys like address.city are flattened into dotted columns, the same as the JSON to Excel page. Values are typed on the way in: plain numbers become real Excel numbers you can sum and sort, and anything with a leading zero stays text.',
        'SheetJS builds a genuine .xlsx workbook with compression, so the file opens in Excel, LibreOffice and Google Sheets with types intact. The workbook holds one sheet, named after the file you dropped in, or data when you pasted the YAML instead. The first row holds the keys.',
        'The page also accepts a YAML file pasted into the box. The preview shows the first 50 rows; the downloaded workbook has everything. The YAML to CSV and YAML to JSON pages use the same parsing logic, so the row and column count match across the three pages.',
      ],
    },
    steps: [
      'Drop in a .yaml or .yml file, or paste the YAML.',
      'Check the preview of the flattened rows.',
      'Click Download to save the .xlsx file.',
    ],
    faq: [
      {
        q: 'What YAML shape works best?',
        a: 'A list of maps, the same shape the CSV and JSON to Excel pages want. Each map becomes one row, every key becomes a column, and nested keys like address.city get their own column with a dotted name.',
      },
      {
        q: 'Will numbers be real numbers in the sheet?',
        a: 'Yes. Values that look like numbers are written as numbers, so Excel can sum and sort them. Anything with a leading zero stays as text.',
      },
      {
        q: 'Which sheet gets the data?',
        a: 'One sheet, named after the file when you dropped one in. The first row holds the keys.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'csv-to-yaml',
    more: {
      h2: 'How the records are written',
      paras: [
        'With the first row as column names, each record becomes a YAML mapping keyed by those names, so the output reads like hand-written config. The result is a list of mappings, which is the shape tools expect when they load records into a pipeline or a manifest.',
        'Values are typed the same way as the CSV to JSON page: plain numbers become numbers, true and false become booleans, and values with leading zeros stay text. If any value in a column must stay text, the whole column stays text, so a zip code like 02134 is never quietly turned into 2134.',
        'Untick "First row is column names" and the output becomes a list of lists instead, one list per row, with no keys at all, which suits data that has no header. The separator is detected or picked from comma, semicolon, tab and pipe, which matters for Excel exports from Europe that use semicolons. js-yaml writes block-style YAML with two-space indentation, and js-yaml itself loads only on the YAML pages, not on the rest of the data tools.',
      ],
    },
    tool: 'csv-to-yaml',
    group: 'Spreadsheets and data',
    card: 'CSV to YAML',
    blurb: 'CSV rows into a YAML list',
    title: 'CSV to YAML converter online',
    h1: 'Convert CSV to YAML',
    lede: 'Turn a CSV file into a YAML list of records, the format CI configs and Kubernetes manifests use. The first row becomes the keys and values are typed, so numbers land as numbers. Everything runs in your browser.',
    description: 'Convert CSV to YAML in your browser. The first row becomes the mapping keys and numbers stay numbers. Nothing is uploaded.',
    steps: [
      'Drop in a .csv file, or paste the rows.',
      'Check the separator and whether the first row holds the column names.',
      'Download the .yaml file or copy it.',
    ],
    faq: [
      {
        q: 'What does the output look like?',
        a: 'A YAML sequence with one mapping per row, keyed by the header. For example - name: Ada followed by zip: \'02134\'. Without a header row the result is a YAML list of lists.',
      },
      {
        q: 'Will zip codes keep their leading zeros?',
        a: 'Yes. Strings that start with a zero are kept as text. Tick "Keep all values as text" if you want no numbers at all.',
      },
      {
        q: 'Can I pick the separator?',
        a: 'The separator is detected on its own, and the dropdown lists comma, semicolon, tab and pipe. Excel exports in much of Europe use semicolons, so pick that one if detection guesses wrong.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'excel-to-sql',
    tool: 'xlsx-to-sql',
    group: 'Spreadsheets and data',
    guide: 'import-csv-into-mysql-postgresql-sqlite',
    card: 'Excel to SQL',
    blurb: 'First sheet into INSERT statements',
    title: 'Excel to SQL converter online',
    h1: 'Convert Excel to SQL',
    lede: 'Turn the rows of an Excel sheet into INSERT statements you can run against your database. The first sheet is read, the first row becomes the column names, numbers stay numbers and empty cells become NULL. Everything runs in your browser.',
    description: 'Convert an Excel spreadsheet to SQL INSERT statements in your browser. The first sheet is converted, and nothing is uploaded.',
    more: {
      h2: 'How the sheet becomes statements',
      paras: [
        'The first sheet is read with SheetJS and taken as the text you see in the cells, then the same code path the CSV to SQL page uses turns each row into one INSERT INTO statement. The first row becomes the column list, numbers stay unquoted, empty cells become NULL, and quotes inside text are doubled.',
        'Only the first sheet is read. If your workbook has several, the page lists their names so you know what was left out, and the order of sheets decides which one counts. A value that looks like a number, like 02134 with a leading zero, stays quoted as text.',
        'The table name you type is cleaned to letters, digits, underscores and dollar signs, capped at 64 characters, with a t_ prefix when it starts with a digit. The script does not create the table: build it first with the types you want, then run the statements. Long output is cut short in the preview at 200,000 characters; the download still holds everything.',
      ],
    },
    steps: [
      'Drop in a .xlsx file. Only the first sheet is converted.',
      'Name the table. The first row becomes the column names.',
      'Copy the statements or download them as a .sql file.',
    ],
    faq: [
      {
        q: 'What about the other sheets?',
        a: 'Only the first sheet is read, like every other Excel page here. If the sheet you want is not the first one, move it to the front in Excel and save again.',
      },
      {
        q: 'What does the output look like?',
        a: 'One INSERT INTO statement per row, against the table name you typed. The columns come from the first row of the sheet, quoted or unquoted depending on whether they are plain names.',
      },
      {
        q: 'How are numbers and text kept apart?',
        a: 'Values that look like numbers are written without quotes, everything else is quoted. A leading zero keeps a value as text, so a zip code like 02134 is inserted as text.',
      },
      {
        q: 'Which databases does it work with?',
        a: 'The statements are plain SQL: strings are single-quoted with quotes doubled, booleans are TRUE and FALSE, empty cells are NULL. They run in MariaDB, MySQL, Postgres and SQLite. The script does not create the table, so make the table first.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'csv-to-sql',
    tool: 'csv-to-sql',
    group: 'Spreadsheets and data',
    guide: 'import-csv-into-mysql-postgresql-sqlite',
    card: 'CSV to SQL',
    blurb: 'INSERT statements from a CSV file',
    title: 'CSV to SQL converter online',
    h1: 'Convert CSV to SQL',
    lede: 'Turn a CSV file into INSERT statements you can run against your database. Numbers stay numbers, empty cells become NULL, and single quotes inside the text are doubled the way SQL wants. Everything runs in your browser.',
    description: 'Convert CSV to SQL INSERT statements in your browser. Name the table, drop a file or paste the rows, and copy the script. Nothing is uploaded.',
    more: {
      h2: 'Exactly what comes out',
      paras: [
        'One INSERT INTO statement per row, against the table name you typed. The first row of the file becomes the column list; turn the header option off and the columns are named column_1, column_2 and so on. The table name is cleaned to letters, digits, underscores and dollar signs, capped at 64 characters, and a name starting with a digit gets a t_ prefix. Column names that are not simple identifiers get double quotes.',
        'Numbers are written unquoted, TRUE and FALSE come out as bare booleans, and an empty cell becomes NULL. Everything else is single-quoted with any quote inside doubled, which is the escape MariaDB, MySQL, Postgres and SQLite all read the same way.',
        'The script does not create the table. You create it first with the types you want, then run the statements. Typing is per column like the CSV to JSON page, so if any value in a column must stay text, the whole column is quoted as text.',
      ],
      sample: {
        before: "name,city,age\nAda,London,36\nO'Brien,Dublin,34\nGrace,,85\nSam,Berlin,41",
        after: "INSERT INTO csv_table (name, city, age) VALUES ('Ada', 'London', 36);\nINSERT INTO csv_table (name, city, age) VALUES ('O''Brien', 'Dublin', 34);\nINSERT INTO csv_table (name, city, age) VALUES ('Grace', NULL, 85);\nINSERT INTO csv_table (name, city, age) VALUES ('Sam', 'Berlin', 41);",
      },
    },
    steps: [
      'Drop in a .csv file, or paste the rows.',
      'Name the table, and check whether the first row holds the column names.',
      'Copy the statements or download them as a .sql file.',
    ],
    faq: [
      {
        q: 'What does the output look like?',
        a: 'One INSERT INTO statement per row, against the table name you typed. The columns come from the first row, or from column_1, column_2 and so on if the file has no header row.',
      },
      {
        q: 'Which databases does it work with?',
        a: 'The statements are plain SQL: strings are single-quoted with quotes doubled, booleans are TRUE and FALSE, empty cells are NULL. They run in MariaDB, MySQL, Postgres and SQLite. The script does not create the table, so make the table first.',
      },
      {
        q: 'How are numbers and text kept apart?',
        a: 'Values that look like numbers are written without quotes, everything else is quoted. A leading zero keeps a value as text, so a zip code like 02134 is inserted as text. Tick "Keep all values as text" to quote everything.',
      },
      {
        q: 'What if a cell contains a single quote?',
        a: 'It is doubled, so O\'Hara becomes \'\'O\'\'Hara\'\' inside the statement. That is the standard escape, and every database above reads it the same way.',
      },
      PRIVATE,
    ],
  },
  {
    slug: 'csv-to-ics',
    tool: 'csv-to-ics',
    group: 'Spreadsheets and data',
    guide: 'import-spreadsheet-into-apple-calendar',
    card: 'CSV to ICS',
    blurb: 'Turn a spreadsheet of dates into a calendar file',
    title: 'CSV to ICS: turn a spreadsheet into a calendar file',
    h1: 'Convert CSV or Excel to an ICS calendar file',
    lede: 'Turn a spreadsheet of events into an .ics file you can add to your calendar. Choose which columns hold the title and the start and end dates, then import the file in Apple Calendar, Google Calendar or Outlook. The file is built in your browser.',
    description: 'Turn a CSV or Excel list of events into an .ics calendar file in your browser. Apple Calendar, Google Calendar and Outlook import it, and nothing is uploaded.',
    more: {
      h2: 'What the calendar file holds',
      paras: [
        'Each row becomes one event in the file. The page writes the title, the start, the end, the location and the description, and leaves your other columns out. Times are written without a time zone, so the calendar app that imports the file decides which zone they belong to. That is what you want for your own calendar, and it is worth checking if you send the file to someone in another country.',
        'An all day row has a start date and no time. Its end date in the file is the day after the last day, because the calendar format treats the end date as exclusive; the page does this for you. If a timed event has no end time, it lasts one hour.',
        'Repeating events are not expanded and no repeat rule is written. If your sheet holds a weekly meeting, each row is one meeting. Rows with no title or no readable start date are skipped, and the page tells you how many it skipped and which rows they were.',
      ],
    },
    steps: [
      'Drop in a .csv, .tsv or .xlsx file, or paste the rows.',
      'Check which column holds the title, the start and the end, and whether your dates are month first or day first.',
      'Click Download .ics, then open the file in Apple Calendar, Google Calendar or Outlook.',
    ],
    faq: [
      {
        q: 'Does it handle repeating events?',
        a: 'No. Each row becomes one event, and no repeat rule is written. A weekly meeting needs a row for every date, or you can add the repeat in the calendar app after you import the file.',
      },
      {
        q: 'Which time zone are the times in?',
        a: 'The times are written without a time zone, so the calendar app places them in its own time zone. That is the right choice when you import the file into your own calendar. If your sheet uses a different zone, the times will land at the clock time written.',
      },
      {
        q: 'Can I import the file into Google Calendar?',
        a: 'Yes. Google Calendar on a computer has an Import option in its settings that takes .ics files, and you pick which calendar gets the events. Apple Calendar imports the same file with File > Import, and Outlook opens it as a new calendar you can save.',
      },
      PRIVATE,
      LIMIT,
    ],
  },
  {
    slug: 'ics-to-csv',
    tool: 'ics-to-csv',
    group: 'Spreadsheets and data',
    guide: 'export-calendar-to-excel',
    card: 'ICS to CSV',
    blurb: 'List every event of a calendar file in a spreadsheet',
    title: 'ICS to CSV: open a calendar file in Excel',
    h1: 'Convert an ICS calendar file to CSV or Excel',
    lede: 'Open a calendar file in Excel or Google Sheets. Every event in the .ics file becomes one row with its dates, place and notes, and the list saves as a CSV or an Excel workbook. The file is read in your browser.',
    description: 'Turn an .ics calendar file into a CSV or Excel list in your browser. Each event becomes a row with its dates, place and notes. Nothing is uploaded.',
    more: {
      h2: 'What each row holds',
      paras: [
        'The columns match the event fields: title, start date, start time, end date, end time, all day, location, description, repeats and time zone. An all day event has dates only. The end date shown is the last day of the event, not the day after, because the calendar format stores an exclusive end date and the page adjusts it back.',
        'A time written in UTC is shown in the time zone of the computer reading the file, so it matches the clock on your desk. A time with a named zone keeps the clock time as written, and the zone name goes in the Time zone column. A time with no zone is left as it is, because the file does not say where it belongs.',
        'Repeating events are not expanded. A weekly meeting is one row, and its rule sits in the Repeats column. The CSV download starts with a byte order mark so Excel shows accented names correctly.',
      ],
    },
    steps: [
      'Drop an .ics file, or paste the calendar text.',
      'Check the preview of the events.',
      'Download the list as a .csv or .xlsx file.',
    ],
    faq: [
      {
        q: 'Are repeating events listed for every date?',
        a: 'No. Each repeating event is one row, and its rule is written in the Repeats column. A weekly meeting is one row, not one row per week. If you need every date, expand the rule in the spreadsheet or keep the events in a calendar app.',
      },
      {
        q: 'Why is a Time zone column empty?',
        a: 'A time written in UTC is shown in the time zone of your computer and has no zone name to show. A time with a named zone keeps the clock time, and the zone name goes in that column. A time with no zone has nothing to put there.',
      },
      {
        q: 'Where do I get an .ics file from Google Calendar?',
        a: 'In Google Calendar on a computer, open Settings and find Import and export. Export downloads a zip file with one .ics for each calendar, so unzip it first and pick the calendar you want.',
      },
      PRIVATE,
      LIMIT,
    ],
  },
  {
    slug: 'csv-to-vcf',
    tool: 'csv-to-vcf',
    group: 'Spreadsheets and data',
    guide: 'import-csv-contacts-into-iphone',
    card: 'CSV to VCF',
    blurb: 'Turn a contact list into a file your phone can import',
    title: 'CSV to VCF: turn a contact spreadsheet into vCards',
    h1: 'Convert CSV or Excel contacts to a VCF file',
    lede: 'The iPhone Contacts app and iCloud import vCard (.vcf) files, not CSV or Excel, so a contact spreadsheet has to become a .vcf first. This page does that in your browser: one card per row, in vCard 3.0, which iCloud.com and the iPhone both accept.',
    description: 'Turn a spreadsheet of contacts into a .vcf file for iPhone, Android or Outlook. One card per row, built in your browser. Nothing is uploaded.',
    more: {
      h2: 'What goes into the .vcf file',
      paras: [
        'Each row of the spreadsheet becomes one vCard. The card can hold a first name, a last name, a full name, an organization, a job title, a mobile number, a home phone, a work phone, two email addresses, a home address, a birthday and a note. You pick which column of the spreadsheet fills which field, so the sheet does not have to use any particular headings.',
        'Some things do not go into the file. Photos and contact groups have no column here, so they are left out. A card holds one home address, so a second address in the sheet is ignored. Custom labels such as "main office" are not kept: a phone number is marked mobile, home or work. Any field you leave unmapped stays out of the card, and the phone shows only what is there.',
        'The file is written as vCard 3.0, the version that iCloud, the iPhone Contacts app, Android and Outlook all read. Newer versions exist, but 3.0 is the one that imports without surprises. Line endings are the Windows style, which the format expects, and long notes are wrapped so a mail app does not cut them off. When you open the file, the phone offers to add the cards to an account you choose.',
      ],
    },
    steps: [
      'Drop a CSV or Excel file with one row per contact.',
      'Check which column fills which field.',
      'Download the .vcf file.',
      'Open it on the phone and add the contacts.',
    ],
    faq: [
      {
        q: 'How do I get the file onto my iPhone?',
        a: 'Email the .vcf to yourself or send it over AirDrop, open it on the phone and choose to add all contacts. On a computer you can also open Contacts on iCloud.com, import the vCard there, and it syncs to the phone.',
      },
      {
        q: 'Is there a limit on how many contacts?',
        a: 'There is no set limit here, because the file is built on your own computer. Some phone apps cap a free export at about 25 contacts, so if a list stops partway, check the app that made it.',
      },
      {
        q: 'Do my contacts get uploaded?',
        a: 'No. A contact list is other people\'s personal data, and this page never sends it anywhere. The spreadsheet is read and the .vcf is written in your browser, and closing the tab ends it.',
      },
      PRIVATE,
      LIMIT,
    ],
  },
  {
    slug: 'vcf-to-csv',
    tool: 'vcf-to-csv',
    group: 'Spreadsheets and data',
    guide: 'export-iphone-contacts-to-excel',
    card: 'VCF to CSV',
    blurb: 'Open a contacts file as a spreadsheet',
    title: 'VCF to CSV: open a contacts file in Excel',
    h1: 'Convert a VCF contacts file to CSV or Excel',
    lede: 'Opening a .vcf straight in Excel gives you a column of raw lines; this page gives one row per person with named columns. Drop the contacts file and get a list of names, phone numbers, addresses and emails. The file is read in your browser.',
    description: 'Turn a .vcf contacts file into one row per person in CSV or Excel. Names, phones, emails and addresses in named columns. Nothing is uploaded.',
    more: {
      h2: 'The columns you get',
      paras: [
        'The list has one row per card and these columns: First name, Last name, Full name, Organization, Job title, Mobile, Home phone, Work phone, Other phone, Email, Email 2, Street, City, Region, Postcode, Country, Birthday and Note. A card with two email addresses fills both columns. A number the file labels with an unusual name, such as main office, goes in Other phone so it is not lost.',
        'The file is read as text, so the pages stay small and nothing leaves the computer. Cards written by old Android phones, where accented letters are encoded as numbers, are decoded the same way as plain ones. Photos stored in the file are skipped, because a spreadsheet column of image data is of no use.',
        'The CSV download starts with a byte order mark, so Excel shows accented names correctly, and the Excel download keeps every value as text, so a phone number that starts with a plus sign or a zero stays as written. If you need the list back as a contacts file later, the same list can be turned back into a .vcf.',
      ],
    },
    steps: [
      'Drop a .vcf contacts file, or paste the card text.',
      'Check the preview of the first contacts.',
      'Download the list as a .csv or .xlsx file.',
    ],
    faq: [
      {
        q: 'How do I get a .vcf from my iPhone?',
        a: 'On a recent iPhone, open Contacts, tap Lists, then touch and hold a list such as All Contacts and choose Export. On a computer you can open Contacts on iCloud.com, select the contacts and choose Export vCard from the menu.',
      },
      {
        q: 'What happens to photos?',
        a: 'They are left out. A vCard can carry a photo, but it arrives as encoded image data, and this page skips those lines, so the spreadsheet holds the text fields only.',
      },
      {
        q: 'Which vCard versions work?',
        a: 'Version 2.1, 3.0 and 4.0 files all read here, including the quoted-printable names that old Android exports use for accented letters.',
      },
      PRIVATE,
      LIMIT,
    ],
  },
];

export const GROUPS: Group[] = ['PDF', 'Images', 'Spreadsheets and data'];

// Anchor ids on the home page and short labels for the header nav.
export const GROUP_ID: Record<Group, string> = { PDF: 'pdf', Images: 'images', 'Spreadsheets and data': 'data' };
export const GROUP_SHORT: Record<Group, string> = { PDF: 'PDF', Images: 'Images', 'Spreadsheets and data': 'Data' };

// Guides under /guides/. A guide goes in only when it is finished and passes the word-count test.
export const GUIDES: { slug: string; title: string; blurb: string }[] = [
  {
    slug: 'iphone-heic-photos-to-jpg',
    title: "iPhone HEIC photos won't open on Windows? Convert to JPG",
    blurb: 'What HEIC is, why Windows will not open it, and how to fix it on the phone and on the PC.',
  },
  {
    slug: 'save-one-page-of-a-pdf',
    title: 'How to save just one page of a PDF',
    blurb: 'Print one page to a new PDF in a browser, drag it out in Preview, or copy the page without redrawing it.',
  },
  {
    slug: 'export-iphone-contacts-to-excel',
    title: 'How to export iPhone contacts to Excel for free',
    blurb: 'Export the vCard from Contacts or iCloud, then turn it into an Excel list with one row per contact.',
  },
  {
    slug: 'import-csv-contacts-into-iphone',
    title: 'How to import a CSV or Excel contact list into an iPhone',
    blurb: 'The iPhone reads vCard files, not CSV or Excel: tidy the sheet, make a .vcf, import it and check what came in.',
  },
  {
    slug: 'csv-opens-in-one-column-in-excel',
    title: 'CSV opens in one column in Excel: why and how to fix it',
    blurb: 'Why Excel puts a CSV in one column, and the five fixes plus the UTF-8 catch.',
  },
  {
    slug: 'import-csv-into-mysql-postgresql-sqlite',
    title: 'Load a CSV into MySQL, PostgreSQL or SQLite',
    blurb: 'The exact import commands for the three databases, and the INSERT fallback.',
  },
  {
    slug: 'combine-pdf-files',
    title: 'How to combine PDF files on Windows, Mac and iPhone',
    blurb: 'Preview on a Mac, Files on iPhone, and the browser route for Windows.',
  },
  {
    slug: 'make-a-favicon',
    title: 'How to make a favicon.ico from a PNG or SVG',
    blurb: 'The sizes browsers use, the file location, and the link tags to paste.',
  },
  {
    slug: 'open-webp-images',
    title: "Saved a WebP image you can't open? Convert it",
    blurb: 'Why websites save WebP, and how to get a JPG or PNG out of it.',
  },
  {
    slug: 'make-a-photo-smaller-to-email',
    title: 'How to make a photo smaller to email or upload',
    blurb: 'Pixel size first, quality second: the numbers that work for email, forms and websites.',
  },
  {
    slug: 'jpg-png-webp-or-avif',
    title: 'JPG, PNG, WebP or AVIF: which image format to use',
    blurb: 'What each format is good at, where it breaks, and a quick way to choose.',
  },
  {
    slug: 'open-json-in-excel-or-sheets',
    title: 'How to open a JSON file in Excel or Google Sheets',
    blurb: 'Why JSON is not a table, how flattening works, and three ways to get it into a sheet.',
  },
  {
    slug: 'are-online-file-converters-safe',
    title: 'Are online file converters safe for private files?',
    blurb: 'What happens to an uploaded file, which files deserve care, and how to check a site.',
  },
  {
    slug: 'excel-csv-leading-zeros',
    title: 'Excel removes leading zeros from a CSV: how to keep them',
    blurb: 'Why 02134 becomes 2134, how to stop it, and how to keep long ID numbers exact.',
  },
  {
    slug: 'csv-garbled-characters-excel',
    title: 'Why a CSV shows odd characters in Excel and how to fix it',
    blurb: 'Why Excel reads a UTF-8 CSV the wrong way, and how to open and save the file so the accents survive.',
  },
  {
    slug: 'add-page-numbers-to-pdf',
    title: 'How to add page numbers to a PDF without Acrobat',
    blurb: 'Why Reader and Preview cannot do it, and the free routes that work before and after export.',
  },
  {
    slug: 'photo-under-100kb-for-a-form',
    title: 'How to get a photo under 100 KB for an online form',
    blurb: 'Why a phone photo is far over the limit, and the resize then compress order that gets it under.',
  },
  {
    slug: 'import-spreadsheet-into-apple-calendar',
    title: 'How to import an Excel or CSV list into Apple Calendar',
    blurb: 'Why Calendar needs an .ics file, and how to convert a sheet and import it on a Mac, iPhone or Google Calendar.',
  },
  {
    slug: 'pdf-too-large-to-email',
    title: 'PDF too large to email? Ways to make it smaller',
    blurb: 'Why the attachment bounces, and the fixes in order: fewer pages, parts, a rebuilt scan, or a link.',
  },
  {
    slug: 'export-calendar-to-excel',
    title: 'How to export a Google or Outlook calendar to Excel',
    blurb: 'Get a calendar file from Google, Outlook or Apple Calendar, then turn its events into spreadsheet rows.',
  },
];
