declare module 'serialize-error' {
  function serializeError(error: Error): object;

  export = serializeError;
}
