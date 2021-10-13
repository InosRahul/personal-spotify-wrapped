require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
app.get('/', (req, res) => {
  res.send('Hello');
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = length => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = ['user-read-private', 'user-read-email', 'user-top-read'].join(
    ' ',
  );

  const query = {
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  };
  let queryParam = new URLSearchParams(query);
  res.redirect(`https://accounts.spotify.com/authorize?${queryParam}`);
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const data = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
  };
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams(data),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
  })
    .then(response => {
      if (response.status === 200) {
        console.log(response.data);
        const { refresh_token, access_token, expires_in } = response.data;

        const queryParams = new URLSearchParams({
          access_token,
          refresh_token,
          expires_in,
        });
        console.log('200');
        res.redirect(`http://localhost:3000/?${queryParams}`);
      } else {
        res.redirect(`/?${JSON.stringify({ error: 'invalid_token' })}`);
      }
    })
    .catch(error => {
      res.send(error);
    });
});

app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log('listening');
});
