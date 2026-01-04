import { API_ENDPOINTS_UDACITY_GRAPHQL } from '../config';
import fetchApiUdacityGraphql from './fetchApiUdacityGraphql';
import type { UdacityUserInfo } from '../types/udacity-api';

interface GraphqlUserResponse {
  user: UdacityUserInfo;
}

interface GraphqlResponse {
  data?: GraphqlUserResponse;
  errors?: Array<{ message: string }>;
}

/**
 * Fetch User information from Udacity API
 * @param udacityAuthToken - Udacity authentication token
 */
export default async function fetchUdacityUserInfo(
  udacityAuthToken: string
): Promise<GraphqlResponse> {
  const queryGraphql = JSON.stringify({
    query: `
      query UserBaseQuery {
        user {
          id
          first_name
          last_name
          email
          nickname
          preferred_language
          social_logins {
            provider
            id
          }
          nanodegrees(start_index: 0, is_graduated: false) {
            id
            key
            title
          }
          graduated_nanodegrees: nanodegrees(is_graduated: true) {
            id
            key
            title
          }
        }
      }
    `,
    variables: null,
    locale: 'en-us',
  });

  return fetchApiUdacityGraphql<GraphqlUserResponse>(
    API_ENDPOINTS_UDACITY_GRAPHQL,
    queryGraphql,
    udacityAuthToken
  );
}
