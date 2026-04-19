export function getWeekParam(offsetWeeks: number): string {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Use the most recent Sunday as the week anchor for Forex Factory
  // The router from forexfactory will reinitialize if the route is unknown,
  // so unless its a sunday starting point it will just redirect to the current week
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek + offsetWeeks * 7);

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  const month = months[sunday.getMonth()];
  const day = sunday.getDate();
  const year = sunday.getFullYear();

  // Forex Factory uses a specific format for the week parameter
  // example -> "may10.2026" for the week starting on Sunday 10 may 2026
  return `${month}${day}.${year}`;
}
