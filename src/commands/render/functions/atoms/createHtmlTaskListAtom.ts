import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { markdownToHtml } from '../../../utils';
import {
  createHtmlVideo,
  createHtmlText,
} from '../utils';
import type { UdacityTaskListAtom } from '../../../../types/udacity-api';

/**
 * Create HTML content for TaskListAtom
 * @param atom - atom json
 * @param targetDir - path to save the assets folder for videos
 * @param prefix - prefix for video file name
 * @returns HTML content
 */
export default async function createHtmlTaskListAtom(
  atom: UdacityTaskListAtom,
  targetDir: string,
  prefix: string
): Promise<string> {
  let { description } = atom;
  const { positive_feedback } = atom;
  description = await createHtmlText(description || '', targetDir, atom.id);
  const positiveFeedbackHtml = await createHtmlText(positive_feedback || '', targetDir, atom.id);

  const tasks: Array<{ id: string; task: string }> = [];
  for (let i = 0, len = atom.tasks.length; i < len; i += 1) {
    const task = markdownToHtml(atom.tasks[i]);
    const id = `${atom.key}--${i}`;
    tasks.push({
      id,
      task,
    });
  }

  // download feedback video if available
  const youtubeId = atom.video_feedback ? atom.video_feedback.youtube_id : '';
  const promiseHtmlVideo = createHtmlVideo(youtubeId, targetDir, prefix, atom.title);
  const promiseLoadTemplate = loadTemplate('atom.taskList');

  const [video, html] = await Promise.all([promiseHtmlVideo, promiseLoadTemplate]);
  const hasFeedback = (video || positiveFeedbackHtml);

  const dataTemplate = {
    description,
    hasFeedback,
    tasks,
    video,
    positiveFeedback: positiveFeedbackHtml,
  };
  const template = Handlebars.compile(html);
  return template(dataTemplate);
}
