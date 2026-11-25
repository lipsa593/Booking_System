import { useState } from 'react';
import { AdminAppointments } from '../components/admin/AdminAppointments';
import { AdminAvailability } from '../components/admin/AdminAvailability';
import { AdminBrands } from '../components/admin/AdminBrands';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminServices } from '../components/admin/AdminServices';
import { AdminSidebar, type AdminTab } from '../components/admin/AdminSidebar';
import { AdminTeam } from '../components/admin/AdminTeam';
import type { DemoData, Service, Staff } from '../types';
import { today } from '../utils/format';
import { isStaffSlotAvailable } from '../utils/availability';

type AdminPageProps = {
  data: DemoData;
  patch: (data: Partial<DemoData>) => void;
  serviceById: (id: string) => Service | undefined;
  staffById: (id: string) => Staff | undefined;
};

export function AdminPage({ data, patch, serviceById, staffById }: AdminPageProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>('Overview');
  const [editingService, setEditingService] = useState<Service | null>(null);

  const activeBookings = data.bookings.filter(booking => booking.status !== 'cancelled');
  const upcomingBookings = activeBookings.filter(booking => booking.date >= today);
  const revenue = activeBookings
    .filter(booking => booking.status !== 'no-show')
    .reduce((total, booking) => total + booking.total, 0);

  function startAddingService() {
    setEditingService({
      id: `s${Date.now()}`,
      name: '',
      category: 'Cut & style',
      durationMinutes: 60,
      price: 75,
      description: '',
      active: true,
    });
  }

  function saveService(service: Service) {
    const serviceAlreadyExists = data.services.some(item => item.id === service.id);
    const updatedServices = serviceAlreadyExists
      ? data.services.map(item => item.id === service.id ? service : item)
      : [...data.services, service];

    patch({ services: updatedServices });
    setEditingService(null);
  }

  function toggleService(serviceId: string) {
    const updatedServices = data.services.map(service =>
      service.id === serviceId
        ? { ...service, active: !service.active }
        : service,
    );

    patch({ services: updatedServices });
  }

  function addTeamMember(person: Omit<Staff, 'id'>) {
    const newStaffMember: Staff = {
      id: `t${Date.now()}`,
      ...person,
    };

    patch({ staff: [...data.staff, newStaffMember] });
  }

  function updateStaffMember(staffId: string, updatedPerson: Omit<Staff, 'id'>) {
    const updatedStaff = data.staff.map(person => person.id === staffId ? { ...person, ...updatedPerson } : person);
    const changedPerson = updatedStaff.find(person => person.id === staffId);
    const updatedBookings = changedPerson
      ? data.bookings.map(booking => {
        if (booking.staffId !== staffId || ['cancelled', 'completed', 'no-show'].includes(booking.status)) return booking;
        const service = serviceById(booking.serviceId);
        if (!service || isStaffSlotAvailable(changedPerson, booking.date, booking.time, service, data.bookings, data.services, booking.id)) return booking;
        return { ...booking, status: 'reassignment-required' };
      })
      : data.bookings;

    patch({ staff: updatedStaff, bookings: updatedBookings });
  }

  function toggleStaffActive(staffId: string) {
    const person = staffById(staffId);
    if (!person) return;
    updateStaffMember(staffId, { ...person, active: !person.active });
  }

  function updateBookingStatus(bookingId: string, status: string) {
    const updatedBookings = data.bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status } : booking,
    );

    patch({ bookings: updatedBookings });
  }

  function reassignBooking(bookingId: string, staffId: string) {
    const updatedBookings = data.bookings.map(booking =>
      booking.id === bookingId ? { ...booking, staffId, status: 'confirmed' } : booking,
    );
    patch({ bookings: updatedBookings });
  }

  const reassignmentRequiredCount = data.bookings.filter(booking => booking.status === 'reassignment-required').length;

  return (
    <main className="admin-layout page-in">
      <AdminSidebar
        currentTab={currentTab}
        upcomingCount={upcomingBookings.length}
        onChangeTab={setCurrentTab}
      />

      <section className="admin-content">
        <div className="admin-topline">
          <div className="crumb">Studio <span>/</span> {currentTab}</div>
        </div>

        {currentTab === 'Overview' && (
          <AdminOverview
            services={data.services}
            staff={data.staff}
            upcomingBookings={upcomingBookings}
            revenue={revenue}
            serviceById={serviceById}
            staffById={staffById}
            onChangeTab={setCurrentTab}
            reassignmentRequiredCount={reassignmentRequiredCount}
          />
        )}

        {currentTab === 'Services' && (
          <AdminServices
            services={data.services}
            editingService={editingService}
            onAdd={startAddingService}
            onEdit={setEditingService}
            onSave={saveService}
            onCancelEdit={() => setEditingService(null)}
            onToggleActive={toggleService}
          />
        )}

        {currentTab === 'Team' && (
          <AdminTeam
            staff={data.staff}
            services={data.services}
            onAdd={addTeamMember}
            onUpdate={updateStaffMember}
            onToggleActive={toggleStaffActive}
          />
        )}

        {currentTab === 'Brands' && (
          <AdminBrands
            brands={data.brands}
            onChange={brands => patch({ brands })}
          />
        )}

        {currentTab === 'Appointments' && (
          <AdminAppointments
            bookings={data.bookings}
            staff={data.staff}
            services={data.services}
            serviceById={serviceById}
            staffById={staffById}
            onUpdateStatus={updateBookingStatus}
            onReassign={reassignBooking}
          />
        )}

        {currentTab === 'Team Availability' && (
          <AdminAvailability
            staff={data.staff}
            bookings={data.bookings}
            services={data.services}
            onUpdateStaff={(person) => updateStaffMember(person.id, person)}
          />
        )}

      </section>
    </main>
  );
}
