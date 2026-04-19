import { parseFloats } from "../helpers/parseFloats";
import { scrapeOpenInsider } from "./openinsider";
import { sanitizeString, isValidTransaction } from "../helpers/scrapeDataValidator";

// processes the transactions from open insider and updates the database accordingly
export async function processTransactions(prisma: any) {
  const transactions = await scrapeOpenInsider();

  // ensure to have olders -> newest when processing
  transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  for (const transaction of transactions) {

    if (!isValidTransaction(transaction)) {
      console.log(transaction.id, "transaction is not valid (potential XSS attack so skipped)")
      continue;
    }

    const exists = await prisma.allInsiderTransactions.findUnique({
      where: { id: transaction.id },
    });

    if (exists) {
      console.log(transaction.id, "transaction already exists")
      continue;
    }

    const cleanedTicker = sanitizeString(transaction.ticker);

    await prisma.allInsiderTransactions.create({
      data: {
        id: transaction.id,
        ticker: cleanedTicker,
        type: transaction.type,
        shares: parseFloats(transaction.shares),
        value: parseFloats(transaction.value, true),
        date: transaction.date,
      }
    })

    const flow = await prisma.insiderTransaction.findUnique({
      where: { ticker: transaction.ticker },
    });

    if (flow?.lastTransactionId === transaction.id) {
      console.log(transaction.id, "transaction already processed")
      continue;
    }

    const netValue = parseFloats(transaction.value, true);
    const netShares = parseFloats(transaction.shares);

    // check if ticker already exists in database,
    //if so update net value and shares, if not create new entry
    await prisma.insiderTransaction.upsert({
      where: { ticker: transaction.ticker },

      update: {
        netValue: { increment: netValue },
        netShares: { increment: netShares },
        lastTransactionId: transaction.id,
        lastUpdated: new Date(),
      },

      create: {
        ticker: cleanedTicker,
        netValue: netValue,
        netShares: netShares,
        transactionDate: transaction.date,
        lastTransactionId: transaction.id,
        trackingSince: new Date(),
        lastUpdated: new Date(),
      },
    });
  }

  return await prisma.insiderTransaction.findMany();
}
