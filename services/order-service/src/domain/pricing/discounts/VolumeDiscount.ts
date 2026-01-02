export const getVolumeDiscount = (totalUnits: number): number => {
  if (totalUnits >= 50) return 0.3;
  if (totalUnits >= 10) return 0.2;
  if (totalUnits >= 5) return 0.1;
  return 0;
};
