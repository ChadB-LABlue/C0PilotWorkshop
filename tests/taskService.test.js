import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask
} from '../src/services/taskService.js';

function resetTasks() {
  for (const task of listTasks()) {
    deleteTask(task.id);
  }
}

test('createTask stores and returns a task copy', () => {
  resetTasks();

  const created = createTask({
    title: 'Write tests',
    description: 'Add coverage for services.',
    status: 'todo',
    priority: 'high'
  });

  assert.equal(created.title, 'Write tests');
  assert.equal(created.description, 'Add coverage for services.');
  assert.equal(created.status, 'todo');
  assert.equal(created.priority, 'high');

  created.title = 'Mutated outside';
  const stored = listTasks();
  assert.equal(stored[0].title, 'Write tests');
});

test('createTask rejects invalid input payload', () => {
  resetTasks();

  assert.throws(
    () => createTask(null),
    /createTask input must be an object\./
  );
});

test('listTasks filters by status and priority', () => {
  resetTasks();

  createTask({ title: 'A', status: 'todo', priority: 'low' });
  createTask({ title: 'B', status: 'in-progress', priority: 'high' });
  createTask({ title: 'C', status: 'todo', priority: 'high' });

  const byStatus = listTasks({ status: 'todo' });
  const byPriority = listTasks({ priority: 'high' });

  assert.equal(byStatus.length, 2);
  assert.ok(byStatus.every((task) => task.status === 'todo'));

  assert.equal(byPriority.length, 2);
  assert.ok(byPriority.every((task) => task.priority === 'high'));
});

test('listTasks sorts by priority descending', () => {
  resetTasks();

  createTask({ title: 'Low', priority: 'low' });
  createTask({ title: 'High', priority: 'high' });
  createTask({ title: 'Medium', priority: 'medium' });

  const sorted = listTasks({ sortBy: 'priority' });
  assert.deepEqual(
    sorted.map((task) => task.priority),
    ['high', 'medium', 'low']
  );
});

test('listTasks sorts by createdAt ascending', async () => {
  resetTasks();

  const first = createTask({ title: 'First' });
  await new Promise((resolve) => setTimeout(resolve, 5));
  const second = createTask({ title: 'Second' });

  const sorted = listTasks({ sortBy: 'createdAt' });
  assert.deepEqual(
    sorted.map((task) => task.id),
    [first.id, second.id]
  );
});

test('listTasks rejects invalid options', () => {
  resetTasks();

  assert.throws(
    () => listTasks('invalid-options'),
    /options must be an object\./
  );
});

test('updateTask updates specified fields and bumps updatedAt', async () => {
  resetTasks();

  const created = createTask({
    title: 'Before update',
    description: 'Initial description',
    status: 'todo',
    priority: 'low'
  });

  await new Promise((resolve) => setTimeout(resolve, 5));

  const updated = updateTask(created.id, {
    title: 'After update',
    status: 'done',
    priority: 'high'
  });

  assert.equal(updated.title, 'After update');
  assert.equal(updated.description, 'Initial description');
  assert.equal(updated.status, 'done');
  assert.equal(updated.priority, 'high');
  assert.ok(new Date(updated.updatedAt).getTime() >= new Date(created.updatedAt).getTime());
});

test('updateTask rejects missing task id', () => {
  resetTasks();

  assert.throws(
    () => updateTask('missing-id', { title: 'Nope' }),
    /Task not found for id: missing-id/
  );
});

test('updateTask rejects invalid updates payload', () => {
  resetTasks();

  const created = createTask({ title: 'Has updates' });

  assert.throws(
    () => updateTask(created.id, null),
    /updates must be an object\./
  );
});

test('deleteTask removes and returns the deleted task', () => {
  resetTasks();

  const created = createTask({ title: 'Delete me' });
  const deleted = deleteTask(created.id);

  assert.equal(deleted.id, created.id);
  assert.equal(listTasks().length, 0);
});

test('deleteTask rejects missing task id', () => {
  resetTasks();

  assert.throws(
    () => deleteTask('missing-id'),
    /Task not found for id: missing-id/
  );
});
