import { config } from 'Constants';

function Auth() {
  window.location.replace(
    'https://eu.battle.net/oauth/authorize?client_id=' +
      process.env.REACT_APP_BLIZZ_CLIENT_ID +
      '&scope=wow.profile&state=blizzardeumz76c&redirect_uri=' +
      config.url.REDIRECT_URL +
      '&response_type=code'
  );
  return null;
}

export default Auth;
