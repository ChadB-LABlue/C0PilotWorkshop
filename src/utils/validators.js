/**
 * Validate and normalize a task title.
 *
 * @param {string} title - Raw task title.
 * @returns {string} Normalized title.
 * @throws {TypeError} When title is not a string or has invalid length.
 *
 * @example
 * validateTitle('Buy milk');
 * // 'Buy milk'
 *
 * @example
 * validateTitle('  Plan sprint  ');
 * // 'Plan sprint'
 */
export function validateTitle(title) {
  if (typeof title !== 'string') {
    throw new TypeError('title must be a string.');
  }

  const normalizedTitle = title.trim();

  if (normalizedTitle.length < 1 || normalizedTitle.length > 120) {
    throw new TypeError('title length must be between 1 and 120 characters.');
  }

  return normalizedTitle;
}

/**
 * Validate task description text.
 *
 * @param {string} description - Task description.
 * @returns {string} Description if valid.
 * @throws {TypeError} When description is not a string or exceeds max length.
 *
 * @example
 * validateDescription('');
 * // ''
 *
 * @example
 * validateDescription('Call vendor about invoice mismatch.');
 * // 'Call vendor about invoice mismatch.'
 */
export function validateDescription(description) {
  if (typeof description !== 'string') {
    throw new TypeError('description must be a string.');
  }

  if (description.length > 1000) {
    throw new TypeError('description length must be 1000 characters or fewer.');
  }

  return description;
}

/**
 * Validate task status.
 *
 * @param {string} status - Task status value.
 * @returns {'todo' | 'in-progress' | 'done'} Status when valid.
 * @throws {TypeError} When status is not one of the supported values.
 *
 * @example
 * validateStatus('todo');
 * // 'todo'
 *
 * @example
 * validateStatus('in-progress');
 * // 'in-progress'
 */
export function validateStatus(status) {
  if (typeof status !== 'string') {
    throw new TypeError('status must be a string.');
  }

  const allowedStatuses = ['todo', 'in-progress', 'done'];
  if (!allowedStatuses.includes(status)) {
    throw new TypeError("status must be one of: 'todo', 'in-progress', 'done'.");
  }

  return status;
}

/**
 * Validate task priority.
 *
 * @param {string} priority - Task priority value.
 * @returns {'low' | 'medium' | 'high'} Priority when valid.
 * @throws {TypeError} When priority is not one of the supported values.
 *
 * @example
 * validatePriority('low');
 * // 'low'
 *
 * @example
 * validatePriority('high');
 * // 'high'
 */
export function validatePriority(priority) {
  if (typeof priority !== 'string') {
    throw new TypeError('priority must be a string.');
  }

  const allowedPriorities = ['low', 'medium', 'high'];
  if (!allowedPriorities.includes(priority)) {
    throw new TypeError("priority must be one of: 'low', 'medium', 'high'.");
  }

  return priority;
}

/**
 * Validate a task id.
 *
 * @param {string} id - Task id value.
 * @returns {string} Normalized id.
 * @throws {TypeError} When id is not a non-empty string.
 *
 * @example
 * validateId('abc-123');
 * // 'abc-123'
 *
 * @example
 * validateId('  task-id  ');
 * // 'task-id'
 */
export function validateId(id) {
  if (typeof id !== 'string') {
    throw new TypeError('id must be a string.');
  }

  const normalizedId = id.trim();
  if (normalizedId.length === 0) {
    throw new TypeError('id must be a non-empty string.');
  }

  return normalizedId;
}

/**
 * Validate sort field value.
 *
 * @param {string | undefined} sortBy - Sort field.
 * @returns {'priority' | 'createdAt' | undefined} Sort field when valid.
 * @throws {TypeError} When sortBy is not supported.
 *
 * @example
 * validateSortBy('priority');
 * // 'priority'
 *
 * @example
 * validateSortBy(undefined);
 * // undefined
 */
export function validateSortBy(sortBy) {
  if (sortBy === undefined) {
    return undefined;
  }

  if (typeof sortBy !== 'string') {
    throw new TypeError('sortBy must be a string when provided.');
  }

  const allowedSortFields = ['priority', 'createdAt'];
  if (!allowedSortFields.includes(sortBy)) {
    throw new TypeError("sortBy must be one of: 'priority', 'createdAt'.");
  }

  return sortBy;
}

/**
 * Validate a list options object.
 *
 * @param {object} options - List options.
 * @param {string} [options.status] - Filter status.
 * @param {string} [options.priority] - Filter priority.
 * @param {string} [options.sortBy] - Sort key.
 * @returns {{status?: string, priority?: string, sortBy?: string}} Normalized options.
 * @throws {TypeError} When options or any field is invalid.
 *
 * @example
 * validateListOptions({ status: 'todo' });
 * // { status: 'todo' }
 *
 * @example
 * validateListOptions({ priority: 'high', sortBy: 'priority' });
 * // { priority: 'high', sortBy: 'priority' }
 */
export function validateListOptions(options = {}) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object.');
  }

  const normalized = {};

  if (options.status !== undefined) {
    normalized.status = validateStatus(options.status);
  }

  if (options.priority !== undefined) {
    normalized.priority = validatePriority(options.priority);
  }

  if (options.sortBy !== undefined) {
    normalized.sortBy = validateSortBy(options.sortBy);
  }

  return normalized;
}
