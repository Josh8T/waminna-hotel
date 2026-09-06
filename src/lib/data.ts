// ====== TYPES ======

export type RoomType = 'standard' | 'deluxe' | 'suite';
export type BedType = 'king' | 'queen' | 'twin';
export type RoomStatus = 'available' | 'maintenance' | 'occupied';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type UserRole = 'guest' | 'user' | 'staff' | 'owner';

export interface Room {
  id: number;
  name: string;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  bedType: BedType;
  pricePerNight: number;
  description: string;
  amenities: string[];
  photos: string[];
  status: RoomStatus;
  size?: string;
  view?: string;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  perNight?: boolean;
  category: 'dining' | 'transport' | 'wellness' | 'convenience';
  icon: string;
}

export interface Review {
  id: string;
  roomId: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Booking {
  id: number;
  bookingReference: string;
  userId: number | null;
  roomId: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string | null;
  specialRequests: string | null;
  selectedAddonIds?: string[];
  addonTotal?: number;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
}

export interface BlockedDate {
  id: number;
  roomId: number;
  date: string;
  reason: 'booking' | 'maintenance';
  bookingId: number | null;
}

export interface User {
  id: string;          // Supabase UUID
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}

// ====== CONSTANTS & ADDONS ======

export const HOTEL_ADDONS: Addon[] = [
  {
    id: 'airport-shuttle',
    name: 'Luxury Airport Transfer',
    description: 'Private chauffered pickup & dropoff from/to International Airport',
    price: 45,
    perNight: false,
    category: 'transport',
    icon: 'Car',
  },
  {
    id: 'daily-breakfast',
    name: 'Gourmet Buffet Breakfast',
    description: 'Daily international breakfast buffet for all guests in your room',
    price: 25,
    perNight: true,
    category: 'dining',
    icon: 'Coffee',
  },
  {
    id: 'spa-package',
    name: '60-Min Wellness Spa Voucher',
    description: 'Relaxing full-body aromatherapy massage at Waminna Spa',
    price: 60,
    perNight: false,
    category: 'wellness',
    icon: 'Sparkles',
  },
  {
    id: 'late-checkout',
    name: 'Guaranteed Late Check-out',
    description: 'Extend stay until 4:00 PM on check-out day',
    price: 30,
    perNight: false,
    category: 'convenience',
    icon: 'Clock',
  },
];


export const AMENITIES = [
  'Air Conditioning',
  'Flat-screen TV',
  'Free Wi-Fi',
  'Mini Bar',
  'Room Safe',
  'Hair Dryer',
  'Room Service',
  'Balcony',
  'City View',
  'Skyline View',
  'Pool View',
  'Bathtub',
  'Rain Shower',
  'Coffee Machine',
  'Iron & Board',
  'Desk',
];

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  standard: 'Standard',
  deluxe: 'Deluxe',
  suite: 'Suite',
};

export const BED_TYPE_LABELS: Record<BedType, string> = {
  king: 'King Bed',
  queen: 'Queen Bed',
  twin: 'Twin Beds',
};

// ====== SEED DATA ======

