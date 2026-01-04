import { notifyLatestVersion } from '../commands/utils';
import { logger } from '../commands/utils';

/**
 * Functions to run before executing a command
 */
export default async function preCli(): Promise<void> {
  try {
    await notifyLatestVersion();
  } catch (error) {
    // Version check failures are non-fatal but should be logged for debugging
    logger.debug(`Failed to check for latest version: ${error instanceof Error ? error.message : String(error)}`);
  }
}
