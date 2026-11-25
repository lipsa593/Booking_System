import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Flower2, Scissors } from 'lucide-react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import type { Booking, Service, Staff } from '../../types';
import { daysFromNow, prettyDate, today, money } from '../../utils/format';
import { getAvailableSlots } from '../../utils/availability';

type BookingFormProps = {
  services: Service[];
  staff: Staff[];
  bookings: Booking[];
  save: (bookings: Booking[]) => void;
};

type BookingFormValues = {
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  paymentMethod: 'in-person' | 'demo-online';
};

const steps = ['Treatment', 'Therapist', 'Date & time', 'Your details'];

export function BookingForm({ services, staff, bookings, save }: BookingFormProps) {
  const [, setPath] = useLocation();
  const initial = new URLSearchParams(window.location.search).get('service') || '';
  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [confirmedStaffId, setConfirmedStaffId] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormValues>({
    defaultValues: {
      serviceId: initial,
      staffId: 'any',
      date: daysFromNow(1),
      time: '',
      name: '',
      email: '',
      phone: '',
      paymentMethod: 'in-person',
    },
  });
  const serviceId = watch('serviceId');
  const staffId = watch('staffId');
  const date = watch('date');
  const time = watch('time');
  const details = { name: watch('name'), email: watch('email'), phone: watch('phone') };
  const paymentMethod = watch('paymentMethod');
  const service = services.find(item => item.id === serviceId);
  const availableStaff = staff.filter(person => person.active && (!service || person.serviceIds.includes(service.id)));
  const selectedStaff = staff.find(person => person.id === staffId);
  const slots = service ? getAvailableSlots(date, service, staff, bookings, services, staffId) : [];
  const alternatives = service && staffId !== 'any'
    ? availableStaff.filter(person =>
      person.id !== staffId
      && getAvailableSlots(date, service, staff, bookings, services, person.id).length > 0,
    )
    : [];
  const selectedStaffUnavailable = Boolean(
    staffId !== 'any'
    && selectedStaff
    && service
    && slots.length === 0,
  );
  const therapistDateLabel = prettyDate(date, { day: 'numeric', month: 'long', year: 'numeric' });
  const canContinue = step === 1
    ? !!service
    : step === 2
      ? staffId === 'any' || availableStaff.some(person => person.id === staffId)
      : step === 3
        ? !!date && !!time && slots.some(slot => slot.time === time)
        : !!details.name.trim() && !!details.email.trim();

  const submit = (values: BookingFormValues) => {
    const { serviceId, staffId, date, time, paymentMethod } = values;
    const selectedService = services.find(item => item.id === serviceId);
    if (!selectedService) return;
    const refreshedSlots = getAvailableSlots(date, selectedService, staff, bookings, services, staffId);
    const slot = refreshedSlots.find(availableSlot => availableSlot.time === time);
    const chosenStaffId = staffId === 'any'
      ? slot?.staffIds[bookings.length % Math.max(1, slot.staffIds.length)]
      : slot?.staffIds.includes(staffId) ? staffId : undefined;
    const chosenStaff = staff.find(person => person.id === chosenStaffId);
    if (!chosenStaff) {
      setAvailabilityError(staffId === 'any'
        ? 'That time was just taken. Please choose another available slot.'
        : `${selectedStaff?.name || 'Your preferred therapist'} is no longer available at that time. Please choose another therapist, time or date.`);
      setStep(3);
      setValue('time', '');
      return;
    }
    const booking: Booking = {
      id: `b${Date.now()}`,
      customerName: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      serviceId,
      staffId: chosenStaff.id,
      date,
      time,
      status: 'confirmed',
      total: selectedService.price,
      paymentMethod,
    };
    save([booking, ...bookings]);
    setConfirmedStaffId(chosenStaff.id);
    setComplete(true);
  };

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (step < 4) {
      event.preventDefault();
      if (canContinue) setStep(step + 1);
      return;
    }
    void handleSubmit(submit)(event);
  }

  if (complete) {
    return (
      <main className="wrap booking-wrap page-in">
        <div className="confirmation card">
          <div className="confirm-mark"><Check size={25} /></div>
          <p className="eyebrow">ALL SET, {details.name.split(' ')[0].toUpperCase()}</p>
          <h1 className="serif">Your time is yours.</h1>
          <p className="confirm-copy" role="status">
            Your demo booking is confirmed.{' '}
            {paymentMethod === 'demo-online'
              ? 'The online payment option was selected, but no real payment was taken.'
              : 'You can pay at the studio during your visit.'}
          </p>
          <div className="confirm-details">
            <span><CalendarDays size={17} />{prettyDate(date, { weekday: 'short', day: 'numeric', month: 'long' })} · {time}</span>
            <span><Scissors size={17} />{service?.name} with {staff.find(person => person.id === confirmedStaffId)?.name || 'a Mysa stylist'}</span>
            <span><Check size={17} />{paymentMethod === 'demo-online' ? 'Online payment · demo only' : 'Pay at the studio'}</span>
            <strong>{money(service?.price || 0)}</strong>
          </div>
          <button className="btn" onClick={() => setPath('/my-bookings')}>See my bookings <ArrowRight size={16} /></button>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap booking-wrap page-in">
      <div className="booking-head"><p className="eyebrow">A LITTLE TIME FOR YOU</p><h1 className="serif">Book your visit.</h1><p>Choose what feels right. We’ll take care of the rest.</p></div>
      <div className="booking-layout">
        <form className="booking-form card" onSubmit={handleFormSubmit}>
          <div className="stepper">{steps.map((label, index) => <div className={`step-item ${step === index + 1 ? 'current' : step > index + 1 ? 'done' : ''}`} key={label}><span>{step > index + 1 ? <Check size={13} /> : `0${index + 1}`}</span>{label}</div>)}</div>
          {step === 1 && <div className="booking-step"><h2 className="serif">What are you in the mood for?</h2><div className="select-cards">{services.filter(item => item.active).map(item => <button type="button" key={item.id} className={`select-service ${serviceId === item.id ? 'selected' : ''}`} onClick={() => { setValue('serviceId', item.id); setValue('time', ''); setAvailabilityError(''); }} data-testid={`choose-service-${item.id}`}><span><b>{item.name}</b><small>{item.durationMinutes} min · {item.category}</small></span><strong>{money(item.price)}</strong></button>)}</div></div>}
          {step === 2 && <div className="booking-step"><h2 className="serif">Who would you like to see?</h2><div className="therapist-options">
            <button type="button" className={`therapist-option ${staffId === 'any' ? 'selected' : ''}`} onClick={() => { setValue('staffId', 'any'); setValue('time', ''); setAvailabilityError(''); }}>
              <span className="any-therapist-avatar"><Flower2 size={20} /></span>
              <span className="therapist-option-copy"><strong>Any available therapist</strong><small>We’ll match you to an available specialist.</small></span>
              <span className="therapist-status">Flexible</span>
            </button>
            {availableStaff.map(person => {
              const isAvailable = Boolean(service && getAvailableSlots(date, service, staff, bookings, services, person.id).length > 0);
              return <button type="button" key={person.id} className={`therapist-option ${staffId === person.id ? 'selected' : ''}`} onClick={() => { setValue('staffId', person.id); setValue('time', ''); setAvailabilityError(''); }}>
                {person.imageUrl ? <img className="therapist-avatar" src={person.imageUrl} alt="" /> : <span className="therapist-avatar therapist-initials">{person.name.split(' ').map(part => part[0]).join('')}</span>}
                <span className="therapist-option-copy"><strong>{person.name}</strong><small>{person.specialties.join(' · ') || person.role}</small></span>
                <span className={`therapist-status ${isAvailable ? 'is-available' : 'is-unavailable'}`}>{isAvailable ? 'Available' : 'Unavailable'}</span>
              </button>;
            })}
            {!availableStaff.length && <p className="availability-empty">No therapists currently offer this treatment.</p>}
          </div>
          {selectedStaff && !availableStaff.some(person => person.id === selectedStaff.id) && <p className="availability-error" role="alert">{selectedStaff.name} does not offer this treatment. Please choose another therapist.</p>}
          <p className="therapist-date-note">Availability shown for {therapistDateLabel}. You can change the date in the next step.</p>
          </div>}
          {step === 3 && <div className="booking-step"><h2 className="serif">Choose your moment.</h2><label className="label" htmlFor="booking-date">A day that works</label><input className="field date-field" id="booking-date" type="date" min={today} {...register('date', { onChange: () => { setValue('time', ''); setAvailabilityError(''); } })} /><p className="label slot-label">Available times · {prettyDate(date, { weekday: 'short', day: 'numeric', month: 'short' })}</p>{availabilityError && <p className="availability-error" role="alert">{availabilityError}</p>}{selectedStaffUnavailable && <div className="therapist-unavailable" role="alert"><strong>{selectedStaff?.name} is unavailable on {therapistDateLabel}.</strong><span>Please select another therapist or choose a different date.</span></div>}<div className="time-grid">{slots.map(slot => <button type="button" key={slot.time} className={`time-slot ${time === slot.time ? 'selected' : ''}`} onClick={() => { setValue('time', slot.time); setAvailabilityError(''); }}>{slot.time}</button>)}</div>{slots.length === 0 && !selectedStaffUnavailable && <p className="availability-empty">No openings for this treatment on this day. Try another date or choose any available therapist.</p>}{selectedStaffUnavailable && <div className="alternative-therapists"><p className="label">Available alternatives</p>{alternatives.length ? alternatives.map(person => <button type="button" className="alternative-therapist" key={person.id} onClick={() => { setValue('staffId', person.id); setValue('time', ''); setAvailabilityError(''); }}>{person.imageUrl ? <img src={person.imageUrl} alt="" /> : <span className="therapist-avatar therapist-initials">{person.name.split(' ').map(part => part[0]).join('')}</span>}<span><strong>{person.name}</strong><small>{person.specialties.join(' · ')}</small></span><span>Choose</span></button>) : <p className="availability-empty">No other therapists have openings on this date. Please choose a different date.</p>}</div>}</div>}
          {step === 4 && (
            <div className="booking-step">
              <h2 className="serif">Let’s make it yours.</h2>
              <p className="step-help">Review your visit, then share the essentials so we know who to welcome.</p>
              <div className="booking-review">
                <span><Scissors size={16} />{service?.name}</span>
                <span><Flower2 size={16} />{staffId === 'any' ? 'Any available therapist' : selectedStaff?.name}</span>
                <span><CalendarDays size={16} />{prettyDate(date, { weekday: 'short', day: 'numeric', month: 'long' })} · {time}</span>
                <strong>{money(service?.price || 0)}</strong>
              </div>
              <div className="form-row"><label className="label" htmlFor="customer-name">Your name</label><input id="customer-name" className="field" placeholder="First and last name" {...register('name', { required: 'Please enter your name.' })} />{errors.name && <small className="availability-error" role="alert">{errors.name.message}</small>}</div>
              <div className="form-row"><label className="label" htmlFor="customer-email">Email address</label><input type="email" id="customer-email" className="field" placeholder="you@example.com" {...register('email', { required: 'Please enter your email address.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' } })} />{errors.email && <small className="availability-error" role="alert">{errors.email.message}</small>}</div>
              <div className="form-row"><label className="label" htmlFor="customer-phone">Phone <span>(optional)</span></label><input id="customer-phone" className="field" placeholder="Your number" {...register('phone')} /></div>
              <fieldset className="payment-options">
                <legend className="label">How would you like to pay?</legend>
                <label className={`payment-option ${paymentMethod === 'in-person' ? 'selected' : ''}`}><input type="radio" value="in-person" {...register('paymentMethod')} /><span><strong>Pay at the studio</strong><small>Pay when you arrive for your visit.</small></span></label>
                <label className={`payment-option ${paymentMethod === 'demo-online' ? 'selected' : ''}`}><input type="radio" value="demo-online" {...register('paymentMethod')} /><span><strong>Pay online · demo</strong><small>Preview only. No card details or real payment.</small></span></label>
              </fieldset>
            </div>
          )}
          <div className="booking-controls">{step > 1 ? <button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</button> : <span />}<button className="btn" type="submit" disabled={!canContinue}>{step === 4 ? 'Confirm visit' : 'Continue'} <ArrowRight size={16} /></button></div>
        </form>
        <aside className="booking-summary"><p className="eyebrow">YOUR VISIT, AT A GLANCE</p><div className="summary-illustration"><div><Flower2 size={31} /></div></div><h3 className="serif">{service?.name || 'A little time for you'}</h3><p>{service?.description || 'Choose a service to see the details of your visit.'}</p><div className="summary-line"><span><Clock3 size={15} />Duration</span><b>{service ? `${service.durationMinutes} min` : '—'}</b></div><div className="summary-line"><span><CalendarDays size={15} />When</span><b>{time ? `${prettyDate(date, { day: 'numeric', month: 'short' })} · ${time}` : 'Choose a time'}</b></div><div className="summary-line"><span><Flower2 size={15} />Therapist</span><b>{staffId === 'any' ? 'Any available' : selectedStaff?.name || 'Choose a therapist'}</b></div><div className="summary-total"><span>Your total</span><strong>{service ? money(service.price) : '—'}</strong></div><small>Payment choices are demo-only; no real payment is processed.</small></aside>
      </div>
    </main>
  );
}
