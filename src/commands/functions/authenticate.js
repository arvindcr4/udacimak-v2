import axios from 'axios';
import inquirer from 'inquirer';
import {
  validateSaveUdacityAuthToken,
} from '.';

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

export default async function authenticate() {
  try {
    const answers = await inquirer.prompt(questions);

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

    const data = {
      email: answers.email,
      password: answers.password,
      otp: '',
      next: 'https://classroom.udacity.com/authenticated',
    };

    const response = await axios.post('https://user-api.udacity.com/signin', data, { headers });

    if (response.status !== 200) {
      console.error(response.data?.message || 'Authentication failed');
      return 1;
    }

    await validateSaveUdacityAuthToken(response.data.jwt);
    return 0;
  } catch (error) {
    if (error.response) {
      console.error(error.response.data?.message || 'Authentication failed');
    } else {
      console.error(error.message);
    }
    return 1;
  }
}
