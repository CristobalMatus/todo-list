import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Todo {
  text: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private storageKey = 'todo-list-tasks';
  private todosSubject: BehaviorSubject<Todo[]>;
  public todos$: Observable<Todo[]>;

  constructor() {
    const initial = this.getTodosFromStorage();
    this.todosSubject = new BehaviorSubject<Todo[]>(initial);
    this.todos$ = this.todosSubject.asObservable();
  }

  private getTodosFromStorage(): Todo[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private updateStorage(todos: Todo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }

  getTodos(): Todo[] {
    return this.todosSubject.value;
  }

  addTodo(text: string): void {
    const todos = [...this.todosSubject.value, { text, completed: false }];
    this.todosSubject.next(todos);
    this.updateStorage(todos);
  }

  deleteTodo(todo: Todo): void {
    const todos = this.todosSubject.value.filter(t => t.text !== todo.text);
    this.todosSubject.next(todos);
    this.updateStorage(todos);
  }

  toggleCompleted(todo: Todo): void {
    const todos = this.todosSubject.value.map(t =>
      t.text === todo.text ? { ...t, completed: !t.completed } : t
    );
    this.todosSubject.next(todos);
    this.updateStorage(todos);
  }
}
