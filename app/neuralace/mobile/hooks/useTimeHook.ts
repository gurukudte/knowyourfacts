/**
 * Formats a 24h time string to 12h format with AM/PM
 * @param timeStr - Time string in 24h format (HH:mm:ss)
 * @returns Formatted time string in 12h format (hh:mm:ss am/pm)
 * @example
 * formatTime("13:45:30") // returns "01:45:30 pm"
 * formatTime("09:15:00") // returns "09:15:00 am"
 */
export const formatTime = (timeStr: string): string => {
  const date = new Date();
  const [hours, minutes, seconds] = timeStr.split(":");
  date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
  return date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};