const DEFAULT_ROOMS: Room[] = [
  {
    id: 1,
    name: 'Urban Standard',
    roomNumber: '101',
    type: 'standard',
    capacity: 2,
    bedType: 'queen',
    pricePerNight: 89,
    description: 'A cozy sanctuary in the heart of Batam. The Urban Standard room offers everything you need for a comfortable stay, with warm ambient lighting, soft linens, and a peaceful urban atmosphere.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Hair Dryer', 'Desk', 'City View'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/standard/standard.png`, `${import.meta.env.BASE_URL}images/rooms/standard/standard_2.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '24 m²',
    view: 'City',
  },
  {
    id: 2,
    name: 'City Standard',
    roomNumber: '102',
    type: 'standard',
    capacity: 2,
    bedType: 'queen',
    pricePerNight: 95,
    description: 'Enjoy urban charm with city views in our City Standard room. Modern furnishings meet warm tones to create a space that is both functional and inviting, perfect for solo travelers or couples exploring the city.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Hair Dryer', 'City View'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/standard_2bed/standard_2bed.png`, `${import.meta.env.BASE_URL}images/rooms/standard/standard_2.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '26 m²',
    view: 'City',
  },
  {
    id: 3,
    name: 'Executive Deluxe',
    roomNumber: '201',
    type: 'deluxe',
    capacity: 2,
    bedType: 'king',
    pricePerNight: 129,
    description: 'Step up to the Executive Deluxe for an elevated experience. Featuring a plush king bed, premium linens, and a private balcony with cityscape views, this room blends comfort with modern urban luxury.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Coffee Machine', 'Balcony', 'City View'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/deluxe/deluxe.png`, `${import.meta.env.BASE_URL}images/rooms/deluxe/deluxe_2.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '32 m²',
    view: 'City',
  },
  {
    id: 4,
    name: 'Pool Deluxe',
    roomNumber: '202',
    type: 'deluxe',
    capacity: 3,
    bedType: 'king',
    pricePerNight: 139,
    description: 'Overlooking the vibrant city scene of Penuin, this Deluxe room offers a tranquil escape. With extra space, a king bed, and thoughtful amenities including an electric kettle and balcony, it is ideal for those seeking relaxation in the heart of Batam.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Electric Kettle', 'Balcony', 'City View'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/deluxe/deluxe_2.png`, `${import.meta.env.BASE_URL}images/rooms/deluxe/deluxe.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '35 m²',
    view: 'City',
  },
  {
    id: 5,
    name: 'Skyline Suite',
    roomNumber: '301',
    type: 'suite',
    capacity: 4,
    bedType: 'king',
    pricePerNight: 199,
    description: 'The Skyline Suite is our signature accommodation, featuring a separate living area, king bedroom, and panoramic skyline views. Perfect for families or extended stays, with all the comforts of home and boutique hotel luxury.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Complimentary Water', 'Electric Kettle', 'Balcony', 'Skyline View', 'Bathtub', 'Iron & Board'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/suite/suite.jpg`, `${import.meta.env.BASE_URL}images/rooms/suite2/image.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '52 m²',
    view: 'Skyline',
  },
  {
    id: 6,
    name: 'Penthouse Suite',
    roomNumber: '302',
    type: 'suite',
    capacity: 4,
    bedType: 'king',
    pricePerNight: 249,
    description: 'Our crown jewel. The Penthouse Suite offers unmatched luxury with a spacious living area, premium king bedroom, and breathtaking panoramic views. Every detail has been carefully curated for the most discerning guests.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Complimentary Water', 'Electric Kettle', 'Balcony', 'City View', 'Rain Shower', 'Iron & Board', 'Desk'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/suite2/suite2_2.png`, `${import.meta.env.BASE_URL}images/rooms/suite2/image.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '68 m²',
    view: 'Panoramic',
  },
];

// ====== IMAGE HELPERS ======

export function getPhotoUrl(url?: string): string {
  const fallback = `${import.meta.env.BASE_URL}images/room-deluxe.jpg`;
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanUrl = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;

  const baseWithoutSlash = cleanBase.startsWith('/') ? cleanBase.slice(1) : cleanBase;
  if (baseWithoutSlash && cleanUrl.startsWith(baseWithoutSlash)) {
    return `/${cleanUrl}`;
  }

  return `${cleanBase}${cleanUrl}`;
}

// ====== STORAGE HELPERS ======

