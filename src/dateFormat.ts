import {SimpleDate, compareDates, addOneDay} from './simpleDate';

export type DueDateStatus = 'overdue' | 'due' | 'nearly-due' | 'future';

export function classifyDueDate(
  dueDate: SimpleDate,
  today: SimpleDate,
): DueDateStatus {
  const comparison = compareDates(dueDate, today);

  if (comparison < 0) return 'overdue';
  if (comparison === 0) return 'due';

  // Check if within 3 days in the future
  let checkDate = today;
  for (let i = 1; i <= 3; i++) {
    checkDate = addOneDay(checkDate);
    if (compareDates(dueDate, checkDate) === 0) {
      return 'nearly-due';
    }
  }

  return 'future';
}

export function formatSemanticDuration(
  targetDate: SimpleDate,
  currentDate: SimpleDate,
): string {
  const isPast = compareDates(targetDate, currentDate) < 0;
  const [earlier, later] = isPast
    ? [targetDate, currentDate]
    : [currentDate, targetDate];

  let years = later.year - earlier.year;
  let months = later.month - earlier.month;
  let days = later.day - earlier.day;

  if (days < 0) {
    months--;
    const lastMonth = new Date(later.year, later.month - 1, 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);

  // Convert days to weeks if appropriate
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    parts.push(`${weeks} ${weeks === 1 ? 'week' : 'weeks'}`);
    if (remainingDays > 0) {
      parts.push(`${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`);
    }
  } else if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }

  if (parts.length === 0) return 'today';

  const result = parts.join(', ');
  return isPast ? `←${result}` : result;
}
