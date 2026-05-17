import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, ArrowRight, BedDouble } from 'lucide-react';
import { getBookingsByUser, getRoomById, initializeData } from '@/lib/data';
import type { Booking } from '@/lib/data';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    initializeData();
    if (user) {
      const userBookings = getBookingsByUser(user.id);
      setBookings(userBookings);
    }
  }, [user]);

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const statusColors: Record<string, string> = {
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-warm-tertiary text-[#8a8984] border-warm-border',
  };

  return (
    <div className="min-h-screen bg-warm-bg">
      <Header />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-2xl font-semibold text-[#1a1917] mb-1">My Bookings</h1>
        <p className="text-sm text-[#8a8984] mb-6">View and manage your reservations</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-warm-secondary p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-[#1a1917] shadow-sm'
                  : 'text-[#8a8984] hover:text-[#5c5a54]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-warm-border">
            <BedDouble className="w-10 h-10 text-[#d3d0c8] mx-auto mb-3" />
            <p className="text-[#5c5a54] mb-1">No bookings found</p>
            <p className="text-sm text-[#8a8984] mb-4">
              {filter === 'all' ? "You haven't made any bookings yet" : `No ${filter} bookings`}
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal text-white rounded-md text-sm font-medium hover:bg-teal-dark transition-colors"
            >
              Browse Rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const room = getRoomById(booking.roomId);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl border border-warm-border p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={room?.photos[0] || '/images/room-standard.jpg'}
                      alt={room?.name || 'Room'}
                      className="w-full sm:w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-[#1a1917]">
                            {room?.name || `Room #${booking.roomId}`}
                          </h3>
                          <p className="font-mono text-xs text-[#8a8984] mt-0.5">
                            {booking.bookingReference}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border capitalize ${
                            statusColors[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-[#5c5a54]">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-[#8a8984]" />
                          {new Date(booking.checkIn).toLocaleDateString()} –{' '}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#8a8984]" />
                          {booking.guestsCount} guests
                        </span>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm font-semibold text-[#1a1917]">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                      <Link
                        to={`/booking-confirmation?ref=${booking.bookingReference}`}
                        className="text-xs text-teal hover:underline mt-1 inline-block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
