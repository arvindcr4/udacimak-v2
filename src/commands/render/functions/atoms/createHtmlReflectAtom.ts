import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { markdownToHtml } from '../../../utils';
import {
  createHtmlText,
  createHtmlVideo,
} from '../utils';
import type { UdacityReflectAtom } from '../../../../types/udacity-api';

/**
 * Create HTML content for ReflectAtom
 * @param atom - atom json
 * @param targetDir - path to save the assets folder for videos
 * @param prefix - prefix for video file name
 * @returns HTML content
 */
export default async function createHtmlReflectAtom(
  atom: UdacityReflectAtom,
  targetDir: string,
  prefix: string
): Promise<string> {
  const questionTitle = markdownToHtml(atom.question.title || '');
  let questionText: string;

  if (atom.question.semantic_type === 'TextQuestion') {
    questionText = await createHtmlText(atom.question.text || '', targetDir, atom.id);
  } else {
    questionText = '<p>Unknown question type. Please contact the developer to make it compatible with this atom type!</p>';
  }

  // download answer video if available
  const youtubeId = atom.answer.video ? atom.answer.video.youtube_id : '';
  const promiseHtmlVideo = createHtmlVideo(youtubeId, targetDir, prefix, atom.title);
  const promiseLoadTemplate = loadTemplate('atom.reflect');

  const [video, html] = await Promise.all([promiseHtmlVideo, promiseLoadTemplate]);

  const answer = await createHtmlText(atom.answer.text || '', targetDir, atom.id);
  const dataTemplate = {
    answer,
    video,
    questionTitle,
    questionText,
  };
  const template = Handlebars.compile(html);
  return template(dataTemplate);
}
