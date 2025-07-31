import { action } from '@uibakery/data';

function deleteTodo() {
  return action('deleteTodo', 'SQL', {
    databaseName: '[Sample] Custom App_aLyc6lzdXB',
    query: `
      DELETE FROM todos 
      WHERE id = {{params.todoId}} AND user_id = {{params.userId}};
    `,
  });
}

export default deleteTodo;
