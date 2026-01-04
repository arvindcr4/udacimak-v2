/* eslint-disable camelcase */
import Handlebars from 'handlebars';
import { loadTemplate } from '../../templates';
import type { UdacityQuizAtom } from '../../../../../types/udacity-api';

interface CodeFile {
  active: string;
  id: string;
  isSelected: boolean;
  name: string;
  text: string;
}

/**
 * Create HTML for ProgrammingQuestion type of QuizAtom
 * @param atom - atom JSON
 */
export default async function createHtmlQuizProgrammingQuestion(
  atom: UdacityQuizAtom
): Promise<string> {
  const files: CodeFile[] = [];
  let active: string; let id: string; let isSelected: boolean; let
    name: string; let text: string;
  for (let i = 0, len = atom.question.initial_code_files.length; i < len; i += 1) {
    const file = atom.question.initial_code_files[i];
    // add active class for first elements
    active = (i === 0) ? ' active show' : '';
    isSelected = (i === 0);
    id = `${atom.id}-${file.name.replace('.', '-').replace(' ', '-')}`;
    ({ name } = file);
    ({ text } = file);
    files.push({
      active,
      id,
      isSelected,
      name,
      text,
    });
  } //.for

  const html = await loadTemplate('atom.quiz.programmingQuestion');

  const template = Handlebars.compile(html);
  const dataTemplate = {
    id: 'question',
    files,
  };

  return template(dataTemplate);
}
