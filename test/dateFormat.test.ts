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
  assert.equal(formatSemanticDuration(future, current), 'Sun; 1 month');
});

void test('future date with extra day', () => {
  const current = {year: 2024, month: 1, day: 4};
  const future = {year: 2024, month: 2, day: 5};
  assert.equal(formatSemanticDuration(future, current), 'Mon; 1 month, 1 day');
});

void test('past date shows arrow prefix', () => {
  const current = {year: 2024, month: 2, day: 4};
  const past = {year: 2024, month: 1, day: 4};
  assert.equal(formatSemanticDuration(past, current), 'Thu; ←1 month');
});

void test('handles years correctly', () => {
  const current = {year: 2024, month: 1, day: 4};
  const future = {year: 2025, month: 2, day: 5};
  assert.equal(
    formatSemanticDuration(future, current),
    'Wed; 1 year, 1 month, 1 day',
  );
});

void test('reproduces bug: tomorrow should be "tomorrow"', () => {
  const current = {year: 2025, month: 6, day: 19};
  const tomorrow = {year: 2025, month: 6, day: 20};
  assert.equal(formatSemanticDuration(tomorrow, current), 'tomorrow');
});

void test('yesterday should be "yesterday"', () => {
  const current = {year: 2025, month: 6, day: 19};
  const yesterday = {year: 2025, month: 6, day: 18};
  assert.equal(formatSemanticDuration(yesterday, current), 'yesterday');
});

void test('reproduces bug: 1 month should be 1 month', () => {
  const current = {year: 2025, month: 6, day: 19};
  const future = {year: 2025, month: 7, day: 19};
  assert.equal(formatSemanticDuration(future, current), 'Sat; 1 month');
});

void test('handles time of day correctly', () => {
  const current = {year: 2025, month: 6, day: 19};
  const tomorrow = {year: 2025, month: 6, day: 20};
  assert.equal(formatSemanticDuration(tomorrow, current), 'tomorrow');
});

void test('1 week from now: 2025-06-26', () => {
  const current = {year: 2025, month: 6, day: 19};
  const future = {year: 2025, month: 6, day: 26};

  const result = formatSemanticDuration(future, current);

  assert.equal(result, 'Thu; 1 week');
});

void test('1 week, 1 day from now: 2025-06-27', () => {
  const current = {year: 2025, month: 6, day: 19};
  const future = {year: 2025, month: 6, day: 27};

  const result = formatSemanticDuration(future, current);

  assert.equal(result, 'Fri; 1 week, 1 day');
});

void test('1 week ago: 2025-06-12', () => {
  const current = {year: 2025, month: 6, day: 19};
  const past = {year: 2025, month: 6, day: 12};

  const result = formatSemanticDuration(past, current);

  assert.equal(result, 'Thu; ←1 week');
});

void test('1 week, 1 day ago: 2025-06-11', () => {
  const current = {year: 2025, month: 6, day: 19};
  const past = {year: 2025, month: 6, day: 11};

  const result = formatSemanticDuration(past, current);

  assert.equal(result, 'Wed; ←1 week, 1 day');
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

void test('business day formatting', () => {
  const monday = {year: 2025, month: 8, day: 18};
  const tuesday = {year: 2025, month: 8, day: 19};
  const wednesday = {year: 2025, month: 8, day: 20};
  const thursday = {year: 2025, month: 8, day: 21};
  const friday = {year: 2025, month: 8, day: 22};
  const saturday = {year: 2025, month: 8, day: 23};
  const sunday = {year: 2025, month: 8, day: 24};
  const nextMonday = {year: 2025, month: 8, day: 25};

  assert.equal(formatSemanticDuration(tuesday, monday), 'tomorrow', 'Mon–Tue');
  assert.equal(
    formatSemanticDuration(wednesday, monday),
    'Wed; 2 days / 2 BD',
    'Mon–Wed',
  );
  assert.equal(
    formatSemanticDuration(thursday, monday),
    'Thu; 3 days / 3 BD',
    'Mon–Thu',
  );
  assert.equal(
    formatSemanticDuration(friday, monday),
    'Fri; 4 days / 4 BD',
    'Mon–Fri',
  );
  assert.equal(
    formatSemanticDuration(saturday, monday),
    'Sat; 5 days / 4 BD',
    'Mon–Sat',
  );
  assert.equal(
    formatSemanticDuration(sunday, monday),
    'Sun; 6 days / 4 BD',
    'Mon–Sun',
  );
  assert.equal(
    formatSemanticDuration(nextMonday, monday),
    'Mon; 1 week',
    'Mon–Mon',
  );
});
