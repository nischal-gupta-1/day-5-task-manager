import type { Priority, SortKey, Task, TaskFilter, TaskInput, TaskSummary } from "./types.js";
import { generateId } from "./utils.js";

const STORAGE_KEY = "day5-tasks";
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

type ValidTaskInput = TaskInput & { priority: Priority };

let tasks: Task[] = load();

function load(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    /* storage unavailable: keep working in memory */
  }
}

export function addTask(input: ValidTaskInput): Task {
  const task: Task = {
    id: generateId(),
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority,
    dueDate: input.dueDate,
    completed: false,
    createdAt: Date.now(),
  };
  tasks = [task, ...tasks];
  save();
  return task;
}

export function updateTask(id: string, input: ValidTaskInput): void {
  tasks = tasks.map((t) =>
    t.id === id
      ? {
          ...t,
          title: input.title.trim(),
          description: input.description.trim(),
          priority: input.priority,
          dueDate: input.dueDate,
        }
      : t
  );
  save();
}

export function deleteTask(id: string): void {
  tasks = tasks.filter((t) => t.id !== id);
  save();
}

export function toggleComplete(id: string): void {
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  save();
}

export function getTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function getSummary(): TaskSummary {
  const completed = tasks.filter((t) => t.completed).length;
  return { total: tasks.length, completed, pending: tasks.length - completed };
}

export function queryTasks(filter: TaskFilter, search: string, sort: SortKey): Task[] {
  const term = search.trim().toLowerCase();

  return tasks
    .filter((t) => filter === "all" || (filter === "completed" ? t.completed : !t.completed))
    .filter((t) => t.title.toLowerCase().includes(term))
    .sort((a, b) => {
      switch (sort) {
        case "dueDate":
          return a.dueDate.localeCompare(b.dueDate);
        case "priority":
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
          return b.createdAt - a.createdAt;
      }
    });
}
