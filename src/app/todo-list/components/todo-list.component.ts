import { Component, OnInit } from '@angular/core';
import { TodoListService, Todo } from '../services/todo-list.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  newTodo: string = '';
  todos$: Observable<Todo[]>;
  activeTab: 'all' | 'active' | 'completed' = 'all';

  constructor(private todoService: TodoListService) {
    this.todos$ = this.todoService.todos$;
  }

  ngOnInit() {
    this.todos$.subscribe(todos => {
      //console.log('TODOS:', todos);
    });
  }

  addTodo() {
    if (this.newTodo.trim()) {
      this.todoService.addTodo(this.newTodo.trim());
      this.newTodo = '';
    }
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo);
  }

  toggleCompleted(todo: Todo) {
    this.todoService.toggleCompleted(todo);
  }

  getActiveTodos(todos: Todo[]): Todo[] {
    const activos = todos.filter(t => !t.completed);
    //console.log('ACTIVAS:', activos);
    return activos;
  }

  getCompletedTodos(todos: Todo[]): Todo[] {
    const completadas = todos.filter(t => t.completed);
    //console.log('COMPLETADAS:', completadas);
    return completadas;
  }
}
