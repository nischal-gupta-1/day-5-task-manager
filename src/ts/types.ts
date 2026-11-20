export type Priority = "low" | "medium" | "high";
export type TaskFilter = "all" | "completed" | "pending";
export type SortKey = "dueDate" | "priority" | "title" | "newest";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // ISO date, e.g. 2026-12-31
  completed: boolean;
  createdAt: number;
}

/** What the form produces before a task has an id. Priority is "" until chosen. */
export interface TaskInput {
  title: string;
  description: string;
  priority: Priority | "";
  dueDate: string;
}

export type ValidationErrors = Partial<Record<keyof TaskInput, string>>;

export interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
}
