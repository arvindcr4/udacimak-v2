import fs from 'fs';

export default function readFileSync(path: string): string {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (error) {
    throw error;
  }
}
