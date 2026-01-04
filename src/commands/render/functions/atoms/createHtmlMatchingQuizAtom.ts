/* eslint-disable camelcase */
import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { markdownToHtml } from '../../../utils';
import type { UdacityMatchingQuizAtom } from '../../../../types/udacity-api';

interface Concept {
  text: string;
}

interface Answer {
  text: string;
}

interface Solution {
  answerText: string;
  matchingConcept: string;
}

/**
 * Create HTML content for MatchingQuizAtom
 * @param atom - atom json
 * @returns HTML content
 */
export default async function createHtmlMatchingQuizAtom(
  atom: UdacityMatchingQuizAtom
): Promise<string> {
  const { question } = atom;
  const prompt = markdownToHtml(question.complex_prompt.text || '');
  const concepts: Concept[] = [];
  const answers: Answer[] = [];
  const solutions: Solution[] = [];
  const conceptsLabel = markdownToHtml(question.concepts_label || '');
  const answersLabel = markdownToHtml(question.answers_label || '');
  for (let i = 0, len = question.concepts.length; i < len; i += 1) {
    const concept = question.concepts[i];
    concepts.push({
      text: markdownToHtml(concept.text || ''),
    });
  }
  for (let j = 0, len = question.answers.length; j < len; j += 1) {
    const answer = question.answers[j];
    answers.push({
      text: markdownToHtml(answer.text || ''),
    });

    // create solution
    for (let k = 0, lenConcepts = question.concepts.length; k < lenConcepts; k += 1) {
      const concept = question.concepts[k];
      const correctAnswer = concept.correct_answer;
      if (correctAnswer && correctAnswer.text
        && correctAnswer.text.toLowerCase().trim() === (answer.text || '').toLowerCase().trim()) {
        solutions.push({
          answerText: markdownToHtml(answer.text || ''),
          matchingConcept: markdownToHtml(concept.text || ''),
        });
      }
    }
  }

  const html = await loadTemplate('atom.matchingQuiz');
  const dataTemplate = {
    answers,
    answersLabel,
    concepts,
    conceptsLabel,
    solutions,
    prompt,
  };
  const template = Handlebars.compile(html);
  return template(dataTemplate);
}
