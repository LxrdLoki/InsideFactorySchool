import * as cheerio from 'cheerio';

export async function scrapeForexFactory() {
  const response = await fetch('https://www.forexfactory.com/calendar.php', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
  });
  const html = await response.text();

  console.log(html);

  const $ = cheerio.load(html);

  const events: any[] = [];

  $('.calendar__row').each((index, element) => {
    const time = $(element).find('.calendar__time').text().trim();
    const currency = $(element).find('.calendar__currency').text().trim();
    const impact = $(element).find('.calendar__impact').text().trim();
    const event = $(element).find('.calendar__event').text().trim();
    const actual = $(element).find('.calendar__actual').text().trim();
    const forecast = $(element).find('.calendar__forecast').text().trim();
    const previous = $(element).find('.calendar__previous').text().trim();

    if (event && currency === "USD") {
      events.push({
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

  return events;
}
