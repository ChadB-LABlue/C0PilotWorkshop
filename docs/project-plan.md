# Task Manager CLI Project Plan

## 1. Project overview
Task Manager CLI is a small Node.js 20+ command-line application for managing personal tasks entirely in memory during runtime. Users can create, list, update, and delete tasks, then filter by status or priority and sort by priority or creation date. The project is intentionally scoped for a workshop exercise, uses only built-in Node.js modules, and avoids external dependencies and databases.

## 2. User stories
1. As a user, I want to create a task so that I can track work I need to do.
Acceptance criteria:
- Given I run the create command with required inputs, a new task is added with a unique id.
- The task includes title, description, status, priority, createdAt, and updatedAt.
- If status or priority is not provided, defaults are applied (`todo`, `medium`).

2. As a user, I want to list all tasks so that I can review my current workload.
Acceptance criteria:
- Running the list command shows all tasks currently in memory.
- Output includes id, title, status, priority, and timestamps in a readable table-like format.
- If no tasks exist, the CLI prints a clear empty-state message.

3. As a user, I want to update a task so that I can keep task details accurate.
Acceptance criteria:
- Running the update command with a valid id updates one or more fields.
- `updatedAt` is refreshed whenever any field changes.
- If the id does not exist, the CLI returns a helpful error message.

4. As a user, I want to delete a task so that I can remove tasks that are no longer needed.
Acceptance criteria:
- Running the delete command with a valid id removes that task from memory.
- The CLI confirms successful deletion.
- If the id does not exist, the CLI returns a helpful error message.

5. As a user, I want to filter tasks by status or priority so that I can focus on relevant tasks.
Acceptance criteria:
- The list command accepts `--status` and `--priority` filters.
- Filter values are validated against allowed enums.
- Combined filters return only tasks matching all supplied criteria.

6. As a user, I want to sort tasks by priority or creation date so that I can triage effectively.
Acceptance criteria:
- The list command accepts `--sort priority` or `--sort createdAt`.
- Priority sorting uses order `high`, `medium`, `low`.
- Date sorting supports ascending and descending order via a flag (for example, `--desc`).

## 3. Data model
- `Task`
  - `id: string` - unique identifier (for example, incrementing string or timestamp-based id)
  - `title: string` - short task name, required, non-empty
  - `description: string` - optional longer details (can be empty string)
  - `status: 'todo' | 'in-progress' | 'done'`
  - `priority: 'low' | 'medium' | 'high'`
  - `createdAt: string` - ISO timestamp (`new Date().toISOString()`)
  - `updatedAt: string` - ISO timestamp

- `TaskStore` (in-memory collection)
  - `tasks: Task[]` - array storing current runtime tasks

## 4. File structure
```text
src/
  index.js             # CLI entry point and argument routing
  commands/
    create-task.js     # Create command handler
    list-tasks.js      # List with filter/sort handler
    update-task.js     # Update command handler
    delete-task.js     # Delete command handler
  core/
    task-store.js      # In-memory task array and CRUD operations
    task-service.js    # Business rules, validation, timestamps
  utils/
    parse-args.js      # Minimal argument parsing with process.argv
    format-output.js   # Console table/row formatting
    validators.js      # Enum and field validation helpers
  constants/
    enums.js           # Allowed status and priority values
```

## 5. Implementation phases
1. Milestone 1: CLI skeleton and command routing
- Create `src/index.js` to parse command name and options.
- Add usage/help output for invalid or missing commands.
- Establish shared enums and validation utilities.

2. Milestone 2: In-memory data layer and Task model
- Implement `TaskStore` with in-memory array and id generation.
- Implement create/read/update/delete methods with clear return values.
- Add timestamp handling for `createdAt` and `updatedAt`.

3. Milestone 3: CRUD command handlers
- Implement create, list, update, and delete command modules.
- Ensure input validation and user-friendly errors.
- Verify behavior for edge cases (missing fields, unknown id).

4. Milestone 4: Filtering and sorting
- Add status/priority filtering in list workflow.
- Add sorting by priority and creation date with optional descending order.
- Ensure predictable ordering rules and stable output.

5. Milestone 5: Output polish and workshop-ready verification
- Improve terminal formatting for readability.
- Perform manual test runs for all user stories.
- Document command examples in comments or README snippet for workshop participants.

## 6. Error handling conventions and input validation rules
### Error handling conventions
- All command handlers return a result object with either `{ ok: true, data }` or `{ ok: false, code, message }`.
- `index.js` is the only module that writes final user-facing errors to stderr and sets process exit codes.
- Use exit code `0` for success, `1` for validation errors, and `2` for unexpected runtime errors.
- Validation errors must be concise and actionable (for example, `Invalid --status value. Allowed: todo, in-progress, done`).
- Not-found operations (update/delete on unknown id) return `ok: false` with code `TASK_NOT_FOUND` and do not throw exceptions.
- Unexpected errors are caught at the CLI boundary, logged as a generic failure message, and optionally include a debug hint when `--verbose` is present.

### Input validation rules
- `title`
  - Required for create.
  - Must be a string after trimming.
  - Must be between 1 and 120 characters.
- `description`
  - Optional for create/update.
  - If provided, must be a string.
  - Maximum length: 1000 characters.
- `status`
  - Allowed values: `todo`, `in-progress`, `done`.
  - Default on create: `todo`.
  - Invalid values return a validation error and do not mutate state.
- `priority`
  - Allowed values: `low`, `medium`, `high`.
  - Default on create: `medium`.
  - Invalid values return a validation error and do not mutate state.
- `id`
  - Required for update/delete.
  - Must be a non-empty string.
  - Unknown ids produce `TASK_NOT_FOUND`.
- Filter flags
  - `--status` and `--priority` must pass enum validation.
  - If both are provided, filtering applies logical AND.
- Sort flags
  - `--sort` allowed values: `priority`, `createdAt`.
  - `--desc` is only valid when `--sort` is present.
  - Unknown sort fields return a validation error.
