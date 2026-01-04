/* eslint-disable camelcase */
import Handlebars from 'handlebars';
import { loadTemplate } from '../../templates';

interface UserState {
  node_key?: string;
  unstructured?: string;
}

interface UnstructuredFile {
  [filename: string]: string;
}

interface CodeFile {
  active: string;
  id: string;
  isSelected: boolean;
  name: string;
  text: string;
}

/**
 * Create HTML of user's answer for Programming Question
 * @param userState - user_state JSON from atom
 */
export default async function createHtmlProgrammingQuestionUserAnswer(
  userState: UserState
): Promise<string> {
  if (!userState || !userState.unstructured || !userState.unstructured.trim()) return '';

  try {
    const unstructured: UnstructuredFile = JSON.parse(userState.unstructured);
    const files: CodeFile[] = [];

    let i = 0;
    let active: string; let id: string; let isSelected: boolean;
    Object.keys(unstructured).forEach((filename) => {
      const text = unstructured[filename];

      // add active class for first elements
      active = (i === 0) ? ' active show' : '';
      isSelected = (i === 0);
      id = `user-answer-${userState.node_key || ''}-${filename.replace('.', '-').replace(' ', '-')}`;

      files.push({
        active,
        id,
        isSelected,
        name: filename,
        text,
      });

      i += 1;
    }); //.forEach

    const html = await loadTemplate('atom.quiz.programmingQuestion');

    const template = Handlebars.compile(html);
    const dataTemplate = {
      id: 'user-answer',
      files,
    };

    return template(dataTemplate);
  } catch (error) {
    return '';
  }
}
