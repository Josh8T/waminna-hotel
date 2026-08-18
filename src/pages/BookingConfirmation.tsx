import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, Home, CalendarDays, ArrowRight } from 'lucide-react';
import { getBookingByReference } from '@/lib/data';
import type { Booking } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (ref) {
      const b = getBookingByReference(ref);
      if (b) setBooking(b);
      else setNotFound(true);
    }
  }, [ref]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-warm-bg">
        <Header />
        <div className="pt-24 text-center px-4">
          <p className="text-lg text-[#5c5a54] mb-4">Booking not found</p>
          <Link to="/" className="text-brand hover:underline">
            Back to home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-warm-bg">
        <Header />
        <div className="pt-24 text-center">
          <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      <Header />

      <div className="max-w-xl mx-auto px-4 pt-24 pb-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-green-700 mb-1">Booking Confirmed!</h1>
          <p className="text-sm text-[#5c5a54]">Thank you for choosing Charles&apos;s Stay</p>
        </div>

        {/* Booking Reference */}
        <div className="text-center mb-6">
          <p className="text-[11px] font-medium tracking-widest uppercase text-[#8a8984] mb-2">
            Your Booking Reference
          </p>
          <div className="inline-block px-6 py-3 border-2 border-dashed border-brand/30 rounded-lg bg-brand-light/30">
            <span className="font-sans text-xl font-bold text-brand tracking-wider">
              {booking.bookingReference}
            </span>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl border border-warm-border p-6 shadow-sm mb-6">
          <h3 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-4">
            Booking Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-[#8a8984] mb-0.5">Room</p>
              <p className="text-sm font-medium text-[#1a1917]">
                {/* Room name would come from lookup */}
                Room #{booking.roomId}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#8a8984] mb-0.5">Guests</p>
              <p className="text-sm font-medium text-[#1a1917]">{booking.guestsCount}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#8a8984] mb-0.5">Check-in</p>
              <p className="text-sm font-medium text-[#1a1917]">
                {new Date(booking.checkIn).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#8a8984] mb-0.5">Check-out</p>
              <p className="text-sm font-medium text-[#1a1917]">
                {new Date(booking.checkOut).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#8a8984] mb-0.5">Nights</p>
              <p className="text-sm font-medium text-[#1a1917]">{booking.nights}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#8a8984] mb-0.5">Total Paid</p>
              <p className="text-sm font-semibold text-brand">${booking.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-5 mb-6">
          <h3 className="text-[11px] font-medium tracking-wider uppercase text-green-700 mb-3">
            What&apos;s Next
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#5c5a54]">
                A confirmation email has been sent to <strong>{booking.guestEmail}</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#5c5a54]">
                Please present your booking reference <strong>{booking.bookingReference}</strong> at check-in
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-warm-border-strong rounded-md text-sm font-medium text-[#5c5a54] hover:bg-warm-secondary transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            to="/my-bookings"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            View My Bookings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
