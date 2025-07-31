import { action } from '@uibakery/data';

function authenticateSocialUser() {
  return action('authenticateSocialUser', 'SQL', {
    databaseName: '[Sample] Custom App_aLyc6lzdXB',
    query: `
      SELECT id, email, display_name, profile_picture_url, provider 
      FROM users 
      WHERE provider = {{params.provider}} AND provider_id = {{params.providerId}}
      LIMIT 1;
    `,
  });
}

export default authenticateSocialUser;
