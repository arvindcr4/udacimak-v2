import dirTree from 'directory-tree';
import fs from 'fs';

/**
 * Delete all files in a directory. Sub-directory won't be deleted.
 * If file extension is provided, it'll only delete files of that type
 * @param dir - directory in which all files will be deleted
 * @param ext - file extension to delete
 */
export default function deleteFilesInFolder(dir: string, ext: string | null = null): void {
  const dt = dirTree(dir) as {
    children?: Array<{
      type?: string;
      extension?: string;
      path: string;
    }>;
  } | null;

  if (!dt || !dt.children || !dt.children.length) {
    return;
  }

  for (let i = 0, len = dt.children.length; i < len; i += 1) {
    const child = dt.children[i];
    if (child.type === 'file') {
      if (ext) {
        (child.extension === `.${ext}`) && fs.unlinkSync(child.path);
      } else {
        fs.unlinkSync(child.path);
      }
    }
  }
}
