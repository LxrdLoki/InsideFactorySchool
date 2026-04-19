import { parseFloats } from "./parseFloats";

//helper functions to validate and sanitize scraped data to prevent XSS attacks

// replace < and > with empty string to prevent XSS attacks
export function sanitizeString(input: string): string {
  return input.replace(/[<>]/g, '');
}

// validating the transactiondata to ensure it has a correct value
export function isValidTransaction(transaction: any): boolean {
  return (
    typeof transaction.ticker === 'string' &&
    transaction.ticker.length < 10 &&
    !isNaN(parseFloats(transaction.shares)) &&
    !isNaN(parseFloats(transaction.value, true))
  );
}
