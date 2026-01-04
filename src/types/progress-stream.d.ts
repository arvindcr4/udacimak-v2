declare module 'progress-stream' {
  import { Stream } from 'stream';

  interface ProgressStreamOptions {
    length?: number;
    time?: number;
    speed?: number;
    drain?: boolean;
    objectMode?: boolean;
  }

  interface ProgressStream extends Stream {
    length: number;
    progress: number;
    speed: number;
    eta: number;
    transferred: number;
    remaining: number;
  }

  function progressStream(options?: ProgressStreamOptions): ProgressStream;

  export = progressStream;
}
