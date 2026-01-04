import fs from 'fs';
import _path from 'path';

/**
 * Create directory or use existing one
 * @param path - directory path to create new directory
 * @param dirname - new directory name
 * @returns full new directory path
 */
export default function makeDir(path: string, dirname: string): string {
  const fullPath = _path.join(path.trim(), dirname.trim());

  try {
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  } catch (err) {
    throw err;
  }

  return fullPath;
}
