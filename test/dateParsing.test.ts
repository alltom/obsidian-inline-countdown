import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {findDatesInText} from '../src/dateParsing';

void test('finds wiki-link date format', () => {
  const text = 'Meeting on [[2025-06-20]] at 3pm';
  const matches = findDatesInText(text);

  assert.equal(matches.length, 1);
  assert.deepEqual(matches[0], {
    index: 11,
    endIndex: 25,
    dateString: '2025-06-20',
    isDueDate: false,
  });
});

void test('finds wiki-link date with alias', () => {
  const text = 'Meeting on [[2025-06-20|tomorrow]] at 3pm';
  const matches = findDatesInText(text);

  assert.equal(matches.length, 1);
  assert.deepEqual(matches[0], {
    index: 11,
    endIndex: 34,
    dateString: '2025-06-20',
    isDueDate: false,
  });
});

void test('finds Tasks plugin emoji format', () => {
  const text = '- [ ] Do the thing 📅 2025-06-20';
  const matches = findDatesInText(text);

  assert.equal(matches.length, 1);
  assert.deepEqual(matches[0], {
    index: 19,
    endIndex: 32,
    dateString: '2025-06-20',
    isDueDate: true,
  });
});

void test('finds Tasks plugin emoji format with spaces', () => {
  const text = '- [ ] Do the thing 📅  2025-06-20';
  const matches = findDatesInText(text);

  assert.equal(matches.length, 1);
  assert.deepEqual(matches[0], {
    index: 19,
    endIndex: 33,
    dateString: '2025-06-20',
    isDueDate: true,
  });
});

void test('finds multiple dates in mixed formats', () => {
  const text = 'Start [[2025-06-20]] and finish 📅 2025-06-25';
  const matches = findDatesInText(text);

  assert.equal(matches.length, 2);
  assert.deepEqual(matches[0], {
    index: 6,
    endIndex: 20,
    dateString: '2025-06-20',
    isDueDate: false,
  });
  assert.deepEqual(matches[1], {
    index: 32,
    endIndex: 45,
    dateString: '2025-06-25',
    isDueDate: true,
  });
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
