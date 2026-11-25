import { ArrowDownRight, ArrowRight, Flower2, Sparkles, Star } from 'lucide-react';
import { Link } from 'wouter';
import { ServiceCard } from '../components/services/ServiceCard';
import { EmptyState } from '../components/ui/Shared';
import type { Review, Service } from '../types';

type HomePageProps = {
  services: Service[];
  brands: string[];
  reviews: Review[];
  serviceById: (id: string) => Service | undefined;
};

export function HomePage({ services, brands, reviews, serviceById }: HomePageProps) {
  const activeServices = services.filter(service => service.active);

  return (
    <main className="page-in">
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" />YOUR NEIGHBOURHOOD BEAUTY STUDIO</p>
          <h1 className="serif">A softer kind<br />of <em>salon day.</em></h1>
          <p className="hero-sub">A thoughtful little studio for good hair, unhurried conversations, and a moment that’s just yours.</p>
          <div className="hero-buttons">
            <Link href="/book" className="btn">Find your time <ArrowRight size={16} /></Link>
            <a className="text-link" href="#services">Explore our services <ArrowDownRight size={16} /></a>
          </div>
          <div className="hero-note"><div className="avatar-stack"><span>ME</span><span>NP</span><span>SJ</span></div><span>Good hands. Good energy.<br /><strong>Always room for you.</strong></span></div>
        </div>
        <div className="hero-art" aria-label="Warm, light-filled salon studio">
          <div className="art-window" /><div className="art-plant"><i /><i /><i /><i /><i /></div><div className="art-chair" /><div className="art-table" />
          <div className="art-copy"><span>TAKE A BREATH</span><strong>You're<br />right on time.</strong></div><div className="art-stamp">M<br />H</div>
        </div>
      </section>
      <section className="welcome-strip" aria-label="Featured salon brands">
        <div className="welcome-inner">
          
          <div className="brand-marquee" aria-label={`Featured beauty brands: ${brands.join(', ')}`}>
            <div className="brand-marquee-track">
              {brands.length > 0 && [0, 1].map(copy => (
                <div className="brand-marquee-group" key={copy} aria-hidden={copy === 1}>
                  {brands.map((brand, index) => (
                    <span className="brand-marquee-item" key={`${copy}-${brand}-${index}`}>
                      <span className="marquee-brand">{brand}</span>
                      <Flower2 size={18} aria-hidden="true" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="services-section wrap" id="services">
        <div className="section-heading">
          <div><p className="eyebrow">GOOD HAIR, YOUR WAY</p><h2 className="serif">A little something<br /><em>for every you.</em></h2></div>
          <p>Our menu is a starting point, not a rulebook. We’ll listen first, then make a plan that feels right.</p>
        </div>
        <div className="service-list">{activeServices.slice(0,3).map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}</div>
        {activeServices.length === 0 && <EmptyState title="Our menu is having a refresh." copy="Check back soon, or reach out to the studio for a little help." />}
        <div className="center-cta"><Link href="/book" className="btn btn-outline">See what feels right <ArrowRight size={16} /></Link></div>
      </section>
      <section className="ritual-section">
        <div className="wrap ritual-grid">
          <div className="ritual-art"><div className="ritual-sun" /><div className="ritual-words serif">slow down<br />and let go</div><div className="ritual-leaf leaf-one" /><div className="ritual-leaf leaf-two" /><span className="ritual-caption">A SMALL RITUAL, JUST FOR YOU</span></div>
          <div className="ritual-copy"><p className="eyebrow">MORE THAN A MIRROR</p><h2 className="serif">The best part<br />is how you <em>feel.</em></h2><p>From the first cup of tea to that last look in the mirror, every detail is here to help you settle in. No rush, no fuss — just good people and a little care.</p><Link className="text-link" href="/book">Make a little time for you <ArrowRight size={16} /></Link></div>
        </div>
      </section>
      <section className="reviews-section wrap" aria-labelledby="reviews-heading">
        <div className="section-heading">
          <div><p className="eyebrow">KIND WORDS, KEPT CLOSE</p><h2 id="reviews-heading" className="serif">A little love<br /><em>from our guests.</em></h2></div>
          <p>Every visit is personal. Here are a few notes from the people who make this little studio feel like home.</p>
        </div>
        <div className="review-grid">
          {reviews.slice(0, 3).map(review => (
            <article className="review-card card" key={review.id}>
              <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index < review.rating ? 'currentColor' : 'none'} />)}
              </div>
              <blockquote>“{review.comment}”</blockquote>
              <div className="review-byline"><strong>{review.customerName}</strong><span>{serviceById(review.serviceId)?.name || 'Studio visit'}</span></div>
            </article>
          ))}
        </div>
      </section>
      <section className="visit-cta"><div className="wrap visit-inner"><div><p className="eyebrow">YOUR CHAIR IS WAITING</p><h2 className="serif">Let’s make a day of it.</h2><p>Find a time that works. We’ll take it from there.</p></div><Link className="btn" href="/book">Book your visit <ArrowRight size={16} /></Link></div></section>
    </main>
  );
}
