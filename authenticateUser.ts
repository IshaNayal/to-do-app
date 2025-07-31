import { action } from '@uibakery/data';

function authenticateUser() {
  return action('authenticateUser', 'SQL', {
    databaseName: '[Sample] Custom App_aLyc6lzdXB',
    query: `
      SELECT id, email FROM users 
      WHERE email = {{params.email}} AND password_hash = {{params.passwordHash}}
      LIMIT 1;
    `,
  });
}

export default authenticateUser;
