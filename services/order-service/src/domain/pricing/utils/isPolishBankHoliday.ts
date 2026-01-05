import { getEasterDate } from "./getEasterDay";

export const isPolishBankHoliday = (date: Date): boolean => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Fixed holidays (month is 0-based)
  const fixedHolidays = [
    [0, 1],   // Jan 1
    [0, 6],   // Jan 6
    [4, 1],   // May 1
    [4, 3],   // May 3
    [7, 15],  // Aug 15
    [10, 1],  // Nov 1
    [10, 11], // Nov 11
    [11, 25], // Dec 25
    [11, 26], // Dec 26
  ];

  if (fixedHolidays.some(([m, d]) => m === month && d === day)) {
    return true;
  }

  // Movable holidays
  const easterSunday = getEasterDate(year);
  const easterMonday = new Date(easterSunday);
  easterMonday.setDate(easterSunday.getDate() + 1);

  const corpusChristi = new Date(easterSunday);
  corpusChristi.setDate(easterSunday.getDate() + 60);

  return (
    sameDay(date, easterSunday) ||
    sameDay(date, easterMonday) ||
    sameDay(date, corpusChristi)
  );
};

const sameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
