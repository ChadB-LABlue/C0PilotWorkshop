import assert from 'node:assert/strict';
import test from 'node:test';
import { Task } from '../src/models/task.js';

test('Task constructor creates a valid task with defaults', () => {
  const task = new Task({ title: 'Plan sprint' });
  const json = task.toJSON();

  assert.equal(typeof json.id, 'string');
  assert.ok(json.id.length > 0);
  assert.equal(json.title, 'Plan sprint');
  assert.equal(json.description, '');
  assert.equal(json.status, 'todo');
  assert.equal(json.priority, 'medium');
  assert.equal(json.category, 'general');
  assert.equal(typeof json.createdAt, 'string');
  assert.equal(typeof json.updatedAt, 'string');
});

test('Task constructor trims title and accepts explicit valid fields', () => {
  const createdAt = '2026-01-01T00:00:00.000Z';
  const updatedAt = '2026-01-01T01:00:00.000Z';

  const task = new Task({
    id: '  task-1  ',
    title: '  Write docs  ',
    description: 'Describe architecture.',
    status: 'in-progress',
    priority: 'high',
    category: '  work  ',
    createdAt,
    updatedAt
  });

  const json = task.toJSON();

  assert.equal(json.id, 'task-1');
  assert.equal(json.title, 'Write docs');
  assert.equal(json.description, 'Describe architecture.');
  assert.equal(json.status, 'in-progress');
  assert.equal(json.priority, 'high');
  assert.equal(json.category, 'work');
  assert.equal(json.createdAt, createdAt);
  assert.equal(json.updatedAt, updatedAt);
});

test('Task constructor rejects invalid category', () => {
  assert.throws(
    () => new Task({ title: 'Valid title', category: '' }),
    /category length must be between 1 and 50 characters\./
  );
});

test('Task constructor rejects non-object input', () => {
  assert.throws(
    () => new Task('bad-input'),
    /Task constructor input must be an object\./
  );
});

test('Task constructor rejects invalid title', () => {
  assert.throws(
    () => new Task({ title: '' }),
    /title length must be between 1 and 120 characters\./
  );
});

test('Task constructor rejects invalid description', () => {
  assert.throws(
    () => new Task({ title: 'Valid title', description: 42 }),
    /description must be a string\./
  );
});

test('Task constructor rejects invalid status', () => {
  assert.throws(
    () => new Task({ title: 'Valid title', status: 'blocked' }),
    /status must be one of/
  );
});

test('Task constructor rejects invalid priority', () => {
  assert.throws(
    () => new Task({ title: 'Valid title', priority: 'urgent' }),
    /priority must be one of/
  );
});

test('Task constructor rejects invalid createdAt', () => {
  assert.throws(
    () => new Task({ title: 'Valid title', createdAt: 'invalid-date' }),
    /createdAt must be a valid ISO timestamp string\./
  );
});

test('Task constructor rejects invalid updatedAt', () => {
  assert.throws(
    () =>
      new Task({
        title: 'Valid title',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: 'invalid-date'
      }),
    /updatedAt must be a valid ISO timestamp string\./
  );
});

test('Task constructor rejects updatedAt earlier than createdAt', () => {
  assert.throws(
    () =>
      new Task({
        title: 'Valid title',
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z'
      }),
    /updatedAt must be greater than or equal to createdAt\./
  );
});

test('Task constructor accepts title boundary lengths of 1 and 120', () => {
  const minTitleTask = new Task({ title: 'A' });
  const maxTitleTask = new Task({ title: 'x'.repeat(120) });

  assert.equal(minTitleTask.toJSON().title, 'A');
  assert.equal(maxTitleTask.toJSON().title.length, 120);
});

test('Task constructor rejects title longer than 120 characters', () => {
  assert.throws(
    () => new Task({ title: 'x'.repeat(121) }),
    /title length must be between 1 and 120 characters\./
  );
});

test('Task constructor accepts and rejects description boundary lengths', () => {
  const maxDescriptionTask = new Task({
    title: 'Boundary description',
    description: 'x'.repeat(1000)
  });

  assert.equal(maxDescriptionTask.toJSON().description.length, 1000);

  assert.throws(
    () =>
      new Task({
        title: 'Boundary description',
        description: 'x'.repeat(1001)
      }),
    /description length must be 1000 characters or fewer\./
  );
});

test('Task constructor rejects array input as a boundary type mismatch', () => {
  assert.throws(
    () => new Task([]),
    /Task constructor input must be an object\./
  );
});

test('Task constructor rejects numeric type mismatches for string fields', () => {
  assert.throws(
    () => new Task({ title: Number.MAX_SAFE_INTEGER }),
    /title must be a string\./
  );

  assert.throws(
    () => new Task({ title: 'Typed', status: 1 }),
    /status must be a string\./
  );
});

test('Task constructor uses defaults when optional fields are missing or undefined', () => {
  const task = new Task({
    title: 'Optional fields',
    description: undefined,
    status: undefined,
    priority: undefined,
    category: undefined
  });

  const json = task.toJSON();

  assert.equal(json.description, '');
  assert.equal(json.status, 'todo');
  assert.equal(json.priority, 'medium');
  assert.equal(json.category, 'general');
});

test('Task model allows duplicate explicit ids for separate instances', () => {
  const first = new Task({ id: 'same-id', title: 'First' });
  const second = new Task({ id: 'same-id', title: 'Second' });

  assert.equal(first.toJSON().id, 'same-id');
  assert.equal(second.toJSON().id, 'same-id');
});

test('Task toJSON remains isolated during iterative snapshot mutation', () => {
  const task = new Task({ title: 'Review code' });
  const snapshots = [task.toJSON(), task.toJSON()];

  for (const snapshot of snapshots) {
    snapshot.title = 'Mutated while iterating';
  }

  assert.equal(task.toJSON().title, 'Review code');
});

test('Task toJSON returns a plain object copy', () => {
  const task = new Task({ title: 'Review code' });
  const first = task.toJSON();
  const second = task.toJSON();

  assert.notEqual(first, second);
  first.title = 'Mutated';
  assert.notEqual(second.title, 'Mutated');
});
