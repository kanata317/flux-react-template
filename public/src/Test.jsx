todolist.jsx
"use strict";

import React from 'react';
import Todo from './todo';

export default React.createClass({
  getInitialState() {
    return {
      todos: []
    };
  },

  saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  },

  fetchTodos() {
    return JSON.parse(localStorage.getItem('todos'));
  },


  render() {
    let todos = this.state.todos.map(todo => {
      return (
        <li key={todo.id} className={todo.complete ? 'completed' : ''}>
          <Todo onDelete={this.deleteTodo} onChangeComplete={this.changeComplete} todo={todo} />
        </li>
        );
    });

    return (
      <div>
        <input type="text" ref="addNew" placeholder="task name" />
        <button type="button" onClick={this.addTodo}>Add</button>
        <ul>{todos}</ul>
      </div>
      );
  }
});
