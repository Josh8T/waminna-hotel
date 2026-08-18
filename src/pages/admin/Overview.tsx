import { useEffect, useState } from 'react';
import { TrendingUp, Users2, BedDouble, DollarSign } from 'lucide-react';
import { getDashboardStats, getBookings, getRoomById, initializeData } from '@/lib/data';
import type { Booking } from '@/lib/data';
import AdminLayout from '@/components/AdminLayout';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    todayCheckins: 0,
    activeBookings: 0,
    occupiedRooms: 0,
    totalRooms: 0,
    monthlyRevenue: 0,
  });
  const [checkins, setCheckins] = useState<Booking[]>([]);
  const [roomStatus, setRoomStatus] = useState<Record<number, 'occupied' | 'available' | 'maintenance'>>({});

  useEffect(() => {
    initializeData();
    setStats(getDashboardStats());

    const allBookings = getBookings();
    const today = new Date().toISOString().split('T')[0];
    const todayCheckinsList = allBookings.filter(
      (b) => b.checkIn === today && b.status === 'confirmed'
    ).slice(0, 5);
    setCheckins(todayCheckinsList);

    // Room occupancy status
    const status: Record<number, 'occupied' | 'available' | 'maintenance'> = {};
    for (let i = 1; i <= 6; i++) {
      const isOccupied = allBookings.some(
        (b) =>
          b.roomId === i &&
          b.status === 'confirmed' &&
          b.checkIn <= today &&
          b.checkOut > today
      );
      status[i] = isOccupied ? 'occupied' : Math.random() > 0.85 ? 'maintenance' : 'available';
    }
    setRoomStatus(status);
  }, []);

  const statCards = [
    { label: 'Check-ins Today', value: stats.todayCheckins.toString(), icon: TrendingUp, color: 'text-[#1a1917]' },
    { label: 'Active Bookings', value: stats.activeBookings.toString(), icon: Users2, color: 'text-[#1a1917]' },
    { label: 'Rooms Occupied', value: `${stats.occupiedRooms}/${stats.totalRooms}`, icon: BedDouble, color: 'text-[#1a1917]' },
    { label: 'Revenue (Month)', value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-brand' },
  ];

  const occupancyRooms = [
    { num: '101', id: 1 }, { num: '102', id: 2 }, { num: '201', id: 3 },
    { num: '202', id: 4 }, { num: '301', id: 5 }, { num: '302', id: 6 },
  ];

  const statusConfig = {
    occupied: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    available: { bg: 'bg-warm-tertiary', text: 'text-[#8a8984]', border: 'border-warm-border' },
    maintenance: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#1a1917]">Overview</h1>
        <span className="text-sm text-[#8a8984]">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-warm-border p-4 shadow-sm">
            <p className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-2">{s.label}</p>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-semibold ${s.color}`}>{s.value}</span>
              <s.icon className={`w-5 h-5 ${s.color === 'text-brand' ? 'text-brand' : 'text-[#d3d0c8]'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Today's Check-ins */}
      <div className="mb-8">
        <h2 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-3">
          Upcoming Check-ins Today
        </h2>
        <div className="bg-white rounded-lg border border-warm-border overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-warm-tertiary border-b border-warm-border text-[11px] text-[#8a8984] font-medium">
            <span>Guest</span>
            <span>Room</span>
            <span>Check-out</span>
            <span>Status</span>
          </div>
          {checkins.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-[#8a8984]">No check-ins today</div>
          ) : (
            checkins.map((booking) => {
              const room = getRoomById(booking.roomId);
              return (
                <div
                  key={booking.id}
                  className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-warm-border last:border-0 items-center"
                >
                  <span className="text-sm text-[#1a1917]">{booking.guestFirstName} {booking.guestLastName}</span>
                  <span className="text-sm text-[#5c5a54]">{room?.name || `Room ${booking.roomId}`}</span>
                  <span className="text-sm text-[#5c5a54]">
                    {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="inline-flex">
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
                      Confirmed
                    </span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Room Occupancy Grid */}
      <div>
        <h2 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-3">
          Room Occupancy — Quick View
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
          {occupancyRooms.map((r) => {
            const status = roomStatus[r.id] || 'available';
            const cfg = statusConfig[status];
            return (
              <div
                key={r.num}
                className={`h-12 rounded-md flex items-center justify-center text-sm font-sans font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
              >
                {r.num}
              </div>
            );
          })}
        </div>
        <div className="flex gap-5 text-xs text-[#8a8984]">
          {(['occupied', 'available', 'maintenance'] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm border ${statusConfig[s].bg} ${statusConfig[s].border}`} />
              <span className="capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
