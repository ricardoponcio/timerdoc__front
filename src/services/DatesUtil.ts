const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
export function toISOStringDateSimple(dateI: string) {
  const tzOffset = -new Date().getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  const timezone = diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60);
  return dateI + (dateI.length === 10 ? 'T00:00:00' : '') + timezone;
}
/**
 * Transforma a entrada para colocar o ISO no final da data.
 * @example 2023-05-24T00:22:05.930Z -> 2023-05-23T21:22:05-03:00
 * @param dateI que deve ser adicionada o timezone
 * @returns data em ISO com o timezone local
 */
export function toISOStringWithTimezone(dateI: string | number | Date): string {
  const date = new Date(dateI);
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    diff +
    pad(tzOffset / 60) +
    ':' +
    pad(tzOffset % 60)
  );
}
