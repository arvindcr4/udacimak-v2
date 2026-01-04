/**
 * Extract file extension from file name
 * @param filename - file name
 * @returns The file extension
 */
export default function getFileExt(filename: string): string {
  // wrap in string literal to get string out of string.match()
  return `${filename.match(/\.[^\.]+\.[^\.]+$/i)}`;
}
