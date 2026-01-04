import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import ytdl from 'yt-dlp-exec';

interface SubtitleTrack {
  src: string;
  srclang: string;
  default: boolean;
}

/**
 * Download Youtube subtitles and rename them to be the same as Youtube video
 * file name
 * @param videoId - Youtube Video Id
 * @param filenameYoutube - Youtube filename (without extension)
 * @param targetDir - target directory path
 * @returns Promise<SubtitleTrack[] | null> - Array of subtitle tracks or null if no video ID
 */
export default async function downloadYoutubeSubtitles(
  videoId: string,
  filenameYoutube: string,
  targetDir: string
): Promise<SubtitleTrack[] | null> {
  if (!videoId || !videoId.trim()) {
    return null;
  }

  const spinnerSubtitles = ora(`Download subtitles for ${filenameYoutube}`).start();
  const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // Use yt-dlp to download subtitles
    await ytdl(urlYoutube, {
      skipDownload: true,
      writeSub: true,
      writeAutoSub: true,
      subLang: 'en',
      subtitlesFormat: 'vtt',
      output: path.join(targetDir, `${filenameYoutube}.%(ext)s`),
      cwd: targetDir,
    });

    // Find and rename downloaded subtitle files
    const files = fs.readdirSync(targetDir);
    const subtitles: SubtitleTrack[] = [];

    files.forEach((file) => {
      // Look for subtitle files matching our video
      if (file.startsWith(filenameYoutube) && (file.endsWith('.vtt') || file.endsWith('.srt'))) {
        // Extract language code from filename
        // Expected format: filenameYoutube.lang.vtt or filenameYoutube.vtt
        const match = file.match(/\.([a-z]{2,3}(-[a-z]{2,3})?)\.(vtt|srt)$/i);
        const langCode = match ? match[1] : 'en';

        subtitles.push({
          src: file,
          srclang: langCode,
          default: (langCode.toLowerCase() === 'en' || langCode.toLowerCase() === 'en-us'),
        });
      }
    });

    spinnerSubtitles.succeed();
    return subtitles;
  } catch (error) {
    spinnerSubtitles.fail();
    throw new Error(`Failed to download subtitles for ${filenameYoutube} with error:\n${error instanceof Error ? error.message : String(error)}\n`);
  }
}
