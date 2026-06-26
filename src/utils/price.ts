export const EXCHANGE_RATE = 129;

export const formatPrice = (usdPrice?: number): string => {
  if (usdPrice === undefined || usdPrice === null) return "";
  return `Ksh ${(usdPrice * EXCHANGE_RATE).toLocaleString()}`;
};

export const formatPriceRaw = (usdPrice?: number): string => {
  if (usdPrice === undefined || usdPrice === null) return "";
  return (usdPrice * EXCHANGE_RATE).toLocaleString();
};

export const usdToKsh = (usdPrice?: number): number => {
  if (usdPrice === undefined || usdPrice === null) return 0;
  return usdPrice * EXCHANGE_RATE;
};
