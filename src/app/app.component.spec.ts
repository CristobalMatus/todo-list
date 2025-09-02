import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "todo-list"', () => {
    expect(component.title).toBe('todo-list');
  });

  it('should initialize with empty newTodo', () => {
    expect(component.newTodo).toBe('');
  });

  it('should initialize with empty todos array', () => {
    expect(component.todos).toEqual([]);
  });

  it('should add a todo when newTodo has content', () => {
    component.newTodo = 'Test Todo';
    component.addTodo();

    expect(component.todos.length).toBe(1);
    expect(component.todos[0].text).toBe('Test Todo');
    expect(component.todos[0].completed).toBe(false);
    expect(component.newTodo).toBe('');
  });

  it('should trim whitespace when adding todo', () => {
    component.newTodo = '  Test Todo  ';
    component.addTodo();

    expect(component.todos.length).toBe(1);
    expect(component.todos[0].text).toBe('Test Todo');
    expect(component.newTodo).toBe('');
  });

  it('should not add todo when newTodo is empty', () => {
    component.newTodo = '   ';
    component.addTodo();

    expect(component.todos.length).toBe(0);
    expect(component.newTodo).toBe('   ');
  });

  it('should not add todo when newTodo is empty string', () => {
    component.newTodo = '';
    component.addTodo();

    expect(component.todos.length).toBe(0);
  });

  it('should delete todo at specified index', () => {
    // Agregar algunos todos primero
    component.todos = [
      { text: 'Todo 1', completed: false },
      { text: 'Todo 2', completed: true },
      { text: 'Todo 3', completed: false }
    ];

    component.deleteTodo(1);

    expect(component.todos.length).toBe(2);
    expect(component.todos[0].text).toBe('Todo 1');
    expect(component.todos[1].text).toBe('Todo 3');
  });

  it('should toggle completed status at specified index', () => {
    // Agregar algunos todos primero
    component.todos = [
      { text: 'Todo 1', completed: false },
      { text: 'Todo 2', completed: true }
    ];

    component.toggleCompleted(0);
    expect(component.todos[0].completed).toBe(true);

    component.toggleCompleted(1);
    expect(component.todos[1].completed).toBe(false);
  });

  it('should handle multiple todo operations', () => {
    // Agregar múltiples todos
    component.newTodo = 'First Todo';
    component.addTodo();

    component.newTodo = 'Second Todo';
    component.addTodo();

    expect(component.todos.length).toBe(2);

    // Alternar primer todo
    component.toggleCompleted(0);
    expect(component.todos[0].completed).toBe(true);
    expect(component.todos[1].completed).toBe(false);

    // Eliminar segundo todo
    component.deleteTodo(1);
    expect(component.todos.length).toBe(1);
    expect(component.todos[0].text).toBe('First Todo');
    expect(component.todos[0].completed).toBe(true);
  });
});
