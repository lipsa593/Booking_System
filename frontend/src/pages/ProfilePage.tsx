import { useState } from 'react';
import { ArrowRight, Check, Star, UserRound } from 'lucide-react';
import { Link } from 'wouter';
import type { Booking, Review, Service, UserProfile } from '../types';
import { today } from '../utils/format';

type ProfilePageProps = {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onLogout: () => void;
  bookings: Booking[];
  reviews: Review[];
  onAddReview: (review: Review) => void;
  serviceById: (id: string) => Service | undefined;
};

export function ProfilePage({ profile, onSave, onLogout, bookings, reviews, onAddReview, serviceById }: ProfilePageProps) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const completedBookings = bookings.filter(booking =>
    booking.email.toLowerCase() === profile.email.toLowerCase()
    && booking.status === 'completed',
  );
  const reviewableBookings = completedBookings.filter(booking =>
    !reviews.some(review => review.bookingId === booking.id),
  );
  const selectedBooking = reviewableBookings.find(booking => booking.id === selectedBookingId)
    || reviewableBookings[0];

  function updateField(field: keyof UserProfile, value: string) {
    setForm(currentProfile => ({ ...currentProfile, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
    setSaved(true);
  }

  return (
    <main className="profile-layout wrap page-in">
      <section className="profile-details-card account-card card">
        <div className="account-brand-mark"><UserRound size={22} /></div>
        <p className="eyebrow">YOUR MYSA HOUSE DETAILS</p>
        <h1 className="serif">Your profile.</h1>
        <p className="account-intro">Keep your contact details ready for your next studio visit.</p>

        <form className="account-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="label" htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              className="field"
              autoComplete="name"
              value={form.name}
              onChange={event => updateField('name', event.target.value)}
              placeholder="First and last name"
              required
            />
          </div>

          <div className="form-row">
            <label className="label" htmlFor="profile-email">Email address</label>
            <input
              id="profile-email"
              className="field"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={event => updateField('email', event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-row">
            <label className="label" htmlFor="profile-phone">Phone number</label>
            <input
              id="profile-phone"
              className="field"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={event => updateField('phone', event.target.value)}
              placeholder="Your phone number"
            />
          </div>

          <button className="btn account-submit" type="submit">
            Save profile <ArrowRight size={16} />
          </button>
        </form>
        {saved && (
          <p className="account-notice" role="status">
            <Check size={17} />
            Profile details saved for this session.
          </p>
        )}

        <p className="account-demo-note">
          Demo only: profile details are held in memory and reset when you refresh.
        </p>
        <p className="account-switch">
          <Link href="/my-bookings">Go to my bookings</Link>
        </p>
        <button className="subtle-action" type="button" onClick={onLogout}>
          Sign out
        </button>
      </section>

      <section className="profile-rate-card card" aria-labelledby="profile-reviews-heading">
        <div className="rate-card-icon"><Star size={21} /></div>
        <p className="eyebrow">A NOTE FROM YOU</p>
        <h2 className="serif" id="profile-reviews-heading">Rate us.</h2>
        <p className="rate-card-intro">Tell us how your visit felt. Your words help us make every studio day special.</p>

        {selectedBooking ? (
          <form className="profile-review-form" onSubmit={event => {
            event.preventDefault();
            const review: Review = {
              id: `r${Date.now()}`,
              bookingId: selectedBooking.id,
              customerName: profile.name || selectedBooking.customerName,
              serviceId: selectedBooking.serviceId,
              staffId: selectedBooking.staffId,
              rating,
              comment: comment.trim(),
              date: today,
            };
            onAddReview(review);
            setComment('');
            setRating(5);
            setSelectedBookingId('');
          }}>
            {reviewableBookings.length > 1 && (
              <div className="form-row">
                <label className="label" htmlFor="review-appointment">Appointment</label>
                <select id="review-appointment" className="field" value={selectedBooking.id} onChange={event => setSelectedBookingId(event.target.value)}>
                  {reviewableBookings.map(booking => <option value={booking.id} key={booking.id}>{serviceById(booking.serviceId)?.name || 'Studio visit'} · {booking.date}</option>)}
                </select>
              </div>
            )}
            <label className="label">Your rating</label>
            <div className="rating-picker profile-rating-picker" role="radiogroup" aria-label="Your rating">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return <button type="button" role="radio" aria-checked={rating === value} aria-label={`${value} star${value === 1 ? '' : 's'}`} key={value} onClick={() => setRating(value)}><Star size={30} fill={value <= rating ? 'currentColor' : 'none'} /></button>;
              })}
            </div>
            <label className="label" htmlFor="profile-review-text">Your review</label>
            <textarea required minLength={8} maxLength={500} id="profile-review-text" className="field" placeholder="Write a few words about your experience…" value={comment} onChange={event => setComment(event.target.value)} />
            <button type="submit" className="btn profile-review-submit" disabled={comment.trim().length < 8}>Send your review <ArrowRight size={16} /></button>
          </form>
        ) : (
          <div className="profile-rate-empty">
            <p>{completedBookings.length ? 'You’ve reviewed all your completed visits. Thank you!' : 'After your appointment is marked complete, you can leave a rating and review here.'}</p>
            <Link className="profile-reviews-link" href="/my-bookings">View my bookings <ArrowRight size={14} /></Link>
          </div>
        )}

        {completedBookings.some(booking => reviews.some(review => review.bookingId === booking.id)) && (
          <div className="profile-review-history">
            <strong>Your recent feedback</strong>
            {completedBookings.map(booking => {
              const review = reviews.find(item => item.bookingId === booking.id);
              return review ? <div className="profile-history-review" key={review.id}>
                <span>{serviceById(booking.serviceId)?.name || 'Studio visit'}</span>
                <span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill={index < review.rating ? 'currentColor' : 'none'} />)}</span>
              </div> : null;
            })}
          </div>
        )}
      </section>
    </main>
  );
}
