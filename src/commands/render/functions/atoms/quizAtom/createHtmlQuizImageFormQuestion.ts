/* eslint-disable camelcase */
import Handlebars from 'handlebars';
import { loadTemplate } from '../../templates';
import { createHtmlWidget } from './index';
import {
  downloadImage,
  makeDir,
} from '../../../../utils';
import type { UdacityQuizAtom } from '../../../../../types/udacity-api';

/**
 * Create HTML for ImageFormQuestion type of QuizAtom
 * @param atom - atom JSON
 * @param outputPath - path to save the assets folder for videos
 */
export default async function createHtmlQuizImageFormQuestion(
  atom: UdacityQuizAtom,
  outputPath: string
): Promise<string> {
  // create directory for image assets
  const pathImg = makeDir(outputPath, 'img');
  const { question } = atom;

  // download quiz background image
  const filename = `${atom.question.evaluation_id}.gif`;
  const promiseDownloadImage = downloadImage(question.background_image || '', pathImg, filename);
  const promiseLoadTemplate = loadTemplate('atom.quiz.imageFormQuestion');

  const [filenameImg, html] = await Promise.all([
    promiseDownloadImage,
    promiseLoadTemplate,
  ]);

  let htmlWidgets = '';
  for (let i = 0, len = question.widgets.length; i < len; i += 1) {
    const widget = question.widgets[i];
    htmlWidgets += createHtmlWidget(widget);
  }

  const template = Handlebars.compile(html);
  const dataTemplate = {
    htmlWidgets,
    srcImg: `img/${filenameImg}`,
  };
  return template(dataTemplate);
}
