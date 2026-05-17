import { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Check, Users, BedDouble, Maximize, Eye } from 'lucide-react';
import { getRoomById, getAvailableRooms } from '@/lib/data';
import type { Room } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const roomId = parseInt(id || '0');

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const room: Room | undefined = getRoomById(roomId);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const priceSummary = useMemo(() => {
    if (!room || nights === 0) return null;
    const subtotal = room.pricePerNight * nights;
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  }, [room, nights]);

  const isAvailable = useMemo(() => {
    if (!checkIn || !checkOut || !room) return true;
    const available = getAvailableRooms(checkIn, checkOut, parseInt(guests));
    return available.some((r) => r.id === room.id);
  }, [checkIn, checkOut, guests, room]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-warm-bg">
        <Header />
        <div className="pt-24 text-center">
          <p className="text-lg text-[#5c5a54]">Room not found</p>
          <Link to="/rooms" className="text-teal hover:underline mt-2 inline-block">
            Back to rooms
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const queryStr = `?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;

  return (
    <div className="min-h-screen bg-warm-bg">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-16 bg-warm-secondary border-b border-warm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-sm text-teal hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Back to all rooms
          </Link>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 max-h-[400px]">
          <div
            className="md:col-span-1 md:row-span-2 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <img
              src={room.photos[0]}
              alt={room.name}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform"
            />
          </div>
          {room.photos.slice(1, 4).map((photo, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden cursor-pointer relative hidden md:block"
              onClick={() => openLightbox(i + 1)}
            >
              <img
                src={photo}
                alt={`${room.name} view ${i + 2}`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform"
              />
              {i === 2 && room.photos.length > 4 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">+{room.photos.length - 4} more</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content + Booking Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 flex flex-col lg:flex-row gap-8">
        {/* Left - Details */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a1917] mb-3">{room.name}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-2.5 py-1 bg-teal-light text-teal text-xs font-medium rounded-full capitalize">
              {room.type}
            </span>
            <span className="px-2.5 py-1 bg-warm-secondary text-[#5c5a54] text-xs font-medium rounded-full">
              {room.capacity} guests
            </span>
            <span className="px-2.5 py-1 bg-warm-secondary text-[#5c5a54] text-xs font-medium rounded-full capitalize">
              {room.bedType} bed
            </span>
          </div>

          <div className="border-t border-warm-border pt-6 mb-6">
            <h3 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-3">
              Description
            </h3>
            <p className="text-sm text-[#5c5a54] leading-relaxed">{room.description}</p>
          </div>

          <div className="border-t border-warm-border pt-6 mb-6">
            <h3 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-3">
              Room Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Maximize, label: 'Room Size', value: room.size || 'N/A' },
                { icon: BedDouble, label: 'Bed Type', value: `${room.bedType.charAt(0).toUpperCase() + room.bedType.slice(1)} Bed` },
                { icon: Users, label: 'Max Guests', value: `${room.capacity} guests` },
                { icon: Eye, label: 'View', value: room.view || 'N/A' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-teal" />
                  <div>
                    <p className="text-[11px] text-[#8a8984]">{label}</p>
                    <p className="text-sm text-[#1a1917]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-warm-border pt-6">
            <h3 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-3">
              Amenities
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-sm text-[#5c5a54]">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Booking Panel */}
        <div className="lg:w-80 lg:min-w-[320px]">
          <div className="lg:sticky lg:top-20 bg-white rounded-xl shadow-lg p-5 border border-warm-border">
            <p className="text-2xl font-semibold text-[#1a1917] mb-4">
              ${room.pricePerNight}
              <span className="text-sm font-normal text-[#8a8984]"> / night</span>
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal bg-white"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {priceSummary && (
              <div className="border-t border-warm-border pt-3 mb-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5c5a54]">
                    ${room.pricePerNight} × {nights} nights
                  </span>
                  <span className="text-[#1a1917]">${priceSummary.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5c5a54]">Taxes (10%)</span>
                  <span className="text-[#1a1917]">${priceSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-1 border-t border-warm-border">
                  <span>Total</span>
                  <span>${priceSummary.total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Link
              to={`/booking${queryStr}`}
              className={`block w-full py-3 text-center rounded-md text-sm font-medium transition-colors ${
                checkIn && checkOut && isAvailable
                  ? 'bg-teal text-white hover:bg-teal-dark'
                  : 'bg-warm-tertiary text-[#8a8984] cursor-not-allowed pointer-events-none'
              }`}
            >
              {checkIn && checkOut ? (isAvailable ? 'Book Now' : 'Not Available') : 'Select Dates'}
            </Link>

            <p className="text-[11px] text-[#8a8984] text-center mt-3">
              Free cancellation up to 3 days before check-in
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={room.photos[lightboxIndex]}
            alt={`${room.name} view ${lightboxIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
