import { TodoListService } from './todo-list.service';

describe('TodoListService', () => {
  let service: TodoListService;

  beforeEach(() => {
    service = new TodoListService();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a todo', () => {
    service.addTodo('Test');
    expect(service.getTodos().length).toBe(1);
    expect(service.getTodos()[0].text).toBe('Test');
  });

  it('should delete a todo', () => {
    service.addTodo('Test');
    const todo = service.getTodos()[0];
    service.deleteTodo(todo);
    expect(service.getTodos().length).toBe(0);
  });

  it('should toggle completed', () => {
    service.addTodo('Test');
    const todo = service.getTodos()[0];
    expect(todo.completed).toBe(false);
    service.toggleCompleted(todo);
    expect(service.getTodos()[0].completed).toBe(true);
  });

  it('should get todos from storage', () => {
    service.addTodo('Test');
    const todos = service.getTodosFromStorage();
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe('Test');
  });
});
