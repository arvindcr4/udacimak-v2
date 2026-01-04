import serializeError from 'serialize-error';

/**
 * Serialize error object and construct error message that shows all
 * error information
 * @param error - Node error object
 * @returns error message
 */
export default function getFullErrorMessage(error: Error | unknown): string {
  const _error = serializeError(error as Error);
  let str = '';

  const {
    name, code, message, stack,
  } = _error as Record<string, unknown>;

  if (name) str += `${(name as string).toUpperCase()}: `;

  if (message) str += `${message as string}\n`;

  if (code) str += `CODE: ${code as string}\n`;

  if (stack) str += `STACK: ${stack as string}`;

  return str || JSON.stringify(error, null, 4) || String(error);
}
