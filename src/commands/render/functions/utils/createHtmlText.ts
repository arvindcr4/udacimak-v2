import {
  downloadMediaInHtml,
  markdownToHtml,
} from '../../../utils';

/**
 * Convert markdown text to HTML and find media links in the text to download
 * @param text - markdown text
 * @param targetDir - target directory to pass to downloadMediaInHtml to save the file
 * @param label - to label the media file
 */
export default async function createHtmlText(
  text: string,
  targetDir: string,
  label: string
): Promise<string> {
  let html = markdownToHtml(text);
  html = await downloadMediaInHtml(html, targetDir, label);

  return html;
}
