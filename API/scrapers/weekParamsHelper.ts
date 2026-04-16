export function getWeekParam(offsetWeeks: number): string {
  const date = new Date();

  date.setDate(date.getDate() + offsetWeeks * 7);

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Forex Factory uses a specific format for the week parameter
  // example: "may14.2026" for the week of 14 may 2026
  return `${month}${day}.${year}`;
}
