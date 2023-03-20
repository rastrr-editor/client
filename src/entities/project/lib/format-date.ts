export default function formatDate(date: Date): string {
  return (
    [
      date.getDate().toString().padStart(2, '0'),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getFullYear(),
    ].join('.') +
    ' ' +
    [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
    ].join(':')
  );
}
