interface OfficeTime {
  login: string;
  logout: string;
  totalBreak: string; // in hours and minutes
  totalInOffice: string; // in hours and minutes
  breaksCount: number;
}

export function parseOfficeTime(log: string): OfficeTime {
  const events = log.split(" ");
  let loginTime: string | null = null;
  let logoutTime: string | null = null;
  let totalBreak = 0; // in minutes
  let breaksCount = 0;
  let lastOutTime: string | null = null;

  for (let i = 0; i < events.length; i++) {
    const [time, action] = events[i].split(":");
    if (action === "in(TD)" && loginTime === null) {
      loginTime = time;
    }
    if (action === "out(TD)") {
      logoutTime = time;
      if (lastOutTime !== null) {
        const breakStart = parseTime(lastOutTime);
        const breakEnd = parseTime(time);
        totalBreak += breakEnd - breakStart;
        breaksCount++;
      }
      lastOutTime = time;
    }
  }

  if (loginTime === null || logoutTime === null) {
    throw new Error("Invalid log format");
  }

  const login = parseTime(loginTime);
  const logout = parseTime(logoutTime);
  const totalInOffice = logout - login - totalBreak;

  return {
    login: formatTimeWithAMPM(loginTime),
    logout: formatTimeWithAMPM(logoutTime),
    totalBreak: formatMinutesToHoursMinutes(totalBreak),
    totalInOffice: formatMinutesToHoursMinutes(totalInOffice),
    breaksCount,
  };
}

export function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatTimeWithAMPM(time: string): string {
  let baseDate = new Date("2025-01-01T00:00:00Z");
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function formatMinutesToHoursMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
