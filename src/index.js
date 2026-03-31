import {
  createTask,
  deleteTask,
  listTasks,
  updateTask
} from './services/taskService.js';

/**
 * Print a section title for demo output.
 *
 * @param {string} title - Section title.
 */
function printSection(title) {
  console.log(`\n=== ${title} ===`);
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
    console.log(listTasks());

    printSection('Filter: status=todo');
    console.log(listTasks({ status: 'todo' }));

    printSection('Filter: priority=high');
    console.log(listTasks({ priority: 'high' }));

    printSection('Sort: priority');
    console.log(listTasks({ sortBy: 'priority' }));

    printSection('Sort: createdAt');
    console.log(listTasks({ sortBy: 'createdAt' }));

    printSection('Update Task');
    const updatedTask = updateTask(taskA.id, {
      status: 'done',
      priority: 'medium'
    });
    console.log(updatedTask);

    printSection('Delete Task');
    const deletedTask = deleteTask(taskC.id);
    console.log(deletedTask);

    printSection('Final Task List');
    console.log(listTasks());
  } catch (error) {
    console.error('Task Manager demo failed:', error);
    process.exitCode = 1;
  }
}

main();
