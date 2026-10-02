import { Todo } from "./Todo.js";
import { validate } from "./validators.js";
import { loadTodos, saveTodos } from "./storage.js";
import { debounce} from "./utils.js";

const form = document.getElementById("todo-form");
const list = document.getElementById("list");
const search = document.getElementById("search");
const filters = document.getElementById("filters");
const stats = document.getElementById("stats");
const errorBox = document.getElementById("error");

let todos = loadTodos()
let query = "";
let filter = "all";

const persist = () => { saveTodos(todos); render(); };

function render() {
  const visible = todos
    .filter(t => filter === "all" || (filter === "done" ? t.done : !t.done))
    .filter(t => t.title.toLowerCase().includes(query));

  list.innerHTML = visible
    .map(({ id, title, priority, dueDate, done, isOverdue }) => `
      <li data-id="${id}" style="${done ? "opacity:.5;text-decoration:line-through" : ""}">
        <input type="checkbox" data-action="toggle" ${done ? "checked" : ""}>
        ${title} [${priority}]
        ${dueDate ? `- ${dueDate}` : ""} ${isOverdue ? `<span class="overdue"> Overdue</span>` : ""}
        <button data-action="delete">Delete</button>
      </li>`)
    .join("");

  const { total, completed, high } = todos.reduce(
    (acc, t) => ({
      ...acc,
      total: acc.total + 1,
      completed: acc.completed + (t.done ? 1 : 0),
      high: acc.high + (!t.done && t.priority === "high" ? 1 : 0),
    }),
    { total: 0, completed: 0, high: 0 }
  );
  stats.textContent = `Total: ${total} | Done: ${completed} | High priority pending: ${high}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    const data = Object.fromEntries(new FormData(form));
    validate(data);
    todos = [...todos, new Todo(data)];
    errorBox.textContent = "";
    form.reset();
    persist();
  } catch (err) {
    errorBox.textContent = err.message;
  }
});

list.addEventListener("click", (e) => {
  const { action } = e.target.dataset;
  if (!action) return;
  const id = e.target.closest("li").dataset.id;

  if (action === "delete") todos = todos.filter(t => t.id !== id);
  if (action === "toggle") todos.find(t => t.id === id)?.toggle();
  persist();
});

filters.addEventListener("click", (e) => {
  if (!e.target.dataset.filter)return;
  filter = e.target.dataset.filter;
  render();
});

search.addEventListener("input", debounce((e) => {
  query = e.target.value.toLowerCase();
  render();
}, 1000));

render();