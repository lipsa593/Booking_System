import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Service, Staff } from '../../types';
import { TeamMemberForm } from './TeamMemberForm';

type AdminTeamProps = {
  staff: Staff[];
  services: Service[];
  onAdd: (person: Omit<Staff, 'id'>) => void;
  onUpdate: (staffId: string, person: Omit<Staff, 'id'>) => void;
  onToggleActive: (staffId: string) => void;
};

export function AdminTeam({ staff, services, onAdd, onUpdate, onToggleActive }: AdminTeamProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Staff | null>(null);

  function addMember(person: Omit<Staff, 'id'>) {
    onAdd(person);
    setShowForm(false);
  }

  function saveMember(person: Omit<Staff, 'id'>) {
    if (editingMember) {
      onUpdate(editingMember.id, person);
      setEditingMember(null);
      return;
    }

    addMember(person);
  }

  function startAddingMember() {
    setEditingMember(null);
    setShowForm(true);
  }

  function startEditingMember(person: Staff) {
    setShowForm(false);
    setEditingMember(person);
  }

  function closeForm() {
    setShowForm(false);
    setEditingMember(null);
  }

  return (
    <div className="admin-page-content">
      <div className="admin-greeting">
        <div>
          <p className="eyebrow">THE PEOPLE BEHIND THE MIRROR</p>
          <h1 className="serif">Your team.</h1>
          <p>Lovely hands make a lovely visit.</p>
        </div>
        <button className="btn btn-sm" onClick={startAddingMember}>
          <Plus size={15} /> Add team member
        </button>
      </div>

      {(showForm || editingMember) && (
        <TeamMemberForm
          key={editingMember?.id || 'new-team-member'}
          staffMember={editingMember || undefined}
          services={services}
          onSave={saveMember}
          onCancel={closeForm}
        />
      )}

      <div className="team-grid">
        {staff.map((person, index) => (
          <article className="team-card card" key={person.id}>
            <div className="team-profile">
              {person.imageUrl
                ? <img className={`team-avatar tone-${index % 3}`} src={person.imageUrl} alt="" />
                : <div className={`team-avatar tone-${index % 3}`}>{person.name.split(' ').map(part => part[0]).join('')}</div>}
              <div className="team-profile-details">
                <h2 className="serif">{person.name}</h2>
                <p>{person.role}</p>
              </div>
              <span className={`pill team-availability ${person.active ? 'pill-accent' : ''}`}>
                {person.active ? 'Available' : 'Away'}
              </span>
            </div>
            <div className="specialty-list">
              {person.serviceIds.map(serviceId => <span key={serviceId}>{services.find(service => service.id === serviceId)?.name || 'Service'}</span>)}
            </div>
            <p className="team-hours">{person.startTime}–{person.endTime} · {person.workingDays.length} working days · {person.daysOff.length} days off</p>
            <div className="team-actions">
              <button className="btn btn-outline btn-sm" onClick={() => startEditingMember(person)}>
                Edit
              </button>
              <button className="subtle-action" onClick={() => onToggleActive(person.id)}>
                {person.active ? 'Set away' : 'Make available'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
