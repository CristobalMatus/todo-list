import { TestBed } from '@angular/core/testing';
import { TodoListService, Todo } from './todo-list.service';

describe('TodoListService', () => {
  let service: TodoListService;
  let mockLocalStorage: Storage;

  beforeEach(() => {
    // Crear un objeto store para simular localStorage
    const store: { [key: string]: string } = {};
    mockLocalStorage = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: jest.fn((key: string) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
      length: 0,
      key: jest.fn()
    };

    // Simular localStorage globalmente
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [TodoListService]
    });
    service = TestBed.inject(TodoListService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a todo', () => {
    service.addTodo('Test Todo');
    expect(service.getTodos().length).toBe(1);
    expect(service.getTodos()[0].text).toBe('Test Todo');
    expect(service.getTodos()[0].completed).toBe(false);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should delete a todo', () => {
    service.addTodo('Test Todo');
    const todo = service.getTodos()[0];
    service.deleteTodo(todo);
    expect(service.getTodos().length).toBe(0);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should toggle completed status', () => {
    service.addTodo('Test Todo');
    const todo = service.getTodos()[0];
    expect(todo.completed).toBe(false);

    service.toggleCompleted(todo);
    expect(service.getTodos()[0].completed).toBe(true);

    service.toggleCompleted(service.getTodos()[0]);
    expect(service.getTodos()[0].completed).toBe(false);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should get todos from storage', () => {
    const testTodos = [
      { text: 'Test Todo 1', completed: false },
      { text: 'Test Todo 2', completed: true }
    ];
    (mockLocalStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(testTodos));

    const todos = service.getTodosFromStorage();
    expect(todos.length).toBe(2);
    expect(todos[0].text).toBe('Test Todo 1');
    expect(todos[1].completed).toBe(true);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('todo-list-tasks');
  });

  it('should return empty array when localStorage is empty', () => {
    (mockLocalStorage.getItem as jest.Mock).mockReturnValue(null);

    const todos = service.getTodosFromStorage();
    expect(todos).toEqual([]);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('todo-list-tasks');
  });

  it('should emit todos through observable', (done) => {
    service.todos$.subscribe(todos => {
      if (todos.length === 1) {
        expect(todos[0].text).toBe('Observable Test');
        done();
      }
    });

    service.addTodo('Observable Test');
  });

  it('should handle toggleCompleted with multiple todos', () => {
    // Agregar múltiples todos
    service.addTodo('Todo 1');
    service.addTodo('Todo 2');
    service.addTodo('Todo 3');

    const todos = service.getTodos();
    expect(todos.length).toBe(3);

    // Alternar el todo del medio
    const middleTodo = todos[1];
    expect(middleTodo.text).toBe('Todo 2');
    expect(middleTodo.completed).toBe(false);

    service.toggleCompleted(middleTodo);

    const updatedTodos = service.getTodos();
    expect(updatedTodos.length).toBe(3);

    // Verificar que solo el todo del medio fue alternado
    expect(updatedTodos[0].completed).toBe(false); // Todo 1 sin cambios
    expect(updatedTodos[1].completed).toBe(true);  // Todo 2 alternado
    expect(updatedTodos[2].completed).toBe(false); // Todo 3 sin cambios

    // Verificar que el storage fue actualizado
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should handle toggleCompleted when todo is not found', () => {
    service.addTodo('Existing Todo');
    const existingTodos = service.getTodos();

    // Intentar alternar un todo que no existe
    const nonExistentTodo: Todo = { text: 'Non-existent Todo', completed: false };
    service.toggleCompleted(nonExistentTodo);

    // Todos los todos deben permanecer sin cambios
    const todosAfterToggle = service.getTodos();
    expect(todosAfterToggle).toEqual(existingTodos);
    expect(todosAfterToggle[0].completed).toBe(false);

    // El storage aún debe ser actualizado (aunque nada haya cambiado)
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });
});
