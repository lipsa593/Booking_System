import { useState } from 'react';
import type { Service, Staff } from '../../types';
import { weekDays } from '../../utils/availability';

type TeamMemberFormProps = {
  staffMember?: Staff;
  services: Service[];
  onSave: (person: Omit<Staff, 'id'>) => void;
  onCancel: () => void;
};

export function TeamMemberForm({ staffMember, services, onSave, onCancel }: TeamMemberFormProps) {
  const isEditing = Boolean(staffMember);
  const [name, setName] = useState(staffMember?.name || '');
  const [role, setRole] = useState(staffMember?.role || 'Stylist');
  const [imageUrl, setImageUrl] = useState(staffMember?.imageUrl || '');
  const [specialties, setSpecialties] = useState(
    staffMember?.specialties.join(', ') || 'Cut & style',
  );
  const [serviceIds, setServiceIds] = useState(staffMember?.serviceIds || []);
  const [workingDays, setWorkingDays] = useState(staffMember?.workingDays || [1, 2, 3, 4, 5, 6]);
  const [startTime, setStartTime] = useState(staffMember?.startTime || '09:00');
  const [endTime, setEndTime] = useState(staffMember?.endTime || '17:00');
  const [daysOff, setDaysOff] = useState(staffMember?.daysOff.join(', ') || '');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const specialtyList = specialties
      .split(',')
      .map(specialty => specialty.trim())
      .filter(specialty => specialty.length > 0);

    onSave({
      name: name.trim(),
      role: role.trim(),
      imageUrl: imageUrl.trim() || undefined,
      specialties: specialtyList,
      serviceIds,
      workingDays,
      startTime,
      endTime,
      daysOff: daysOff.split(',').map(day => day.trim()).filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day)),
      active: staffMember?.active ?? true,
    });
  }

  return (
    <form className="service-form card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{isEditing ? 'UPDATE YOUR STUDIO TEAM' : 'A NEW FACE IN THE STUDIO'}</p>
          <h2 className="serif">{isEditing ? 'Edit team member' : 'Add a team member'}</h2>
        </div>
      </div>

      <div className="form-grid">
        <div>
          <label className="label" htmlFor="team-member-name">Name</label>
          <input
            id="team-member-name"
            className="field"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="First and last name"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="team-member-role">Role</label>
          <input
            id="team-member-role"
            className="field"
            value={role}
            onChange={event => setRole(event.target.value)}
            placeholder="For example, Stylist"
            required
          />
        </div>

        <div className="form-span">
          <label className="label" htmlFor="team-member-image">Profile image URL</label>
          <input
            id="team-member-image"
            className="field"
            type="url"
            value={imageUrl}
            onChange={event => setImageUrl(event.target.value)}
            placeholder="https://example.com/therapist.jpg"
          />
        </div>

        <div className="form-span">
          <label className="label" htmlFor="team-member-specialties">Specialties</label>
          <input
            id="team-member-specialties"
            className="field"
            value={specialties}
            onChange={event => setSpecialties(event.target.value)}
            placeholder="Separate specialties with commas"
          />
          <small className="image-upload-help">For example: Cut & style, Colour</small>
        </div>
        <fieldset className="form-span schedule-editor-fieldset">
          <legend className="label">Services this stylist provides</legend>
          <div className="schedule-check-grid">
            {services.map(service => <label key={service.id} className="schedule-check"><input type="checkbox" checked={serviceIds.includes(service.id)} onChange={event => setServiceIds(current => event.target.checked ? [...current, service.id] : current.filter(id => id !== service.id))} /><span>{service.name}</span></label>)}
          </div>
        </fieldset>
        <fieldset className="form-span schedule-editor-fieldset">
          <legend className="label">Regular working days</legend>
          <div className="schedule-check-grid weekday-check-grid">
            {weekDays.map(day => <label key={day.value} className="schedule-check"><input type="checkbox" checked={workingDays.includes(day.value)} onChange={event => setWorkingDays(current => event.target.checked ? [...current, day.value] : current.filter(value => value !== day.value))} /><span>{day.label}</span></label>)}
          </div>
        </fieldset>
        <div>
          <label className="label" htmlFor="team-start-time">Starts at</label>
          <input id="team-start-time" className="field" type="time" required max={endTime} value={startTime} onChange={event => setStartTime(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="team-end-time">Finishes at</label>
          <input id="team-end-time" className="field" type="time" required min={startTime} value={endTime} onChange={event => setEndTime(event.target.value)} />
        </div>
        <div className="form-span">
          <label className="label" htmlFor="team-days-off">Additional days off</label>
          <input id="team-days-off" className="field" value={daysOff} onChange={event => setDaysOff(event.target.value)} placeholder="YYYY-MM-DD, YYYY-MM-DD" />
          <small className="image-upload-help">Add specific dates, separated by commas.</small>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn btn-sm" type="submit" disabled={!serviceIds.length || !workingDays.length || startTime >= endTime}>
          {isEditing ? 'Save changes' : 'Add team member'}
        </button>
      </div>
    </form>
  );
}
