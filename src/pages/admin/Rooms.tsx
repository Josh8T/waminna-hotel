import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getRooms, updateRoom, createRoom, deleteRoom, initializeData, getPhotoUrl, syncRoomsWithSupabase } from '@/lib/data';
import type { Room, RoomType, BedType, RoomStatus } from '@/lib/data';
import AdminLayout from '@/components/AdminLayout';
import ImageUploader from '@/components/ImageUploader';

const AMENITIES_LIST = [
  'Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe',
  'Hair Dryer', 'Room Service', 'Balcony', 'City View', 'Skyline View',
  'Pool View', 'Bathtub', 'Rain Shower', 'Coffee Machine', 'Iron & Board', 'Desk',
];

const emptyRoom: Partial<Room> = {
  name: '',
  roomNumber: '',
  type: 'standard',
  capacity: 2,
  bedType: 'queen',
  pricePerNight: 100,
  description: '',
  amenities: [],
  photos: ['images/rooms/standard/standard.png'],
  status: 'available',
  size: '25 m²',
  view: 'City View',
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState<Partial<Room>>(emptyRoom);

  useEffect(() => {
    initializeData();
    setRooms(getRooms());
    syncRoomsWithSupabase().then((latestRooms) => {
      if (latestRooms && latestRooms.length > 0) {
        setRooms([...latestRooms]);
      }
    });
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyRoom);
    setShowModal(true);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setForm({ ...room });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.roomNumber || !form.pricePerNight) return;
    const roomPayload = {
      ...form,
      photos: form.photos && form.photos.length > 0 && form.photos[0].trim() !== ''
        ? form.photos
        : ['images/rooms/standard/standard.png'],
    };
    if (editing) {
      updateRoom(editing.id, roomPayload);
    } else {
      createRoom(roomPayload as Omit<Room, 'id'>);
    }
    setRooms(getRooms());
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteRoom(id);
      setRooms(getRooms());
    }
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }));
  };

  const updateField = <K extends keyof Room>(field: K, value: Room[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-[#1a1917]">Rooms</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg border border-warm-border overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src={getPhotoUrl(room.photos?.[0])}
                alt={room.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getPhotoUrl('images/rooms/standard/standard.png');
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-[#1a1917]">{room.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(room)}
                    className="p-1.5 rounded hover:bg-warm-secondary text-[#8a8984]"
                    aria-label="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-[#8a8984] hover:text-red-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-0.5 bg-brand-light text-brand text-[11px] font-medium rounded-full capitalize">
                  {room.type}
                </span>
                <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full capitalize border ${
                  room.status === 'available'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : room.status === 'maintenance'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-warm-tertiary text-[#8a8984] border-warm-border'
                }`}>
                  {room.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#1a1917] mb-1">
                ${room.pricePerNight}<span className="text-xs font-normal text-[#8a8984]">/night</span>
              </p>
              <p className="text-xs text-[#8a8984]">
                {room.capacity} guests · {room.bedType} bed · {room.size}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[#1a1917] mb-4">
                {editing ? 'Edit Room' : 'Add Room'}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">Room Name</label>
                    <input
                      type="text"
                      value={form.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">Room Number</label>
                    <input
                      type="text"
                      value={form.roomNumber || ''}
                      onChange={(e) => updateField('roomNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => updateField('type', e.target.value as RoomType)}
                      className="w-full px-3 py-2 border border-warm-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="suite">Suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">Capacity</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={form.capacity || 2}
                      onChange={(e) => updateField('capacity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">Bed Type</label>
                    <select
                      value={form.bedType}
                      onChange={(e) => updateField('bedType', e.target.value as BedType)}
                      className="w-full px-3 py-2 border border-warm-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="king">King</option>
                      <option value="queen">Queen</option>
                      <option value="twin">Twin</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">Price/Night ($)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.pricePerNight || ''}
                      onChange={(e) => updateField('pricePerNight', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => updateField('status', e.target.value as RoomStatus)}
                      className="w-full px-3 py-2 border border-warm-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="occupied">Occupied</option>
                    </select>
                  </div>
                </div>
                <ImageUploader
                  photos={form.photos || []}
                  onChange={(newPhotos) => updateField('photos', newPhotos)}
                />
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">Description</label>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_LIST.map((a) => (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          form.amenities?.includes(a)
                            ? 'bg-brand-light text-brand border-brand'
                            : 'bg-warm-bg text-[#8a8984] border-warm-border hover:border-warm-border-strong'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 border border-warm-border-strong rounded-md text-sm font-medium text-[#5c5a54] hover:bg-warm-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2.5 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark"
                  >
                    {editing ? 'Save Changes' : 'Create Room'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
