import { Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

@Injectable()
export class AuthenticationService {
  private oAuth2Client;

  constructor() {
    authorize().then(jwtClient => {
      this.oAuth2Client = jwtClient;
    });
  }

  getOAuth2Client() {
    return this.oAuth2Client;
  }
}

function authorize() {
  return new Promise(resolve => {
    const jwtClient = new JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      SCOPES,
    );

    jwtClient.authorize(() => resolve(jwtClient));
  });
}
