# Task Manager CLI — Project Plan

## Project Overview

Task Manager CLI is a Node.js command-line application that allows users to create, list, update, delete, filter, and sort tasks entirely in memory, with no external dependencies or database required. The application targets developers and power users who prefer a fast, scriptable interface for managing personal task lists during a project or workshop session.

---

## User Stories

1. **Create a task**
   - As a user, I can create a new task by providing a title, description, and priority so that I can track work items.
   - *Acceptance criteria:*
     - Task is assigned a unique numeric ID.
     - `status` defaults to `todo`.
     - `createdAt` and `updatedAt` are set to the current ISO timestamp.
     - The new task is printed to stdout in a human-readable format.

2. **List all tasks**
   - As a user, I can list all tasks so that I can see everything I need to do.
   - *Acceptance criteria:*
     - All tasks are displayed in a table or list format.
     - When no tasks exist, the output reads "No tasks found."

3. **Update a task**
   - As a user, I can update a task's title, description, status, or priority so that I can keep task information current.
   - *Acceptance criteria:*
     - Only the fields provided are changed; others remain unchanged.
     - `updatedAt` is refreshed on every update.
     - If the task ID does not exist, an error message is displayed and the process exits with code 1.

4. **Delete a task**
   - As a user, I can delete a task by ID so that I can remove completed or cancelled work.
   - *Acceptance criteria:*
     - The task is removed from the in-memory store.
     - A confirmation message is printed.
     - If the ID does not exist, an error message is displayed.

5. **Filter tasks**
   - As a user, I can filter tasks by status (`todo`, `in-progress`, `done`), by priority (`low`, `medium`, `high`), or by category (for example `work`, `personal`, `urgent`) so that I can focus on relevant items.
   - *Acceptance criteria:*
     - Filter results are displayed in the same format as the list command.
     - Invalid filter values produce a clear error message.

6. **Categorize tasks**
   - As a user, I can optionally assign a category when creating a task so that I can organize tasks by context.
   - *Acceptance criteria:*
     - `category` is optional and defaults to `general` when omitted.
     - If provided, `category` is stored on the task and returned in list output.
     - Invalid category values produce a clear validation error.

7. **Sort tasks**
   - As a user, I can sort the task list by priority (high → medium → low) or by creation date (newest or oldest first) so that I can prioritise my work.
   - *Acceptance criteria:*
     - Sort order is stable (tasks with equal keys retain their original order).
     - The `--sort` flag accepts `priority` and `date` as values.

8. **Error handling**
   - As a user, I receive clear, actionable error messages when I provide invalid input so that I can quickly correct mistakes.
   - *Acceptance criteria:*
     - Missing required arguments produce a usage hint.
     - Unknown commands print an error and the full usage summary.
     - All errors are written to `stderr`; the process exits with a non-zero code.

---

## Data Model

### Task

| Property    | Type                                        | Notes                       |
|-------------|---------------------------------------------|-----------------------------|
| `id`        | `number`                                    | Auto-incrementing integer   |
| `title`     | `string`                                    | Required, max 100 chars     |
| `description` | `string`                                  | Optional, defaults to `""`  |
| `status`    | `"todo" \| "in-progress" \| "done"`         | Defaults to `"todo"`        |
| `priority`  | `"low" \| "medium" \| "high"`               | Defaults to `"medium"`      |
| `category`  | `string`                                    | Optional, defaults to `"general"` |
| `createdAt` | `string` (ISO 8601)                         | Set on creation             |
| `updatedAt` | `string` (ISO 8601)                         | Updated on every change     |

### In-memory store

```js
// src/store.js
{
  tasks: Task[],   // ordered array of task objects
  nextId: number   // auto-increment counter
}
```

---

## File Structure

```
src/
├── index.js          # Entry point — parses argv and dispatches commands
├── store.js          # In-memory task store (singleton)
├── commands/
│   ├── create.js     # create command handler
│   ├── list.js       # list command handler
│   ├── update.js     # update command handler
│   ├── delete.js     # delete command handler
│   ├── filter.js     # filter command handler
│   └── sort.js       # sort command handler
├── validators.js     # Input validation helpers
├── formatters.js     # Output formatting helpers
└── errors.js         # Custom error types and exit helper
```

---

## Error Handling Conventions and Input Validation Rules

### Error handling conventions

- All user-facing errors are instances of a custom `AppError` class (defined in `src/errors.js`).
- Errors are written to `process.stderr`, never `process.stdout`.
- The process exits with code `1` on any handled error.
- Unhandled exceptions bubble up to a top-level `try/catch` in `src/index.js` which prints the message and exits with code `2`.

### Input validation rules

| Field       | Rule                                                         |
|-------------|--------------------------------------------------------------|
| `title`     | Required. Must be a non-empty string. Max 100 characters.    |
| `description` | Optional. If provided, must be a string. Max 500 characters. |
| `status`    | Must be one of `todo`, `in-progress`, `done`.                |
| `priority`  | Must be one of `low`, `medium`, `high`.                      |
| `category`  | Optional. If provided, must be a non-empty string. Defaults to `general`. |
| `id`        | Must be a positive integer. Must refer to an existing task.  |

Validation is centralised in `src/validators.js`. Each command calls the appropriate validator before mutating state, so validation logic is never duplicated.

---

## Implementation Phases

### Phase 1 — Core data layer (Milestone 1)

- [ ] Scaffold the project: create `src/` directory and all stub files.
- [ ] Implement `src/store.js` with `createTask`, `getAll`, `getById`, `updateTask`, and `deleteTask` functions.
- [ ] Implement `src/validators.js`.
- [ ] Implement `src/errors.js`.
- [ ] Write unit tests for the store and validators using Node.js built-in `assert`.

### Phase 2 — CLI commands (Milestone 2)

- [ ] Implement `src/index.js` argument parser (uses `process.argv`).
- [ ] Implement `create`, `list`, `update`, `delete` command handlers.
- [ ] Implement `src/formatters.js` for consistent output.
- [ ] Manual smoke-test all four commands end-to-end.

### Phase 3 — Filter and sort (Milestone 3)

- [ ] Implement `filter` command handler with `--status`, `--priority`, and `--category` flags.
- [ ] Implement `sort` command handler with `--sort priority` and `--sort date` options.
- [ ] Add tests for filter and sort logic.

### Phase 4 — Categories and validation hardening (Milestone 4)

- [ ] Add optional `category` support to task creation, defaulting to `general`.
- [ ] Extend validators to enforce category input rules.
- [ ] Add tests for category defaults and category-based filtering.

### Phase 5 — Polish and documentation (Milestone 5)

- [ ] Add `--help` flag that prints usage for all commands.
- [ ] Add input validation error messages with usage hints.
- [ ] Write `README.md` in `src/` describing how to run each command.
- [ ] Review and refactor for code clarity.
