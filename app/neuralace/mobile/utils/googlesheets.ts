// Function to calculate the number of days until a specific date
export function calculateDaysUntil(targetDateString: string): number {
  // Parse the target date
  const targetDate = new Date(targetDateString);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate.getTime() - targetDate.getTime();

  // Convert milliseconds to days
  const daysDifference = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  return daysDifference - 1;
}
