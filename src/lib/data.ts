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
  id: number;
  email: string;
  password: string;
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
  'Garden View',
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
    name: 'Garden Standard',
    roomNumber: '101',
    type: 'standard',
    capacity: 2,
    bedType: 'queen',
    pricePerNight: 89,
    description: 'A cozy retreat overlooking our lush garden. The Garden Standard room offers everything you need for a comfortable stay, with warm natural light, soft linens, and a peaceful ambiance that makes you feel right at home.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Hair Dryer', 'Desk', 'Garden View'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/standard/standard.png`, `${import.meta.env.BASE_URL}images/rooms/standard/standard_2.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '24 m²',
    view: 'Garden',
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
    name: 'Garden Deluxe',
    roomNumber: '201',
    type: 'deluxe',
    capacity: 2,
    bedType: 'king',
    pricePerNight: 129,
    description: 'Step up to the Garden Deluxe for an elevated experience. Featuring a plush king bed, premium linens, and a private balcony with garden views, this room blends comfort with a touch of luxury for a truly memorable stay.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Coffee Machine', 'Balcony', 'Garden View'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/deluxe/deluxe.png`, `${import.meta.env.BASE_URL}images/rooms/deluxe/deluxe_2.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '32 m²',
    view: 'Garden',
  },
  {
    id: 4,
    name: 'Pool Deluxe',
    roomNumber: '202',
    type: 'deluxe',
    capacity: 3,
    bedType: 'king',
    pricePerNight: 139,
    description: 'Overlooking our serene pool, the Pool Deluxe room offers a tranquil escape. With extra space, a king bed, and thoughtful amenities including a coffee machine and balcony, it is ideal for those seeking relaxation with a view.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Coffee Machine', 'Balcony', 'Pool View'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/deluxe/deluxe_2.png`, `${import.meta.env.BASE_URL}images/rooms/deluxe/deluxe.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '35 m²',
    view: 'Pool',
  },
  {
    id: 5,
    name: 'Garden Suite',
    roomNumber: '301',
    type: 'suite',
    capacity: 4,
    bedType: 'king',
    pricePerNight: 199,
    description: 'The Garden Suite is our signature accommodation, featuring a separate living area, king bedroom, and panoramic garden views. Perfect for families or extended stays, with all the comforts of home and the luxury of a boutique hotel.',
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Room Service', 'Coffee Machine', 'Balcony', 'Garden View', 'Bathtub', 'Iron & Board'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/suite/suite.jpg`, `${import.meta.env.BASE_URL}images/rooms/suite2/image.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '52 m²',
    view: 'Garden',
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
    amenities: ['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Room Service', 'Coffee Machine', 'Balcony', 'City View', 'Rain Shower', 'Iron & Board', 'Desk'],
    photos: [`${import.meta.env.BASE_URL}images/rooms/suite2/suite2_2.png`, `${import.meta.env.BASE_URL}images/rooms/suite2/image.png`, `${import.meta.env.BASE_URL}images/corridor/corridor2.png`, `${import.meta.env.BASE_URL}images/corridor/image.png`],
    status: 'available',
    size: '68 m²',
    view: 'Panoramic',
  },
];

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
  setItem(STORAGE_KEYS.users, [
    {
      id: 1,
      email: 'admin@charlesstay.com',
      password: 'admin123',
      firstName: 'Charles',
      lastName: 'Admin',
      phone: '+62 812 3456 7890',
      role: 'owner',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      email: 'staff@charlesstay.com',
      password: 'staff123',
      firstName: 'Staff',
      lastName: 'Member',
      phone: '+62 813 4567 8901',
      role: 'staff',
      createdAt: new Date().toISOString(),
    },
  ]);
  setItem(STORAGE_KEYS.currentUser, null);
  setItem(STORAGE_KEYS.initialized, true);
}

// ====== ROOM CRUD ======

export function getRooms(): Room[] {
  return getItem<Room[]>(STORAGE_KEYS.rooms, DEFAULT_ROOMS);
}

export function getRoomById(id: number): Room | undefined {
  return getRooms().find((r) => r.id === id);
}

export function getAvailableRooms(checkIn: string, checkOut: string, guests?: number): Room[] {
  const rooms = getRooms();
  const blockedDates = getBlockedDates();

  return rooms.filter((room) => {
    if (room.status !== 'available') return false;
    if (guests && room.capacity < guests) return false;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
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
  return rooms[idx];
}

export function createRoom(room: Omit<Room, 'id'>): Room {
  const rooms = getRooms();
  const newRoom = { ...room, id: Math.max(0, ...rooms.map((r) => r.id)) + 1 };
  rooms.push(newRoom);
  setItem(STORAGE_KEYS.rooms, rooms);
  return newRoom;
}

export function deleteRoom(id: number): boolean {
  const rooms = getRooms();
  const filtered = rooms.filter((r) => r.id !== id);
  if (filtered.length === rooms.length) return false;
  setItem(STORAGE_KEYS.rooms, filtered);
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

  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
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
  for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    datesToBlock.push(d.toISOString().split('T')[0]);
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

export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.users, []);
}

export function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): User {
  const users = getUsers();
  if (users.some((u) => u.email === data.email)) {
    throw new Error('Email already registered');
  }

  const user: User = {
    id: Math.max(0, ...users.map((u) => u.id)) + 1,
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone ?? null,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  setItem(STORAGE_KEYS.users, users);
  return user;
}

export function loginUser(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    setItem(STORAGE_KEYS.currentUser, user);
    return user;
  }
  return null;
}

export function logoutUser(): void {
  setItem(STORAGE_KEYS.currentUser, null);
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.currentUser, null);
}

export function updateUserRole(id: number, role: UserRole): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], role };
  setItem(STORAGE_KEYS.users, users);
  return users[idx];
}

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
