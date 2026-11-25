import type { Booking, Service, Staff } from '../types';

export const weekDays = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 0 },
];

const minutes = (time: string) => {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
};

const dateWeekday = (date: string) => new Date(`${date}T12:00:00`).getDay();

export function staffWorksOn(person: Staff, date: string) {
  return person.active
    && person.workingDays.includes(dateWeekday(date))
    && !person.daysOff.includes(date)
    && !person.unavailability?.some(restriction => restriction.date === date);
}

export function getAvailableSlots(
  date: string,
  service: Service,
  staff: Staff[],
  bookings: Booking[],
  services: Service[],
  staffId = 'any',
  ignoreBookingId?: string,
) {
  const candidates = staff.filter(person =>
    staffWorksOn(person, date)
    && person.serviceIds.includes(service.id)
    && (staffId === 'any' || person.id === staffId),
  );
  const slots = new Map<string, string[]>();

  candidates.forEach(person => {
    const opening = minutes(person.startTime);
    const closing = minutes(person.endTime);
    for (let start = opening; start + service.durationMinutes <= closing; start += 30) {
      const slot = `${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`;
      const collision = bookings.some(booking => {
        if (booking.id === ignoreBookingId || booking.staffId !== person.id || booking.date !== date || booking.status === 'cancelled') return false;
        const existingService = services.find(item => item.id === booking.serviceId);
        const existingDuration = existingService?.durationMinutes || 60;
        const existingStart = minutes(booking.time);
        return start < existingStart + existingDuration && existingStart < start + service.durationMinutes;
      });
      if (!collision) slots.set(slot, [...(slots.get(slot) || []), person.id]);
    }
  });

  return [...slots.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([time, staffIds]) => ({ time, staffIds }));
}

export function isStaffSlotAvailable(
  person: Staff,
  date: string,
  time: string,
  service: Service,
  bookings: Booking[],
  services: Service[],
  ignoreBookingId?: string,
) {
  if (!staffWorksOn(person, date) || !person.serviceIds.includes(service.id)) return false;
  const start = minutes(time);
  if (start < minutes(person.startTime) || start + service.durationMinutes > minutes(person.endTime)) return false;
  return !bookings.some(booking => {
    if (booking.id === ignoreBookingId || booking.staffId !== person.id || booking.date !== date || booking.status === 'cancelled') return false;
    const existingDuration = services.find(item => item.id === booking.serviceId)?.durationMinutes || 60;
    const existingStart = minutes(booking.time);
    return start < existingStart + existingDuration && existingStart < start + service.durationMinutes;
  });
}
