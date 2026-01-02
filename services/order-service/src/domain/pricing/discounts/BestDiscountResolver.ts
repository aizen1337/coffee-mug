export const resolveBestDiscount = (
  discounts: number[],
): number => Math.max(...discounts, 0);
