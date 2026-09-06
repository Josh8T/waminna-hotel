import { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Check, Users, BedDouble, Maximize, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getRoomById, getAvailableRooms, getPhotoUrl } from '@/lib/data';
import type { Room } from '@/lib/data';
import { getTodayString, getTomorrowString, validateStayDates } from '@/lib/dateUtils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function RoomDetail() {
  const { t } = useThemeLanguage();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const roomId = parseInt(id || '0');

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const room: Room | undefined = getRoomById(roomId);

  const today = getTodayString();
  const minCheckOut = checkIn ? getTomorrowString(checkIn) : getTomorrowString();

  const dateValidation = useMemo(() => {
    return validateStayDates(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const nights = dateValidation.isValid ? dateValidation.nights : 0;

  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);
    if (newCheckIn && checkOut && checkOut <= newCheckIn) {
      const nextDay = getTomorrowString(newCheckIn);
      setCheckOut(nextDay);
      toast.info(
        t(
          'Check-out date adjusted to ensure a minimum 1-night stay.',
          'Tanggal keluar disesuaikan untuk memastikan minimum 1 malam menginap.'
        )
      );
    }
  };

  const handleCheckOutChange = (newCheckOut: string) => {
    if (checkIn && newCheckOut <= checkIn) {
      toast.warning(
        t(
          'Same-day check-out is not allowed. Check-out must be at least 1 day after check-in.',
          'Check-out di hari yang sama tidak diperbolehkan. Tanggal keluar harus minimal 1 hari setelah tanggal masuk.'
        )
      );
      setCheckOut(getTomorrowString(checkIn));
      return;
    }
    setCheckOut(newCheckOut);
  };

  const priceSummary = useMemo(() => {
    if (!room || nights === 0) return null;
    const subtotal = room.pricePerNight * nights;
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  }, [room, nights]);

  const isAvailable = useMemo(() => {
    if (!checkIn || !checkOut || !room || !dateValidation.isValid) return false;
    const available = getAvailableRooms(checkIn, checkOut, parseInt(guests));
    return available.some((r) => r.id === room.id);
  }, [checkIn, checkOut, guests, room, dateValidation.isValid]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2]">
        <Header />
        <div className="pt-24 text-center">
          <p className="text-lg text-[#827D75] dark:text-[#ded9d6]">{t('Room not found', 'Kamar tidak ditemukan')}</p>
          <Link to="/rooms" className="text-[#C5A059] hover:underline mt-2 inline-block font-medium">
            {t('Back to rooms', 'Kembali ke katalog kamar')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const queryStr = `?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] transition-colors">
      <Header />

      {/* Breadcrumb & Navigation Header */}
      <div className="pt-20 pb-4 bg-[#f2ede9] dark:bg-[#242320] border-b border-[#e8e6e1] dark:border-[#30312f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#414930] dark:text-[#C5A059] hover:underline uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> {t('Back to Accommodations Catalog', 'Kembali ke Katalog Kamar')}
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
              src={getPhotoUrl(room.photos?.[0])}
              alt={room.name}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getPhotoUrl('images/rooms/standard/standard.png');
              }}
            />
          </div>
          {room.photos.slice(1, 4).map((photo, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden cursor-pointer relative hidden md:block"
              onClick={() => openLightbox(i + 1)}
            >
              <img
                src={getPhotoUrl(photo)}
                alt={`${room.name} view ${i + 2}`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getPhotoUrl('images/rooms/standard/standard.png');
                }}
              />
              {i === 2 && room.photos.length > 4 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">+{room.photos.length - 4} {t('more', 'lagi')}</span>
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
          <h1 className="text-2xl sm:text-3xl font-display font-normal text-[#1c1b19] dark:text-[#F7F5F2] mb-3">{room.name}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-2.5 py-1 bg-[#e8ece1] dark:bg-[#30312f] text-[#414930] dark:text-[#C5A059] text-xs font-sans font-semibold rounded-full capitalize">
              {room.type}
            </span>
            <span className="px-2.5 py-1 bg-[#f5f3f0] dark:bg-[#242320] text-[#46483f] dark:text-[#ded9d6] text-xs font-sans font-medium rounded-full">
              {room.capacity} {t('guests', 'tamu')}
            </span>
            <span className="px-2.5 py-1 bg-[#f5f3f0] dark:bg-[#242320] text-[#46483f] dark:text-[#ded9d6] text-xs font-sans font-medium rounded-full capitalize">
              {room.bedType} {t('bed', 'tempat tidur')}
            </span>
          </div>

          <div className="border-t border-[#e8e6e1] dark:border-[#30312f] pt-6 mb-6">
            <h3 className="text-[11px] font-sans font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-3">
              {t('Description', 'Deskripsi')}
            </h3>
            <p className="text-sm text-[#46483f] dark:text-[#ded9d6] leading-relaxed font-sans">{room.description}</p>
          </div>

          <div className="border-t border-[#e8e6e1] dark:border-[#30312f] pt-6 mb-6">
            <h3 className="text-[11px] font-sans font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-3">
              {t('Room Details', 'Detail Kamar')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Maximize, label: t('Room Size', 'Ukuran Kamar'), value: room.size || 'N/A' },
                { icon: BedDouble, label: t('Bed Type', 'Tipe Tempat Tidur'), value: `${room.bedType.charAt(0).toUpperCase() + room.bedType.slice(1)} Bed` },
                { icon: Users, label: t('Max Guests', 'Kapasitas Maksimal'), value: `${room.capacity} ${t('guests', 'tamu')}` },
                { icon: Eye, label: t('View', 'Pemandangan'), value: room.view || 'N/A' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#C5A059]" />
                  <div>
                    <p className="text-[11px] font-sans text-[#827D75] dark:text-white/60">{label}</p>
                    <p className="text-sm text-[#1c1b19] dark:text-[#F7F5F2]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#e8e6e1] dark:border-[#30312f] pt-6">
            <h3 className="text-[11px] font-sans font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-3">
              {t('Amenities', 'Fasilitas')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-sm text-[#46483f] dark:text-[#ded9d6]">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Booking Panel */}
        <div className="lg:w-80 lg:min-w-[320px]">
          <div className="lg:sticky lg:top-20 bg-white dark:bg-[#242320] rounded-xl shadow-lg p-5 border border-[#e8e6e1] dark:border-[#30312f]">
            <p className="text-2xl font-sans font-bold text-[#414930] dark:text-[#C5A059] mb-4">
              ${room.pricePerNight}
              <span className="text-sm font-sans font-normal text-[#827D75] dark:text-white/60"> / {t('night', 'malam')}</span>
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-sans font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-1">
                  {t('Check-in', 'Tanggal Masuk')} *
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  min={today}
                  className="w-full px-3 py-2 border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-sans font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6]">
                    {t('Check-out', 'Tanggal Keluar')} *
                  </label>
                  {nights > 0 && (
                    <span className="text-[10px] font-semibold text-[#C5A059] px-1.5 py-0.5 bg-[#C5A059]/15 rounded">
                      {nights} {nights === 1 ? t('night', 'malam') : t('nights', 'malam')}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => handleCheckOutChange(e.target.value)}
                  min={minCheckOut}
                  className="w-full px-3 py-2 border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-1">
                  {t('Guests', 'Tamu')}
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n} className="dark:bg-[#242320]">
                      {n} {n === 1 ? t('Guest', 'Tamu') : t('Guests', 'Tamu')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Warning alert if dates invalid */}
            {checkIn && checkOut && !dateValidation.isValid && (
              <div className="flex items-center gap-2 p-2.5 mb-4 bg-red-500/10 border border-red-500/30 rounded text-red-700 dark:text-red-400 text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t(dateValidation.messageEn, dateValidation.messageId)}</span>
              </div>
            )}

            {priceSummary && (
              <div className="border-t border-[#e8e6e1] dark:border-[#30312f] pt-3 mb-4 space-y-1.5 font-sans">
                <div className="flex justify-between text-sm">
                  <span className="text-[#46483f] dark:text-[#ded9d6]">
                    ${room.pricePerNight} × {nights} {t('nights', 'malam')}
                  </span>
                  <span className="text-[#1c1b19] dark:text-[#F7F5F2]">${priceSummary.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#46483f] dark:text-[#ded9d6]">{t('Taxes (10%)', 'Pajak (10%)')}</span>
                  <span className="text-[#1c1b19] dark:text-[#F7F5F2]">${priceSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-1 border-t border-[#e8e6e1] dark:border-[#30312f]">
                  <span>Total</span>
                  <span className="text-[#C5A059]">${priceSummary.total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Link
              to={dateValidation.isValid && isAvailable ? `/booking${queryStr}` : '#'}
              className={`block w-full py-3 text-center rounded-md text-xs uppercase tracking-wider font-sans font-semibold transition-all ${
                dateValidation.isValid && isAvailable
                  ? 'bg-[#C5A059] text-[#1C1C19] hover:bg-[#b08d49] shadow-sm cursor-pointer'
                  : 'bg-[#827D75]/30 text-[#827D75] cursor-not-allowed pointer-events-none'
              }`}
              aria-disabled={!dateValidation.isValid || !isAvailable}
            >
              {!checkIn || !checkOut
                ? t('Select Dates', 'Pilih Tanggal')
                : !dateValidation.isValid
                ? t('Minimum 1 Night Required', 'Minimal 1 Malam Diperlukan')
                : isAvailable
                ? t('Book Now', 'Pesan Sekarang')
                : t('Not Available', 'Tidak Tersedia')}
            </Link>

            <p className="text-[11px] text-[#827D75] dark:text-white/60 text-center mt-3 font-sans">
              {t('Free cancellation up to 3 days before check-in', 'Bebas pembatalan hingga 3 hari sebelum waktu masuk')}
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
