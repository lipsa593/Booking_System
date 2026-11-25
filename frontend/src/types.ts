export type Service = {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description: string;
  imageUrl?: string;
  active: boolean;
};

export type Staff = {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  specialties: string[];
  active: boolean;
  serviceIds: string[];
  workingDays: number[];
  startTime: string;
  endTime: string;
  daysOff: string[];
  unavailability?: { date: string; reason: string }[];
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
};

export type Booking = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  status: string;
  total: number;
  paymentMethod?: 'in-person' | 'demo-online';
};

export type Review = {
  id: string;
  bookingId: string;
  customerName: string;
  serviceId: string;
  staffId: string;
  rating: number;
  comment: string;
  date: string;
};

export type DemoData = {
  services: Service[];
  staff: Staff[];
  bookings: Booking[];
  reviews: Review[];
  brands: string[];
};
