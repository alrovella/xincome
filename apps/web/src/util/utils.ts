import type { PaymentType } from "@repo/database";
import { addHours, addMinutes } from "date-fns";

export function calculateGrowth(previousValue: number, currentValue: number) {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  const growth =
    ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  return growth;
}

export function convertToGoogleCalendarDate(
  date: Date,
  timezoneOffset = -3
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  // Calcula el desplazamiento del huso horario en horas y minutos
  const tzHours = Math.floor(timezoneOffset / 60);
  const tzMinutes = timezoneOffset % 60;

  // Formatea el desplazamiento del huso horario como una cadena
  const tzString = `${tzHours.toString().padStart(2, "0")}:${tzMinutes.toString().padStart(2, "0")}`;

  // Devuelve la cadena en el formato "20241010T210000Z" con el desplazamiento del huso horario
  return `${year}${month}${day}T${hour}${minute}${second}${tzString}`;
}

export function formatPrice(amount: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const sleep = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

export function getInitials(fullName: string): string {
  if (!fullName) return "";

  const firstInitial = fullName.split(" ")[0]?.charAt(0).toUpperCase();
  const lastInitial = fullName.split(" ")[1]?.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export function createBusinessHour(hours: number, minutes: number): Date {
  const date = new Date(1970, 1, 1);

  let updatedDate = addHours(date, hours);
  updatedDate = addMinutes(updatedDate, minutes);

  return updatedDate;
}

export function createBusinessDate(time: string): Date {
  const date = new Date(1970, 1, 1);

  const [hours, minutes] = time.split(":");
  if (!hours || !minutes) return date;

  let updatedDate = addHours(date, Number(hours));
  updatedDate = addMinutes(updatedDate, Number(minutes));

  return updatedDate;
}

export function getProvinces() {
  return [
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Cordoba",
    "Corrientes",
    "Entre Rios",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquen",
    "Rio Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucuman",
  ];
}

export function removeAccents(str: string) {
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function createSlug(text: string): string {
  return (
    text
      .toLowerCase() // Convertimos todo a minúsculas
      .trim() // Eliminamos espacios al principio y al final
      .normalize("NFD") // Normalizamos caracteres especiales
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, "") // Quitamos diacríticos (acentos, etc.)
      .replace(/[^a-z0-9\s-]/g, "") // Eliminamos caracteres especiales que no sean letras, números, espacios o guiones
      .replace(/\s+/g, "-") // Reemplazamos espacios por guiones
      .replace(/-+/g, "-")
  ); // Reemplazamos guiones consecutivos por uno solo
}

export function combineDateAndTime(date: Date, time: string): Date {
  // Split the time string into hours and minutes
  if (!time) return date;
  const [hourStr, minuteStr] = time.split(":");
  if (!hourStr || !minuteStr) return date;

  const hours = Number.parseInt(hourStr, 10);
  const minutes = Number.parseInt(minuteStr, 10);

  // Set the hours and minutes on the Date object
  date.setHours(hours, minutes, 0, 0);

  return date;
}

export function getPluralPaymentType(paymentType: PaymentType): string {
  return paymentType === "COBRANZA" ? "Cobranzas" : "Pagos";
}
