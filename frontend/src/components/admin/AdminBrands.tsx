import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type AdminBrandsProps = {
  brands: string[];
  onChange: (brands: string[]) => void;
};

export function AdminBrands({ brands, onChange }: AdminBrandsProps) {
  const [newBrand, setNewBrand] = useState('');
  const [error, setError] = useState('');

  function addBrand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const brandName = newBrand.trim();

    if (!brandName) return;

    const alreadyExists = brands.some(
      brand => brand.toLowerCase() === brandName.toLowerCase(),
    );

    if (alreadyExists) {
      setError('That brand is already on the list.');
      return;
    }

    onChange([...brands, brandName]);
    setNewBrand('');
    setError('');
  }

  function removeBrand(brandToRemove: string) {
    onChange(brands.filter(brand => brand !== brandToRemove));
  }

  return (
    <div className="admin-page-content">
      <header className="admin-greeting">
        <div>
          <p className="eyebrow">BRANDS FEATURED ON YOUR HOME PAGE</p>
          <h1 className="serif">Products &amp; brands.</h1>
          <p>Add or remove the brand names shown in the moving banner.</p>
        </div>
      </header>

      <form className="brand-admin-form card" onSubmit={addBrand}>
        <div className="brand-admin-input">
          <label className="label" htmlFor="new-brand-name">Brand name</label>
          <input
            id="new-brand-name"
            className="field"
            value={newBrand}
            onChange={event => {
              setNewBrand(event.target.value);
              setError('');
            }}
            placeholder="Enter a product or brand name"
            maxLength={60}
            required
          />
        </div>
        <button className="btn btn-sm" type="submit">
          <Plus size={16} /> Add brand
        </button>
      </form>

      {error && <p className="brand-admin-error" role="alert">{error}</p>}

      {brands.length > 0 ? (
        <ul className="brand-admin-list">
          {brands.map((brand, index) => (
            <li className="brand-admin-row card" key={`${brand}-${index}`}>
              <span className="brand-admin-number">{String(index + 1).padStart(2, '0')}</span>
              <strong>{brand}</strong>
              <button
                className="brand-admin-remove"
                type="button"
                onClick={() => removeBrand(brand)}
                aria-label={`Remove ${brand}`}
                title={`Remove ${brand}`}
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="brand-admin-empty">No brands yet. Add one to show it in the home-page banner.</p>
      )}
    </div>
  );
}
