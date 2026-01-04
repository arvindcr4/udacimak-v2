import dirTree from 'directory-tree';

interface Subtitle {
  default: boolean;
  src: string;
  srclang: string;
}

/**
 * Find the local subtitles files that are associated with given youtube video
 * @param filenameYoutube - Youtube file name
 * @param targetDir - directory of Youtube file
 * @returns subtitles
 */
export default function findVideoLocalSubtitles(filenameYoutube: string, targetDir: string): Subtitle[] {
  const subtitles: Subtitle[] = [];

  // find all subtitle files
  const allSubtitles = dirTree(targetDir, {
    extensions: /\.(vtt|srt|sbv|sub|mpsub|lrc|cap|smi|sami|rs|ttml|dfxp)$/,
  }) as {
    children?: Array<{
      extension?: string;
      name: string;
    }>;
  } | null;

  if (!allSubtitles || !allSubtitles.children) return subtitles;

  // find subtitle files of the given Youtube video filename
  for (let i = 0, len = allSubtitles.children.length; i < len; i += 1) {
    const subtitlesCurrent = allSubtitles.children[i];
    const {
      extension,
      name,
    } = subtitlesCurrent;
    if (name.includes(filenameYoutube)) {
      // get language code in file name
      const srclang = `${name.replace(extension as string || '', '').match(/[a-z]{2,3}$/i)}`;
      const _default = (srclang.toLowerCase() === 'en' || srclang.toLowerCase() === 'en-us');
      subtitles.push({
        default: _default,
        src: name,
        srclang,
      });
    }
  }

  return subtitles;
}
