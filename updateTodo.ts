import { action } from '@uibakery/data';

function updateTodo() {
  return action('updateTodo', 'SQL', {
    databaseName: '[Sample] Custom App_aLyc6lzdXB',
    query: `
      UPDATE todos 
      SET is_done = {{params.isDone}}, updated_at = CURRENT_TIMESTAMP
      WHERE id = {{params.todoId}} AND user_id = {{params.userId}}
      RETURNING id, task, is_done, created_at, updated_at;
    `,
  });
}

export default updateTodo;
