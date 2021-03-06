import express from 'express';
import fetch from 'node-fetch';

import { catchAsync, getAdminMe } from '../utils';
import { Errors } from '../constants';

const router = express.Router();

const { API_HOST, API_HOST_LE } = process.env;
const apiProtocol = API_HOST_LE ? 'https' : 'http';
const apiHost = API_HOST_LE || API_HOST;
const redirectUri = `${apiProtocol}://${apiHost}/auth/callback`;

const { ADMIN_HOST, ADMIN_HOST_LE } = process.env;
const adminProtocol = ADMIN_HOST_LE ? 'https' : 'http';
const adminHost = ADMIN_HOST_LE || ADMIN_HOST;
const redirectClient = `${adminProtocol}://${adminHost}/discord-callback`;

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

const DISCORD_TOKEN_URL = 'https://discord.com/api/v8/oauth2/token';

router.get('/login', (req, res) => {
  res.redirect(
    `https://discord.com/api/v8/oauth2/authorize?client_id=${CLIENT_ID}` +
      `&scope=identify&response_type=code&redirect_uri=${redirectUri}`,
  );
});

router.get(
  '/callback',
  catchAsync(async (req, res, next) => {
    if (!req.query.code) {
      // NoCodeProvided
      return next(Errors.BAD_REQUEST);
    }
    const code = req.query.code;

    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    };
    const params = encode(data);
    const response = await fetch(DISCORD_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const json = (await response.json()) as any;

    res.redirect(`${redirectClient}?token=${json.access_token}`);
  }),
);

router.get(
  '/admin-me',
  catchAsync(async (req, res, next) => {
    const redis = req.app.settings?.redis;
    const authorization = req.headers.authorization;

    if (!authorization) {
      return next(Errors.UNAUTHORIZED);
    }

    let userError = null;
    const user = await getAdminMe(redis, authorization).catch((error) => {
      userError = error;
    });
    if (userError) {
      return next(Errors.UNAUTHORIZED);
    }

    res.send(user);
  }),
);

function encode(obj) {
  let string = '';

  for (const [key, value] of Object.entries(obj)) {
    if (!value) continue;
    string += `&${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`;
  }

  return string.substring(1);
}

export default router;
