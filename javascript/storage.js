import { Todo } from "./Todo.js";

const KEY = "todos";

export function loadTodos() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw).map(Todo.fromJSON) : [];
  } catch (err) {
    console.error("Storage corrupt:", err);
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(KEY, JSON.stringify(todos));
  } catch (err) {
    console.error("Save fail:", err);
  }
}