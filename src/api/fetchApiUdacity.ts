import axios, { AxiosError } from 'axios';
import { config } from '../commands/utils';
import { CLI_CONFIG_UDACITY_AUTH_TOKEN } from '../config';

/**
 * Send request to Udacity API
 * @param url - request url
 * @param udacityAuthToken - Udacity authentication token
 */
export default async function fetchApiUdacity<T = any>(
  url: string,
  udacityAuthToken = ''
): Promise<T> {
  if (!udacityAuthToken) {
    udacityAuthToken = config.get(CLI_CONFIG_UDACITY_AUTH_TOKEN);
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${udacityAuthToken}`,
    Host: 'review-api.udacity.com',
    Origin: 'https://review.udacity.com',
    Referer: 'https://review.udacity.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  };

  try {
    const response = await axios.get<T>(url, { headers });
    const jsonRes = response.data;
    if ((jsonRes as any).errors) {
      throw (jsonRes as any).errors;
    }
    return jsonRes;
  } catch (error) {
    if ((error as AxiosError).response) {
      const jsonRes = (error as any).response.data;
      if (jsonRes.errors) {
        throw jsonRes.errors;
      }
    }
    throw error;
  }
}
