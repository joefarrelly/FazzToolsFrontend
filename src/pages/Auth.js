import { config } from 'Constants';

function Auth() {
  window.location.replace(
    'https://eu.battle.net/oauth/authorize?client_id=39658b8731b945fcba53f216556351b6&scope=wow.profile&state=blizzardeumz76c&redirect_uri=' +
      config.url.REDIRECT_URL +
      '&response_type=code'
  );
  return null;
}

export default Auth;
