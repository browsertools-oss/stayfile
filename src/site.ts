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
  | 'img-to-pdf'
  | 'img-convert'
  | 'img-compress'
  | 'img-resize'
  | 'csv-to-json'
  | 'json-to-csv'
  | 'csv-to-xlsx';

export type Group = 'PDF' | 'Images' | 'Spreadsheets and data';

export interface Preset {
  split?: 'extract' | 'ranges' | 'every';
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
    card: 'Merge PDF',
    blurb: 'Combine several PDFs into one file',
    title: 'Merge PDF files online without uploading them',
    h1: 'Merge PDF files',
    lede: 'Put several PDFs into one file in the order you choose. The merging happens in your browser, so the documents stay on your computer.',
    description: 'Combine PDF files into one document in your browser. Drag to set the order, then download. Nothing is uploaded and there is no sign-up.',
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
    card: 'Split PDF',
    blurb: 'Break a PDF into several files',
    preset: { split: 'ranges' },
    title: 'Split a PDF into separate files online',
    h1: 'Split a PDF',
    lede: 'Cut one PDF into several smaller ones, either by page ranges you type or one file per page. You get a zip when there is more than one file.',
    description: 'Split a PDF by page ranges or into single pages, right in your browser. Your file is not uploaded. Download the parts as a zip.',
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
    tool: 'pdf-split',
    group: 'PDF',
    card: 'Extract PDF pages',
    blurb: 'Save only the pages you need',
    preset: { split: 'extract' },
    title: 'Extract pages from a PDF online and save them as a new PDF',
    h1: 'Extract pages from a PDF',
    lede: 'Pick the pages you need and save them as a new, smaller PDF. You can also use this to reorder or drop pages.',
    description: 'Save selected pages of a PDF as a new file. Type pages like 1, 3, 7-9 and download. Works in your browser with no upload.',
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
    slug: 'rotate-pdf',
    tool: 'pdf-rotate',
    group: 'PDF',
    card: 'Rotate PDF',
    blurb: 'Turn sideways or upside-down pages',
    title: 'Rotate PDF pages online and save the result',
    h1: 'Rotate PDF pages',
    lede: 'Turn every page, or only the ones that came out of the scanner sideways, and save the PDF that way for good.',
    description: 'Rotate all pages or selected pages of a PDF by 90 or 180 degrees and save it. Runs in your browser, so the file is not uploaded.',
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
    slug: 'jpg-to-pdf',
    tool: 'img-to-pdf',
    group: 'PDF',
    card: 'Images to PDF',
    blurb: 'Turn JPG or PNG images into a PDF',
    title: 'JPG to PDF: convert images to a PDF online',
    h1: 'Convert images to PDF',
    lede: 'Make one PDF from photos or scans, one image per page. Works with JPG, PNG, WebP and GIF, and you choose the page size.',
    description: 'Turn JPG, PNG or WebP images into a single PDF with one image per page. Pick A4, Letter or image size. Nothing is uploaded.',
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
        a: 'Most browsers cannot open HEIC files, so they may not work here. On an iPhone you can have the camera save JPG instead under Settings, Camera, Formats, Most Compatible.',
      },
      PRIVATE,
    ],
  },

  // ---------- Images ----------
  {
    slug: 'convert-image',
    tool: 'img-convert',
    group: 'Images',
    card: 'Convert image',
    blurb: 'Switch between JPG, PNG, WebP and AVIF',
    title: 'Image converter: JPG, PNG, WebP and AVIF online',
    h1: 'Convert images',
    lede: 'Change images between JPG, PNG, WebP and AVIF. Convert one file or a whole batch, with a quality setting for the formats that use one.',
    description: 'Convert images between JPG, PNG, WebP and AVIF in your browser. Batch conversion, adjustable quality, and no uploads.',
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
    slug: 'webp-to-jpg',
    tool: 'img-convert',
    group: 'Images',
    card: 'WebP to JPG',
    blurb: 'Open WebP images anywhere',
    preset: { out: 'image/jpeg', accept: 'image/webp,.webp' },
    title: 'WebP to JPG converter: save WebP images as JPG',
    h1: 'Convert WebP to JPG',
    lede: 'Images saved from websites often come down as WebP, which some apps still refuse to open. Turn them into ordinary JPG files.',
    description: 'Convert WebP images to JPG so they open in any app. Batch convert in your browser with no upload and no sign-up.',
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
    group: 'Images',
    card: 'HEIC to JPG',
    blurb: 'Turn iPhone photos into JPG',
    preset: { out: 'image/jpeg', accept: 'image/heic,image/heif,.heic,.heif' },
    title: 'HEIC to JPG converter for iPhone photos',
    h1: 'Convert HEIC to JPG',
    lede: "iPhones save photos as HEIC, which many Windows apps and upload forms won't open. Turn them into ordinary JPG files, one photo or a whole batch.",
    description: 'Convert iPhone HEIC photos to JPG in your browser, one at a time or in a batch. Your photos are never uploaded.',
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
    slug: 'jpg-to-webp',
    tool: 'img-convert',
    group: 'Images',
    card: 'JPG to WebP',
    blurb: 'Lighter images for your website',
    preset: { out: 'image/webp' },
    title: 'Convert JPG and PNG to WebP online',
    h1: 'Convert images to WebP',
    lede: 'WebP files are often a quarter to a third smaller than JPG at about the same quality, which makes web pages load faster.',
    description: 'Convert JPG and PNG images to WebP in your browser. Batch convert, set the quality, and download a zip. Nothing is uploaded.',
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
    group: 'Images',
    card: 'Compress image',
    blurb: 'Shrink photos for email and upload forms',
    title: 'Compress images online: make JPG, PNG and WebP smaller',
    h1: 'Compress images',
    lede: 'Make photos small enough for an email, an upload form or a website. You see the new size before you download, and the original is never changed.',
    description: 'Reduce the file size of JPG, PNG and WebP images in your browser. Set quality and maximum width, compare sizes, and save. No upload.',
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
    slug: 'resize-image',
    tool: 'img-resize',
    group: 'Images',
    card: 'Resize image',
    blurb: 'Set exact pixel sizes or a percentage',
    title: 'Resize images online by pixels or percentage',
    h1: 'Resize images',
    lede: 'Change the width and height of one image or many. Type exact pixels or a percentage, and the proportions stay locked unless you unlock them.',
    description: 'Resize JPG, PNG and WebP images to exact pixel dimensions or a percentage, in batches, right in your browser. Files are not uploaded.',
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
    slug: 'json-to-csv',
    tool: 'json-to-csv',
    group: 'Spreadsheets and data',
    card: 'JSON to CSV',
    blurb: 'Open JSON data in a spreadsheet',
    title: 'JSON to CSV converter online',
    h1: 'Convert JSON to CSV',
    lede: 'Turn a JSON array, an API response or JSON Lines into a CSV file that opens in Excel, Numbers or Google Sheets. Nested fields get their own columns.',
    description: 'Convert JSON to CSV in your browser. Flattens nested objects into columns and accepts JSON Lines. Nothing leaves your device.',
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
    slug: 'csv-to-excel',
    tool: 'csv-to-xlsx',
    group: 'Spreadsheets and data',
    card: 'CSV to Excel',
    blurb: 'Save a CSV as a real .xlsx workbook',
    title: 'CSV to Excel converter: save CSV as XLSX online',
    h1: 'Convert CSV to Excel',
    lede: 'Save a CSV as a proper .xlsx workbook. Numbers are stored as numbers, so you can sum and sort them as soon as the file opens in Excel.',
    description: 'Convert CSV files to Excel .xlsx in your browser. Handles commas, semicolons and tabs and keeps numbers as numbers. No upload.',
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
];

export const GROUPS: Group[] = ['PDF', 'Images', 'Spreadsheets and data'];

// Anchor ids on the home page and short labels for the header nav.
export const GROUP_ID: Record<Group, string> = { PDF: 'pdf', Images: 'images', 'Spreadsheets and data': 'data' };
export const GROUP_SHORT: Record<Group, string> = { PDF: 'PDF', Images: 'Images', 'Spreadsheets and data': 'Data' };
