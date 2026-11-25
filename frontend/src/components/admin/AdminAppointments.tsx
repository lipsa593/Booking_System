import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { EmptyState } from '../ui/Shared';
import type { Booking, Service, Staff } from '../../types';
import { prettyDate } from '../../utils/format';
import { isStaffSlotAvailable } from '../../utils/availability';

type AdminAppointmentsProps = {
  bookings: Booking[];
  staff: Staff[];
  services: Service[];
  serviceById: (id: string) => Service | undefined;
  staffById: (id: string) => Staff | undefined;
  onUpdateStatus: (bookingId: string, status: string) => void;
  onReassign: (bookingId: string, staffId: string) => void;
};

export function AdminAppointments({ bookings, staff, services, serviceById, staffById, onUpdateStatus, onReassign }: AdminAppointmentsProps) {
  const [query, setQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStaff, setFilterStaff] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [reassigningBooking, setReassigningBooking] = useState<Booking | null>(null);
  const [replacementStaffId, setReplacementStaffId] = useState('');

  const filteredBookings = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    return bookings
      .filter(booking => {
        const searchableText = [
          booking.id,
          booking.customerName,
          serviceById(booking.serviceId)?.name || '',
          staffById(booking.staffId)?.name || '',
        ].join(' ').toLowerCase();
        return searchableText.includes(searchText)
          && (!filterDate || booking.date === filterDate)
          && (!filterStaff || booking.staffId === filterStaff)
          && (!filterService || booking.serviceId === filterService)
          && (!filterStatus || booking.status === filterStatus);
      })
      .sort((firstBooking, secondBooking) =>
        firstBooking.date.localeCompare(secondBooking.date)
        || firstBooking.time.localeCompare(secondBooking.time),
      );
  }, [bookings, filterDate, filterService, filterStaff, filterStatus, query, serviceById, staffById]);

  const alternatives = reassigningBooking
    ? staff.filter(person => {
      const service = serviceById(reassigningBooking.serviceId);
      return person.id !== reassigningBooking.staffId
        && !!service
        && person.serviceIds.includes(service.id)
        && isStaffSlotAvailable(person, reassigningBooking.date, reassigningBooking.time, service, bookings, services, reassigningBooking.id);
    })
    : [];

  function openReassignment(booking: Booking) {
    setReassigningBooking(booking);
    setReplacementStaffId('');
  }

  function closeReassignment() {
    setReassigningBooking(null);
    setReplacementStaffId('');
  }

  function confirmReassignment() {
    if (!reassigningBooking || !replacementStaffId) return;
    onReassign(reassigningBooking.id, replacementStaffId);
    closeReassignment();
  }

  return (
    <div className="admin-page-content">
      <div className="admin-greeting">
        <div>
          <p className="eyebrow">EVERY VISIT, ALL IN ONE PLACE</p>
          <h1 className="serif">Appointments.</h1>
          <p>Keep an eye on the studio’s rhythm.</p>
        </div>
        <div className="appointment-count">{filteredBookings.length} visits</div>
      </div>

      {bookings.some(booking => booking.status === 'reassignment-required') && (
        <div className="reassignment-alert">
          <strong>{bookings.filter(booking => booking.status === 'reassignment-required').length} appointments need reassignment.</strong>
          <span>Choose an available therapist for each affected visit.</span>
        </div>
      )}

      <div className="appointment-filters">
        <input className="field appointment-search" placeholder="Search ID, client, service or therapist" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search appointments" />
        <label><span>Date</span><input className="field" type="date" value={filterDate} onChange={event => setFilterDate(event.target.value)} /></label>
        <label><span>Therapist</span><select className="field" value={filterStaff} onChange={event => setFilterStaff(event.target.value)}><option value="">All therapists</option>{staff.map(person => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label>
        <label><span>Treatment</span><select className="field" value={filterService} onChange={event => setFilterService(event.target.value)}><option value="">All treatments</option>{services.map(service => <option value={service.id} key={service.id}>{service.name}</option>)}</select></label>
        <label><span>Status</span><select className="field" value={filterStatus} onChange={event => setFilterStatus(event.target.value)}><option value="">All statuses</option><option value="confirmed">Confirmed</option><option value="reassignment-required">Reassignment required</option><option value="checked-in">Checked in</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no-show">No show</option></select></label>
      </div>

      <div className="appointment-table card">
        <div className="table-head appointment-table-head">
          <span>APPOINTMENT / CLIENT</span>
          <span>TREATMENT</span>
          <span>THERAPIST</span>
          <span>DATE &amp; TIME</span>
          <span>STATUS</span>
          <span>ACTIONS</span>
        </div>
        {filteredBookings.map(booking => (
          <div className={`table-row appointment-table-row ${booking.status === 'reassignment-required' ? 'needs-reassignment' : ''}`} key={booking.id}>
            <div className="appointment-client-cell">
              <span className="appointment-id">{booking.id.toUpperCase()}</span>
              <div className="table-client">
                <span>{booking.customerName.split(' ').map(part => part[0]).join('')}</span>
                <strong>{booking.customerName}<small>{booking.email}</small></strong>
              </div>
            </div>
            <span>{serviceById(booking.serviceId)?.name || '—'}</span>
            <span>{staffById(booking.staffId)?.name || '—'}</span>
            <span>{prettyDate(booking.date, { day: 'numeric', month: 'short', year: 'numeric' })}<small>{booking.time}</small></span>
            <select className="status-select" value={booking.status} disabled={booking.status === 'reassignment-required'} onChange={event => onUpdateStatus(booking.id, event.target.value)} aria-label={`Status for appointment ${booking.id}`}>
              <option value="confirmed">Confirmed</option>
              <option value="reassignment-required">Reassignment required</option>
              <option value="checked-in">Checked in</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No show</option>
            </select>
            {booking.status === 'reassignment-required'
              ? <button className="btn btn-sm reassign-button" onClick={() => openReassignment(booking)}>Reassign therapist</button>
              : <span className="no-appointment-action">—</span>}
          </div>
        ))}
        {filteredBookings.length === 0 && (
          <EmptyState title="No visits match those filters." copy="Try changing the date, therapist, treatment or status." />
        )}
      </div>

      {reassigningBooking && (
        <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeReassignment(); }}>
          <section className="reassignment-modal card" role="dialog" aria-modal="true" aria-labelledby="reassignment-title">
            <div className="modal-heading">
              <div><p className="eyebrow">APPOINTMENT {reassigningBooking.id.toUpperCase()}</p><h2 className="serif" id="reassignment-title">Reassign therapist</h2></div>
              <button type="button" className="icon-button" aria-label="Close reassignment dialog" onClick={closeReassignment}><X size={18} /></button>
            </div>
            <p className="reassignment-visit-details">{reassigningBooking.customerName} · {serviceById(reassigningBooking.serviceId)?.name} · {prettyDate(reassigningBooking.date, { day: 'numeric', month: 'long', year: 'numeric' })} at {reassigningBooking.time}</p>
            <p className="step-help">Choose a therapist who can provide this treatment at the scheduled time. The change is saved only after confirmation.</p>
            <div className="reassignment-options">
              {alternatives.map(person => (
                <label key={person.id} className={`reassignment-option ${replacementStaffId === person.id ? 'selected' : ''}`}>
                  <input type="radio" name="replacement-therapist" value={person.id} checked={replacementStaffId === person.id} onChange={() => setReplacementStaffId(person.id)} />
                  {person.imageUrl ? <img src={person.imageUrl} alt="" /> : <span className="availability-initials">{person.name.split(' ').map(part => part[0]).join('')}</span>}
                  <span><strong>{person.name}</strong><small>{person.specialties.join(' · ') || person.role}</small></span>
                  <span className="replacement-availability"><Check size={14} />Available</span>
                </label>
              ))}
              {alternatives.length === 0 && <EmptyState title="No therapist is available for this visit." copy="Keep the appointment flagged and try again after updating availability." />}
            </div>
            <div className="modal-actions"><button type="button" className="btn btn-outline btn-sm" onClick={closeReassignment}>Cancel</button><button type="button" className="btn btn-sm" onClick={confirmReassignment} disabled={!replacementStaffId || alternatives.length === 0}>Confirm reassignment</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
