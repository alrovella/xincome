import {
  addMonths,
  addYears,
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";

export const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];

export const Period = [
  "HOY",
  "ESTEMES",
  "MESPASADO",
  "ESTEANO",
  "ANOPASADO",
] as const;

export function getPeriods() {
  return Period.map((period) => ({
    key: period,
    description: getPeriodDescription(period),
    dates: getPeriodDates(period),
  }));
}

function getPeriodDescription(period: (typeof Period)[number]) {
  switch (period) {
    case "HOY":
      return "Hoy";
    case "ESTEMES":
      return "Este mes";
    case "ESTEANO":
      return "Este año";
    case "ANOPASADO":
      return "Año pasado";
    case "MESPASADO":
      return "Mes pasado";
  }
}

export function getPeriodDates(period: (typeof Period)[number]) {
  switch (period) {
    case "HOY":
      return {
        startDate: startOfDay(new Date()),
        endDate: endOfDay(new Date()),
      };
    case "ESTEMES":
      return {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      };
    case "ESTEANO":
      return {
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date()),
      };
    case "ANOPASADO":
      return {
        startDate: startOfYear(addYears(new Date(), -1)),
        endDate: endOfYear(addYears(new Date(), -1)),
      };
    case "MESPASADO":
      return {
        startDate: startOfMonth(addMonths(new Date(), -1)),
        endDate: startOfMonth(new Date()),
      };
  }
}
