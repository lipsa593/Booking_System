import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check } from 'lucide-react';
import type { Booking, Service, Staff } from '../../types';
import { getAvailableSlots, staffWorksOn, weekDays } from '../../utils/availability';
import { prettyDate, today } from '../../utils/format';

type AdminAvailabilityProps = {
  staff: Staff[];
  bookings: Booking[];
  services: Service[];
  onUpdateStaff: (person: Staff) => void;
};

const leaveReasons = ['Personal Leave', 'Sick Leave', 'Holiday', 'Other'];

export function AdminAvailability({ staff, bookings, services, onUpdateStaff }: AdminAvailabilityProps) {
  const [staffId, setStaffId] = useState(staff[0]?.id || '');
  const person = staff.find(member => member.id === staffId);
  const [month, setMonth] = useState(() => new Date(`${today}T12:00:00`));
  const [activeDate, setActiveDate] = useState(today);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [reason, setReason] = useState('Personal Leave');
  const [customReason, setCustomReason] = useState('');
  const [startTime, setStartTime] = useState(person?.startTime || '09:00');
  const [endTime, setEndTime] = useState(person?.endTime || '17:00');

  useEffect(() => {
    if (!person) return;
    setStartTime(person.startTime);
    setEndTime(person.endTime);
    setSelectedDates([]);
  }, [staffId, person?.startTime, person?.endTime]);

  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    const numberOfDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: mondayOffset }, () => ''),
      ...Array.from({ length: numberOfDays }, (_, index) =>
        `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`,
      ),
    ];
  }, [month]);

  if (!person) {
    return <div className="admin-page-content"><h1 className="serif">Team Availability.</h1><p>Add a team member to start managing availability.</p></div>;
  }

  const selectedRestrictions = selectedDates.length ? selectedDates : [activeDate];
  const activeRestriction = person.unavailability?.find(item => item.date === activeDate);
  const currentMonthLabel = month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  function updatePerson(changes: Partial<Staff>) {
    onUpdateStaff({ ...person, ...changes });
  }

  function dateAvailability(date: string) {
    if (!staffWorksOn(person, date)) return 'unavailable';
    const hasBookings = bookings.some(booking =>
      booking.staffId === person.id && booking.date === date && booking.status !== 'cancelled',
    );
    const hasOpenings = services
      .filter(service => person.serviceIds.includes(service.id))
      .some(service => getAvailableSlots(date, service, staff, bookings, services, person.id).length > 0);
    if (!hasOpenings) return 'unavailable';
    return hasBookings ? 'limited' : 'available';
  }

  function toggleDate(date: string) {
    setActiveDate(date);
    setSelectedDates(current => current.includes(date)
      ? current.filter(selected => selected !== date)
      : [...current, date]);
  }

  function markUnavailable() {
    const restrictionReason = reason === 'Other' ? customReason.trim() : reason;
    if (!restrictionReason) return;
    const restrictions = person.unavailability || [];
    const updatedRestrictions = selectedRestrictions.reduce((current, date) => [
      ...current.filter(item => item.date !== date),
      { date, reason: restrictionReason },
    ], restrictions);
    onUpdateStaff({
      ...person,
      daysOff: person.daysOff.filter(date => !selectedRestrictions.includes(date)),
      unavailability: updatedRestrictions,
    });
    setSelectedDates([]);
  }

  function removeRestrictions(dates: string[]) {
    onUpdateStaff({
      ...person,
      daysOff: person.daysOff.filter(date => !dates.includes(date)),
      unavailability: (person.unavailability || []).filter(item => !dates.includes(item.date)),
    });
    setSelectedDates([]);
  }

  function saveHours() {
    updatePerson({ startTime, endTime });
  }

  function therapistStatus(member: Staff) {
    if (!staffWorksOn(member, activeDate)) return 'Unavailable';
    const hasOpenings = services
      .filter(service => member.serviceIds.includes(service.id))
      .some(service => getAvailableSlots(activeDate, service, staff, bookings, services, member.id).length > 0);
    if (!hasOpenings) return 'Unavailable';
    const isLimited = bookings.some(booking =>
      booking.staffId === member.id && booking.date === activeDate && booking.status !== 'cancelled',
    );
    return isLimited ? 'Limited' : 'Available';
  }

  return (
    <div className="admin-page-content availability-page">
      <div className="admin-greeting">
        <div>
          <p className="eyebrow">KEEP EVERY VISIT RUNNING SMOOTHLY</p>
          <h1 className="serif">Team Availability.</h1>
          <p>Set regular hours, leave, and time away for your team.</p>
        </div>
      </div>

      <div className="availability-team-list card">
        <div className="availability-section-heading">
          <div><p className="eyebrow">YOUR TEAM</p><h2 className="serif">Select a therapist</h2></div>
          <span className="availability-legend"><i className="available-dot" />Available <i className="limited-dot" />Limited <i className="unavailable-dot" />Unavailable</span>
        </div>
        <div className="availability-team-options">
          {staff.map(member => (
            <button type="button" className={`availability-team-option ${member.id === staffId ? 'selected' : ''}`} key={member.id} onClick={() => setStaffId(member.id)}>
              {member.imageUrl ? <img src={member.imageUrl} alt="" /> : <span className="availability-initials">{member.name.split(' ').map(part => part[0]).join('')}</span>}
              <span><strong>{member.name}</strong><small>{member.role}</small></span>
              <i className={`${therapistStatus(member).toLowerCase()}-dot`} />
              <small>{therapistStatus(member)}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="availability-management-grid">
        <section className="availability-calendar card">
          <div className="availability-section-heading">
            <div><p className="eyebrow">MONTHLY VIEW</p><h2 className="serif">{currentMonthLabel}</h2></div>
            <div className="calendar-nav">
              <button type="button" className="icon-button" aria-label="Previous month" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}><ArrowLeft size={17} /></button>
              <button type="button" className="icon-button" aria-label="Next month" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}><ArrowRight size={17} /></button>
            </div>
          </div>
          <div className="availability-calendar-grid">
            {weekDays.map(day => <span className="calendar-weekday" key={day.value}>{day.label}</span>)}
            {calendarDays.map((date, index) => {
              if (!date) return <span className="calendar-empty" key={`empty-${index}`} />;
              const status = dateAvailability(date);
              const dayNumber = Number(date.slice(-2));
              return <button type="button" key={date} aria-label={`${prettyDate(date, { day: 'numeric', month: 'long', year: 'numeric' })}, ${status}`} className={`availability-day ${status} ${activeDate === date ? 'focused' : ''} ${selectedDates.includes(date) ? 'multi-selected' : ''}`} onClick={() => toggleDate(date)}>
                <span>{dayNumber}</span>
                <i className={`${status}-dot`} />
                {selectedDates.includes(date) && <Check size={11} className="calendar-selected-check" />}
              </button>;
            })}
          </div>
          <div className="availability-calendar-legend"><span><i className="available-dot" />Available</span><span><i className="unavailable-dot" />Unavailable</span><span><i className="limited-dot" />Limited / booked</span></div>
          <p className="availability-selection-help">Select one date or several dates on the calendar. Selected: {selectedDates.length || 0}</p>
          {selectedDates.length > 0 && <button type="button" className="text-link clear-date-selection" onClick={() => setSelectedDates([])}>Clear date selection</button>}
        </section>

        <section className="availability-settings card">
          <p className="eyebrow">AVAILABILITY SETTINGS</p>
          <h2 className="serif">{person.name}</h2>
          <p className="availability-active-date"><CalendarDays size={15} />{prettyDate(activeDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

          <div className="availability-setting-block">
            <h3 className="label">Selected date restrictions</h3>
            {activeRestriction || person.daysOff.includes(activeDate)
              ? <div className="restriction-note"><span>{activeRestriction?.reason || 'Day off'}</span><button type="button" className="subtle-action" onClick={() => removeRestrictions([activeDate])}>Remove</button></div>
              : <p className="availability-muted">No full-day restriction on this date.</p>}
            <label className="label" htmlFor="leave-reason">Reason</label>
            <select id="leave-reason" className="field" value={reason} onChange={event => setReason(event.target.value)}>{leaveReasons.map(item => <option key={item}>{item}</option>)}</select>
            {reason === 'Other' && <input className="field custom-reason-field" aria-label="Other leave reason" placeholder="Add a reason" value={customReason} onChange={event => setCustomReason(event.target.value)} />}
            <div className="availability-action-row">
              <button type="button" className="btn btn-sm" onClick={markUnavailable} disabled={reason === 'Other' && !customReason.trim()}>{selectedDates.length > 1 ? `Mark ${selectedDates.length} dates as leave` : 'Mark unavailable'}</button>
              {(activeRestriction || person.daysOff.includes(activeDate)) && <button type="button" className="btn btn-outline btn-sm" onClick={() => removeRestrictions(selectedRestrictions)}>Remove restriction</button>}
            </div>
          </div>

          <div className="availability-setting-block">
            <h3 className="label">Working days</h3>
            <div className="availability-weekdays">{weekDays.map(day => <label className="availability-weekday" key={day.value}><input type="checkbox" checked={person.workingDays.includes(day.value)} onChange={event => updatePerson({ workingDays: event.target.checked ? [...person.workingDays, day.value] : person.workingDays.filter(value => value !== day.value) })} /><span>{day.label}</span></label>)}</div>
            <h3 className="label availability-hours-label">Working hours</h3>
            <div className="availability-hours"><label><span>From</span><input className="field" type="time" value={startTime} max={endTime} onChange={event => setStartTime(event.target.value)} /></label><label><span>Until</span><input className="field" type="time" value={endTime} min={startTime} onChange={event => setEndTime(event.target.value)} /></label></div>
            <button type="button" className="btn btn-outline btn-sm availability-save-hours" onClick={saveHours} disabled={!person.workingDays.length || startTime >= endTime}>Save working schedule</button>
          </div>

        </section>
      </div>
    </div>
  );
}
