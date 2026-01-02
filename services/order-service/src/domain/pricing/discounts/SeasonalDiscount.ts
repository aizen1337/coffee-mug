const BLACK_FRIDAY_MONTH = 10; // November (0-based)
const BLACK_FRIDAY_DAY_RANGE = [23, 30];

const HOLIDAY_DISCOUNT_CATEGORIES = ['COFFEE', 'MUG'];

export const getSeasonalDiscount = (
  date: Date,
  categories: string[],
): number => {
  const month = date.getMonth();
  const day = date.getDate();

  // Black Friday
  if (
    month === BLACK_FRIDAY_MONTH &&
    day >= BLACK_FRIDAY_DAY_RANGE[0] &&
    day <= BLACK_FRIDAY_DAY_RANGE[1]
  ) {
    return 0.25;
  }

  // Polish holidays (simplified: Jan 1, May 1, Dec 25)
  const isHoliday =
    (month === 0 && day === 1) ||
    (month === 4 && day === 1) ||
    (month === 11 && day === 25);

  if (isHoliday && categories.some(c =>
    HOLIDAY_DISCOUNT_CATEGORIES.includes(c),
  )) {
    return 0.15;
  }

  return 0;
};
