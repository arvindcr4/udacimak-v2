import path from 'path';
import { readFileSync } from 'fs';

/**
 * Retrieve information of package
 * @returns package information
 */
export default function getPkgInfo(): Record<string, any> {
  // Read package.json from project root
  // When transpiled: __dirname is lib/commands/utils/, so we go up 3 levels to get to project root
  // When using ts-node: __dirname is src/commands/utils/, so we go up 3 levels to get to project root
  const levelsUp = 3;
  const projectRoot = path.resolve(__dirname, ...Array(levelsUp).fill('..'));
  const packagePath = path.join(projectRoot, 'package.json');
  const pkgContent = readFileSync(packagePath, 'utf-8');
  return JSON.parse(pkgContent);
}
