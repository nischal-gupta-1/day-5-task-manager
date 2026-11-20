# Taskboard

A responsive task management dashboard built with **HTML, CSS and TypeScript**. Add, edit, complete, filter, search and sort tasks while a live summary tracks your total, completed and pending work. No frameworks, no runtime dependencies. Tasks persist in the browser via `localStorage`.

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Usage](#usage)
- [Form validation rules](#form-validation-rules)
- [Responsive design](#responsive-design)
- [Project structure](#project-structure)
- [How the code is organised](#how-the-code-is-organised)
- [Git workflow](#git-workflow)
- [Possible improvements](#possible-improvements)

## Features

**Dashboard**

- Header with navigation links (collapses into a menu on mobile)
- Summary cards for total, completed and pending tasks, updated instantly

**Task management**

- Add, edit, delete, and mark tasks complete or pending
- Filter by All, Pending or Completed
- Search by task title
- Sort by newest, due date, priority or title
- Priority badges and colour-coded borders; overdue tasks are flagged
- Empty state with different messages for "no tasks yet" and "no matches"
- Data saved to `localStorage`, so tasks survive a page refresh

**Form**

- Fields: title, description, priority dropdown, due date
- Required-field checks, inline error messages and a success message
- The same form handles editing, with a Cancel button to back out

**Quality**

- Strict TypeScript with typed DOM access and events, and no `any`
- Semantic HTML, labelled inputs, ARIA states and visible keyboard focus
- Task text is rendered with `textContent`, never `innerHTML`, so user input cannot inject markup

## Tech stack

| Area    | Tools                                                  |
| ------- | ------------------------------------------------------ |
| Markup  | HTML5                                                  |
| Styling | CSS3 (custom properties, grid, flexbox, media queries) |
| Logic   | TypeScript 5 (strict mode, ES modules)                 |
| Tooling | npm, `tsc`, Git, GitHub                                |

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org/) 18 or newer and Git.

```bash
# 1. Clone and enter the project
git clone https://github.com/<your-username>/day-5-task-manager.git
cd day-5-task-manager

# 2. Install TypeScript
npm install

# 3. Compile (outputs to dist/)
npm run build
```

Then serve the folder with a local server and open `index.html`. The easiest option is the **Live Server** extension in VS Code (right-click `index.html`, then "Open with Live Server").

> ES modules do not load from `file://`, so double-clicking `index.html` will not work.

### npm scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run build` | Compile `src/ts` to `dist/` once      |
| `npm run watch` | Recompile automatically on every save |

## Usage

1. Fill in the form with a title, description, priority and due date, then choose **Add task**.
2. Use **Mark complete**, **Edit** or **Delete** on any task card.
3. Narrow the list with the **All / Pending / Completed** chips, the search box and the sort menu.
4. Watch the summary cards at the top update as you work.

## Form validation rules

| Field       | Rule                            |
| ----------- | ------------------------------- |
| Title       | Required, 3 to 80 characters    |
| Description | Required, up to 300 characters  |
| Priority    | Must choose Low, Medium or High |
| Due date    | Required, must be a valid date  |

Errors appear under the relevant field and the field is marked invalid for assistive technology. A success message confirms each add or update.

## Responsive design

| Layout  | Width           | Behaviour                                                                       |
| ------- | --------------- | ------------------------------------------------------------------------------- |
| Desktop | above 900px     | Form and task list side by side; form stays in view while scrolling             |
| Tablet  | 641px to 900px  | Single column; summary cards stay in a row                                      |
| Mobile  | 640px and below | Hamburger navigation, stacked summary cards, full-width form fields and buttons |

Grid children use `minmax(0, 1fr)` and long text uses `overflow-wrap`, so nothing causes horizontal scrolling.

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

## How the code is organised

- **`types.ts`** defines the `Task` interface, the `Priority` union type (`"low" | "medium" | "high"`), and the filter, sort and validation types.
- **`utils.ts`** holds pure helpers: validation, ID generation, date formatting and the overdue check.
- **`tasks.ts`** owns the array of tasks and every operation on it. It uses `filter`, `map` and `sort` and never mutates state in place.
- **`main.ts`** is the only file that touches the DOM. It reads the form, renders the list, and uses event delegation for the task buttons.

Data flows one way: an event handler calls a function in `tasks.ts`, then `render()` redraws the summary and list from the current state.

## Git workflow

Each feature was built on its own branch, merged into `main`, and committed using [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix   | Used for                                 |
| -------- | ---------------------------------------- |
| `chore:` | Repository setup                         |
| `feat:`  | New functionality                        |
| `style:` | CSS and layout                           |
| `fix:`   | Bug fixes (for example, mobile overflow) |
| `docs:`  | README and documentation                 |

## Possible improvements

- Due-date reminders and a "due today" view
- Drag-and-drop reordering
- Categories or tags
- Dark mode
- Unit tests for `tasks.ts` and `utils.ts`

## Author

Built by **Nischal Gupta** as the Day 5 mini-project.
