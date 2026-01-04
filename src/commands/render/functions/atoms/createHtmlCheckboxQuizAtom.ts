import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { createHtmlText } from '../utils';
import type { UdacityCheckboxQuizAtom } from '../../../../types/udacity-api';

/**
 * Create HTML content for CheckboxQuizAtom
 * @param atom - atom json
 * @param targetDir - output directory path
 * @returns HTML content
 */
export default async function createHtmlCheckboxQuizAtom(
  atom: UdacityCheckboxQuizAtom,
  targetDir: string
): Promise<string> {
  const prompt = await createHtmlText(atom.question.prompt || '', targetDir, atom.id);

  const answers: Array<{ id: string; name: string; text: string }> = [];
  const solution: Array<{ id: string }> = [];
  for (let i = 0, len = atom.question.answers.length; i < len; i += 1) {
    const answer = atom.question.answers[i];
    const { id } = answer;
    const text = await createHtmlText(answer.text || '', targetDir, atom.id);
    const isCorrect = answer.is_correct;

    // if this is the correct answer, add to solution
    if ('is_correct' in answer && isCorrect !== null && isCorrect === true) {
      solution.push(answer);
    }

    answers.push({
      id,
      name: atom.id,
      text,
    });
  }

  const html = await loadTemplate('atom.checkboxQuiz');
  const dataTemplate = {
    answers,
    solution,
    prompt,
  };
  const template = Handlebars.compile(html);
  return template(dataTemplate);
}
