import { format, formatDistance } from "date-fns";
import { es } from "date-fns/locale";

export function datesDistance(fromDate: Date, toDate: Date) {
  const value = formatDistance(fromDate, toDate, {
    locale: es,
    addSuffix: true,
  });
  return value;
}

export function formatFriendlyDateTime(date: Date) {
  return format(date, "dd/MM/yyyy ' a las ' HH:mm 'hs'", { locale: es });
}

export function getDayName(dayNumber: number): string {
  // Verificar que el número esté entre 0 y 6
  if (dayNumber < 0 || dayNumber > 6) {
    throw new Error("El día debe estar entre 0 y 6.");
  }

  // Crear una fecha base (cualquier fecha con un día específico)
  const date = new Date();
  // Setear el día al correspondiente (0 = Domingo, 1 = Lunes, etc.)
  date.setUTCDate(date.getUTCDate() - date.getUTCDay() + dayNumber);

  // Retornar el nombre del día
  return format(date, "EEEE", { locale: es });
}
