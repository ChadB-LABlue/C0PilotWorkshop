import {
  createTask,
  deleteTask,
  listTasks,
  updateTask
} from './services/taskService.js';
import { colorizeStatus, colorizePriority } from './utils/colors.js';

/**
 * Print a section title for demo output.
 *
 * @param {string} title - Section title.
 */
function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

/**
 * Format a task object with colored status and priority.
 * @param {Object} task - The task object.
 * @returns {Object} A formatted task with colored output.
 */
function formatTaskWithColors(task) {
  return {
    ...task,
    status: colorizeStatus(task.status),
    priority: colorizePriority(task.priority)
  };
}

/**
 * Print a task or array of tasks with colors.
 * @param {Object|Array} taskOrTasks - A task or list of tasks.
 */
function printTasksWithColors(taskOrTasks) {
  if (Array.isArray(taskOrTasks)) {
    taskOrTasks.forEach(task => console.log(formatTaskWithColors(task)));
  } else {
    console.log(formatTaskWithColors(taskOrTasks));
  }
}

/**
 * Demonstrate all Task Manager features.
 */
function main() {
  try {
    printSection('Create Tasks');
    const taskA = createTask({
      title: 'Write workshop docs',
      description: 'Draft exercise overview and expected outcomes.',
      status: 'todo',
      priority: 'high'
    });

    const taskB = createTask({
      title: 'Review pull requests',
      description: 'Check pending PRs for exercise updates.',
      status: 'in-progress',
      priority: 'medium'
    });

    const taskC = createTask({
      title: 'Refactor helper script',
      description: 'Simplify duplicate validation logic.',
      status: 'todo',
      priority: 'low'
    });

    console.log(taskA);
    console.log(taskB);
    console.log(taskC);

    printSection('List All Tasks');
    printTasksWithColors(listTasks());

    printSection('Filter: status=todo');
    printTasksWithColors(listTasks({ status: 'todo' }));

    printSection('Filter: priority=high');
    printTasksWithColors(listTasks({ priority: 'high' }));

    printSection('Sort: priority');
    printTasksWithColors(listTasks({ sortBy: 'priority' }));

    printSection('Sort: createdAt');
    printTasksWithColors(listTasks({ sortBy: 'createdAt' }));

    printSection('Update Task');
    const updatedTask = updateTask(taskA.id, {
      status: 'done',
      priority: 'medium'
    });
    printTasksWithColors(updatedTask);

    printSection('Delete Task');
    const deletedTask = deleteTask(taskC.id);
    printTasksWithColors(deletedTask);

    printSection('Final Task List');
    printTasksWithColors(listTasks());
  } catch (error) {
    console.error('Task Manager demo failed:', error);
    process.exitCode = 1;
  }
}

main();
