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
import { state, setState } from '../../state/CommandLineState';

interface VideoResult {
  src: string;
  subtitles: Array<{ src: string; srclang: string; default: boolean }>;
}

// Use centralized state management instead of globals

/**
 * Download youtube video and save locally
 * @param videoId - Youtube video id to construct download url
 * @param outputPath - directory to save the file
 * @param prefix - file prefix
 * @param title - title of atom
 * @returns Promise<VideoResult | null> - Video result with filename and subtitles
 */
export default async function downloadYoutube(
  videoId: string,
  outputPath: string,
  prefix: string,
  title: string
): Promise<VideoResult | null> {
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
        const err = error as Error & { code?: string; videoId?: string; message?: string };

        if (!err.message) {
          throw error;
        }

        // handle various error messages
        const errorMsg = String(err.message).toLowerCase();
        if (errorMsg.includes('unavailable') || errorMsg.includes('removed')) {
          const newError = new Error(`Youtube video ${videoId} is unavailable. It may have been deleted.`) as Error & { code?: string; videoId?: string };
          newError.code = 'VIDEO_UNAVAILABLE';
          newError.videoId = videoId;
          throw newError;
        }
        if (errorMsg.includes('sign in') || errorMsg.includes('private')) {
          const newError = new Error(`Youtube video ${videoId} is private and cannot be downloaded.`) as Error & { code?: string; videoId?: string };
          newError.code = 'VIDEO_PRIVATE';
          newError.videoId = videoId;
          throw newError;
        }
        const newError = new Error(`Youtube video ${videoId} download failed: ${err.message}`) as Error & { code?: string; videoId?: string; originalError?: unknown };
        newError.code = 'VIDEO_DOWNLOAD_FAILED';
        newError.videoId = videoId;
        (newError as any).originalError = error;
        throw newError;
      }
    }
  }

  return null;
}

async function downloadYoutubeHelper(
  videoId: string,
  outputPath: string,
  prefix: string,
  title: string,
  format: string
): Promise<VideoResult> {
  const filenameBase = `${prefix}. ${filenamify(title || '')}-${videoId}`;
  const filenameYoutube = `${filenameBase}.mp4`;
  const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;
  const tempPath = path.join(outputPath, `.${filenameYoutube}`);
  const savePath = path.join(outputPath, filenameYoutube);

  let timeout = 0;

  // calculate amount of time to wait before starting this next Youtube download
  if (state.previousYoutubeTimestamp) {
    const timeGap = Date.now() - state.previousYoutubeTimestamp;
    const delayYoutubeMs = state.delayYoutube * 1000;

    if (timeGap > 0 && timeGap <= delayYoutubeMs) {
      timeout = delayYoutubeMs - timeGap;
    }
  }

  // delay to avoid Youtube from detecting automated usage
  if (timeout > 0) {
    const timeoutSeconds = parseFloat((timeout / 1000).toFixed(1));
    const spinnerDelayYoutube = ora(`Delaying Youtube download for further ${timeoutSeconds} seconds`).start();
    await new Promise<void>((resolveWait) => {
      setTimeout(() => {
        spinnerDelayYoutube.stop();
        resolveWait();
      }, timeout);
    });
  }

  const spinnerInfo = ora(`Getting Youtube video (id=${videoId}) with quality="${format}"`).start();

  try {
    // download using yt-dlp
    const ytdlOptions: Record<string, any> = {
      output: tempPath,
      format: format || 'best',
      noWarnings: true,
      noCallHome: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
    };
    // Only add verbose if true (yt-dlp doesn't support --no-verbose)
    if (state.ytVerbose) {
      ytdlOptions.verbose = true;
    }
    await ytdl(urlYoutube, ytdlOptions);

    spinnerInfo.succeed();

    // rename temp file to final file name
    await fs.rename(tempPath, savePath);
    logger.info(`Downloaded video ${filenameYoutube} with quality="${format}"`);

    let subtitles: Array<{ src: string; srclang: string; default: boolean }> = [];
    if (state.downloadYoutubeSubtitles) {
      try {
        subtitles = await downloadYoutubeSubtitles(videoId, filenameBase, outputPath) || [];
      } catch (error) {
        // Subtitle download failures should be logged but don't fail the entire video download
        logger.error(`Failed to download subtitles for video ${videoId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    setState.previousYoutubeTimestamp = Date.now();

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
