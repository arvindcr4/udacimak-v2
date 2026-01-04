import Handlebars from 'handlebars';
import {
  loadTemplate,
} from '../templates';
import { markdownToHtml } from '../../../utils';
import type { UdacityWorkspaceAtom } from '../../../../types/udacity-api';

interface WorkspaceBlueprint {
  kind?: string;
  conf?: {
    defaultPath?: string;
    openFiles?: string[];
    userCode?: string;
  };
}

interface WorkspaceConfiguration {
  blueprint?: WorkspaceBlueprint;
}

interface WorkspaceAtomExtended extends UdacityWorkspaceAtom {
  configuration?: WorkspaceConfiguration;
}

/**
 * Create HTML content for WorkspaceAtom
 * @param atom - atom json
 * @returns HTML content
 */
export default async function createHtmlWorkspaceAtom(
  atom: WorkspaceAtomExtended
): Promise<string> {
  if (!atom) {
    return '(No Workspace data available)';
  }

  const { configuration } = atom;
  let defaultPath = '';
  let openFiles: string[] = [];
  let userCode: string | undefined;
  let kind = 'Unknown';

  // attempt to get workspace information
  if (configuration && configuration.blueprint) {
    ({ kind } = configuration.blueprint);
    const { conf } = configuration.blueprint;
    if (conf) {
      // Jupyter workspace usually has defaultPath
      if (conf.defaultPath) ({ defaultPath } = conf);
      // Coding workspace usually has openFiles
      if (conf.openFiles && conf.openFiles.length) {
        ({ openFiles } = conf);
      }
      ({ userCode } = conf);
      userCode = markdownToHtml(userCode || '');
    }
  }

  const html = await loadTemplate('atom.workspace');
  const data = {
    defaultPath,
    kind,
    openFiles,
    userCode,
  };

  const template = Handlebars.compile(html);
  return template(data);
}
