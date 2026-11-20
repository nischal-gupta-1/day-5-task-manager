import type { Priority, Task, TaskInput, ValidationErrors } from "./types.js";

const PRIORITIES: readonly Priority[] = ["low", "medium", "high"];

export function isPriority(value: string): value is Priority {
  return (PRIORITIES as readonly string[]).includes(value);
}

export function validateTaskInput(input: TaskInput): ValidationErrors {
  const errors: ValidationErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title) errors.title = "Enter a title.";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 80) errors.title = "Title must be 80 characters or fewer.";

  if (!description) errors.description = "Enter a description.";
  else if (description.length > 300) errors.description = "Description must be 300 characters or fewer.";

  if (!input.priority) errors.priority = "Choose a priority.";

  if (!input.dueDate) errors.dueDate = "Pick a due date.";
  else if (Number.isNaN(new Date(input.dueDate).getTime())) errors.dueDate = "Enter a valid date.";

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function todayISO(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isOverdue(task: Task): boolean {
  return !task.completed && task.dueDate < todayISO();
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
