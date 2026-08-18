import { createClient } from '@supabase/supabase-js';
import type { UserRole } from '@/lib/data';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables in .env file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// ====== AUTH USER TYPE ======

/**
 * AuthUser is the merged type used throughout the app.
 * It combines Supabase Auth (id, email) with the profiles table (role, names).
 */
export interface AuthUser {
  id: string;          // Supabase UUID
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
}

export async function getProfile(userId: string): Promise<AuthUser | null> {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, phone, role')
      .eq('id', userId)
      .single();
    if (!error && data) {
      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phone: data.phone ?? null,
        role: (data.role as UserRole) || 'user',
      };
    }
  } catch (e) {
    console.warn('Profile fetch warning:', e);
  }

  // Fallback to current authenticated user session data if profiles table query fails
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && session.user.id === userId) {
      return {
        id: session.user.id,
        email: session.user.email || '',
        firstName: session.user.user_metadata?.first_name || '',
        lastName: session.user.user_metadata?.last_name || '',
        phone: session.user.user_metadata?.phone ?? null,
        role: (session.user.user_metadata?.role as UserRole) || 'user',
      };
    }
  } catch {}

  return null;
}

export async function createProfile(
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<void> {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    await supabase.from('profiles').upsert({
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      role: 'user',
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Profile creation notice:', err);
  }
}



/**
 * Uploads a WebP image blob to Supabase Storage bucket.
 * Returns public CDN URL on success, or null on error.
 */
export async function uploadRoomImageToSupabase(
  blob: Blob,
  bucketName = 'room-photos'
): Promise<string | null> {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const fileName = `room-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;
    const filePath = `photos/${fileName}`;

    // Try primary bucket
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, blob, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });

    if (error) {
      // Try fallback bucket 'rooms'
      const { data: retryData, error: retryErr } = await supabase.storage
        .from('rooms')
        .upload(filePath, blob, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true,
        });

      if (!retryErr && retryData) {
        const { data: pubUrl } = supabase.storage.from('rooms').getPublicUrl(filePath);
        return pubUrl.publicUrl;
      }

      console.warn('Supabase upload notice:', error.message);
      return null;
    }

    const { data: pubUrl } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return pubUrl.publicUrl;
  } catch (err) {
    console.warn('Supabase upload error:', err);
    return null;
  }
}

// ====== SUPABASE ROOM DATABASE OPERATIONS ======

export interface SupabaseRoomRow {
  id?: number;
  name: string;
  room_number: string;
  type: string;
  capacity: number;
  bed_type: string;
  price_per_night: number;
  description: string;
  amenities: string[];
  photos: string[];
  status: string;
  size?: string;
  view?: string;
}

export function roomToSupabaseRow(room: any): SupabaseRoomRow {
  return {
    ...(room.id ? { id: room.id } : {}),
    name: room.name || '',
    room_number: room.roomNumber || '',
    type: room.type || 'standard',
    capacity: room.capacity || 2,
    bed_type: room.bedType || 'queen',
    price_per_night: room.pricePerNight || 0,
    description: room.description || '',
    amenities: room.amenities || [],
    photos: room.photos || [],
    status: room.status || 'available',
    size: room.size || '',
    view: room.view || '',
  };
}

export function supabaseRowToRoom(row: any) {
  return {
    id: row.id,
    name: row.name,
    roomNumber: row.room_number,
    type: row.type,
    capacity: row.capacity,
    bedType: row.bed_type,
    pricePerNight: Number(row.price_per_night),
    description: row.description,
    amenities: row.amenities || [],
    photos: row.photos || [],
    status: row.status,
    size: row.size || '',
    view: row.view || '',
  };
}

export async function fetchRoomsFromSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const { data, error } = await supabase.from('rooms').select('*').order('id', { ascending: true });
    if (error) {
      console.warn('Supabase fetch rooms notice:', error.message);
      return null;
    }
    return data ? data.map(supabaseRowToRoom) : null;
  } catch (err) {
    console.warn('Supabase fetch rooms error:', err);
    return null;
  }
}

export async function insertRoomToSupabase(roomData: any) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const row = roomToSupabaseRow(roomData);
    delete row.id;
    const { data, error } = await supabase.from('rooms').insert([row]).select().single();
    if (error) {
      console.warn('Supabase create room notice:', error.message);
      return null;
    }
    return data ? supabaseRowToRoom(data) : null;
  } catch (err) {
    console.warn('Supabase create room error:', err);
    return null;
  }
}

export async function updateRoomInSupabase(id: number, updates: any) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const row = roomToSupabaseRow(updates);
    delete row.id;
    const { data, error } = await supabase.from('rooms').update(row).eq('id', id).select().single();
    if (error) {
      console.warn('Supabase update room notice:', error.message);
      return null;
    }
    return data ? supabaseRowToRoom(data) : null;
  } catch (err) {
    console.warn('Supabase update room error:', err);
    return null;
  }
}

export async function deleteRoomFromSupabase(id: number) {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  try {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete room notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete room error:', err);
    return false;
  }
}