const STORAGE_KEYS = {
  rooms: 'cs_rooms',
  bookings: 'cs_bookings',
  blockedDates: 'cs_blockedDates',
  users: 'cs_users',
  currentUser: 'cs_currentUser',
  initialized: 'cs_initialized_v3',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ====== INITIALIZATION ======

export function initializeData(): void {
  if (getItem(STORAGE_KEYS.initialized, false)) return;

  setItem(STORAGE_KEYS.rooms, DEFAULT_ROOMS);
  setItem(STORAGE_KEYS.bookings, []);
  setItem(STORAGE_KEYS.blockedDates, []);
  // NOTE: User accounts are managed via Supabase Auth — not stored in localStorage.
  setItem(STORAGE_KEYS.initialized, true);
}

import {
  fetchRoomsFromSupabase,
  insertRoomToSupabase,
  updateRoomInSupabase,
  deleteRoomFromSupabase,
} from './supabase';
import { calculateNights, parseDateString, toDateString } from './dateUtils';

export async function syncRoomsWithSupabase(): Promise<Room[]> {
  const sbRooms = await fetchRoomsFromSupabase();
  if (sbRooms && sbRooms.length > 0) {
    setItem(STORAGE_KEYS.rooms, sbRooms);
    return sbRooms;
  }
  return getRooms();
}

// ====== ROOM CRUD ======

export function getRooms(): Room[] {
  return getItem<Room[]>(STORAGE_KEYS.rooms, DEFAULT_ROOMS);
}

export function getRoomById(id: number): Room | undefined {
  return getRooms().find((r) => r.id === id);
}

export function getAvailableRooms(checkIn: string, checkOut: string, guests?: number): Room[] {
  if (!checkIn || !checkOut) return [];
  const nights = calculateNights(checkIn, checkOut);
  if (nights < 1) return [];

  const rooms = getRooms();
  const blockedDates = getBlockedDates();

  return rooms.filter((room) => {
    if (room.status !== 'available') return false;
    if (guests && room.capacity < guests) return false;

    const start = parseDateString(checkIn);
    const end = parseDateString(checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateStr = toDateString(d);
      const isBlocked = blockedDates.some(
        (bd) => bd.roomId === room.id && bd.date === dateStr
      );
      if (isBlocked) return false;
    }
    return true;
  });
}

export function updateRoom(id: number, updates: Partial<Room>): Room | null {
  const rooms = getRooms();
  const idx = rooms.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  rooms[idx] = { ...rooms[idx], ...updates };
  setItem(STORAGE_KEYS.rooms, rooms);

  // Async sync to Supabase Database
  updateRoomInSupabase(id, rooms[idx]).catch((err) => console.warn('Supabase update notice:', err));

  return rooms[idx];
}

export function createRoom(room: Omit<Room, 'id'>): Room {
  const rooms = getRooms();
  const newRoom = { ...room, id: Math.max(0, ...rooms.map((r) => r.id)) + 1 };
  rooms.push(newRoom);
  setItem(STORAGE_KEYS.rooms, rooms);

  // Async sync to Supabase Database
  insertRoomToSupabase(newRoom).then((sbCreated) => {
    if (sbCreated && sbCreated.id) {
      const currentRooms = getRooms();
      const index = currentRooms.findIndex((r) => r.roomNumber === newRoom.roomNumber);
      if (index !== -1) {
        currentRooms[index].id = sbCreated.id;
        setItem(STORAGE_KEYS.rooms, currentRooms);
      }
    }
  }).catch((err) => console.warn('Supabase create room notice:', err));

  return newRoom;
}

export function deleteRoom(id: number): boolean {
  const rooms = getRooms();
  const filtered = rooms.filter((r) => r.id !== id);
  if (filtered.length === rooms.length) return false;
  setItem(STORAGE_KEYS.rooms, filtered);

  // Async sync to Supabase Database
  deleteRoomFromSupabase(id).catch((err) => console.warn('Supabase delete notice:', err));

  return true;
}

// ====== BLOCKED DATES ======

export function getBlockedDates(): BlockedDate[] {
  return getItem<BlockedDate[]>(STORAGE_KEYS.blockedDates, []);
}

export function blockDates(
  roomId: number,
  dates: string[],
  reason: 'booking' | 'maintenance' = 'booking',
  bookingId: number | null = null
): void {
  const blocked = getBlockedDates();
  const existing = new Set(blocked.map((b) => `${b.roomId}-${b.date}`));

  let nextId = Math.max(0, ...blocked.map((b) => b.id)) + 1;
  for (const date of dates) {
    const key = `${roomId}-${date}`;
    if (!existing.has(key)) {
      blocked.push({ id: nextId++, roomId, date, reason, bookingId });
    }
  }
  setItem(STORAGE_KEYS.blockedDates, blocked);
}

export function unblockDates(roomId: number, dates?: string[]): void {
  const blocked = getBlockedDates();
  const filtered = blocked.filter(
    (b) => b.roomId !== roomId || (dates && !dates.includes(b.date))
  );
  setItem(STORAGE_KEYS.blockedDates, filtered);
}

// ====== BOOKING CRUD ======

export function getBookings(): Booking[] {
  return getItem<Booking[]>(STORAGE_KEYS.bookings, []);
}

export function getBookingByReference(ref: string): Booking | undefined {
  return getBookings().find((b) => b.bookingReference === ref);
}

export function getBookingsByUser(userId: number): Booking[] {
  return getBookings().filter((b) => b.userId === userId);
}

export function getBookingsByEmail(email: string): Booking[] {
  if (!email) return [];
  const normalized = email.trim().toLowerCase();
  return getBookings().filter(
    (b) => b.guestEmail?.trim().toLowerCase() === normalized
  );
}

export function createBooking(data: {
  roomId: number;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  userId?: number;
}): Booking {
  const bookings = getBookings();
  const room = getRoomById(data.roomId);
  if (!room) throw new Error('Room not found');

  const nights = calculateNights(data.checkIn, data.checkOut);
  if (nights < 1) {
    throw new Error('Invalid booking dates: stay must be for at least 1 night.');
  }

  const subtotal = room.pricePerNight * nights;
  const taxAmount = subtotal * 0.1;
  const totalAmount = subtotal + taxAmount;

  const refNum = Math.floor(10000 + Math.random() * 90000);
  const bookingReference = `BK-${refNum}`;

  const booking: Booking = {
    id: Math.max(0, ...bookings.map((b) => b.id)) + 1,
    bookingReference,
    userId: data.userId ?? null,
    roomId: data.roomId,
    guestFirstName: data.guestFirstName,
    guestLastName: data.guestLastName,
    guestEmail: data.guestEmail,
    guestPhone: data.guestPhone ?? null,
    specialRequests: data.specialRequests ?? null,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    guestsCount: data.guestsCount,
    nights,
    subtotal,
    taxAmount,
    totalAmount,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  setItem(STORAGE_KEYS.bookings, bookings);

  // Block dates
  const datesToBlock: string[] = [];
  const start = parseDateString(data.checkIn);
  const end = parseDateString(data.checkOut);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    datesToBlock.push(toDateString(d));
  }
  blockDates(data.roomId, datesToBlock, 'booking', booking.id);

  return booking;
}

export function updateBookingStatus(id: number, status: BookingStatus): Booking | null {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], status };
  setItem(STORAGE_KEYS.bookings, bookings);

  if (status === 'cancelled') {
    const booking = bookings[idx];
    const datesToUnblock: string[] = [];
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      datesToUnblock.push(d.toISOString().split('T')[0]);
    }
    unblockDates(booking.roomId, datesToUnblock);
  }

  return bookings[idx];
}

// ====== AUTH ======
// Authentication is handled by Supabase Auth (src/lib/supabase.ts + src/hooks/useAuth.tsx).
// User management (role changes) is done via the Supabase Dashboard → profiles table.

// ====== STATS ======

export function getDashboardStats() {
  const bookings = getBookings();
  const rooms = getRooms();
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7); // YYYY-MM

  const todayCheckins = bookings.filter(
    (b) => b.checkIn === today && b.status === 'confirmed'
  ).length;

  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' && b.checkOut >= today
  ).length;

  const occupiedRooms = new Set(
    bookings
      .filter((b) => b.status === 'confirmed' && b.checkIn <= today && b.checkOut > today)
      .map((b) => b.roomId)
  ).size;

  const monthlyRevenue = bookings
    .filter((b) => b.createdAt.startsWith(currentMonth) && b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return {
    todayCheckins,
    activeBookings,
    occupiedRooms,
    totalRooms: rooms.length,
    monthlyRevenue,
  };
}
