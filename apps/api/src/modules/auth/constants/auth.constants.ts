// Cookie names for authentication tokens
export const cookieConstants = {
  accessTokenName: 'classes.access_token',
  refreshTokenName: 'classes.refresh_token',
  sessionName: 'classes.session_token',
};

// Authentication constants
export const authConstants = {
  bcryptSaltRounds: 10,
  accessTokenExpiry: '7d', // 7 days
  refreshTokenExpiry: '30d', // 30 days
};
