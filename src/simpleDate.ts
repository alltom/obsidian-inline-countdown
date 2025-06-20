export interface SimpleDate {
  year: number;
  month: number; // 1-based (1 = January)
  day: number;
}

export function parseSimpleDate(dateString: string): SimpleDate | undefined {
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return {year, month, day};
}

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
