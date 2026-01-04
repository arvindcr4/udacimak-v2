#!/usr/bin/env node
import {
  renderCourse,
} from './functions';
import {
  getFullErrorMessage,
  logger,
} from '../utils';

/**
 *
 * @param path - path to source JSON files of a course/nanodegree
 * @param targetDir - target directory to save the contents
 */
export default async function render(path: string, targetDir: string): Promise<void> {
  try {
    await renderCourse(path, targetDir);
  } catch (error) {
    logger.error(getFullErrorMessage(error));
  }
}
