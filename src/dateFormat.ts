export interface SimpleDate {
  year: number;
  month: number; // 1-based (1 = January)
  day: number;
}

export type DueDateStatus = 'overdue' | 'due' | 'nearly-due' | 'future';

export function dateFromJsDate(jsDate: Date): SimpleDate {
  return {
    year: jsDate.getFullYear(),
    month: jsDate.getMonth() + 1, // Convert from 0-based to 1-based
    day: jsDate.getDate(),
  };
}

export function compareDates(date1: SimpleDate, date2: SimpleDate): number {
  if (date1.year !== date2.year) return date1.year - date2.year;
  if (date1.month !== date2.month) return date1.month - date2.month;
  return date1.day - date2.day;
}

export function addOneDay(date: SimpleDate): SimpleDate {
  return dateFromJsDate(new Date(date.year, date.month - 1, date.day + 1));
}

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
  targetDate: Date,
  currentDate: Date,
): string {
  // Normalize to midnight for day-based comparisons
  const normalizedTarget = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const normalizedCurrent = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );

  const isPast = normalizedTarget < normalizedCurrent;
  const [earlier, later] = isPast
    ? [normalizedTarget, normalizedCurrent]
    : [normalizedCurrent, normalizedTarget];

  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(later.getFullYear(), later.getMonth(), 0);
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
