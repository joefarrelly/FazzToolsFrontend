export const config = {
  url: {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    REDIRECT_URL: process.env.REACT_APP_REDIRECT_URL || 'http://localhost:3000/redirect',
  },
};
