/**
 * Formats a date string into a standard readable date format: e.g. "Sun, Aug 16, 2026"
 * @param {string | Date} date - The date to format
 * @returns {string} The formatted date
 */
export const formatOrderDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date string into a standard readable time format: e.g. "10:30 AM"
 * @param {string | Date} date - The date to format
 * @returns {string} The formatted time
 */
export const formatOrderTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a date string into a combined date and time: e.g. "Sun, Aug 16, 2026 at 10:30 AM"
 * @param {string | Date} date - The date to format
 * @returns {string} The formatted date and time
 */
export const formatOrderDateTime = (date) => {
  if (!date) return '';
  return `${formatOrderDate(date)} at ${formatOrderTime(date)}`;
};
