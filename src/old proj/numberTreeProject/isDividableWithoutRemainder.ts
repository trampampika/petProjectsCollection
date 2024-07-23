const getQuotient  = (value: number, divisor: number) =>
  Math.floor(value / divisor);

const getRemainder = (value: number, divisor: number) =>
  value % divisor;

export const isDividableWithoutRemainder = (value: number, divisor: number) => {
  const quotient = getQuotient(value, divisor);
  const remainder = getRemainder(value, divisor);

  return quotient > 0 && remainder === 0;
};
