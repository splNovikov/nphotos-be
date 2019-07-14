import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { google } from 'googleapis';
import { createInterface } from 'readline';
const consola = require('consola'); // tslint:disable-line

const readFileAsync = promisify(readFile);
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const CREDENTIALS_PATH = './credentials/credentials.json';
const TOKEN_PATH = './credentials/token.json';

@Injectable()
export class AuthenticationService {
  private oAuth2Client;

  constructor() {
    authorize(oAuth2Client => {
      debugger;
      this.oAuth2Client = oAuth2Client;
    });
  }

  getOAuth2Client() {
    return this.oAuth2Client;
  }
}

async function authorize(setOAth2ClientCallback) {
  const credentials = await parseCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  // Check if we have previously stored a token.
  const token = await parseToken(oAuth2Client);
  if (!token) {
    return getNewToken(oAuth2Client, setOAth2ClientCallback);
  }

  oAuth2Client.setCredentials(token);
  setOAth2ClientCallback(oAuth2Client);
}

async function parseCredentials(credentialsPath = CREDENTIALS_PATH) {
  try {
    const credentials = await readFileAsync(credentialsPath);
    return JSON.parse(credentials.toString());
  } catch (err) {
    consola.error('Error occurred while reading credentials!', err);
  }
}

async function parseToken(oAuth2Client, tokenPath = TOKEN_PATH) {
  try {
    const token = await readFileAsync(tokenPath);
    return JSON.parse(token.toString());
  } catch (err) {
    consola.error('Error occurred while reading token!', err);
  }
}

function getNewToken(oAuth2Client, setOAth2ClientCallback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  consola.info('Authorize this app by visiting this url:', authUrl);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (getTokenErr, token) => {
      if (getTokenErr) {
        return consola.error(
          'Error while trying to retrieve access token',
          getTokenErr,
        );
      }
      oAuth2Client.setCredentials(token);
      setOAth2ClientCallback(oAuth2Client);

      // Store the token to disk for later program executions
      writeFile(TOKEN_PATH, JSON.stringify(token), writeTokenErr => {
        if (writeTokenErr) {
          return consola.error(writeTokenErr);
        }
        consola.info('Token stored to', TOKEN_PATH);
      });
    });
  });
}
