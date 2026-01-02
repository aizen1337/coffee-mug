import { OrderItem, PricingContext } from './types';
import { getVolumeDiscount } from './discounts/VolumeDiscount';
import { getSeasonalDiscount } from './discounts/SeasonalDiscount';
import { applyLocationPricing } from './LocationPricing';
import { resolveBestDiscount } from './discounts/BestDiscountResolver';

export const calculateFinalOrderPrice = (
  items: OrderItem[],
  context: PricingContext,
): number => {
  const baseTotal = items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0,
  );

  const locationAdjusted = applyLocationPricing(
    baseTotal,
    context.location,
  );

  const totalUnits = items.reduce(
    (sum, i) => sum + i.quantity,
    0,
  );

  const categories = items.map(i => i.category);

  const volumeDiscount = getVolumeDiscount(totalUnits);
  const seasonalDiscount = getSeasonalDiscount(
    context.orderDate,
    categories,
  );

  const discount = resolveBestDiscount([
    volumeDiscount,
    seasonalDiscount,
  ]);

  return Number(
    (locationAdjusted * (1 - discount)).toFixed(2),
  );
};
