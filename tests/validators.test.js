import assert from 'node:assert/strict';
import test from 'node:test';
import {
  validateDescription,
  validateId,
  validateListOptions,
  validatePriority,
  validateSortBy,
  validateStatus,
  validateTitle
} from '../src/utils/validators.js';

test('validateTitle trims valid input', () => {
  assert.equal(validateTitle('  Build CLI  '), 'Build CLI');
});

test('validateTitle rejects non-string input', () => {
  assert.throws(() => validateTitle(123), /title must be a string\./);
});

test('validateTitle rejects empty or oversized strings', () => {
  assert.throws(() => validateTitle('   '), /title length must be between 1 and 120 characters\./);
  assert.throws(() => validateTitle('a'.repeat(121)), /title length must be between 1 and 120 characters\./);
});

test('validateDescription accepts empty string and rejects oversized value', () => {
  assert.equal(validateDescription(''), '');
  assert.throws(
    () => validateDescription('a'.repeat(1001)),
    /description length must be 1000 characters or fewer\./
  );
});

test('validateDescription rejects non-string input', () => {
  assert.throws(() => validateDescription(false), /description must be a string\./);
});

test('validateStatus accepts only supported values', () => {
  assert.equal(validateStatus('todo'), 'todo');
  assert.equal(validateStatus('in-progress'), 'in-progress');
  assert.equal(validateStatus('done'), 'done');
  assert.throws(() => validateStatus('blocked'), /status must be one of/);
});

test('validatePriority accepts only supported values', () => {
  assert.equal(validatePriority('low'), 'low');
  assert.equal(validatePriority('medium'), 'medium');
  assert.equal(validatePriority('high'), 'high');
  assert.throws(() => validatePriority('urgent'), /priority must be one of/);
});

test('validateId trims and rejects empty input', () => {
  assert.equal(validateId('  task-123  '), 'task-123');
  assert.throws(() => validateId('   '), /id must be a non-empty string\./);
});

test('validateSortBy accepts undefined and supported values only', () => {
  assert.equal(validateSortBy(undefined), undefined);
  assert.equal(validateSortBy('priority'), 'priority');
  assert.equal(validateSortBy('createdAt'), 'createdAt');
  assert.throws(() => validateSortBy('title'), /sortBy must be one of/);
});

test('validateListOptions returns normalized valid options', () => {
  assert.deepEqual(validateListOptions({}), {});
  assert.deepEqual(
    validateListOptions({ status: 'todo', priority: 'high', sortBy: 'priority' }),
    { status: 'todo', priority: 'high', sortBy: 'priority' }
  );
});

test('validateListOptions rejects invalid container and invalid fields', () => {
  assert.throws(() => validateListOptions(null), /options must be an object\./);
  assert.throws(() => validateListOptions([]), /options must be an object\./);
  assert.throws(() => validateListOptions({ status: 'blocked' }), /status must be one of/);
  assert.throws(() => validateListOptions({ priority: 'urgent' }), /priority must be one of/);
  assert.throws(() => validateListOptions({ sortBy: 'title' }), /sortBy must be one of/);
});
