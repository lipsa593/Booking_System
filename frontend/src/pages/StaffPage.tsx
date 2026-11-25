import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { EmptyState, Metric, StatusBadge } from '../components/ui/Shared';
import type { Booking, DemoData, Service, Staff } from '../types';
import { prettyDate, today, money } from '../utils/format';
import { staffWorksOn } from '../utils/availability';

type StaffPageProps = {
  data: DemoData;
  serviceById: (id: string) => Service | undefined;
  staffById: (id: string) => Staff | undefined;
  update: (bookings: Booking[]) => void;
};

export function StaffPage({ data, serviceById, staffById, update }: StaffPageProps) {
  const [date, setDate] = useState(today);
  // Show active bookings for the selected date, ordered by appointment time.
  const bookingsForSelectedDate = data.bookings
    .filter(
      booking => booking.date === date && booking.status !== 'cancelled',
    )
    .sort((firstBooking, secondBooking) =>
      firstBooking.time.localeCompare(secondBooking.time),
    );

  // Find the next confirmed appointment for the summary card.
  const nextBooking = bookingsForSelectedDate.find(
    booking => booking.status === 'confirmed',
  );

  // Do not count no-shows toward the expected revenue total.
  const expectedRevenue = bookingsForSelectedDate
    .filter(booking => booking.status !== 'no-show')
    .reduce((total, booking) => total + booking.total, 0);

  // Update one booking while leaving the other bookings unchanged.
  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    const updatedBookings = data.bookings.map(booking => {
      if (booking.id === bookingId) {
        return { ...booking, status: newStatus };
      }

      return booking;
    });

    update(updatedBookings);
  };

  return (
    <main className="ops-page page-in">
      <div className="ops-wrap">
        <header className="ops-header">
          <div>
            <p className="eyebrow">MYSA HOUSE · STUDIO</p>
            <h1 className="serif">A good day starts here.</h1>
            <p>Your day, at a glance. Keep the rhythm easy.</p>
          </div>

          <div className="ops-date">
            <CalendarDays size={17} />
            <input
              type="date"
              className="field"
              value={date}
              onChange={event => setDate(event.target.value)}
            />
          </div>
        </header>

        <div className="metric-row">
          <Metric
            label="On the books"
            value={`${bookingsForSelectedDate.length}`}
            note="visits today"
          />
          <Metric
            label="Expected total"
            value={money(expectedRevenue)}
            note="before add-ons"
          />
          <Metric
            label="Next up"
            value={nextBooking?.time || '—'}
            note={nextBooking?.customerName || 'All caught up'}
          />
        </div>

        <section className="staff-availability card" aria-label="Team availability">
          <div className="availability-heading">
            <div><p className="eyebrow">TEAM AVAILABILITY</p><h2 className="serif">Who’s in the studio?</h2></div>
            <span>{data.staff.filter(person => staffWorksOn(person, date)).length} working today</span>
          </div>
          <div className="availability-team-grid">
            {data.staff.filter(person => person.active).map(person => {
              const working = staffWorksOn(person, date);
              const providedServices = data.services.filter(service => person.serviceIds.includes(service.id));
              return <article className={`availability-person ${working ? 'is-working' : 'is-away'}`} key={person.id}>
                <div><strong>{person.name}</strong><span>{working ? `${person.startTime}–${person.endTime}` : person.daysOff.includes(date) ? 'Day off' : 'Not scheduled'}</span></div>
                <small>{providedServices.map(service => service.name).join(' · ') || 'No services assigned'}</small>
              </article>;
            })}
          </div>
        </section>

        <section className="schedule card">
          <div className="schedule-head">
            <div>
              <p className="eyebrow">THE STUDIO FLOOR</p>
              <h2 className="serif">{prettyDate(date)}</h2>
            </div>
            <span className="pill pill-accent">
              {bookingsForSelectedDate.length} visits
            </span>
          </div>

          {bookingsForSelectedDate.length > 0 ? (
            <div className="schedule-list">
              {bookingsForSelectedDate.map((booking, index) => {
                const service = serviceById(booking.serviceId);
                const stylist = staffById(booking.staffId);
                const customerInitials = booking.customerName
                  .split(' ')
                  .map(name => name[0])
                  .slice(0, 2)
                  .join('');

                return (
                  <article className="schedule-row" key={booking.id}>
                    <div className="schedule-time">
                      <strong>{booking.time}</strong>
                      <span>{service?.durationMinutes || 60} min</span>
                    </div>

                    <div className="timeline">
                      <i className={index === 0 ? 'first' : ''} />
                    </div>

                    <div className="schedule-person">
                      <div className="person-monogram">{customerInitials}</div>
                      <div>
                        <strong>{booking.customerName}</strong>
                        <span>
                          {service?.name || 'Studio visit'} <i>·</i>{' '}
                          {stylist?.name || 'Team'}
                        </span>
                        <small>{booking.phone || booking.email}</small>
                      </div>
                    </div>

                    <StatusBadge status={booking.status} />

                    <div className="schedule-actions">
                      {booking.status === 'confirmed' && (
                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            updateBookingStatus(booking.id, 'checked-in')
                          }
                        >
                          Check in
                        </button>
                      )}

                      {booking.status === 'checked-in' && (
                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            updateBookingStatus(booking.id, 'completed')
                          }
                        >
                          Complete
                        </button>
                      )}

                      {booking.status !== 'no-show' &&
                        booking.status !== 'completed' && (
                          <button
                            className="subtle-action"
                            onClick={() =>
                              updateBookingStatus(booking.id, 'no-show')
                            }
                          >
                            No show
                          </button>
                        )}

                      {(booking.status === 'completed' ||
                        booking.status === 'no-show') && (
                        <button
                          className="subtle-action"
                          onClick={() =>
                            updateBookingStatus(booking.id, 'confirmed')
                          }
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="A little breathing room."
              copy="No visits are booked for this day. Take a moment, then check another date."
            />
          )}
        </section>
      </div>
    </main>
  );
}
