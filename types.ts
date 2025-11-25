export interface Preset {
  id: string;
  name: string;
  color: string; // Tailwind class like 'bg-red-200' or hex
  textColor: string;
}

export interface ScheduleData {
  // Key format: `${dayIndex}-${timeIndex}`
  // Value: presetId
  [key: string]: string;
}

export interface TimeSlot {
  dayIndex: number; // 0 (Mon) - 6 (Sun)
  timeIndex: number; // Index in TIME_SLOTS
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Generate 30-minute intervals from 09:00 to 22:00
const START_HOUR = 9;
const END_HOUR = 22;

export const TIME_SLOTS = Array.from({ length: (END_HOUR - START_HOUR) * 2 + 1 }, (_, i) => {
  const totalMinutes = (START_HOUR * 60) + (i * 30);
  const hour = Math.floor(totalMinutes / 60);
  const min = totalMinutes % 60;
  return `${hour.toString().padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
});