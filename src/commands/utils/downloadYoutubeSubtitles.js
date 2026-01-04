import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import ytdl from 'yt-dlp-exec';


/**
 * Download Youtube subtitles and rename them to be the same as Youtube video
 * file name
 * @param {string} videoId Youtube Video Id
 * @param {string} filenameYoutube Youtube filename (without extension)
 * @param {string} targetDir target directory
 */
export default async function downloadYoutubeSubtitles(videoId, filenameYoutube, targetDir) {
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
    const subtitles = [];

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
    throw new Error(`Failed to download subtitles for ${filenameYoutube} with error:\n${error.message}\n`);
  }
}
