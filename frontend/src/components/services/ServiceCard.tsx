import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import type { Service } from '../../types';
import { money } from '../../utils/format';
import { serviceImages } from '../../data/demoData';

type ServiceCardProps = {
  service: Service;
  index: number;
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <article className="service-row" data-testid={`service-card-${service.id}`}>
      <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
      <img
        className="service-image"
        src={service.imageUrl || serviceImages[service.id] || serviceImages.s1}
        alt={`${service.name} service`}
        loading="lazy"
      />
      <div className="service-description">
        <h3 className="serif">{service.name}</h3>
        <p>{service.description}</p>
      </div>
      <span className="service-meta">{service.durationMinutes} min<br /><strong>{money(service.price)}</strong></span>
      <Link className="service-arrow" href={`/book?service=${service.id}`} aria-label={`Book ${service.name}`}>
        <ArrowRight size={18} />
      </Link>
    </article>
  );
}
