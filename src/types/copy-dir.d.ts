declare module 'copy-dir' {
  interface CopyDirFunction {
    (from: string, to: string, options?: (status: string, filepath: string, outputDir: string) => void): void;
    sync(from: string, to: string, options?: (status: string, filepath: string, outputDir: string) => void): void;
  }

  const copyDir: CopyDirFunction;
  export = copyDir;
}
