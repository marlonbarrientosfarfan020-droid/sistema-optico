import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NumericValue = number | string | { toNumber?: () => number } | null | undefined;

function toNumeric(val: NumericValue): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return isNaN(val) ? null : val;
  if (typeof val === "object" && typeof val.toNumber === "function") return val.toNumber();
  const parsed = Number(val);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Safely rounds numbers to 2 decimal places to avoid floating point inaccuracies in finance
 */
export function round2(num: number | string | null | undefined): number {
  const n = Number(num) || 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Formats monetary amounts in Peruvian Soles (S/ X,XXX.XX)
 */
export function formatCurrency(amount: number | string | { toNumber?: () => number } | null | undefined): string {
  let val = 0;
  if (amount !== null && amount !== undefined) {
    if (typeof amount === "object" && typeof amount.toNumber === "function") {
      val = amount.toNumber();
    } else {
      val = Number(amount) || 0;
    }
  }
  return `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a date to readable format
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Formats diopters with +/- sign and 2 decimals (e.g., +2.25, -0.75, Plano)
 */
export function formatDiopter(value: NumericValue): string {
  const num = toNumeric(value);
  if (num === null) return "-";
  if (num === 0) return "PLANO";
  return num > 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
}

/**
 * Formats optical cylinder with sign and 2 decimals
 */
export function formatCylinder(value: NumericValue): string {
  const num = toNumeric(value);
  if (num === null) return "-";
  if (num === 0) return "0.00";
  return num > 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
}

/**
 * Formats optical axis (0-180°)
 */
export function formatAxis(value: NumericValue): string {
  const num = toNumeric(value);
  if (num === null) return "-";
  return `${num}°`;
}

/**
 * Calculates Spherical Equivalent (SE = SPH + CYL / 2)
 */
export function calculateSphericalEquivalent(sph: number = 0, cyl: number = 0): number {
  return sph + cyl / 2;
}

/**
 * Optical transposition helper
 * Transposes sphere, cylinder and axis:
 * New SPH = SPH + CYL
 * New CYL = -CYL
 * New AXIS = (AXIS + 90) % 180 (0 becomes 180)
 */
export function transposePrescription(sph: number = 0, cyl: number = 0, axis: number = 0) {
  if (cyl === 0) return { sph, cyl, axis };
  const newSph = sph + cyl;
  const newCyl = -cyl;
  let newAxis = (axis + 90) % 180;
  if (newAxis === 0) newAxis = 180;
  return { sph: Number(newSph.toFixed(2)), cyl: Number(newCyl.toFixed(2)), axis: newAxis };
}
