import { SessionData } from "@/app/neuralace/mobile/types/sessionTypes";

// Utility function to calculate the time difference in seconds
const calculateTimeDiffInSeconds = (startTime: string, endTime: string) => {
  const start = startTime.split(":").map(Number);
  const end = endTime.split(":").map(Number);

  // Convert to seconds
  const startInSeconds = start[0] * 3600 + start[1] * 60 + start[2];
  const endInSeconds = end[0] * 3600 + end[1] * 60 + end[2];

  // Return the difference
  return endInSeconds - startInSeconds;
};

// Function to calculate the sum of time differences for all videos in all sessions
export const calculateTotalTimeDiff = (sessions: any[]) => {
  let totalTimeInSeconds = 0;

  sessions?.forEach((session: SessionData) => {
    session?.videos?.forEach((video) => {
      // Only calculate time difference if startTime and endTime are not "00:00:00"
      if (video.startTime !== "00:00:00" && video.endTime !== "00:00:00") {
        console.log(calculateTimeDiffInSeconds(video.startTime, video.endTime));
        totalTimeInSeconds += calculateTimeDiffInSeconds(
          video.startTime,
          video.endTime
        );
      }
    });
  });

  // Convert the total time from seconds to HH:mm:ss format
  const hours = Math.floor(totalTimeInSeconds / 3600);
  const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
  const seconds = totalTimeInSeconds % 60;

  return `${hours}:${minutes}:${seconds}`;
};
