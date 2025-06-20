import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {formatSemanticDuration, classifyDueDate} from '../src/dateFormat';
import {addOneDay, dateFromJsDate} from '../src/simpleDate';

void test('same day returns today', () => {
  const date = {year: 2024, month: 1, day: 4};
  assert.equal(formatSemanticDuration(date, date), 'today');
});

void test('future date shows correct format', () => {
  const current = {year: 2024, month: 1, day: 4};
  const future = {year: 2024, month: 2, day: 4};
  assert.equal(formatSemanticDuration(future, current), '1 month');
});

void test('future date with extra day', () => {
  const current = {year: 2024, month: 1, day: 4};
  const future = {year: 2024, month: 2, day: 5};
  assert.equal(formatSemanticDuration(future, current), '1 month, 1 day');
});

void test('past date shows arrow prefix', () => {
  const current = {year: 2024, month: 2, day: 4};
  const past = {year: 2024, month: 1, day: 4};
  assert.equal(formatSemanticDuration(past, current), '←1 month');
});

void test('handles years correctly', () => {
  const current = {year: 2024, month: 1, day: 4};
  const future = {year: 2025, month: 2, day: 5};
  assert.equal(
    formatSemanticDuration(future, current),
    '1 year, 1 month, 1 day',
  );
});

void test('reproduces bug: tomorrow should show 1 day', () => {
  const current = {year: 2025, month: 6, day: 19};
  const tomorrow = {year: 2025, month: 6, day: 20};
  assert.equal(formatSemanticDuration(tomorrow, current), '1 day');
});

void test('reproduces bug: 1 month should be 1 month', () => {
  const current = {year: 2025, month: 6, day: 19};
  const future = {year: 2025, month: 7, day: 19};
  assert.equal(formatSemanticDuration(future, current), '1 month');
});

void test('handles time of day correctly', () => {
  const current = {year: 2025, month: 6, day: 19}; // SimpleDate ignores time of day
  const tomorrow = {year: 2025, month: 6, day: 20};
  assert.equal(formatSemanticDuration(tomorrow, current), '1 day');
});

// Tests based on user's examples (assuming today is 2025-06-19)
void test('1 week from now: 2025-06-26', () => {
  const current = {year: 2025, month: 6, day: 19}; // June 19, 2025
  const future = {year: 2025, month: 6, day: 26}; // June 26, 2025
  assert.equal(formatSemanticDuration(future, current), '1 week');
});

void test('1 week, 1 day from now: 2025-06-27', () => {
  const current = {year: 2025, month: 6, day: 19}; // June 19, 2025
  const future = {year: 2025, month: 6, day: 27}; // June 27, 2025
  assert.equal(formatSemanticDuration(future, current), '1 week, 1 day');
});

void test('1 week ago: 2025-06-12', () => {
  const current = {year: 2025, month: 6, day: 19}; // June 19, 2025
  const past = {year: 2025, month: 6, day: 12}; // June 12, 2025
  assert.equal(formatSemanticDuration(past, current), '←1 week');
});

void test('1 week, 1 day ago: 2025-06-11', () => {
  const current = {year: 2025, month: 6, day: 19}; // June 19, 2025
  const past = {year: 2025, month: 6, day: 11}; // June 11, 2025
  assert.equal(formatSemanticDuration(past, current), '←1 week, 1 day');
});

void test('past due dates are classified as overdue', () => {
  const dueDate = {year: 2025, month: 6, day: 19};
  const today = {year: 2025, month: 6, day: 20};

  const status = classifyDueDate(dueDate, today);

  assert.equal(status, 'overdue');
});

void test('due dates matching today are classified as due', () => {
  const dueDate = {year: 2025, month: 6, day: 20};
  const today = {year: 2025, month: 6, day: 20};

  const status = classifyDueDate(dueDate, today);

  assert.equal(status, 'due');
});

void test('due dates 1 day in future are classified as nearly-due', () => {
  const dueDate = {year: 2025, month: 6, day: 21};
  const today = {year: 2025, month: 6, day: 20};

  const status = classifyDueDate(dueDate, today);

  assert.equal(status, 'nearly-due');
});

void test('due dates 3 days in future are classified as nearly-due', () => {
  const dueDate = {year: 2025, month: 6, day: 23};
  const today = {year: 2025, month: 6, day: 20};

  const status = classifyDueDate(dueDate, today);

  assert.equal(status, 'nearly-due');
});

void test('due dates 4 days in future are classified as future', () => {
  const dueDate = {year: 2025, month: 6, day: 24};
  const today = {year: 2025, month: 6, day: 20};

  const status = classifyDueDate(dueDate, today);

  assert.equal(status, 'future');
});

void test('adding one day advances to next day', () => {
  const date = {year: 2025, month: 6, day: 20};

  const nextDay = addOneDay(date);

  assert.deepEqual(nextDay, {year: 2025, month: 6, day: 21});
});

void test('adding one day crosses month boundary correctly', () => {
  const lastDayOfMonth = {year: 2025, month: 6, day: 30};

  const nextDay = addOneDay(lastDayOfMonth);

  assert.deepEqual(nextDay, {year: 2025, month: 7, day: 1});
});

void test('dateFromJsDate converts JS Date to SimpleDate', () => {
  const jsDate = new Date('2025-06-20T15:30:00');

  const simpleDate = dateFromJsDate(jsDate);

  assert.deepEqual(simpleDate, {year: 2025, month: 6, day: 20});
});
