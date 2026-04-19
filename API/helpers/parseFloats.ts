export function parseFloats(value: any, isMoney = false): number {

  if (!value) {
    return 0;
  }

  // remove currency symbols and commas if it's a money value
  if (isMoney) {
    value = value.replace(/[$,]/g, '');
  }

  const isNegative = value.includes('-');

  // Remove everything except digits and dots
  let cleaned = value
    .replace(/[^\d.]/g, '');

  const number = parseFloat(cleaned) || 0;

  // make float negative or positive based on if it included a - sign or not
  return isNegative ? -number : number;
}
