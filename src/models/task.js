import { randomUUID } from 'node:crypto';
import {
  validateCategory,
  validateDescription,
  validateId,
  validatePriority,
  validateStatus,
  validateTitle
} from '../utils/validators.js';

/**
 * Represents a task domain entity.
 */
export class Task {
  /**
   * Create a task with validated properties.
   *
   * @param {object} input - Task initialization data.
   * @param {string} input.title - Task title.
   * @param {string} [input.description] - Task description.
   * @param {'todo' | 'in-progress' | 'done'} [input.status] - Task status.
   * @param {'low' | 'medium' | 'high'} [input.priority] - Task priority.
  * @param {string} [input.category] - Task category.
   * @param {string} [input.id] - Optional pre-defined id.
   * @param {string} [input.createdAt] - Optional pre-defined creation timestamp.
   * @param {string} [input.updatedAt] - Optional pre-defined update timestamp.
   */
  constructor(input = {}) {
    if (input === null || typeof input !== 'object' || Array.isArray(input)) {
      throw new TypeError('Task constructor input must be an object.');
    }

    const {
      id,
      title,
      description = '',
      status = 'todo',
      priority = 'medium',
      category = 'general',
      createdAt,
      updatedAt
    } = input;

    this.id = id === undefined ? randomUUID() : validateId(id);
    this.title = validateTitle(title);
    this.description = validateDescription(description);
    this.status = validateStatus(status);
    this.priority = validatePriority(priority);
    this.category = validateCategory(category);

    const createdTimestamp = createdAt ?? new Date().toISOString();
    const updatedTimestamp = updatedAt ?? createdTimestamp;

    this.createdAt = Task.#validateTimestamp(createdTimestamp, 'createdAt');
    this.updatedAt = Task.#validateTimestamp(updatedTimestamp, 'updatedAt');

    if (new Date(this.updatedAt).getTime() < new Date(this.createdAt).getTime()) {
      throw new TypeError('updatedAt must be greater than or equal to createdAt.');
    }
  }

  /**
   * Return a plain object representation for storage/transport.
   *
   * @returns {{id: string, title: string, description: string, status: string, priority: string, category: string, createdAt: string, updatedAt: string}}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Validate an ISO timestamp string.
   *
   * @param {string} value - Timestamp candidate.
   * @param {string} fieldName - Field label for error messaging.
   * @returns {string} Original timestamp if valid.
   */
  static #validateTimestamp(value, fieldName) {
    if (typeof value !== 'string') {
      throw new TypeError(`${fieldName} must be an ISO timestamp string.`);
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new TypeError(`${fieldName} must be a valid ISO timestamp string.`);
    }

    return value;
  }
}
