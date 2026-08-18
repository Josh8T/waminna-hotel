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
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage, t } = useThemeLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: t('Overview', 'Ringkasan'), icon: LayoutDashboard },
    { path: '/admin/bookings', label: t('Bookings', 'Reservasi'), icon: CalendarDays },
    { path: '/admin/rooms', label: t('Rooms', 'Kamar'), icon: DoorOpen },
    { path: '/admin/users', label: t('Users', 'Pengguna'), icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] flex transition-colors">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 lg:sticky lg:top-0 lg:translate-x-0 z-50 w-60 min-w-[240px] h-screen bg-[#242320] dark:bg-[#1C1C19] border-r border-[#30312f] flex flex-col justify-between shrink-0 transition-transform text-white overflow-y-auto`}
      >
        <div>
          <div className="p-5 flex items-center justify-between border-b border-[#30312f]">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}images/stitch/waminna_emblem.png`} alt="Waminna Emblem" className="h-7 w-auto" />
              <span className="text-xs font-sans font-semibold text-[#C5A059] tracking-wider">
                ADMIN SUITE
              </span>
            </div>
            <button
              className="lg:hidden p-1 text-white"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="px-3 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-sans font-semibold tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#30312f] text-[#C5A059] font-semibold border-l-2 border-[#C5A059]'
                      : 'text-white/70 hover:bg-[#30312f]/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-[#C5A059]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#30312f] space-y-3">
          {/* Controls */}
          <div className="flex items-center justify-between px-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-sans font-semibold rounded border border-[#30312f] text-white/80 hover:text-[#C5A059] flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-[#30312f] text-white/80 hover:text-[#C5A059]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C5A059]" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-[#30312f] flex items-center justify-center border border-[#C5A059]/30">
              <span className="text-xs font-sans font-semibold text-[#C5A059]">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] font-sans text-white/60 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-sans font-semibold text-red-400 hover:bg-red-950/40 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('Sign out', 'Keluar')}
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-sans font-semibold text-white/70 hover:text-white transition-colors"
          >
            <BedDouble className="w-4 h-4 text-[#C5A059]" />
            {t('View Site', 'Lihat Situs')}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#242320] text-white border-b border-[#30312f]">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-sans font-semibold tracking-wider text-[#C5A059]">HOTEL ADMIN</span>
          <div className="w-5" />
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
