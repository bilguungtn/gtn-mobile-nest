/**
 * date format yyyymmddhhmmss
 * @param {Date} date
 * @returns {string} yyyymmddhhmmss string format.
 */
export const dateFormat = (date: Date): string => {
  const formatedDate =
    date.getFullYear() +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    ('0' + date.getDate()).slice(-2) +
    ('0' + date.getHours()).slice(-2) +
    ('0' + date.getMinutes()).slice(-2) +
    ('0' + date.getSeconds()).slice(-2);
  return formatedDate;
};
