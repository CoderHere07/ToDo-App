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
let editId = null;

const persist = () => { saveTodos(todos); render(); };

function render() {
  const visible = todos
    .filter(t => filter === "all" || (filter === "done" ? t.done : !t.done))
    .filter(t => t.title.toLowerCase().includes(query));

  if (visible.length === 0) {
    let message;

    if (todos.length === 0) {
      message = "No tasks yet. Add your first one above!";
    } else if (query) {
      message = `No tasks match "${esc(query)}".`;
    } else if (filter === "done") {
      message = "No completed tasks yet.";
    } else {
      message = "Nothing pending. You're all caught up! 🎉";
    }

  list.innerHTML = `<li class="empty">${message}</li>`;
} else {
  list.innerHTML = visible.map(({ id, title, priority, dueDate, done, isOverdue }) => {
      if(id === editId){
        return ` 
          <li data-id = ${id} class = "editing">
            <input class="edit-input" data-field="title" value="${title}" required>
            <select data-field="priority">
              <option value="low" ${priority === "low" ? "selected" : ""}>Low</option>
              <option value="medium" ${priority === "medium" ? "selected" : ""}>Medium</option>
              <option value="high" ${priority === "high" ? "selected" : ""}>High</option>
            </select>
            <input type="date" data-field="dueDate" value="${dueDate}">
            <button data-action="save">Save</button>
            <button data-action="cancel">Cancel</button>
          </li>
        `
      }
      
      return `
      <li data-id="${id}" style="${done ? "opacity:.5;text-decoration:line-through" : ""}">
        <input type="checkbox" data-action="toggle" ${done ? "checked" : ""}>
        <span class = "todo-text">
          ${title} [${priority}]
          ${dueDate ? `- ${dueDate}` : ""}
          ${isOverdue ? `<span class="overdue"> Overdue</span>` : ""}
        </span>
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </li>`;
    })
    .join("")
  };

  
  list.querySelector(".edit-input")?.focus();

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
  const li = e.target.closest("li");
  const id = li.dataset.id;
  if (action === "edit") {
    editId = id;
    return render();
  }
  if (action === "cancel") {
    editId = null;
    return render();
  }
  if (action === "save") {
    return saveEdit(li);
  }


  if (action === "delete") todos = todos.filter(t => t.id !== id);
  if (action === "toggle") todos.find(t => t.id === id)?.toggle();
  persist();
});

function saveEdit(li) {
  try{
    const changes ={
      title : li.querySelector("[data-field=title]").value.trim(),
      priority : li.querySelector("[data-field=priority]").value,
      dueDate : li.querySelector("[data-field=dueDate]").value,
    } 
    validate(changes);
    todos.find(t => t.id === li.dataset.id)?.update(changes);
    editId = null;
    persist();
  
  }
  catch(err){
    errorBox.textContent = err.message;
  }

}

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