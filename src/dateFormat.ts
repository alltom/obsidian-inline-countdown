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
