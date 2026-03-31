import chalk from 'chalk';

/**
 * Return a status value wrapped in color based on its value.
 * @param {string} status - The status value (todo, in-progress, done).
 * @returns {string} The colored status string.
 */
export function colorizeStatus(status) {
  switch (status) {
    case 'done':
      return chalk.green(status);
    case 'in-progress':
      return chalk.yellow(status);
    case 'todo':
      return chalk.red(status);
    default:
      return status;
  }
}

/**
 * Return a priority value wrapped in color based on its value.
 * @param {string} priority - The priority value (low, medium, high).
 * @returns {string} The colored priority string.
 */
export function colorizePriority(priority) {
  switch (priority) {
    case 'high':
      return chalk.bold.red(priority);
    case 'medium':
      return chalk.bold.yellow(priority);
    case 'low':
      return chalk.dim(priority);
    default:
      return priority;
  }
}
