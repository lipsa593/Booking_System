import { Plus } from 'lucide-react';
import { serviceImages } from '../../data/demoData';
import type { Service } from '../../types';
import { money } from '../../utils/format';
import { ServiceEditor } from './ServiceEditor';

type AdminServicesProps = {
  services: Service[];
  editingService: Service | null;
  onAdd: () => void;
  onEdit: (service: Service) => void;
  onSave: (service: Service) => void;
  onCancelEdit: () => void;
  onToggleActive: (serviceId: string) => void;
};

export function AdminServices({
  services,
  editingService,
  onAdd,
  onEdit,
  onSave,
  onCancelEdit,
  onToggleActive,
}: AdminServicesProps) {
  return (
    <div className="admin-page-content">
      <div className="admin-greeting">
        <div>
          <p className="eyebrow">THE MENU, MADE BY YOU</p>
          <h1 className="serif">Services.</h1>
          <p>Shape the experience, one thoughtful detail at a time.</p>
        </div>
        <button className="btn btn-sm" onClick={onAdd}>
          <Plus size={15} /> Add service
        </button>
      </div>

      {editingService && (
        <ServiceEditor
          key={editingService.id}
          service={editingService}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      )}

      <div className="service-admin-list">
        {services.map(service => (
          <article
            className={`service-admin-row card ${!service.active ? 'inactive' : ''}`}
            key={service.id}
          >
            <img
              className="service-admin-image"
              src={service.imageUrl || serviceImages[service.id] || serviceImages.s1}
              alt={`${service.name} service`}
            />
            <div className="service-admin-main">
              <strong>{service.name}</strong>
              <span>{service.category} · {service.durationMinutes} minutes</span>
            </div>
            <p>{service.description}</p>
            <strong className="price">{money(service.price)}</strong>
            <span className={`pill ${service.active ? 'pill-accent' : ''}`}>
              {service.active ? 'Active' : 'Hidden'}
            </span>
            <div className="row-action-group">
              <button className="subtle-action" onClick={() => onEdit(service)}>Edit</button>
              <button className="subtle-action" onClick={() => onToggleActive(service.id)}>
                {service.active ? 'Hide' : 'Activate'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
