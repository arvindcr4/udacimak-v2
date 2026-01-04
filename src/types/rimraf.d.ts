declare module 'rimraf' {
  function rimraf(path: string, callback: (err: Error | null) => void): void;
  namespace rimraf {
    function sync(path: string): void;
  }
  export = rimraf;
}
