import { TodoListService } from './todo-list.service';

describe('TodoListService', () => {
  let service: TodoListService;
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const store: { [key: string]: string } = {};
    mockLocalStorage = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: jest.fn((key: string) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
      length: 0,
      key: jest.fn()
    };

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    service = new TodoListService();
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
});
