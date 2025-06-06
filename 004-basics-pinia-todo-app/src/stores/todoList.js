import { defineStore } from "pinia";

export const useTodoListStore = defineStore("todoList", {
  state: () => ({
    id: 0,
    todoList: [],
  }),
  actions: {
    addTodo(item) {
      this.todoList.push({ id: this.id++, item, completed: false });
    },
    deleteTodo(itemId) {
      this.todoList = this.todoList.filter((item) => item.id !== itemId);
    },

    toggleCompleted(idToFind) {
      const todo = this.todoList.find((todo) => todo.id === idToFind);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});
