import { Task } from '../models/task.js';
import {
  validateCategory,
  validateDescription,
  validateId,
  validateListOptions,
  validatePriority,
  validateStatus,
  validateTitle
} from '../utils/validators.js';

const priorityRank = {
  low: 1,
  medium: 2,
  high: 3
};

const tasks = [];

/**
 * Create and store a new task.
 *
 * @param {{title: string, description?: string, status?: string, priority?: string, category?: string}} input - Task creation input.
 * @returns {{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}} Created task.
 */
export function createTask(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('createTask input must be an object.');
  }

  const task = new Task({
    title: input.title,
    description: input.description ?? '',
    status: input.status ?? 'todo',
    priority: input.priority ?? 'medium',
    category: input.category ?? 'general'
  }).toJSON();

  tasks.push(task);
  return { ...task };
}

/**
 * List tasks with optional filtering and sorting.
 *
 * @param {{status?: string, priority?: string, category?: string, sortBy?: 'priority' | 'createdAt'}} [options] - Query options.
 * @returns {Array<{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}>} Matching tasks.
 */
export function listTasks(options = {}) {
  const normalizedOptions = validateListOptions(options);

  let result = tasks.filter((task) => {
    const statusMatches = normalizedOptions.status ? task.status === normalizedOptions.status : true;
    const priorityMatches = normalizedOptions.priority ? task.priority === normalizedOptions.priority : true;
    const categoryMatches = normalizedOptions.category ? task.category === normalizedOptions.category : true;
    return statusMatches && priorityMatches && categoryMatches;
  });

  if (normalizedOptions.sortBy === 'priority') {
    result = [...result].sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
  }

  if (normalizedOptions.sortBy === 'createdAt') {
    result = [...result].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  return result.map((task) => ({ ...task }));
}

/**
 * Update an existing task by id.
 *
 * @param {string} id - Task id.
 * @param {{title?: string, description?: string, status?: string, priority?: string, category?: string}} updates - Partial updates.
 * @returns {{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}} Updated task.
 */
export function updateTask(id, updates) {
  const normalizedId = validateId(id);

  if (updates === null || typeof updates !== 'object' || Array.isArray(updates)) {
    throw new TypeError('updates must be an object.');
  }

  const targetTask = tasks.find((task) => task.id === normalizedId);
  if (!targetTask) {
    throw new Error(`Task not found for id: ${normalizedId}`);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'title')) {
    targetTask.title = validateTitle(updates.title);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'description')) {
    targetTask.description = validateDescription(updates.description);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'status')) {
    targetTask.status = validateStatus(updates.status);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'priority')) {
    targetTask.priority = validatePriority(updates.priority);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'category')) {
    targetTask.category = validateCategory(updates.category);
  }

  targetTask.updatedAt = new Date().toISOString();
  return { ...targetTask };
}

/**
 * Delete an existing task by id.
 *
 * @param {string} id - Task id.
 * @returns {{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}} Deleted task.
 */
export function deleteTask(id) {
  const normalizedId = validateId(id);
  const taskIndex = tasks.findIndex((task) => task.id === normalizedId);

  if (taskIndex === -1) {
    throw new Error(`Task not found for id: ${normalizedId}`);
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  return { ...deletedTask };
}
