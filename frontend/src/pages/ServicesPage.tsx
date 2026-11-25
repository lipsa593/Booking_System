import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { ServiceCard } from '../components/services/ServiceCard';
import { EmptyState } from '../components/ui/Shared';
import type { Service } from '../types';

type ServicesPageProps = {
  services: Service[];
};

export function ServicesPage({ services }: ServicesPageProps) {
  const activeServices = services.filter(service => service.active);

  return (
    <main className="services-page wrap page-in">
      <header className="services-page-heading">
        <p className="eyebrow">GOOD HAIR, YOUR WAY</p>
        <h1 className="serif">Our services.</h1>
        <p>Explore the full menu, then choose a service to begin booking your visit.</p>
      </header>

      {activeServices.length > 0 ? (
        <div className="service-list">
          {activeServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Our menu is having a refresh."
          copy="Check back soon, or reach out to the studio for a little help."
        />
      )}
    </main>
  );
}
