import Handlebars from 'handlebars';
import {
  createHtmlText,
} from '../utils';
import { loadTemplate } from '../templates';
import type { UdacityTextAtom } from '../../../../types/udacity-api';

/**
 * Create HTML content for TextAtom
 * @param atom - atom json
 * @param outputPath - path to save the assets
 * @returns HTML content
 */
export default async function createHtmlTextAtom(
  atom: UdacityTextAtom,
  outputPath: string
): Promise<string> {
  const text = await createHtmlText(atom.text, outputPath, atom.id);

  const html = await loadTemplate('atom.text');
  const data = {
    text,
  };
  const template = Handlebars.compile(html);
  return template(data);
}
