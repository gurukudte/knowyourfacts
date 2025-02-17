export const convertToIST = (utcTime: string) => {
  // Assuming the input UTC time is in ISO format (e.g., "2025-01-14T08:00:00Z")
  const date = new Date(utcTime);

  // Adjust the time to IST (UTC +5:30)
  const istOffset = 5.5 * 60; // IST is UTC +5:30, which is 330 minutes
  date.setMinutes(date.getMinutes() + istOffset);

  // Format the date into "14 Jan 2025, 04:01:12 pm"
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Format the time with AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const period = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle 12 AM/PM case

  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${period}`;
};
