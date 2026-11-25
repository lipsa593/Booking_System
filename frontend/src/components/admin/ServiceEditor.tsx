import { useState } from 'react';
import type { Service } from '../../types';

type ServiceEditorProps = {
  service: Service;
  onSave: (service: Service) => void;
  onCancel: () => void;
};

export function ServiceEditor({ service, onSave, onCancel }: ServiceEditorProps) {
  const [form, setForm] = useState(service);
  const [imageError, setImageError] = useState('');

  function updateField(key: keyof Service, value: string | number) {
    setForm(currentForm => ({ ...currentForm, [key]: value }));
  }

  // Read the selected image into demo state so it can be previewed.
  function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Choose an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('imageUrl', reader.result);
        setImageError('');
      }
    };
    reader.onerror = () => setImageError('The image could not be opened. Please try another file.');
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <form className="service-form card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">REFINE YOUR MENU</p>
          <h2 className="serif">{service.name ? 'Edit service' : 'Add a service'}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onCancel} aria-label="Close">×</button>
      </div>

      <div className="form-grid">
        <div>
          <label className="label" htmlFor="service-name">Service name</label>
          <input id="service-name" className="field" required value={form.name} onChange={event => updateField('name', event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="service-category">Category</label>
          <select id="service-category" className="field" value={form.category} onChange={event => updateField('category', event.target.value)}>
            {['Cut & style', 'Colour', 'Treatments', 'Styling'].map(category => <option key={category}>{category}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="service-duration">Duration · minutes</label>
          <input id="service-duration" className="field" type="number" min="15" step="15" required value={form.durationMinutes} onChange={event => updateField('durationMinutes', Number(event.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="service-price">Price · ₹</label>
          <input id="service-price" className="field" type="number" min="0" required value={form.price} onChange={event => updateField('price', Number(event.target.value))} />
        </div>
        <div className="form-span">
          <label className="label" htmlFor="service-description">A few words about it</label>
          <input id="service-description" className="field" required value={form.description} onChange={event => updateField('description', event.target.value)} />
        </div>
        <div className="form-span">
          <label className="label" htmlFor="service-image-upload">Upload service image (optional)</label>
          <input id="service-image-upload" className="field" type="file" accept="image/*" onChange={uploadImage} />
          <small className="image-upload-help">Choose an image file up to 5 MB. The preview resets when you refresh.</small>
          {imageError && <p className="image-upload-error" role="alert">{imageError}</p>}
          {form.imageUrl && <img className="service-image-preview" src={form.imageUrl} alt="Service image preview" />}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn btn-sm" type="submit">Save service</button>
      </div>
    </form>
  );
}
