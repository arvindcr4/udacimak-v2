import path from 'path';
import {
  downloadImage,
  makeDir,
} from '.';

// Use require for cheerio to avoid Babel transpilation issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cheerio = require('cheerio');

interface MediaLink {
  i: number;
  type: 'video' | 'img';
  src: string;
}

/**
 * Find media links in given HTML text and download them
 * @param html - HTML content as string
 * @param targetDir - target directory path
 * @param atomId - id of atom or label
 * @returns Promise<string> - Modified HTML with local media paths
 */
export default async function downloadMediaInHtml(
  html: string,
  targetDir: string,
  atomId: string
): Promise<string> {
  if (!html) return html;

  // find if there are videos / images need to be downloaded
  const $ = cheerio.load(html);
  const videos = $('video source');
  const images = $('img');

  // save links to download video / images
  const links: MediaLink[] = [];

  if (videos && videos.length) {
    videos.each((i: number, video: any) => {
      links.push({
        i,
        type: 'video',
        src: video.attribs.src,
      });
    });
  }

  if (images && images.length) {
    images.each((i: number, image: any) => {
      links.push({
        i,
        type: 'img',
        src: image.attribs.src,
      });
    });
  }

  if (!links.length) return html;

  const pathMedia = makeDir(targetDir, 'media');

  try {
    // loop and download all media links
    for (let j = 0, len = links.length; j < len; j += 1) {
      const link = links[j];
      const { i, type, src } = link;

      // since these src values may contain a link, but won't return a proper filename
      // manually create the file name
      let extension: string | null = null;

      if (src) {
        extension = path.extname(src);
      }

      let filename: string;
      if (!extension) {
        // provide extension if it's not in the url
        extension = (type === 'video') ? '.mp4' : '.gif';
        // generate file name with atom id and i (index of links array)
        filename = `unnamed-${atomId}-${i}${extension}`;
      } else {
        // Use the original filename from the URL
        filename = path.basename(src);
      }

      const filenameImg = await downloadImage(src, pathMedia, filename);
      html = html.replace(src, `media/${filenameImg}`);
    } //.for links

    return html;
  } catch (error) {
    throw error;
  }
}
