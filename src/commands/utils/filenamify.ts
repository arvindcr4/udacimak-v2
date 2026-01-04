import _filenamify from 'filenamify';

interface FilenamifyOptions {
  replacement?: string;
}

/**
 * Rename file name to be valid by removing special characters
 * @param filename - file name
 * @param option - filenamify options
 * @returns valid file name
 */
export default function filenamify(filename: string, option?: FilenamifyOptions): string {
  if (!option) {
    option = {
      replacement: '',
    };
  }

  return _filenamify(filename, option);
}
