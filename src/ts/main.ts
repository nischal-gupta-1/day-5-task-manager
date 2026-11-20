import type { Priority, SortKey, Task, TaskFilter, TaskInput, ValidationErrors } from "./types.js";
import { addTask, deleteTask, getSummary, getTask, queryTasks, toggleComplete, updateTask } from "./tasks.js";
import { capitalize, formatDate, hasErrors, isOverdue, isPriority, validateTaskInput } from "./utils.js";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

const form = el<HTMLFormElement>("task-form");
const titleInput = el<HTMLInputElement>("title");
const descInput = el<HTMLTextAreaElement>("description");
const prioritySelect = el<HTMLSelectElement>("priority");
const dueInput = el<HTMLInputElement>("dueDate");
const submitBtn = el<HTMLButtonElement>("submit-btn");
const cancelBtn = el<HTMLButtonElement>("cancel-btn");
const formTitle = el<HTMLHeadingElement>("form-title");
const successMsg = el<HTMLParagraphElement>("success-msg");
const searchInput = el<HTMLInputElement>("search");
const sortSelect = el<HTMLSelectElement>("sort");
const taskList = el<HTMLUListElement>("task-list");
const emptyState = el<HTMLDivElement>("empty-state");
const emptyText = el<HTMLParagraphElement>("empty-text");
const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");
const navToggle = el<HTMLButtonElement>("nav-toggle");
const nav = el<HTMLElement>("site-nav");

let filter: TaskFilter = "all";
let editingId: string | null = null;
let successTimer: number | undefined;

const fields = {
  title: titleInput,
  description: descInput,
  priority: prioritySelect,
  dueDate: dueInput,
} as const;

/* ---------- rendering ---------- */

function renderSummary(): void {
  const { total, completed, pending } = getSummary();
  el<HTMLElement>("count-total").textContent = String(total);
  el<HTMLElement>("count-completed").textContent = String(completed);
  el<HTMLElement>("count-pending").textContent = String(pending);
}

function button(label: string, action: string, className = ""): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  b.dataset.action = action;
  b.className = `btn btn-small ${className}`.trim();
  return b;
}

function buildTaskItem(task: Task): HTMLLIElement {
  const li = document.createElement("li");
  li.className = `task priority-${task.priority}${task.completed ? " is-done" : ""}`;
  li.dataset.id = task.id;

  const head = document.createElement("div");
  head.className = "task-head";
  const title = document.createElement("h3");
  title.textContent = task.title;
  const badge = document.createElement("span");
  badge.className = `badge badge-${task.priority}`;
  badge.textContent = capitalize(task.priority);
  head.append(title, badge);

  const desc = document.createElement("p");
  desc.className = "task-desc";
  desc.textContent = task.description;

  const due = document.createElement("p");
  due.className = "task-due";
  due.textContent = `Due ${formatDate(task.dueDate)}`;
  if (isOverdue(task)) {
    due.classList.add("overdue");
    due.textContent += " (overdue)";
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.append(
    button(task.completed ? "Mark pending" : "Mark complete", "toggle"),
    button("Edit", "edit"),
    button("Delete", "delete", "btn-danger")
  );

  li.append(head, desc, due, actions);
  return li;
}

function renderTasks(): void {
  const sort = sortSelect.value as SortKey;
  const results = queryTasks(filter, searchInput.value, sort);

  taskList.replaceChildren(...results.map(buildTaskItem));

  const isEmpty = results.length === 0;
  emptyState.hidden = !isEmpty;
  if (isEmpty) {
    const { total } = getSummary();
    emptyText.textContent =
      total === 0
        ? "No tasks yet. Add your first task using the form."
        : "No tasks match your search or filter.";
  }
}

function render(): void {
  renderSummary();
  renderTasks();
}

/* ---------- form ---------- */

function readForm(): TaskInput {
  const p = prioritySelect.value;
  return {
    title: titleInput.value,
    description: descInput.value,
    priority: isPriority(p) ? p : "",
    dueDate: dueInput.value,
  };
}

function showErrors(errors: ValidationErrors): void {
  (Object.keys(fields) as (keyof typeof fields)[]).forEach((key) => {
    const message = errors[key] ?? "";
    el<HTMLElement>(`${key}-error`).textContent = message;
    fields[key].classList.toggle("invalid", message !== "");
    fields[key].setAttribute("aria-invalid", String(message !== ""));
  });
}

function showSuccess(message: string): void {
  successMsg.textContent = message;
  successMsg.hidden = false;
  window.clearTimeout(successTimer);
  successTimer = window.setTimeout(() => {
    successMsg.hidden = true;
  }, 3500);
}

function resetForm(): void {
  form.reset();
  showErrors({});
  editingId = null;
  formTitle.textContent = "Add a task";
  submitBtn.textContent = "Add task";
  cancelBtn.hidden = true;
}

function startEdit(task: Task): void {
  editingId = task.id;
  titleInput.value = task.title;
  descInput.value = task.description;
  prioritySelect.value = task.priority;
  dueInput.value = task.dueDate;
  showErrors({});
  formTitle.textContent = "Edit task";
  submitBtn.textContent = "Save changes";
  cancelBtn.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  titleInput.focus();
}

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const input = readForm();
  const errors = validateTaskInput(input);
  showErrors(errors);

  if (hasErrors(errors) || input.priority === "") {
    successMsg.hidden = true;
    return;
  }
  const valid = { ...input, priority: input.priority as Priority };

  if (editingId) {
    updateTask(editingId, valid);
    showSuccess("Task updated.");
  } else {
    addTask(valid);
    showSuccess("Task added.");
  }
  resetForm();
  render();
});

cancelBtn.addEventListener("click", resetForm);

/* ---------- list actions (event delegation) ---------- */

taskList.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const btn = target.closest<HTMLButtonElement>("button[data-action]");
  const item = target.closest<HTMLLIElement>("li[data-id]");
  if (!btn || !item) return;

  const id = item.dataset.id as string;
  switch (btn.dataset.action) {
    case "toggle":
      toggleComplete(id);
      break;
    case "edit": {
      const task = getTask(id);
      if (task) startEdit(task);
      return;
    }
    case "delete":
      if (!window.confirm("Delete this task?")) return;
      if (editingId === id) resetForm();
      deleteTask(id);
      break;
  }
  render();
});

/* ---------- filter, search, sort ---------- */

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter as TaskFilter;
    filterButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    renderTasks();
  });
});

searchInput.addEventListener("input", renderTasks);
sortSelect.addEventListener("change", renderTasks);

/* ---------- navigation ---------- */

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (event: MouseEvent) => {
  if ((event.target as HTMLElement).tagName === "A") {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

render();
