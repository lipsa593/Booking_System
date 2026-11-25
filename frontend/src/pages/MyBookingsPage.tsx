import { useState } from 'react';
import { ArrowRight, CalendarDays, Plus, Star, UserRound, X } from 'lucide-react';
import { Link } from 'wouter';
import { EmptyState } from '../components/ui/Shared';
import type { Booking, DemoData, Review, Service, Staff } from '../types';
import { prettyDate, today, money } from '../utils/format';
import { getAvailableSlots } from '../utils/availability';

type MyBookingsPageProps = {
  data: DemoData;
  serviceById: (id: string) => Service | undefined;
  staffById: (id: string) => Staff | undefined;
  update: (bookings: Booking[]) => void;
  reviews: Review[];
  updateReviews: (reviews: Review[]) => void;
  services: Service[];
  staff: Staff[];
};

export function MyBookingsPage({ data, serviceById, staffById, update, reviews, updateReviews, services, staff }: MyBookingsPageProps) {
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [reschedule, setReschedule] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const matches = data.bookings
    .filter(booking => !searched || booking.email.toLowerCase() === email.trim().toLowerCase())
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const visibleBookings = matches.filter(booking => booking.status !== 'cancelled');

  const cancel = (id: string) => {
    if (window.confirm('Cancel this visit?')) {
      update(data.bookings.map(booking => booking.id === id ? { ...booking, status: 'cancelled' } : booking));
    }
  };
  const saveDate = (id: string, date: string, time: string) => {
    update(data.bookings.map(booking => booking.id === id ? { ...booking, date, time } : booking));
    setReschedule(null);
  };

  return (
    <main className="wrap account-page page-in">
      <div className="account-heading"><div><p className="eyebrow">YOUR TIME, YOUR WAY</p><h1 className="serif">My bookings.</h1><p>Look up a visit, or make a little change.</p></div><Link className="btn" href="/book">Book another <Plus size={16} /></Link></div>
      <div className="lookup card">
        <div className="lookup-icon"><UserRound size={20} /></div>
        <div className="lookup-copy"><strong>Find your visits</strong><span>Use the email address you booked with.</span></div>
        <form className="lookup-form" onSubmit={event => { event.preventDefault(); setSearched(true); }}>
          <input className="field" type="email" required placeholder="Email address" value={email} onChange={event => setEmail(event.target.value)} aria-label="Email address" />
          <button className="btn btn-sm" type="submit">Find visits</button>
          {searched && <button className="clear-search" type="button" onClick={() => { setSearched(false); setEmail(''); }}>Clear</button>}
        </form>
      </div>
      <div className="booking-cards">{visibleBookings.map(booking => <article className="account-booking card" key={booking.id} data-testid={`booking-card-${booking.id}`}>
        <div className="date-tile"><strong>{new Date(`${booking.date}T12:00:00`).getDate()}</strong><span>{new Date(`${booking.date}T12:00:00`).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</span></div>
        <div className="account-booking-main"><div className="booking-main-title"><h3 className="serif">{serviceById(booking.serviceId)?.name || 'Studio visit'}</h3><span className="pill">Confirmed</span></div><p><CalendarDays size={14} />{prettyDate(booking.date)} · {booking.time}</p><p><UserRound size={14} />{staffById(booking.staffId)?.name || 'Mysa stylist'} · {money(booking.total)}</p></div>
        <div className="booking-actions"><button className="btn btn-outline btn-sm" onClick={() => setReschedule(reschedule === booking.id ? null : booking.id)}>Reschedule</button><button className="cancel-link" onClick={() => cancel(booking.id)}>Cancel visit</button></div>
        {booking.status === 'completed' && (() => {
          const existingReview = reviews.find(review => review.bookingId === booking.id);
          if (existingReview) return <div className="submitted-review"><div className="review-stars" aria-label={`${existingReview.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < existingReview.rating ? 'currentColor' : 'none'} />)}</div><p>“{existingReview.comment}”</p><small>Your review is live on our home page. Thank you.</small></div>;
          return reviewing === booking.id ? (
            <form className="review-editor" onSubmit={event => {
              event.preventDefault();
              const review: Review = { id: `r${Date.now()}`, bookingId: booking.id, customerName: booking.customerName, serviceId: booking.serviceId, staffId: booking.staffId, rating, comment: comment.trim(), date: today };
              updateReviews([review, ...reviews]);
              setReviewing(null);
              setComment('');
            }}>
              <strong>How was your visit?</strong>
              <div className="rating-picker" role="radiogroup" aria-label="Your rating">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  return <button type="button" role="radio" aria-checked={rating === value} aria-label={`${value} star${value === 1 ? '' : 's'}`} key={value} onClick={() => setRating(value)}><Star size={23} fill={value <= rating ? 'currentColor' : 'none'} /></button>;
                })}
              </div>
              <label className="sr-only" htmlFor={`review-${booking.id}`}>Write your review</label>
              <textarea required minLength={8} maxLength={500} id={`review-${booking.id}`} className="field" placeholder="Share a few words about your experience…" value={reviewing === booking.id ? comment : ''} onChange={event => setComment(event.target.value)} />
              <div className="review-editor-actions"><button type="button" className="btn btn-outline btn-sm" onClick={() => setReviewing(null)}>Not now</button><button type="submit" className="btn btn-sm" disabled={comment.trim().length < 8}>Post review</button></div>
            </form>
          ) : <button className="review-cta" onClick={() => { setReviewing(booking.id); setRating(5); }}>Rate this visit <Star size={15} /></button>;
        })()}
        {reschedule === booking.id && <ReschedulePanel booking={booking} service={serviceById(booking.serviceId)} staff={staff} services={services} bookings={data.bookings} onSave={(date, time) => saveDate(booking.id, date, time)} onClose={() => setReschedule(null)} />}
      </article>)}</div>
      {visibleBookings.length === 0 && <EmptyState title={searched ? 'No visits found just yet.' : 'Nothing on the calendar yet.'} copy={searched ? 'Check that you used the same email as your booking.' : 'When you book a little time for yourself, it will appear here.'} action={<Link className="btn btn-sm" href="/book">Find a time <ArrowRight size={15} /></Link>} />}
    </main>
  );
}

function ReschedulePanel({ booking, service, staff, services, bookings, onSave, onClose }: { booking: Booking; service?: Service; staff: Staff[]; services: Service[]; bookings: Booking[]; onSave: (date: string, time: string) => void; onClose: () => void }) {
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);
  const person = staff.find(member => member.id === booking.staffId);
  const slots = service ? getAvailableSlots(date, service, staff, bookings, services, booking.staffId, booking.id).map(slot => slot.time) : [];

  return <div className="reschedule-panel"><div className="reschedule-title"><strong>Choose a new time · {person?.name || 'your stylist'}</strong><button className="icon-button" onClick={onClose} aria-label="Close"><X size={16} /></button></div><div className="reschedule-fields"><input className="field" type="date" min={today} value={date} onChange={event => { setDate(event.target.value); setTime(''); }} /><select className="field" value={time} onChange={event => setTime(event.target.value)} disabled={!slots.length}><option value="">Choose an available time</option>{slots.map(slot => <option value={slot} key={slot}>{slot}</option>)}</select><button className="btn btn-sm" disabled={!time || !slots.includes(time)} onClick={() => onSave(date, time)}>Save change</button></div>{slots.length === 0 && <small className="availability-empty">No openings for this stylist on that date.</small>}</div>;
}
