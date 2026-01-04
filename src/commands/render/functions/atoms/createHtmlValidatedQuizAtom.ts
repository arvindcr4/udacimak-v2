/* eslint-disable camelcase */
import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { createHtmlText } from '../utils';
import type { UdacityValidatedQuizAtom } from '../../../../types/udacity-api';

/**
 * Create HTML content for ValidatedQuizAtom
 * @param atom - atom json
 * @param targetDir - output directory path
 * @returns HTML content
 */
export default async function createHtmlValidatedQuizAtom(
  atom: UdacityValidatedQuizAtom,
  targetDir: string
): Promise<string> {
  const prompt = await createHtmlText(atom.question.prompt || '', targetDir, atom.id);
  const matchers: string[] = [];

  const matchersArray = atom.question.matchers || [];
  for (let i = 0, len = matchersArray.length; i < len; i += 1) {
    const matcher = matchersArray[i];
    matchers.push(matcher.expression);
  }

  const html = await loadTemplate('atom.validatedQuiz');
  const template = Handlebars.compile(html);
  const data = {
    prompt,
    matchers,
  };

  return template(data);
}
