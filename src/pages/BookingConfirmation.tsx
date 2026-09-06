import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, CalendarDays, Mail, ArrowRight, Home } from 'lucide-react';
import { getBookingByReference, initializeData, getRoomById } from '@/lib/data';
import type { Booking } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { t } = useThemeLanguage();

  useEffect(() => {
    initializeData();
    if (ref) {
      const b = getBookingByReference(ref);
      if (b) {
        setBooking(b);
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  }, [ref]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] flex flex-col font-sans transition-colors">
        <Header />
        <main className="flex-1 pt-32 text-center px-4">
          <h2 className="text-xl font-display font-medium text-[#1c1b19] dark:text-[#F7F5F2] mb-2">
            {t('Booking Not Found', 'Reservasi Tidak Ditemukan')}
          </h2>
          <p className="text-sm text-[#827D75] dark:text-[#ded9d6] mb-6 font-sans">
            {t('We could not locate a reservation with the provided reference.', 'Kami tidak dapat menemukan reservasi dengan nomor referensi tersebut.')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08d48] text-[#1C1C19] rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors"
          >
            {t('Back to Home', 'Kembali ke Beranda')}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] flex items-center justify-center">
        <Header />
        <div className="w-8 h-8 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
      </div>
    );
  }

  const room = getRoomById(booking.roomId);

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-28 pb-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-display font-medium text-[#1c1b19] dark:text-[#F7F5F2] mb-1">
            {t('Booking Confirmed!', 'Reservasi Dikonfirmasi!')}
          </h1>
          <p className="text-sm text-[#827D75] dark:text-[#ded9d6] font-sans">
            {t('Thank you for choosing Waminna Hotel Batam', 'Terima kasih telah memilih Waminna Hotel Batam')}
          </p>
        </div>

        {/* Booking Reference */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#827D75] dark:text-[#ded9d6] mb-2 font-sans">
            {t('Your Booking Reference', 'Kode Referensi Reservasi')}
          </p>
          <div className="inline-block px-6 py-3 border-2 border-dashed border-[#C5A059]/40 rounded-xl bg-[#C5A059]/10">
            <span className="font-mono text-xl font-bold text-[#C5A059] tracking-wider">
              {booking.bookingReference}
            </span>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white dark:bg-[#242320] rounded-2xl border border-[#e8e6e1] dark:border-[#30312f] p-6 shadow-sm mb-6">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-4 font-sans border-b border-[#e8e6e1] dark:border-[#30312f] pb-3">
            {t('Reservation Details', 'Detail Reservasi')}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm font-sans">
            <div>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mb-0.5">{t('Room Category', 'Tipe Kamar')}</p>
              <p className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">
                {room?.name || `Room #${booking.roomId}`}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mb-0.5">{t('Guests', 'Jumlah Tamu')}</p>
              <p className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{booking.guestsCount} {t('guests', 'tamu')}</p>
            </div>
            <div>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mb-0.5">{t('Check-in', 'Masuk (Check-in)')}</p>
              <p className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">
                {new Date(booking.checkIn).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mb-0.5">{t('Check-out', 'Keluar (Check-out)')}</p>
              <p className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">
                {new Date(booking.checkOut).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mb-0.5">{t('Duration', 'Durasi')}</p>
              <p className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{booking.nights} {t('night(s)', 'malam')}</p>
            </div>
            <div>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mb-0.5">{t('Total Paid', 'Total Dibayar')}</p>
              <p className="font-semibold text-base text-[#C5A059]">${booking.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 p-5 mb-8">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-emerald-800 dark:text-emerald-300 mb-3 font-sans">
            {t('Important Information', 'Informasi Penting')}
          </h3>
          <div className="space-y-3 font-sans text-xs sm:text-sm text-emerald-900/80 dark:text-emerald-200/90">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <p>
                {t('A confirmation email has been sent to', 'Email konfirmasi telah dikirimkan ke')}{' '}
                <strong className="text-emerald-950 dark:text-white">{booking.guestEmail}</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <p>
                {t('Please present your booking reference', 'Harap tunjukkan kode reservasi')}{' '}
                <strong className="text-emerald-950 dark:text-white">{booking.bookingReference}</strong>{' '}
                {t('upon arrival at 24-hour reception desk.', 'saat kedatangan di meja resepsionis 24 jam.')}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#242320] rounded-xl text-xs font-sans font-semibold text-[#1c1b19] dark:text-[#F7F5F2] hover:border-[#C5A059] transition-colors"
          >
            <Home className="w-4 h-4" /> {t('Back to Home', 'Kembali ke Beranda')}
          </Link>
          <Link
            to="/my-bookings"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#C5A059] hover:bg-[#b08d48] text-[#1C1C19] rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            {t('View My Bookings', 'Lihat Reservasi Saya')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
