import {
  API_ENDPOINTS_UDACITY_GRAPHQL,
} from '../config';
import fetchApiUdacityGraphql from './fetchApiUdacityGraphql';
import type {
  UdacityCourse,
  UdacityCourseInfo,
  UdacityGraphqlResponse,
} from '../types/udacity-api';

interface CourseQuery {
  course: UdacityCourse;
}

/**
 * Fetch JSON data of a course from Udacity API
 * @param courseInfo - course information
 * @param udacityAuthToken - Udacity authentication token
 */
export default async function fetchCourse(
  courseInfo: UdacityCourseInfo,
  udacityAuthToken: string
): Promise<UdacityGraphqlResponse<CourseQuery>> {
  const { key } = courseInfo;

  const queryGraphql = JSON.stringify({
    query: `
      query CourseQuery {
        course(key: "${key}" version: "1.0.0" locale: "en-us") {
          id
          key
          version
          locale
          semantic_type
          forum_path
          title
          is_public
          is_default
          user_state {
            node_key
            completed_at
            last_viewed_at
            unstructured
          }
          resources {
            files {
              name
              uri
            }
          }
          instructors {
            image_url
            first_name
          }
          project_deadline {
            due_at
          }
          project {
            key
            version
            locale
            duration
            semantic_type
            title
            description
            is_public
            summary
            forum_path
            rubric_id
            terminal_project_id
            resources {
              files {
                name
                uri
              }
            }
            image {
              url
              width
              height
            }
          }
          aggregated_state {
            node_key
            completion_amount
            completed_count
            concept_count
            last_viewed_child_key
            lesson_aggregated_states {
              node_key
              completed_at
              completion_amount
              completed_count
              concept_count
              last_viewed_child_key
            }
          }
          lessons {
            id
            key
            version
            locale
            semantic_type
            summary
            title
            duration
            is_public
            is_project_lesson
            display_workspace_project_only
            image {
              url
              width
              height
            }
            resources {
              files {
                name
                uri
              }
            }
            concepts {
              id
              key
              is_public
              semantic_type
              title
              user_state {
                node_key
                completed_at
                last_viewed_at
                unstructured
              }
              resources {
                files {
                  name
                  uri
                }
              }
            }
            project {
              key
              version
              locale
              duration
              semantic_type
              title
              description
              is_public
              summary
              forum_path
              rubric_id
              terminal_project_id
              resources {
                files {
                  name
                  uri
                }
              }
              image {
                url
                width
                height
              }
              project_state {
                state
                submissions {
                  created_at
                  url
                  result
                  is_legacy
                  id
                  status
                }
              }
            }
          }
        }
      }
    `,
    variables: null,
    locale: 'en-us',
  });

  return fetchApiUdacityGraphql<CourseQuery>(API_ENDPOINTS_UDACITY_GRAPHQL, queryGraphql, udacityAuthToken);
}
