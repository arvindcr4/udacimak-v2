import {
  createHtmlVideo,
} from '../utils';
import type { UdacityVideoAtom } from '../../../../types/udacity-api';

/**
 * Create HTML content for VideoAtom
 * @param atom - atom json
 * @param outputPath - path to save the assets folder for videos
 * @param prefix - prefix for file name
 * @returns HTML content
 */
export default async function createHtmlVideoAtom(
  atom: UdacityVideoAtom,
  outputPath: string,
  prefix: string
): Promise<string> {
  // create directory for video assets
  const pathVideo = outputPath;

  try {
    const html = await createHtmlVideo(
      atom.video.youtube_id || '',
      pathVideo,
      prefix,
      atom.title
    );

    return html;
  } catch (error) {
    throw error;
  }
}
