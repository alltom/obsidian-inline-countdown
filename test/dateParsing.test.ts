import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {findDatesInText} from '../src/dateParsing';

void test('finds wiki-link date format', () => {
  const text = 'Meeting on [[2025-06-20]] at 3pm';

  const matches = findDatesInText(text);

  assert.deepEqual(matches[0], {
    index: 11,
    endIndex: 25,
    dateString: '2025-06-20',
    date: {year: 2025, month: 6, day: 20},
    isDueDate: false,
  });
});

void test('finds wiki-link date with alias', () => {
  const text = 'Meeting on [[2025-06-20|tomorrow]] at 3pm';

  const matches = findDatesInText(text);

  assert.deepEqual(matches[0], {
    index: 11,
    endIndex: 34,
    dateString: '2025-06-20',
    date: {year: 2025, month: 6, day: 20},
    isDueDate: false,
  });
});

void test('finds Tasks plugin emoji format', () => {
  const text = '- [ ] Do the thing 📅 2025-06-20';

  const matches = findDatesInText(text);

  assert.deepEqual(matches[0], {
    index: 19,
    endIndex: 32,
    dateString: '2025-06-20',
    date: {year: 2025, month: 6, day: 20},
    isDueDate: true,
  });
});

void test('finds Tasks plugin emoji format with spaces', () => {
  const text = '- [ ] Do the thing 📅  2025-06-20';

  const matches = findDatesInText(text);

  assert.deepEqual(matches[0], {
    index: 19,
    endIndex: 33,
    dateString: '2025-06-20',
    date: {year: 2025, month: 6, day: 20},
    isDueDate: true,
  });
});

void test('finds Tasks plugin start date format', () => {
  const text = '- [ ] Complete project 🛫 2025-07-05';

  const matches = findDatesInText(text);

  assert.deepEqual(matches[0], {
    index: 23,
    endIndex: 36,
    dateString: '2025-07-05',
    date: {year: 2025, month: 7, day: 5},
    isDueDate: false,
  });
});

void test('finds Tasks plugin start date format with spaces', () => {
  const text = '- [ ] Complete project 🛫  2025-07-05';

  const matches = findDatesInText(text);

  assert.deepEqual(matches[0], {
    index: 23,
    endIndex: 37,
    dateString: '2025-07-05',
    date: {year: 2025, month: 7, day: 5},
    isDueDate: false,
  });
});

void test('finds multiple dates in mixed formats', () => {
  const text = '- [ ] Task with [[2025-06-20]] 📅 2025-06-25 🛫 2025-07-05';

  const matches = findDatesInText(text);

  assert.equal(matches.length, 3);
  assert.equal(matches[0]?.isDueDate, false); // wikilink
  assert.equal(matches[1]?.isDueDate, true); // due date
  assert.equal(matches[2]?.isDueDate, false); // start date
});

void test('returns empty array when no dates found', () => {
  const text = 'No dates in this text';

  const matches = findDatesInText(text);

  assert.equal(matches.length, 0);
});

void test('ignores invalid date formats', () => {
  const text = 'Invalid [[25-06-20]] and 📅 20-06-25';

  const matches = findDatesInText(text);

  assert.equal(matches.length, 0);
});
