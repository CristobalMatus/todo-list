import { TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoListService } from '../services/todo-list.service';
import { of } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let service: TodoListService;

  beforeEach(() => {
    const serviceMock = {
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      toggleCompleted: jest.fn(),
      todos$: of([]),
    };
    TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      providers: [
        { provide: TodoListService, useValue: serviceMock }
      ]
    });
    service = TestBed.inject(TodoListService);
    component = TestBed.createComponent(TodoListComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addTodo on service', () => {
    component.newTodo = 'Test';
    component.addTodo();
    expect(service.addTodo).toHaveBeenCalledWith('Test');
  });

  it('should call deleteTodo on service', () => {
    const todo = { text: 'Test', completed: false };
    component.deleteTodo(todo);
    expect(service.deleteTodo).toHaveBeenCalledWith(todo);
  });

  it('should call toggleCompleted on service', () => {
    const todo = { text: 'Test', completed: false };
    component.toggleCompleted(todo);
    expect(service.toggleCompleted).toHaveBeenCalledWith(todo);
  });
});
