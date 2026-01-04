import {
  API_ENDPOINTS_UDACITY_GRAPHQL,
} from '../config';
import fetchApiUdacityGraphql from './fetchApiUdacityGraphql';
import type {
  UdacityNanodegree,
  UdacityNanodegreeInfo,
  UdacityGraphqlResponse,
} from '../types/udacity-api';

interface NanodegreeQuery {
  nanodegree: UdacityNanodegree;
}

/**
 * Fetch JSON data of a Nanodegree from Udacity API
 * @param ndInfo - Nanodegree information
 * @param udacityAuthToken - Udacity authentication token
 */
export default async function fetchNanodegree(
  ndInfo: UdacityNanodegreeInfo,
  udacityAuthToken: string
): Promise<UdacityGraphqlResponse<NanodegreeQuery>> {
  const { key, locale, version } = ndInfo;

  // Handle undefined/null values for GraphQL
  const versionStr = version === undefined || version === null ? 'null' : `"${version}"`;
  const localeStr = locale === undefined || locale === null ? 'null' : `"${locale}"`;

  const queryGraphql = JSON.stringify({
    query: `
      query NanodegreeQuery {
        nanodegree(key: "${key}" version: ${versionStr} locale: ${localeStr}) {
          id
          key
          title
          semantic_type
          is_public
          cohorts {
            id
            start_at
            due_at
            end_at
          }
          version
          locale
          title
          color_scheme
          enrollment {
            product_variant
            variant
            static_access {
              static_access
              access_expiry_at
            }
          }
          nd_units {
            id
          }
          hero_image {
            url
          }
          forum_path
          summary
          is_graduated
          is_default
          project_deadlines {
            due_at
          }
          user_state {
            completed_at
            last_viewed_at
            unstructured
          }
          aggregated_state {
            completion_amount
            completed_count
            concept_count
            last_viewed_child_key
            part_aggregated_states {
              completed_at
              completion_amount
              completed_count
              concept_count
              last_viewed_child_key
              module_aggregated_states {
                completed_at
                completion_amount
                completed_count
                concept_count
                last_viewed_child_key
                lesson_aggregated_states {
                  completed_at
                  completed_count
                  concept_count
                  completion_amount
                  last_viewed_child_key
                }
              }
            }
          }
          resources {
            files {
              name
              uri
            }
          }
          parts(part_types: [Core, Elective, Career]) {
            id
            key
            title
            semantic_type
            is_public
            version
            locale
            summary
            part_type
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
            modules {
              id
              key
              title
              semantic_type
              is_public
              version
              locale
              is_project_module
              forum_path
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
                video {
                  youtube_id
                  china_cdn_id
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
                concepts {
                  id
                  key
                  title
                  semantic_type
                  is_public
                  resources {
                    files {
                      name
                      uri
                    }
                  }
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

  try {
    return await fetchApiUdacityGraphql<NanodegreeQuery>(API_ENDPOINTS_UDACITY_GRAPHQL, queryGraphql, udacityAuthToken);
  } catch (error) {
    const err = new Error(`Failed to fetch nanodegree ${ndInfo.key}: ${error instanceof Error ? error.message : String(error)}`) as AppError;
    (err as AppError).cause = error;
    throw err;
  }
}

interface AppError extends Error {
  cause?: unknown;
}
