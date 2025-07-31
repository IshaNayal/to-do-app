import { action } from '@uibakery/data';

function createTodo() {
  return action('createTodo', 'SQL', {
    databaseName: '[Sample] Custom App_aLyc6lzdXB',
    query: `
      INSERT INTO todos (user_id, task, is_done)
      VALUES ({{params.userId}}, {{params.task}}, false)
      RETURNING id, task, is_done, created_at, updated_at;
    `,
  });
}

export default createTodo;
