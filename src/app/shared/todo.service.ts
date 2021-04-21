import { Injectable } from '@angular/core';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos?: Todo[] = [];

  constructor() {
    this.loadState();
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === 'todos') this.loadState();
    });
  }

  getTodos() {
    console.log(this.todos);
    return this.todos;
  }

  getTodo(id: string) {
    return this.todos?.find((t) => t.id === id);
  }

  addTodo(todo: Todo) {
    this.todos?.push(todo);
    this.saveState();
  }

  updateTodo(id: string, updateTodoFields: Partial<Todo>) {
    const todo = this.getTodo(id);
    Object.assign(todo, updateTodoFields);
    this.saveState();
  }

  deleteTodo(id: string) {
    const index = this.todos?.findIndex((t) => t.id === id);
    if (index === -1) return;
    this.todos?.splice(index!, 1);
    this.saveState();
  }

  saveState() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  loadState() {
    try {
      const todosInStorage = JSON.parse(localStorage.getItem('todos')!);
      // if (!todosInStorage) return;
      // clear the todos array while keeping the reference
      this.todos!.length = 0;
      this.todos!.push(...todosInStorage);
    } catch (e) {
      console.log('There was an error retrieving the todos from localStorage');
      console.log(e);
    }
  }
}
