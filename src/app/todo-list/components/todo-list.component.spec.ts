import { TodoListComponent } from './todo-list.component';
import { TodoListService, Todo } from '../services/todo-list.service';
import { BehaviorSubject } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let mockTodoService: jest.Mocked<TodoListService>;
  let todosSubject: BehaviorSubject<Todo[]>;

  beforeEach(() => {
    todosSubject = new BehaviorSubject<Todo[]>([]);

    // Mock service
    mockTodoService = {
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      toggleCompleted: jest.fn(),
      getTodos: jest.fn().mockReturnValue([]),
      getTodosFromStorage: jest.fn().mockReturnValue([]),
      todos$: todosSubject.asObservable()
    } as any;

    component = new TodoListComponent(mockTodoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty newTodo', () => {
    expect(component.newTodo).toBe('');
  });

  it('should initialize with all tab active', () => {
    expect(component.activeTab).toBe('all');
  });

  it('should initialize todos$ from service', () => {
    expect(component.todos$).toBe(mockTodoService.todos$);
  });

  it('should call addTodo on service when newTodo has content', () => {
    component.newTodo = 'Test Todo';
    component.addTodo();

    expect(mockTodoService.addTodo).toHaveBeenCalledWith('Test Todo');
    expect(component.newTodo).toBe('');
  });

  it('should trim whitespace when adding todo', () => {
    component.newTodo = '  Test Todo  ';
    component.addTodo();

    expect(mockTodoService.addTodo).toHaveBeenCalledWith('Test Todo');
    expect(component.newTodo).toBe('');
  });

  it('should not call addTodo on service when newTodo is empty', () => {
    component.newTodo = '   ';
    component.addTodo();

    expect(mockTodoService.addTodo).not.toHaveBeenCalled();
    expect(component.newTodo).toBe('   ');
  });

  it('should not call addTodo on service when newTodo is empty string', () => {
    component.newTodo = '';
    component.addTodo();

    expect(mockTodoService.addTodo).not.toHaveBeenCalled();
  });

  it('should call deleteTodo on service', () => {
    const todo: Todo = { text: 'Test Todo', completed: false };
    component.deleteTodo(todo);

    expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(todo);
  });

  it('should call toggleCompleted on service', () => {
    const todo: Todo = { text: 'Test Todo', completed: false };
    component.toggleCompleted(todo);

    expect(mockTodoService.toggleCompleted).toHaveBeenCalledWith(todo);
  });

  it('should filter active todos correctly', () => {
    const todos: Todo[] = [
      { text: 'Active Todo', completed: false },
      { text: 'Completed Todo', completed: true },
      { text: 'Another Active', completed: false }
    ];

    const activeTodos = component.getActiveTodos(todos);

    expect(activeTodos.length).toBe(2);
    expect(activeTodos[0].text).toBe('Active Todo');
    expect(activeTodos[1].text).toBe('Another Active');
    expect(activeTodos.every(todo => !todo.completed)).toBe(true);
  });

  it('should filter completed todos correctly', () => {
    const todos: Todo[] = [
      { text: 'Active Todo', completed: false },
      { text: 'Completed Todo', completed: true },
      { text: 'Another Completed', completed: true }
    ];

    const completedTodos = component.getCompletedTodos(todos);

    expect(completedTodos.length).toBe(2);
    expect(completedTodos[0].text).toBe('Completed Todo');
    expect(completedTodos[1].text).toBe('Another Completed');
    expect(completedTodos.every(todo => todo.completed)).toBe(true);
  });

  it('should return empty array when no active todos', () => {
    const todos: Todo[] = [
      { text: 'Completed Todo 1', completed: true },
      { text: 'Completed Todo 2', completed: true }
    ];

    const activeTodos = component.getActiveTodos(todos);

    expect(activeTodos.length).toBe(0);
  });

  it('should return empty array when no completed todos', () => {
    const todos: Todo[] = [
      { text: 'Active Todo 1', completed: false },
      { text: 'Active Todo 2', completed: false }
    ];

    const completedTodos = component.getCompletedTodos(todos);

    expect(completedTodos.length).toBe(0);
  });

  it('should handle empty todos array', () => {
    const todos: Todo[] = [];

    expect(component.getActiveTodos(todos)).toEqual([]);
    expect(component.getCompletedTodos(todos)).toEqual([]);
  });
});
