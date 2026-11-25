import { ArrowRight } from 'lucide-react';
import { EmptyState, Metric } from '../ui/Shared';
import type { Booking, Service, Staff } from '../../types';
import { money } from '../../utils/format';
import type { AdminTab } from './AdminSidebar';

type AdminOverviewProps = {
  services: Service[];
  staff: Staff[];
  upcomingBookings: Booking[];
  revenue: number;
  serviceById: (id: string) => Service | undefined;
  staffById: (id: string) => Staff | undefined;
  onChangeTab: (tab: AdminTab) => void;
  reassignmentRequiredCount: number;
};

export function AdminOverview({
  services,
  staff,
  upcomingBookings,
  revenue,
  serviceById,
  staffById,
  onChangeTab,
  reassignmentRequiredCount,
}: AdminOverviewProps) {
  const activeServiceCount = services.filter(service => service.active).length;
  const activeStaffCount = staff.filter(person => person.active).length;

  return (
    <div className="admin-page-content">
      <div className="admin-greeting">
        <div>
          <p className="eyebrow">YOUR STUDIO AT A GLANCE</p>
          <h1 className="serif">Good morning.</h1>
          <p>Here’s what’s happening at Mysa House.</p>
        </div>
        <button className="btn btn-sm" onClick={() => onChangeTab('Appointments')}>
          View appointments <ArrowRight size={15} />
        </button>
      </div>

      {reassignmentRequiredCount > 0 && (
        <button className="reassignment-alert" onClick={() => onChangeTab('Appointments')}>
          <strong>{reassignmentRequiredCount} appointment{reassignmentRequiredCount === 1 ? '' : 's'} need a new therapist.</strong>
          <span>Review and reassign affected visits <ArrowRight size={15} /></span>
        </button>
      )}

      <div className="admin-metrics">
        <Metric label="Upcoming visits" value={`${upcomingBookings.length}`} note="across your calendar" />
        <Metric label="Services offered" value={`${activeServiceCount}`} note="active menu items" />
        <Metric label="Team members" value={`${activeStaffCount}`} note="ready to welcome" />
        <Metric label="Booked value" value={money(revenue)} note="all active bookings" />
      </div>

      <div className="overview-grid">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">NEXT ON THE CALENDAR</p>
              <h2 className="serif">Coming up</h2>
            </div>
            <button className="text-link" onClick={() => onChangeTab('Appointments')}>
              All visits <ArrowRight size={14} />
            </button>
          </div>

          {upcomingBookings.slice(0, 5).map(booking => (
            <div className="mini-appointment" key={booking.id}>
              <div className="mini-date">
                <b>{new Date(`${booking.date}T12:00:00`).getDate()}</b>
                <small>{new Date(`${booking.date}T12:00:00`).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</small>
              </div>
              <div>
                <strong>{booking.customerName}</strong>
                <span>{serviceById(booking.serviceId)?.name} · {staffById(booking.staffId)?.name}</span>
              </div>
              <time>{booking.time}</time>
            </div>
          ))}
          {upcomingBookings.length === 0 && (
            <EmptyState title="A blank canvas." copy="New appointments will show up here." />
          )}
        </section>

        <section className="admin-panel menu-preview">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR MENU</p>
              <h2 className="serif">Services</h2>
            </div>
            <button className="text-link" onClick={() => onChangeTab('Services')}>
              Manage <ArrowRight size={14} />
            </button>
          </div>
          {services.filter(service => service.active).slice(0, 4).map(service => (
            <div className="menu-preview-row" key={service.id}>
              <span>{service.name}</span>
              <b>{money(service.price)}</b>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
