/**
 * Date utilities for hotel stay bookings and availability.
 * Designed to be timezone-safe (local date formatting) and enforce
 * strict date constrictions across the application.
 */

export interface DateValidationResult {
  isValid: boolean;
  errorCode?: 'MISSING_DATES' | 'CHECKOUT_BEFORE_CHECKIN' | 'ZERO_DAY_STAY' | 'PAST_CHECKIN';
  messageEn: string;
  messageId: string;
  nights: number;
}

/**
 * Format a Date object as YYYY-MM-DD in local time (prevents UTC date shifts).
 */
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Safely parse a YYYY-MM-DD string into a local Date object at midnight.
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

/**
 * Get today's date formatted as YYYY-MM-DD in local time.
 */
export function getTodayString(): string {
  return toDateString(new Date());
}

/**
 * Get tomorrow's date formatted as YYYY-MM-DD in local time,
 * or the day after a provided base date string.
 */
export function getTomorrowString(baseDateStr?: string): string {
  const base = baseDateStr ? parseDateString(baseDateStr) : new Date();
  base.setDate(base.getDate() + 1);
  return toDateString(base);
}

/**
 * Calculate the number of nights between check-in and check-out.
 * Returns 0 if either date is empty, or negative if checkOut < checkIn.
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = parseDateString(checkIn);
  const end = parseDateString(checkOut);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Given a check-in date and an optional current check-out date,
 * return a guaranteed valid check-out date (at least 1 night after check-in).
 */
export function getNextValidCheckOut(checkIn: string, currentCheckOut?: string): string {
  if (!checkIn) return currentCheckOut || getTomorrowString();
  const minValid = getTomorrowString(checkIn);
  if (!currentCheckOut || currentCheckOut <= checkIn) {
    return minValid;
  }
  return currentCheckOut;
}

/**
 * Comprehensive stay dates validator.
 * Enforces:
 * 1. Both check-in and check-out dates are required.
 * 2. Check-in cannot be in the past.
 * 3. Check-out cannot be same day as check-in (disallows 0-day check-in).
 * 4. Check-out cannot be earlier than check-in.
 * 5. Minimum stay is 1 night.
 */
export function validateStayDates(checkIn: string, checkOut: string): DateValidationResult {
  if (!checkIn || !checkOut) {
    return {
      isValid: false,
      errorCode: 'MISSING_DATES',
      messageEn: 'Please select both check-in and check-out dates.',
      messageId: 'Harap pilih tanggal masuk dan tanggal keluar.',
      nights: 0,
    };
  }

  const today = getTodayString();
  if (checkIn < today) {
    return {
      isValid: false,
      errorCode: 'PAST_CHECKIN',
      messageEn: 'Check-in date cannot be in the past.',
      messageId: 'Tanggal masuk tidak boleh di masa lalu.',
      nights: 0,
    };
  }

  const nights = calculateNights(checkIn, checkOut);

  if (nights === 0 || checkIn === checkOut) {
    return {
      isValid: false,
      errorCode: 'ZERO_DAY_STAY',
      messageEn: 'Same-day check-out is not allowed. A minimum stay of 1 night is required.',
      messageId: 'Check-out di hari yang sama tidak diperbolehkan. Minimum menginap adalah 1 malam.',
      nights: 0,
    };
  }

  if (nights < 0 || checkOut < checkIn) {
    return {
      isValid: false,
      errorCode: 'CHECKOUT_BEFORE_CHECKIN',
      messageEn: 'Check-out date must be after check-in date.',
      messageId: 'Tanggal keluar harus setelah tanggal masuk.',
      nights: 0,
    };
  }

  return {
    isValid: true,
    messageEn: '',
    messageId: '',
    nights,
  };
}

/**
 * Format date range for UI display (e.g. "Sep 10 – Sep 12 (2 nights)").
 */
export function formatDateRange(checkIn: string, checkOut: string, locale: string = 'en-US'): string {
  if (!checkIn || !checkOut) return '';
  const start = parseDateString(checkIn);
  const end = parseDateString(checkOut);
  const nights = calculateNights(checkIn, checkOut);

  const startStr = start.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  const nightLabel = nights === 1 ? '1 night' : `${nights} nights`;

  return `${startStr} – ${endStr} (${nightLabel})`;
}
