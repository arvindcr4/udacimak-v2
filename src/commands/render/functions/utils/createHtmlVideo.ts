import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { downloadYoutube } from '../../../utils';

interface VideoResult {
  src: string;
  subtitles?: Array<{
    default: boolean;
    src: string;
    srclang: string;
  }>;
}

/**
 * Download youtube video and and create HTML for it
 * @param videoId - Youtube video id to construct download url
 * @param outputPath - directory to save the file
 * @param prefix - file prefix
 * @param title - title of atom
 */
export default async function createHtmlVideo(
  videoId: string,
  outputPath: string,
  prefix: string,
  title: string
): Promise<string> {
  let video: VideoResult | null;
  try {
    video = await downloadYoutube(videoId, outputPath, prefix, title);
  } catch (error) {
    throw error;
  }

  if (!video) return '';

  const html = await loadTemplate('atom.video');
  const data = {
    video,
  };
  const template = Handlebars.compile(html);
  return template(data);
}
