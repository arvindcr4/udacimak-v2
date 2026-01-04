import axios, { AxiosError } from 'axios';
import { config } from '../commands/utils';
import { CLI_CONFIG_UDACITY_AUTH_TOKEN } from '../config';

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * Send request to Udacity GraphQL API
 * @param url - request url
 * @param queryGraphql - GraphQL query
 * @param udacityAuthToken - Udacity authentication token
 */
export default async function fetchApiUdacityGraphql<T = any>(
  url: string,
  queryGraphql: string,
  udacityAuthToken = ''
): Promise<GraphqlResponse<T>> {
  if (!udacityAuthToken) {
    udacityAuthToken = config.get(CLI_CONFIG_UDACITY_AUTH_TOKEN);
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${udacityAuthToken}`,
    'Content-Type': 'application/json; charset=UTF-8',
    Host: 'api.udacity.com',
    Origin: 'https://classroom.udacity.com',
    Referer: 'https://classroom.udacity.com/me',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  };

  try {
    const response = await axios.post<GraphqlResponse<T>>(url, queryGraphql, { headers });
    const jsonRes = response.data;
    if (jsonRes.errors) {
      throw jsonRes.errors;
    }
    return jsonRes;
  } catch (error) {
    if ((error as AxiosError).response) {
      const jsonRes = (error as any).response.data as GraphqlResponse<T>;
      if (jsonRes.errors) {
        throw jsonRes.errors;
      }
    }
    throw error;
  }
}
