import { parseFloats } from "../helpers/parseFloats";
import { scrapeOpenInsider } from "./openinsider";

export async function processTransactions(prisma: any) {
  const transactions = await scrapeOpenInsider();

  for (const transaction of transactions) {

    const flow = await prisma.insiderTransaction.findUnique({
      where: { ticker: transaction.ticker },
    });

    console.log("flow -> ", flow)

    if (flow?.lastTransactionId === transaction.id) {
      console.log(flow.lastTransactionId, "update already processed")
      break;
    }

    const netValue = parseFloats(transaction.value, true);
    const netShares = parseFloats(transaction.shares);

    await prisma.insiderTransaction.upsert({
      where: { ticker: transaction.ticker },

      update: {
        netValue: { increment: netValue },
        netShares: { increment: netShares },
        lastTransactionId: transaction.id,
        lastUpdated: new Date(),
      },

      create: {
        ticker: transaction.ticker,
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
