import {SimpleDate, parseSimpleDate} from './simpleDate';

export interface DateMatch {
  index: number;
  endIndex: number;
  dateString: string;
  date: SimpleDate;
  isDueDate: boolean;
}

export function findDatesInText(text: string): DateMatch[] {
  const regex =
    /(?:\[\[(\d{4}-\d{2}-\d{2})(?:\|[^\]]+)?\]\]|📅\s*(\d{4}-\d{2}-\d{2}))/g;
  const matches: DateMatch[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const dateString = match[1] || match[2];
    if (dateString) {
      const date = parseSimpleDate(dateString);
      if (date) {
        matches.push({
          index: match.index,
          endIndex: match.index + match[0].length,
          dateString,
          date,
          isDueDate: !!match[2], // true if emoji format (match[2]), false if wiki-link (match[1])
        });
      }
    }
  }

  return matches;
}
