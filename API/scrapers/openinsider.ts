import * as cheerio from 'cheerio';

export async function scrapeOpenInsider() {
  const url = 'http://openinsider.com/latest-insider-trading';

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
  });
  const html = await response.text();

  const $ = cheerio.load(html);

  const events: any[] = [];

  // Loop through each row in the calendar table and extract the relevant data
  $('.tinytable tbody tr').each((index, element) => {
    const cols = $(element).find('td');

    const fillingDate = $(cols[1]).text().trim();
    const date = $(cols[2]).text().trim();
    const ticker = $(cols[3]).text().trim();
    const companyName = $(cols[4]).text().trim();
    const type = $(cols[7]).text().trim();
    const pricePerShare = $(cols[8]).text().trim();
    const shares = $(cols[9]).text().trim();
    const totalOwned = $(cols[10]).text().trim();
    const value = $(cols[12]).text().trim();

    // unique id to avoid duplicates in database
    const id = `${fillingDate}-${ticker}-${date}-${shares}-${value}`;

    events.push({
      ticker,
      date,
      id,
      companyName,
      type,
      pricePerShare,
      shares,
      totalOwned,
      value
    });
  });

  

  return events;
}
