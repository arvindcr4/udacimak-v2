/* eslint-disable camelcase */
import https from 'https';
import axios from 'axios';
import _cliProgress from 'cli-progress';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import {
  addHttp,
  filenamify,
  logger,
} from '.';


/**
 * Download media file and save it as image assets
 * @param uri - URI of image
 * @param outputDir - output directory path
 * @param filename - optional file name parameter
 * @returns filename or empty string on error
 */
export default async function downloadImage(
  uri: string,
  outputDir: string,
  filename?: string
): Promise<string> {
  const errorCheck = `Please double-check the url from the JSON data to see if the link is really broken.
If it is, it could be a broken link that Udacity hasn't fixed and you can ignore this error message.
If the link was temporary broken and is up again when you check, please re-run the render to make sure the media file will be downloaded.
`;

  if (!uri) {
    return '';
  }

  // add https protocol to url if missing
  uri = addHttp(uri);

  if (!filename) {
    filename = path.basename(uri);
  }
  filename = filenamify(filename);

  const savePath = path.join(outputDir, filename);
  const tempPath = path.join(outputDir, `.${filename}`);

  // avoid re-downloading images if it already exists
  if (fs.existsSync(savePath)) {
    logger.info(`Image already exists. Skip downloading ${savePath}`);
    return filename;
  }

  const spinner = ora(`Download media file ${filename}`).start();
  const headers = {
    Origin: 'https://classroom.udacity.com',
    Referer: 'https://classroom.udacity.com/me',
  };

  try {
    const response = await axios({
      method: 'GET',
      url: uri,
      headers,
      responseType: 'stream',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    if (response.status === 500) {
      spinner.fail();
      logger.error(`Error Status 500: Request for media file fails!
The url ${uri} returns Internal Server Error.
${errorCheck}`);
      return '';
    }

    const totalLength = parseInt(response.headers['content-length'], 10);
    const progressBar = totalLength
      ? new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic)
      : null;
    let downloadedLength = 0;

    if (progressBar && totalLength) {
      progressBar.start(totalLength, 0);
    }

    response.data.on('data', (chunk: Buffer) => {
      downloadedLength += chunk.length;
      if (progressBar && totalLength) {
        progressBar.update(downloadedLength);
      }
    });

    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', () => resolve());
      writer.on('error', reject);
    });

    // rename temp file to proper file name when finish
    await fs.promises.rename(tempPath, savePath);

    spinner.succeed();
    if (progressBar) {
      progressBar.stop();
    }
    logger.info(`Downloaded media file ${filename}`);
    return filename;
  } catch (error) {
    spinner.fail();

    if (error instanceof Error && 'code' in error && error.code === 'ENOTFOUND') {
      logger.error(`${error.code}: Request for media file fails!
The url ${uri} doesn't seem to exist.
${errorCheck}`);
      return '';
    }
    throw error;
  }
}
