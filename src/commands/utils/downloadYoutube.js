import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import ytdl from 'yt-dlp-exec';
import {
  downloadYoutubeSubtitles,
  filenamify,
  findVideoLocalSubtitles,
  logger,
} from '.';


/**
 * Download youtube video and save locally
 * @param {string} videoId Youtube video id to construct download url
 * @param {string} outputPath directory to save the file
 * @param {string} prefix file prefix
 * @param {string} title title of atom
 * @param {string} format quality setting (eg. best)
 */
export default async function downloadYoutube(videoId, outputPath, prefix, title) {
  if (!videoId) {
    return null;
  }

  const filenameBase = `${prefix}. ${filenamify(title || '')}-${videoId}`;
  const filenameYoutube = `${filenameBase}.mp4`;
  const savePath = path.join(outputPath, filenameYoutube);

  // avoid re-downloading videos if it already exists
  if (fs.existsSync(savePath)) {
    logger.info(`Video already exists. Skip downloading ${savePath}`);
    const subtitles = findVideoLocalSubtitles(filenameBase, outputPath);
    return {
      src: filenameYoutube,
      subtitles,
    };
  }

  // try different quality formats - using worst quality for speed
  const ytVideoQualities = [
    'worst',
  ];

  for (let i = 0; i < ytVideoQualities.length; i += 1) {
    try {
      // eslint-disable-next-line no-use-before-define
      const dlPromise = await downloadYoutubeHelper(
        videoId,
        outputPath,
        prefix,
        title,
        ytVideoQualities[i],
      );
      return dlPromise;
    } catch (error) {
      if (i < ytVideoQualities.length - 1) {
        logger.error(`Failed to download youtube video with id ${videoId} with quality="${ytVideoQualities[i]}", retrying with quality="${ytVideoQualities[i + 1]}"`);
      } else {
        const { message } = error;

        if (!message) {
          throw error;
        }

        // handle various error messages
        const errorMsg = String(message).toLowerCase();
        if (errorMsg.includes('unavailable') || errorMsg.includes('removed')) {
          const err = new Error(`Youtube video ${videoId} is unavailable. It may have been deleted.`);
          err.code = 'VIDEO_UNAVAILABLE';
          err.videoId = videoId;
          throw err;
        }
        if (errorMsg.includes('sign in') || errorMsg.includes('private')) {
          const err = new Error(`Youtube video ${videoId} is private and cannot be downloaded.`);
          err.code = 'VIDEO_PRIVATE';
          err.videoId = videoId;
          throw err;
        }
        const err = new Error(`Youtube video ${videoId} download failed: ${message}`);
        err.code = 'VIDEO_DOWNLOAD_FAILED';
        err.videoId = videoId;
        err.originalError = error;
        throw err;
      }
    }
  }

  return null;
}

async function downloadYoutubeHelper(videoId, outputPath, prefix, title, format) {
  const filenameBase = `${prefix}. ${filenamify(title || '')}-${videoId}`;
  const filenameYoutube = `${filenameBase}.mp4`;
  const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;
  const tempPath = path.join(outputPath, `.${filenameYoutube}`);
  const savePath = path.join(outputPath, filenameYoutube);

  let timeout = 0;

  // calculate amount of time to wait before starting this next Youtube download
  if (global.previousYoutubeTimestamp) {
    const timeGap = Date.now() - global.previousYoutubeTimestamp;
    const delayYoutube = (global.delayYoutube || 0) * 1000;

    if (timeGap > 0 && timeGap <= delayYoutube) {
      timeout = delayYoutube - timeGap;
    }
  }

  // delay to avoid Youtube from detecting automated usage
  if (timeout > 0) {
    const timeoutSeconds = parseFloat(timeout / 1000).toFixed(1);
    const spinnerDelayYoutube = ora(`Delaying Youtube download for further ${timeoutSeconds} seconds`).start();
    await new Promise((resolveWait) => {
      setTimeout(() => {
        spinnerDelayYoutube.stop();
        resolveWait();
      }, timeout);
    });
  }

  const spinnerInfo = ora(`Getting Youtube video (id=${videoId}) with quality="${format}"`).start();

  try {
    // download using yt-dlp
    const ytdlOptions = {
      output: tempPath,
      format: format || 'best',
      noWarnings: true,
      noCallHome: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
    };
    // Only add verbose if true (yt-dlp doesn't support --no-verbose)
    if (global.ytVerbose) {
      ytdlOptions.verbose = true;
    }
    await ytdl(urlYoutube, ytdlOptions);

    spinnerInfo.succeed();

    // rename temp file to final file name
    await fs.rename(tempPath, savePath);
    logger.info(`Downloaded video ${filenameYoutube} with quality="${format}"`);

    let subtitles = [];
    if (global.downloadYoutubeSubtitles) {
      try {
        subtitles = await downloadYoutubeSubtitles(videoId, filenameBase, outputPath);
      } catch (error) {
        // Subtitle download failures should be logged but don't fail the entire video download
        logger.error(`Failed to download subtitles for video ${videoId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    global.previousYoutubeTimestamp = Date.now();

    return {
      src: filenameYoutube,
      subtitles,
    };
  } catch (error) {
    spinnerInfo.fail();

    // clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
      await fs.remove(tempPath);
    }

    throw error;
  }
}
