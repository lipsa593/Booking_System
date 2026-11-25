import { Bell, CalendarDays } from 'lucide-react';
import { EmptyState } from '../components/ui/Shared';
import type { Booking, UserProfile } from '../types';
import { prettyDate } from '../utils/format';

type NotificationsPageProps = {
  bookings: Booking[];
  profile: UserProfile;
};

export function NotificationsPage({ bookings, profile }: NotificationsPageProps) {
  // Only show notifications related to the signed-in demo profile.
  const userBookings = bookings
    .filter(booking => booking.email.toLowerCase() === profile.email.toLowerCase())
    .sort((first, second) => second.date.localeCompare(first.date));

  return (
    <main className="wrap notifications-page page-in">
      <header className="account-heading">
        <div>
          <p className="eyebrow">A LITTLE NOTE FROM THE STUDIO</p>
          <h1 className="serif">Notifications.</h1>
          <p>Your booking updates and reminders will appear here.</p>
        </div>
      </header>

      {userBookings.length > 0 ? (
        <div className="notification-list">
          {userBookings.map(booking => (
            <article className="notification-card card" key={booking.id}>
              <div className="notification-icon"><CalendarDays size={20} /></div>
              <div className="notification-content">
                <strong>
                  {booking.status === 'cancelled'
                    ? 'Your visit was cancelled'
                    : booking.status === 'completed'
                      ? 'Your visit is complete'
                      : 'Your visit is confirmed'}
                </strong>
                <p>
                  {prettyDate(booking.date, { weekday: 'short', day: 'numeric', month: 'long' })}
                  {' at '}{booking.time}
                </p>
              </div>
              <span className={`pill ${booking.status === 'confirmed' ? 'pill-accent' : ''}`}>
                {booking.status.replace('-', ' ')}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You’re all caught up."
          copy="When you book a visit, appointment updates will show up here."
        />
      )}

      <p className="account-demo-note">
        Demo notifications are created from your bookings and reset when you refresh.
      </p>
    </main>
  );
}
