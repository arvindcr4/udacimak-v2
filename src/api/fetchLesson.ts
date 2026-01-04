import {
  API_ENDPOINTS_UDACITY_GRAPHQL,
} from '../config';
import fetchApiUdacityGraphql from './fetchApiUdacityGraphql';
import type {
  UdacityLesson,
  UdacityLessonInfo,
  UdacityGraphqlResponse,
} from '../types/udacity-api';

interface LessonQuery {
  lesson: UdacityLesson;
}

/**
 * Fetch JSON data of a lesson from Udacity API
 * @param lessonInfo - lesson information
 * @param udacityAuthToken - Udacity authentication token
 */
export default async function fetchLesson(
  lessonInfo: UdacityLessonInfo,
  udacityAuthToken: string
): Promise<UdacityGraphqlResponse<LessonQuery>> {
  const { id, locale, rootKey } = lessonInfo;

  const queryGraphql = JSON.stringify({
    query: `
      query LessonQuery {
        lesson(id: ${id}, root_key: "${rootKey}") {
          id
          key
          title
          semantic_type
          is_public
          version
          locale
          summary
          display_workspace_project_only
          resources {
            files {
              name
              uri
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
          }
          lab {
            id
            key
            version
            locale
            estimated_session_duration
            duration
            is_public
            semantic_type
            title
            evaluation_objective
            partners
            overview {
              title
              summary
              key_takeaways
              video {
                topher_id
                youtube_id
              }
            }
            details {
              text
            }
            review_video {
              topher_id
              youtube_id
            }
            result {
              state
              skill_confidence_rating_after
              skill_confidence_rating_before
            }
            workspace {
              id
              key
              title
              semantic_type
              is_public
              workspace_id
              pool_id
              view_id
              configuration
            }
          }
          concepts {
            id
            key
            title
            semantic_type
            is_public
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
            atoms {
              ...on EmbeddedFrameAtom {
                id
                key
                title
                semantic_type
                is_public
                external_uri
                instructor_notes
              }
              ...on TextAtom {
                id
                key
                title
                semantic_type
                is_public
                text
                instructor_notes
              }
              ...on TaskListAtom {
                id
                key
                title
                semantic_type
                is_public
                instructor_notes
                user_state {
                  node_key
                  completed_at
                  last_viewed_at
                  unstructured
                }
                tasks
                positive_feedback
                video_feedback {
                  youtube_id
                  china_cdn_id
                }
                description
              }
              ...on ImageAtom {
                id
                key
                title
                semantic_type
                is_public
                url
                caption
                alt
                width
                height
                instructor_notes
              }
              ...on VideoAtom {
                id
                key
                title
                semantic_type
                is_public
                instructor_notes
                video {
                  youtube_id
                  china_cdn_id
                }
              }
              ...on ReflectAtom {
                id
                key
                title
                semantic_type
                is_public
                instructor_notes
                user_state {
                  node_key
                  completed_at
                  last_viewed_at
                  unstructured
                }
                question {
                  ...on TextQuestion {
                    title
                    semantic_type
                    evaluation_id
                    text
                  }
                }
                answer {
                  text
                  video {
                    youtube_id
                    china_cdn_id
                  }
                }
              }
              ...on RadioQuizAtom {
                id
                key
                title
                semantic_type
                is_public
                instructor_notes
                user_state {
                  node_key
                  completed_at
                  last_viewed_at
                  unstructured
                }
                question {
                  prompt
                  answers {
                    id
                    text
                    is_correct
                  }
                }
              }
              ...on CheckboxQuizAtom {
                id
                key
                title
                semantic_type
                is_public
                instructor_notes
                user_state {
                  node_key
                  completed_at
                  last_viewed_at
                  unstructured
                }
                question {
                  prompt
                  answers {
                    id
                    text
                    is_correct
                  }
                }
              }
              ...on MatchingQuizAtom {
                id
                key
                title
                semantic_type
                is_public
                instructor_notes
                user_state {
                  node_key
                  completed_at
                  last_viewed_at
                  unstructured
                }
                question {
                  complex_prompt {
                    text
                  }
                  concepts_label
                  answers_label
                  concepts {
                    text
                    correct_answer {
                      id
                      text
                    }
                  }
                  answers {
                    id
                    text
                  }
                }
              }
              ...on ValidatedQuizAtom {
                id
                key
                title
                semantic_type
                is_public
                instructor_notes
                user_state {
                  node_key
                  completed_at
                  last_viewed_at
                  unstructured
                }
                question {
                  prompt
                  matchers {
                    ...on RegexMatcher {
                      expression
                    }
                  }
                }
              }
              ...on QuizAtom {
                id
                key
                title
                semantic_type
                is_public
                instructor_notes
                user_state {
                  node_key
                  completed_at
                  last_viewed_at
                  unstructured
                }
                instruction {
                  video {
                    youtube_id
                    china_cdn_id
                  }
                  text
                }
                question {
                  ...on ImageFormQuestion {
                    title
                    alt_text
                    background_image
                    semantic_type
                    evaluation_id
                    widgets {
                      group
                      initial_value
                      label
                      marker
                      model
                      is_text_area
                      tabindex
                      placement {
                        height
                        width
                        x
                        y
                      }
                    }
                  }
                  ...on ProgrammingQuestion {
                    title
                    semantic_type
                    evaluation_id
                    initial_code_files {
                      text
                      name
                    }
                  }
                  ...on CodeGradedQuestion {
                    title
                    prompt
                    semantic_type
                    evaluation_id
                  }
                  ...on IFrameQuestion {
                    title
                    semantic_type
                    evaluation_id
                    initial_code_files {
                      text
                      name
                    }
                    external_iframe_uri
                  }
                  ...on TextQuestion {
                    title
                    semantic_type
                    evaluation_id
                    text
                  }
                }
                answer {
                  text
                  video {
                    youtube_id
                    china_cdn_id
                  }
                }
              }
              ...on WorkspaceAtom {
                id
                key
                title
                semantic_type
                is_public
                workspace_id
                pool_id
                view_id
                gpu_capable
                configuration
              }
            }
          }
        }
      }
    `,
    variables: null,
    [locale]: 'en-us',
  });

  try {
    return await fetchApiUdacityGraphql<LessonQuery>(API_ENDPOINTS_UDACITY_GRAPHQL, queryGraphql, udacityAuthToken);
  } catch (error) {
    const err = new Error(`Failed to fetch lesson: ${error instanceof Error ? error.message : String(error)}`) as AppError;
    (err as AppError).cause = error;
    throw err;
  }
}

interface AppError extends Error {
  cause?: unknown;
}
