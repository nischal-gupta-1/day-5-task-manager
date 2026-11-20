# Taskboard: Task Management Dashboard

A responsive task manager built with HTML, CSS and TypeScript. Add, edit, complete, filter, search and sort tasks, with a live summary of total, completed and pending work. Tasks are saved in the browser's `localStorage`.

![Desktop view](screenshots/desktop.png)

## Features

- Dashboard with summary cards for total, completed and pending tasks
- Add, edit, delete and mark tasks complete or pending
- Filter by All, Pending or Completed
- Search by task title and sort by newest, due date, priority or title
- Empty state when there are no tasks or no matches
- Form validation with inline errors and a success message (title, description, priority, due date)
- Overdue tasks highlighted
- Responsive layouts for desktop, tablet and mobile with a collapsible navigation menu and no horizontal overflow

## Technologies

- HTML5 (semantic structure, accessible labels and ARIA)
- CSS3 (custom properties, grid, flexbox, media queries)
- TypeScript (strict mode, ES modules)
- Git and GitHub

## Project structure

```
day-5-task-manager/
├── index.html
├── src/
│   ├── css/style.css
│   ├── ts/
│   │   ├── main.ts     # DOM wiring and event handlers
│   │   ├── tasks.ts    # add, edit, delete, filter, sort
│   │   ├── types.ts    # Task interface and Priority type
│   │   └── utils.ts    # validation and formatting helpers
│   └── assets/
├── dist/               # compiled JavaScript (git-ignored)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

1. Clone the repository and open the folder:
   ```bash
   git clone https://github.com/<your-username>/day-5-task-manager.git
   cd day-5-task-manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile TypeScript (use `npm run watch` to recompile on every save):
   ```bash
   npm run build
   ```
4. Serve the folder with a local server, for example the VS Code **Live Server** extension, and open `index.html`. ES modules do not load from `file://`, so opening the file directly will not work.

## Screenshots

| Desktop | Tablet | Mobile |
| --- | --- | --- |
| ![Desktop](screenshots/desktop.png) | ![Tablet](screenshots/tablet.png) | ![Mobile](screenshots/mobile.png) |
