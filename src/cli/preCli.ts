import { notifyLatestVersion } from '../commands/utils';

/**
 * Functions to run before executing a command
 */
export default async function preCli(): Promise<void> {
  try {
    await notifyLatestVersion();
  } catch (error) {
    // Do nothing
  }
}
