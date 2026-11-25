import type { DemoData } from '../types';
import { daysFromNow, today } from '../utils/format';

export const serviceImages: Record<string, string> = {
  s1: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=420&q=80',
  s2: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=420&q=80',
  s3: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=420&q=80',
  s4: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=420&q=80',
  s5: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=420&q=80',
};

export const initialDemoData: DemoData = {
  services: [
    { id: 's1', name: 'The Mysa Cut', category: 'Cut & style', durationMinutes: 60, price: 78, description: 'A considered cut, finished with a soft, lived-in blow-dry.', active: true },
    { id: 's2', name: 'Signature colour', category: 'Colour', durationMinutes: 150, price: 185, description: 'Dimensional colour made to sit beautifully between visits.', active: true },
    { id: 's3', name: 'Gloss & glaze', category: 'Colour', durationMinutes: 75, price: 96, description: 'A luminous refresh that brings tone and shine back to life.', active: true },
    { id: 's4', name: 'Restorative ritual', category: 'Treatments', durationMinutes: 45, price: 64, description: 'A deeply nourishing scalp and hair treatment, with a slow finish.', active: true },
    { id: 's5', name: 'Event styling', category: 'Styling', durationMinutes: 60, price: 88, description: 'A polished, personal look for the moments worth remembering.', active: true },
  ],
  staff: [
    { id: 't1', name: 'Mara Ellis', role: 'Creative director', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80', specialties: ['Cut & style', 'Colour'], serviceIds: ['s1', 's2', 's3'], workingDays: [1, 2, 3, 4, 5, 6], startTime: '09:00', endTime: '17:00', daysOff: [], active: true },
    { id: 't2', name: 'Nina Park', role: 'Colourist', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80', specialties: ['Colour', 'Treatments'], serviceIds: ['s2', 's3', 's4'], workingDays: [1, 2, 3, 4, 5, 6], startTime: '09:00', endTime: '17:00', daysOff: [], active: true },
    { id: 't3', name: 'Sofia James', role: 'Stylist', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80', specialties: ['Cut & style', 'Styling'], serviceIds: ['s1', 's5'], workingDays: [1, 2, 3, 4, 5, 6], startTime: '09:00', endTime: '17:00', daysOff: [], active: true },
    { id: 't4', name: 'Ava Patel', role: 'Senior stylist', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80', specialties: ['Cut & style', 'Styling'], serviceIds: ['s1', 's5'], workingDays: [1, 2, 3, 4, 5, 6], startTime: '09:00', endTime: '17:00', daysOff: [], active: true },
    { id: 't5', name: 'Leila Morgan', role: 'Colour specialist', imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&q=80', specialties: ['Colour', 'Treatments'], serviceIds: ['s2', 's3', 's4'], workingDays: [1, 2, 3, 4, 5, 6], startTime: '09:00', endTime: '17:00', daysOff: [], active: true },
    { id: 't6', name: 'Iris Bennett', role: 'Treatment specialist', imageUrl: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=160&q=80', specialties: ['Treatments', 'Colour'], serviceIds: ['s3', 's4'], workingDays: [1, 2, 3, 4, 5, 6], startTime: '09:00', endTime: '17:00', daysOff: [], active: true },
    { id: 't7', name: 'Zara Khan', role: 'Stylist', imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80', specialties: ['Styling', 'Cut & style'], serviceIds: ['s1', 's5'], workingDays: [1, 2, 3, 4, 5, 6], startTime: '09:00', endTime: '17:00', daysOff: [], active: true },
  ],
  brands: [
    'O3+', 'VLCC', 'Lotus Herbals', 'Kaya', 'Dermalogica', 'Lakmé',
    "L'Oréal Paris", 'Biotique', 'Mamaearth', 'The Body Shop', 'Forest Essentials',
    'Kama Ayurveda', 'Minimalist', 'Cetaphil', 'Neutrogena', 'The Ordinary',
    'Clinique', 'Estée Lauder', 'Bioderma', 'Plum', 'Dot & Key', 'Nykaa',
    'Colorbar', 'Aroma Magic', "Cheryl's Cosmeceuticals", 'Just Herbs',
    "Re'equil", 'Fixderma', 'Swiss Beauty',
  ],
  bookings: [
    { id: 'b1', customerName: 'Olivia Chen', email: 'olivia@example.com', phone: '07700 900 143', serviceId: 's1', staffId: 't1', date: today, time: '09:30', status: 'confirmed', total: 78 },
    { id: 'b2', customerName: 'Amara Lewis', email: 'amara@example.com', phone: '07700 900 261', serviceId: 's2', staffId: 't2', date: today, time: '10:00', status: 'confirmed', total: 185 },
    { id: 'b3', customerName: 'Ella Brooks', email: 'ella@example.com', phone: '07700 900 318', serviceId: 's4', staffId: 't3', date: today, time: '11:15', status: 'checked-in', total: 64 },
    { id: 'b4', customerName: 'Mia Patel', email: 'mia@example.com', phone: '07700 900 426', serviceId: 's3', staffId: 't2', date: today, time: '13:00', status: 'confirmed', total: 96 },
    { id: 'b5', customerName: 'Grace Kim', email: 'grace@example.com', phone: '07700 900 557', serviceId: 's1', staffId: 't1', date: daysFromNow(2), time: '14:30', status: 'confirmed', total: 78 },
  ],
  reviews: [
    { id: 'r1', bookingId: 'sample-1', customerName: 'Amelia R.', serviceId: 's1', staffId: 't1', rating: 5, comment: 'The loveliest cut I have had in years. I left feeling completely myself, only a little brighter.', date: daysFromNow(-18) },
    { id: 'r2', bookingId: 'sample-2', customerName: 'Priya S.', serviceId: 's2', staffId: 't2', rating: 5, comment: 'Such thoughtful colour and a genuinely relaxing afternoon. The result is beautiful.', date: daysFromNow(-12) },
    { id: 'r3', bookingId: 'sample-3', customerName: 'Charlotte W.', serviceId: 's4', staffId: 't6', rating: 5, comment: 'A calm little reset in the middle of a busy week. Already looking forward to coming back.', date: daysFromNow(-6) },
  ],
};

export function loadDemoData(): DemoData {
  // Return the sample data directly; nothing is saved in browser storage.
  return initialDemoData;
}
