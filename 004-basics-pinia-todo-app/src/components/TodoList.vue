<script setup>
import { useTodoListStore } from "../stores/todoList.js";
import { storeToRefs } from "pinia";

const store = useTodoListStore();
const { todoList } = storeToRefs(store);

const { toggleCompleted, deleteTodo } = store;
</script>

<template>
  <div v-for="todo in todoList" :key="todo.id" class="item">
    <div class="content">
      <span :class="{ completed: todo.completed }">{{ todo.item }}</span>
      <span @click.stop="toggleCompleted(todo.id)">&#10004;</span>
      <button @click="deleteTodo(todo.id)">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.completed {
  text-decoration: line-through;
}
</style>
