import { format, formatDistanceToNow, isToday, isYesterday, startOfDay, differenceInCalendarDays } from 'date-fns';

export function formatDate(iso) {
  return format(new Date(iso), 'MMM d, yyyy');
}

export function formatRelative(iso) {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function isDateToday(iso) {
  return isToday(new Date(iso));
}

export function isDateYesterday(iso) {
  return isYesterday(new Date(iso));
}

export function daysBetween(a, b) {
  return differenceInCalendarDays(startOfDay(new Date(b)), startOfDay(new Date(a)));
}

export function todayISO() {
  return startOfDay(new Date()).toISOString();
}
