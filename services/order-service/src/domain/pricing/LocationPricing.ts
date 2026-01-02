import { Location } from './types';

export const applyLocationPricing = (
  baseAmount: number,
  location: Location,
): number => {
  switch (location) {
    case 'EU':
      return baseAmount * 1.15;
    case 'ASIA':
      return baseAmount * 0.95;
    case 'US':
    default:
      return baseAmount;
  }
};
