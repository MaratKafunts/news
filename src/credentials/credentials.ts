export const googleOAuthConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  projectID: 'angular-argon-465215-p3',
  authUri: 'https://accounts.google.com/o/oauth2/auth',
  tokenUri: 'https://oauth2.googleapis.com/token',
  authProviderCertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
  redirectUris: ['http://localhost:3000/auth/google/redirect'],
};
