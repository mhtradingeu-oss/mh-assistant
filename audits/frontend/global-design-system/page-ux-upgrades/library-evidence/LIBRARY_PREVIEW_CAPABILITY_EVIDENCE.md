# Library Preview Capability Evidence

## User-observed issue

Some file types do not preview well in Library, especially Excel and text/document-like files.

## Preview requirement

Library should provide a professional preview experience for:
- image files
- video files
- audio files
- PDF files
- text-like files
- CSV/JSON/Markdown/text files where safe
- Office files such as DOC/DOCX/XLS/XLSX/PPT/PPTX through a polished fallback if inline preview is not supported
- unknown file types through a clear fallback

## Safety boundary

- Do not change backend protected preview behavior.
- Do not change upload/source/status/reclassify/rename/archive/delete behavior.
- Do not add unsafe external document viewers.
- Do not expose protected file paths unsafely.
- If inline preview is not supported, show professional fallback actions instead.
