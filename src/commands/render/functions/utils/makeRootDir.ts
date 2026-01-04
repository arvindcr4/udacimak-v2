import copydir from 'copy-dir';
import path from 'path';
import rimraf from 'rimraf';
import {
  makeDir,
} from '../../../utils';

/**
 * Create the root folder for the course
 * and copy CSS, JS assets to a folder
 * @param outpath - Path to put the course content
 * @param courseName - Name of the course
 * @returns path to the course folder
 */
export default function makeRootDir(outpath: string, courseName: string): string {
  // create root folder
  const dirRoot = makeDir(outpath, courseName);
  const dirAsset = makeDir(dirRoot, 'assets');

  // remove dirAsset first if exist
  rimraf.sync(dirAsset);
  // copy CSS, JS assets to target folder
  try {
    const dirAssetSource = path.join(__dirname, '/../../templates/assets/');
    copydir.sync(dirAssetSource, dirAsset);
  } catch (error) {
    throw error;
  }
  return dirRoot;
}
