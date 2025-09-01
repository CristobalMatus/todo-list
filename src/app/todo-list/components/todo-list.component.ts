import { Component, OnInit } from '@angular/core';
import { TodoListService, Todo } from '../services/todo-list.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  newTodo: string = '';
  todos: Todo[] = [];

  constructor(private todoService: TodoListService) {}

  ngOnInit() {
    this.todos = this.todoService.getTodos();
  }

  addTodo() {
    if (this.newTodo.trim()) {
      this.todos.push({ text: this.newTodo.trim(), completed: false });
      this.newTodo = '';
      this.todoService.saveTodos(this.todos);
    }
  }

  deleteTodo(index: number) {
    this.todos.splice(index, 1);
    this.todoService.saveTodos(this.todos);
  }

  toggleCompleted(index: number) {
    this.todos[index].completed = !this.todos[index].completed;
    this.todoService.saveTodos(this.todos);
  }
}
