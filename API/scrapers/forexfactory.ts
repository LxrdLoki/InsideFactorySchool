import * as cheerio from 'cheerio';
import { getWeekParam } from './weekParamsHelper';

export async function scrapeForexFactory(WeekOffset: number) {

  // Get the week parameter for the current week (0) or next week (1), etc.
  const weekParam = getWeekParam(WeekOffset);

  console.log(weekParam)

  const url = WeekOffset === 0 ? 'https://www.forexfactory.com/calendar.php' : `https://www.forexfactory.com/calendar?week=${weekParam}`;

  console.log(url)
  // forex factory's calendar page doesn't allow CORS request so had to sploof the request headers to make it work
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
  });
  const html = await response.text();

  const $ = cheerio.load(html);

  const events: any[] = [];
  let currentDate = '';

  // Loop through each row in the calendar table and extract the relevant data
  $('.calendar__row').each((index, element) => {
    const time = $(element).find('.calendar__time').text().trim();

    const dateText = $(element).find('.calendar__date').text().trim();

    if (dateText) {
      currentDate = dateText;
    }
    const currency = $(element).find('.calendar__currency').text().trim();

    // Since impact is an SVG it doesn't get taken with .text()
    const impactEl = $(element).find('.calendar__impact span');
    const impactTitle = impactEl.attr('class') || '';

    let impact = '';

    if (impactTitle.includes('icon--ff-impact-red')) {
      impact = 'high';
    } else if (impactTitle.includes('icon--ff-impact-ora')) {
      impact = 'medium';
    }

    const event = $(element).find('.calendar__event').text().trim();
    const actual = $(element).find('.calendar__actual').text().trim();
    const forecast = $(element).find('.calendar__forecast').text().trim();
    const previous = $(element).find('.calendar__previous').text().trim();

    if (event && currency === "USD" && (impact === 'high' || impact === 'medium')) {
      events.push({
        date: currentDate,
        time,
        currency,
        impact,
        event,
        actual,
        forecast,
        previous,
      });
    }
  });

  console.log(events)
  return events;
}
