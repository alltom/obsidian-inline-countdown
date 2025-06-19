import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {formatSemanticDuration} from '../src/dateFormat';

void test('same day returns today', () => {
  const date = new Date('2024-01-04');
  assert.equal(formatSemanticDuration(date, date), 'today');
});

void test('future date shows correct format', () => {
  const current = new Date('2024-01-04');
  const future = new Date('2024-02-04');
  assert.equal(formatSemanticDuration(future, current), '1 month');
});

void test('future date with extra day', () => {
  const current = new Date('2024-01-04');
  const future = new Date('2024-02-05');
  assert.equal(formatSemanticDuration(future, current), '1 month, 1 day');
});

void test('past date shows arrow prefix', () => {
  const current = new Date('2024-02-04');
  const past = new Date('2024-01-04');
  assert.equal(formatSemanticDuration(past, current), '←1 month');
});

void test('handles years correctly', () => {
  const current = new Date('2024-01-04');
  const future = new Date('2025-02-05');
  assert.equal(
    formatSemanticDuration(future, current),
    '1 year, 1 month, 1 day',
  );
});

void test('reproduces bug: tomorrow should show 1 day', () => {
  const current = new Date('2025-06-19');
  const tomorrow = new Date('2025-06-20');
  assert.equal(formatSemanticDuration(tomorrow, current), '1 day');
});

void test('reproduces bug: 1 month should be 1 month', () => {
  const current = new Date('2025-06-19');
  const future = new Date('2025-07-19');
  assert.equal(formatSemanticDuration(future, current), '1 month');
});

void test('handles time of day correctly', () => {
  const current = new Date('2025-06-19T15:30:00'); // 3:30 PM today
  const tomorrow = new Date('2025-06-20T00:00:00'); // midnight tomorrow
  assert.equal(formatSemanticDuration(tomorrow, current), '1 day');
});

// Tests based on user's examples (assuming today is 2025-06-19)
void test('1 week from now: 2025-06-26', () => {
  const current = new Date(2025, 5, 19); // June 19, 2025
  const future = new Date(2025, 5, 26); // June 26, 2025
  assert.equal(formatSemanticDuration(future, current), '1 week');
});

void test('1 week, 1 day from now: 2025-06-27', () => {
  const current = new Date(2025, 5, 19); // June 19, 2025
  const future = new Date(2025, 5, 27); // June 27, 2025
  assert.equal(formatSemanticDuration(future, current), '1 week, 1 day');
});

void test('1 week ago: 2025-06-12', () => {
  const current = new Date(2025, 5, 19); // June 19, 2025
  const past = new Date(2025, 5, 12); // June 12, 2025
  assert.equal(formatSemanticDuration(past, current), '←1 week');
});

void test('1 week, 1 day ago: 2025-06-11', () => {
  const current = new Date(2025, 5, 19); // June 19, 2025
  const past = new Date(2025, 5, 11); // June 11, 2025
  assert.equal(formatSemanticDuration(past, current), '←1 week, 1 day');
});
