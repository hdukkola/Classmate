// Utility function to format time based on user preference
export function formatTime(time: string): string {
  const use24Hour = localStorage.getItem("use24HourTime") === "true";
  
  if (use24Hour) {
    return time; // Already in 24-hour format (e.g., "16:00")
  }
  
  // Convert to 12-hour format with AM/PM
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Convert 12-hour time to 24-hour format
export function convertTo24Hour(time: string): string {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return time; // Already in 24-hour format or invalid
  
  let [, hours, minutes, period] = match;
  let hour = parseInt(hours);
  
  if (period.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
}
