import axios, { AxiosError } from 'axios';
import inquirer from 'inquirer';
import {
  validateSaveUdacityAuthToken,
} from '.';

interface Questions {
  email: string;
  password: string;
}

interface AuthRequestBody {
  email: string;
  password: string;
  otp: string;
  next: string;
}

interface AuthResponseBody {
  jwt: string;
  message?: string;
}

const questions = [
  {
    type: 'input',
    name: 'email',
    message: 'Email:',
  },
  {
    type: 'password',
    name: 'password',
    message: 'Password:',
  },
];

/**
 * Authenticate with Udacity and save JWT token
 * @returns Promise<number> - Exit code (0 for success, 1 for failure)
 */
export default async function authenticate(): Promise<number> {
  try {
    const answers = await inquirer.prompt<Questions>(questions);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: 'https://auth.udacity.com/sign-in?next=https%3A%2F%2Fclassroom.udacity.com%2Fauthenticated',
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Udacity-Ads-Are-Blocked': 'unknown',
      Origin: 'https://auth.udacity.com',
    };

    const data: AuthRequestBody = {
      email: answers.email,
      password: answers.password,
      otp: '',
      next: 'https://classroom.udacity.com/authenticated',
    };

    const response = await axios.post<AuthResponseBody>(
      'https://user-api.udacity.com/signin',
      data,
      { headers }
    );

    if (response.status !== 200) {
      console.error(response.data?.message || 'Authentication failed');
      return 1;
    }

    await validateSaveUdacityAuthToken(response.data.jwt);
    return 0;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response) {
      console.error(axiosError.response.data?.message || 'Authentication failed');
    } else {
      console.error(axiosError.message);
    }
    return 1;
  }
}
