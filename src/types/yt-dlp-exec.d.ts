declare module 'yt-dlp-exec' {
  interface YtDlpOptions {
    output?: string;
    format?: string;
    noWarnings?: boolean;
    noCallHome?: boolean;
    noCheckCertificates?: boolean;
    preferFreeFormats?: boolean;
    verbose?: boolean;
    [key: string]: any;
  }

  function ytdl(url: string, options?: YtDlpOptions): Promise<any>;

  export = ytdl;
}
