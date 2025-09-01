import { Injectable } from '@angular/core';

export interface Todo {
  text: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private storageKey = 'todo-list-tasks';

  getTodos(): Todo[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }
}
