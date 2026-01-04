import fs from 'fs';

type CourseType = 'NANODEGREE' | 'COURSE' | 'UNKNOWN';

/**
 * Check is this folder contains nanodegree, course or what
 * @param jsonPath - path to json file
 * @param filename - json filename
 * @returns course type
 */
export default function getCourseType(
  jsonPath: string,
  filename = 'data.json'
): CourseType {
  const pathData = `${jsonPath}/${filename}`;

  // read json file for data
  let courseType: CourseType;
  const rawData = fs.readFileSync(pathData, 'utf-8');
  const parsed = JSON.parse(rawData) as { data: Record<string, unknown> };
  const data = parsed.data;

  if (data.nanodegree) courseType = 'NANODEGREE';
  else if (data.course) courseType = 'COURSE';
  else courseType = 'UNKNOWN';

  return courseType;
}
