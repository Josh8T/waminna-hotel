import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  DoorOpen,
  Users,
  LogOut,
  Menu,
  X,
  BedDouble,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { path: '/admin/rooms', label: 'Rooms', icon: DoorOpen },
  { path: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-warm-bg flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-50 w-52 min-w-[208px] h-screen bg-warm-tertiary border-r border-warm-border flex flex-col transition-transform`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-teal" />
            <span className="text-sm font-semibold text-[#1a1917]">Hotel Admin</span>
          </div>
          <button
            className="lg:hidden p-1"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-teal-light text-teal font-medium border-l-[3px] border-teal'
                    : 'text-[#5c5a54] hover:bg-warm-secondary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-warm-border">
          <div className="flex items-center gap-2 mb-3 px-3">
            <div className="w-7 h-7 rounded-full bg-teal-light flex items-center justify-center">
              <span className="text-xs font-medium text-teal">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#1a1917] truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-[#8a8984] capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#5c5a54] hover:bg-warm-secondary w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#8a8984] hover:text-[#5c5a54] transition-colors mt-1"
          >
            <BedDouble className="w-4 h-4" />
            View Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-warm-border">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold">Hotel Admin</span>
          <div className="w-5" />
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
