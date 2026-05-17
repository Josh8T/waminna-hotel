import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { getBookings, getRoomById, updateBookingStatus, initializeData } from '@/lib/data';
import type { Booking, BookingStatus } from '@/lib/data';
import AdminLayout from '@/components/AdminLayout';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    initializeData();
    setBookings(getBookings());
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      !search ||
      b.guestFirstName.toLowerCase().includes(search.toLowerCase()) ||
      b.guestLastName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingReference.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleStatusChange = (id: number, status: BookingStatus) => {
    updateBookingStatus(id, status);
    setBookings(getBookings());
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      confirmed: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      completed: 'bg-warm-tertiary text-[#8a8984] border-warm-border',
    };
    return (
      <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border capitalize ${map[status] || map.completed}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-[#1a1917] mb-4">Bookings</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8984]" />
          <input
            type="text"
            placeholder="Search by guest or reference..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-warm-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-warm-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-warm-tertiary border-b border-warm-border">
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                  Guest / Ref
                </th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                  Room
                </th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                  Check-in
                </th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                  Check-out
                </th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                  Status
                </th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                  Total
                </th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-[#8a8984]">
                    No bookings found
                  </td>
                </tr>
              ) : (
                paginated.map((b) => {
                  const room = getRoomById(b.roomId);
                  return (
                    <tr key={b.id} className="border-b border-warm-border last:border-0 hover:bg-warm-bg transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#1a1917]">
                          {b.guestFirstName} {b.guestLastName}
                        </p>
                        <p className="font-mono text-[10px] text-[#8a8984]">{b.bookingReference}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5c5a54]">
                        {room?.name || `Room ${b.roomId}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5c5a54]">
                        {new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5c5a54]">
                        {new Date(b.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">{statusBadge(b.status)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#1a1917]">
                        ${b.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative group inline-block">
                          <button className="p-1 rounded hover:bg-warm-secondary">
                            <MoreHorizontal className="w-4 h-4 text-[#8a8984]" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-warm-border rounded-md shadow-lg z-10 hidden group-hover:block">
                            {b.status === 'confirmed' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(b.id, 'completed')}
                                  className="w-full text-left px-3 py-2 text-sm text-[#5c5a54] hover:bg-warm-bg"
                                >
                                  Mark Completed
                                </button>
                                <button
                                  onClick={() => handleStatusChange(b.id, 'cancelled')}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {b.status === 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(b.id, 'confirmed')}
                                className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-[#8a8984]">
          Showing {filtered.length > 0 ? (page - 1) * perPage + 1 : 0}–
          {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-warm-border bg-warm-secondary text-[#5c5a54] hover:bg-warm-tertiary disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                page === p
                  ? 'bg-teal-light text-teal border border-teal'
                  : 'border border-warm-border bg-warm-secondary text-[#5c5a54] hover:bg-warm-tertiary'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-warm-border bg-warm-secondary text-[#5c5a54] hover:bg-warm-tertiary disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
