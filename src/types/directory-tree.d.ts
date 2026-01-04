declare module 'directory-tree' {
  interface DirectoryTree {
    path: string;
    name: string;
    children?: DirectoryTree[];
    size: number;
    type?: string;
    extension?: string;
  }

  interface DirectoryTreeOptions {
    exclude?: RegExp;
    extensions?: RegExp | string[];
    attributes?: string[];
    depth?: number;
  }

  function directoryTree(
    path: string,
    options?: DirectoryTreeOptions,
    onEachFile?: (item: DirectoryTree) => void
  ): DirectoryTree | null;

  export default directoryTree;
}
