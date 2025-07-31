import { action } from '@uibakery/data';

function createSocialUser() {
  return action('createSocialUser', 'SQL', {
    databaseName: '[Sample] Custom App_aLyc6lzdXB',
    query: `
      INSERT INTO users (email, provider, provider_id, display_name, profile_picture_url, password_hash)
      VALUES ({{params.email}}, {{params.provider}}, {{params.providerId}}, {{params.displayName}}, {{params.profilePictureUrl}}, '')
      RETURNING id, email, display_name, profile_picture_url, provider;
    `,
  });
}

export default createSocialUser;
