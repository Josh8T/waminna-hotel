import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, ArrowRight, BedDouble } from 'lucide-react';
import { getBookingsByEmail, getRoomById, initializeData, getPhotoUrl } from '@/lib/data';
import type { Booking } from '@/lib/data';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function MyBookings() {
  const { user } = useAuth();
  const { t } = useThemeLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    initializeData();
    if (user) {
      const userBookings = getBookingsByEmail(user.email);
      setBookings(userBookings);
    }
  }, [user]);

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  const tabs = [
    { key: 'all', label: t('All', 'Semua') },
    { key: 'confirmed', label: t('Confirmed', 'Dikonfirmasi') },
    { key: 'completed', label: t('Completed', 'Selesai') },
    { key: 'cancelled', label: t('Cancelled', 'Dibatalkan') },
  ];

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    cancelled: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    completed: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-28 pb-16">
        <h1 className="text-3xl font-display font-normal text-[#1a1917] dark:text-[#F7F5F2] mb-1">
          {t('My Bookings', 'Reservasi Saya')}
        </h1>
        <p className="text-sm text-[#827D75] dark:text-[#ded9d6] mb-8 font-sans">
          {t('View and manage your room reservations', 'Lihat dan kelola reservasi kamar Anda')}
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#f0ece6] dark:bg-[#242320] border border-[#e8e6e1] dark:border-[#30312f] p-1.5 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 text-xs font-sans font-semibold rounded-lg transition-colors ${
                filter === tab.key
                  ? 'bg-white dark:bg-[#30312f] text-[#1a1917] dark:text-[#F7F5F2] shadow-sm'
                  : 'text-[#827D75] dark:text-[#ded9d6] hover:text-[#1c1b19] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white dark:bg-[#242320] rounded-2xl border border-[#e8e6e1] dark:border-[#30312f] shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#f5f3f0] dark:bg-[#191816] flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
              <BedDouble className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-display text-[#1c1b19] dark:text-[#F7F5F2] mb-1">
              {t('No bookings found', 'Tidak ada reservasi ditemukan')}
            </h3>
            <p className="text-sm text-[#827D75] dark:text-[#ded9d6] mb-6 font-sans">
              {filter === 'all'
                ? t("You haven't made any bookings yet", 'Anda belum memiliki riwayat reservasi')
                : t(`No ${filter} bookings`, `Tidak ada reservasi berstatus ${filter}`)}
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08d48] text-[#1C1C19] rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>{t('Browse Rooms', 'Jelajahi Kamar')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const room = getRoomById(booking.roomId);
              return (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-[#242320] rounded-2xl border border-[#e8e6e1] dark:border-[#30312f] p-5 sm:p-6 shadow-sm hover:border-[#C5A059]/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <img
                      src={getPhotoUrl(room?.photos?.[0])}
                      alt={room?.name || 'Room'}
                      className="w-full sm:w-28 h-28 object-cover rounded-xl"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getPhotoUrl('images/rooms/standard/standard.png');
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-[#1c1b19] dark:text-[#F7F5F2]">
                            {room?.name || `Room #${booking.roomId}`}
                          </h3>
                          <p className="font-mono text-xs text-[#C5A059] font-medium mt-0.5">
                            {booking.bookingReference}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border capitalize ${
                            statusColors[booking.status] || statusColors.completed
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-[#5c5a54] dark:text-[#ded9d6] font-sans">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4 text-[#C5A059]" />
                          {new Date(booking.checkIn).toLocaleDateString()} –{' '}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#C5A059]" />
                          {booking.guestsCount} {t('guests', 'tamu')}
                        </span>
                      </div>
                    </div>
                    <div className="sm:text-right flex sm:flex-col justify-between items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e8e6e1] dark:border-[#30312f]">
                      <p className="text-base font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                      <Link
                        to={`/booking-confirmation?ref=${booking.bookingReference}`}
                        className="text-xs font-semibold text-[#C5A059] hover:underline mt-1 inline-block"
                      >
                        {t('View Details', 'Lihat Detail')} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

