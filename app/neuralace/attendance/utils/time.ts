import { Console } from "console";
import { minTime } from "date-fns/constants";

let baseDate = new Date("2025-01-01T00:00:00Z");

export const getData = (punchStr: string) => {
  if (punchStr === null || punchStr === undefined) {
    return {
      loginTime: "Not available",
      logoutTime: "Not available",
    };
  }
  const zampui = "13:32:in(TD)";
  // "22:30:in(TD) 22:33:(TD) 23:11:out(TD) 23:51:in(TD) 00:57:out(TD) 01:03:in(TD) 02:48:out(TD) 03:19:in(TD) 05:10:out(TD) 05:51:in(TD)";
  const ritika =
    "05:47:in(TD) 05:55:out(TD) 06:13:in(TD) 06:14:(TD) 08:18:out(TD) 09:25:in(TD) 10:05:out(TD) 10:45:in(TD) 11:16:out(TD) 12:57:in(TD) 13:03:out(TD) 13:08:(TD) 13:26:in(TD) 13:40:out(TD) 13:46:in(TD) 14:08:out(TD) 05:44:in(TD) 06:33:out(TD)";

  const events = punchStr.split(" ");

  const loginTimeArray: Date[] = [];
  const logoutTimeArray: Date[] = [];
  for (let i = 0; i < events?.length; i++) {
    const [hours, mins, action] = events[i]?.split(":");

    let date = new Date(baseDate);

    date.setHours(Number(hours), Number(mins), 0, 0);

    if (action === "in(TD)") {
      loginTimeArray.push(date);
    }
    if (action === "out(TD)") {
      logoutTimeArray.push(date);
    }
  }

  const loginArray = loginTimeArray.map((time: Date) => {
    let modifiedTime = time;
    let hoursArray = loginTimeArray.map((date) => date.getHours());
    const maxHour = Math.max(...hoursArray);

    // console.log(max);
    if (maxHour > 20) {
      if (time.getHours() < 10) {
        const newDate = new Date(time);
        newDate.setDate(newDate.getDate() + 1);
        modifiedTime = newDate;
      } else {
        modifiedTime = time;
      }
    }
    return modifiedTime;
  });
  const logoutArray = logoutTimeArray.map((time: Date) => {
    let modifiedTime = time;
    let hoursArray = logoutTimeArray.map((date) => date.getHours());
    const maxHour = Math.max(...hoursArray);
    if (maxHour > 20) {
      if (time.getHours() < 10) {
        const newDate = new Date(time);
        newDate.setDate(newDate.getDate() + 1);
        modifiedTime = newDate;
      } else {
        modifiedTime = time;
      }
    }
    return modifiedTime;
  });

  let logoutTime = new Date(
    Math.max(...logoutArray.map((date) => date.getTime()))
  );
  let loginTime = new Date(
    Math.min(...loginArray.map((date) => date.getTime()))
  );

  let results = getTotalDuration(logoutTime, loginTime);

  // console.log("loginArray", loginArray);
  // console.log("logoutArray", logoutArray);
  // console.log(`login:${loginTime}`);
  // console.log(`logout:${logoutTime}`);
  // console.log(
  //   `login:${convertToAmPm(loginTime)} logout:${convertToAmPm(logoutTime)}`
  // );
  return {
    loginTime: convertToAmPm(loginTime),
    logoutTime: convertToAmPm(logoutTime),
  };
};

const getTotalDuration = (max: Date, min: Date) => {
  const diffInMs = Math.abs(max.getTime() - min.getTime()); // Absolute difference in milliseconds
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to total minutes

  const hours = Math.floor(diffInMinutes / 60)
    .toString()
    .padStart(2, "0"); // Get full hours
  const minutes = (diffInMinutes % 60).toString().padStart(2, "0");
  return { hours, minutes };
};

function convertToAmPm(dateString: Date): string {
  if (!dateString) {
    return "Not available";
  }
  const date = new Date(dateString);

  let hours: number = date.getHours(); // Get hours in UTC
  let minutes: number = date.getMinutes(); // Get minutes in UTC
  let ampm: string = hours >= 12 ? "PM" : "AM"; // Determine AM or PM

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Hour '0' should be '12'

  // Format minutes with leading zero if needed
  minutes = minutes < 10 ? +("0" + minutes) : minutes;
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return "Not available";
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
}
