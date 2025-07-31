import { action } from '@uibakery/data';

function loadTodos() {
  return action('loadTodos', 'SQL', {
    databaseName: '[Sample] Custom App_aLyc6lzdXB',
    query: `
      SELECT id, task, is_done, created_at, updated_at 
      FROM todos 
      WHERE user_id = {{params.userId}}
      ORDER BY created_at DESC;
    `,
  });
}

export default loadTodos;
