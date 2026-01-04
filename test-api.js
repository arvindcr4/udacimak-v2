#!/usr/bin/env node

/**
 * Test script to verify Udacity API accessibility
 * Usage: node test-api.js <auth_token>
 *
 * To get your auth token:
 * 1. Log in to classroom.udacity.com in your browser
 * 2. Open Developer Tools (F12)
 * 3. Go to Application tab → Cookies → https://classroom.udacity.com
 * 4. Find the cookie named "_udacity" and copy its value
 */

const axios = require('axios');

const API_ENDPOINT = 'https://api.udacity.com/api/classroom-content/v1/graphql';

async function testUdacityApi(authToken) {
  console.log('Testing Udacity API...\n');

  if (!authToken) {
    console.error('ERROR: Please provide an auth token');
    console.log('Usage: node test-api.js <auth_token>');
    console.log('\nTo get your auth token:');
    console.log('1. Log in to classroom.udacity.com');
    console.log('2. Open Developer Tools (F12)');
    console.log('3. Go to Application tab → Cookies');
    console.log('4. Copy the value of the "_udacity" cookie');
    process.exit(1);
  }

  // Test with a simple GraphQL query
  const testQuery = JSON.stringify({
    query: `
      query UserBaseQuery {
        user {
          id
          first_name
          email
        }
      }
    `,
    variables: null,
    locale: 'en-us',
  });

  try {
    console.log('Making request to:', API_ENDPOINT);
    console.log('Using token:', authToken.substring(0, 20) + '...\n');

    const response = await axios.post(API_ENDPOINT, testQuery, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
        Origin: 'https://classroom.udacity.com',
        Referer: 'https://classroom.udacity.com/me',
      },
    });

    if (response.data.errors) {
      console.error('❌ API returned errors:');
      console.error(JSON.stringify(response.data.errors, null, 2));
      process.exit(1);
    }

    if (response.data.data && response.data.data.user) {
      const user = response.data.data.user;
      console.log('✅ API is working!');
      console.log('   User ID:', user.id);
      console.log('   Name:', user.first_name);
      console.log('   Email:', user.email);
      console.log('\n🎉 Your udacimak should work with this token!');
    } else {
      console.log('⚠️  Unexpected response structure');
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('❌ API request failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Get token from command line or environment
const token = process.argv[2] || process.env.UDACITY_AUTH_TOKEN;
testUdacityApi(token);
