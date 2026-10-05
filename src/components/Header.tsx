import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown, User, LogOut, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function Header() {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage, t } = useThemeLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = hasRole('staff');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const scrollToSearch = () => {
    if (location.pathname === '/') {
      const el = document.getElementById('search-bar');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/?scrollToSearch=1');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-200 ${
        scrolled
          ? 'bg-[#fbf9f6]/95 dark:bg-[#1C1C19]/95 backdrop-blur-md shadow-sm border-b border-[#e8e6e1] dark:border-[#30312f]'
          : 'bg-[#fbf9f6]/80 dark:bg-[#1C1C19]/80 backdrop-blur-md border-b border-[#C5A059]/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        {/* Left: Mobile menu button */}
        <button
          className="lg:hidden p-2 -ml-2 text-[#1c1b19] dark:text-[#F7F5F2] z-20"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo (Centered on mobile/tablet, left-aligned on desktop) */}
        <Link
          to="/"
          className="flex items-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 z-10"
        >
          {/* Mobile compact emblem icon to save header space */}
          <img
            src={`${import.meta.env.BASE_URL}images/logo/logo_transparent.png`}
            alt="Waminna Hotel"
            className="h-8 w-auto object-contain block sm:hidden transition-transform hover:scale-105"
          />

          {/* Desktop full horizontal lockup (Light Mode) */}
          <img
            src={`${import.meta.env.BASE_URL}images/logo/waminna_logo_lockup_horizontal_black.png`}
            alt="Waminna Hotel"
            className="h-8 sm:h-9 w-auto object-contain hidden sm:block sm:dark:hidden transition-transform hover:scale-105"
          />

          {/* Desktop full horizontal lockup (Dark Mode) */}
          <img
            src={`${import.meta.env.BASE_URL}images/logo/waminna_logo_lockup_horizontal_white.png`}
            alt="Waminna Hotel"
            className="h-8 sm:h-9 w-auto object-contain hidden sm:dark:block transition-transform hover:scale-105"
          />
        </Link>

        {/* Center: Desktop nav (Centered in header container) */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
          <Link
            to="/rooms"
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-sans font-semibold rounded-md transition-colors ${
              location.pathname === '/rooms'
                ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
            }`}
          >
            {t('Rooms', 'Kamar')}
          </Link>
          <Link
            to="/contact"
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-sans font-semibold rounded-md transition-colors ${
              location.pathname === '/contact'
                ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
            }`}
          >
            {t('Contact', 'Kontak')}
          </Link>
          <Link
            to="/faq"
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-sans font-semibold rounded-md transition-colors ${
              location.pathname === '/faq'
                ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
            }`}
          >
            FAQ
          </Link>
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-sans font-semibold rounded-md transition-colors ${
                  location.pathname === '/my-bookings'
                    ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                    : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
                }`}
              >
                {t('My Bookings', 'Reservasi Saya')}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3.5 py-2 text-xs uppercase tracking-wider font-sans font-semibold rounded-md transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                      : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </>
          ) : null}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector for guests */}
          {!user && (
            <button
              onClick={toggleLanguage}
              className="hidden sm:inline-flex px-2.5 py-1.5 text-xs font-sans font-semibold tracking-wider rounded border border-[#e8e6e1] dark:border-[#30312f] text-[#46483f] dark:text-[#F7F5F2] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors items-center gap-1.5 bg-white/50 dark:bg-black/30"
              title="Switch Language (EN / ID)"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language}</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden sm:inline-flex p-1.5 rounded-full text-[#46483f] dark:text-[#F7F5F2] hover:text-[#C5A059] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C5A059]" /> : <Moon className="w-4 h-4 text-[#414930]" />}
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs uppercase tracking-wider font-sans font-semibold text-[#46483f] dark:text-[#F7F5F2]/90 hover:text-[#1c1b19] dark:hover:text-white hover:bg-[#f2ede9] dark:hover:bg-[#242320] transition-colors focus:outline-none cursor-pointer"
                  aria-label="User account menu"
                >
                  <span className="truncate max-w-[130px]">
                    {user.firstName || user.email?.split('@')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#827D75] dark:text-[#ded9d6]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-48 bg-[#fbf9f6] dark:bg-[#1C1C19] border border-[#e8e6e1] dark:border-[#30312f] shadow-lg rounded-xl p-1.5 z-[250]"
              >
                <DropdownMenuItem
                  onClick={() => setAccountModalOpen(true)}
                  className="cursor-pointer text-xs uppercase tracking-wider font-sans font-semibold text-[#46483f] dark:text-[#F7F5F2]/90 hover:text-[#1c1b19] dark:hover:text-white hover:bg-[#f2ede9] dark:hover:bg-[#242320] rounded-lg px-3 py-2 flex items-center gap-2 transition-colors outline-none"
                >
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span>{t('My Account', 'Akun Saya')}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={toggleLanguage}
                  className="cursor-pointer text-xs uppercase tracking-wider font-sans font-semibold text-[#46483f] dark:text-[#F7F5F2]/90 hover:text-[#1c1b19] dark:hover:text-white hover:bg-[#f2ede9] dark:hover:bg-[#242320] rounded-lg px-3 py-2 flex items-center justify-between transition-colors outline-none"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#C5A059]" />
                    <span>{t('Language', 'Bahasa')}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e8ece1] dark:bg-[#30312f] text-[#414930] dark:text-[#C5A059] border border-[#C5A059]/20">
                    {language}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#e8e6e1] dark:bg-[#30312f] my-1" />

                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-xs uppercase tracking-wider font-sans font-semibold text-[#ba1a1a] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors outline-none"
                >
                  <LogOut className="w-4 h-4 text-[#ba1a1a] dark:text-red-400" />
                  <span>{t('Sign Out', 'Keluar')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-2 text-xs uppercase tracking-wider font-sans font-semibold text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] transition-colors"
              >
                {t('Sign In', 'Masuk')}
              </Link>
            </div>
          )}
          <button
            onClick={scrollToSearch}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs uppercase tracking-wider font-sans font-semibold bg-[#C5A059] text-[#1C1C19] rounded hover:bg-[#b08d49] shadow-sm transition-all whitespace-nowrap"
          >
            {t('Book Now', 'Pesan Sekarang')}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999]"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] h-full h-dvh bg-[#fbf9f6] dark:bg-[#1C1C19] text-[#1c1b19] dark:text-[#F7F5F2] z-[10000] shadow-2xl p-6 border-r border-[#e8e6e1] dark:border-[#30312f] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#e8e6e1] dark:border-[#30312f]">
                <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center">
                  <img
                    src={`${import.meta.env.BASE_URL}images/logo/waminna_logo_lockup_horizontal_black.png`}
                    alt="Waminna Hotel"
                    className="h-8 w-auto object-contain dark:hidden"
                  />
                  <img
                    src={`${import.meta.env.BASE_URL}images/logo/waminna_logo_lockup_horizontal_white.png`}
                    alt="Waminna Hotel"
                    className="h-8 w-auto object-contain hidden dark:block"
                  />
                </Link>
                <button
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#46483f] dark:text-[#F7F5F2] transition-colors"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="mt-6 flex flex-col gap-1.5">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3.5 py-3 text-xs uppercase tracking-wider font-sans font-semibold rounded-lg transition-colors ${
                    location.pathname === '/'
                      ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                      : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
                  }`}
                >
                  {t('Home', 'Beranda')}
                </Link>
                <Link
                  to="/rooms"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3.5 py-3 text-xs uppercase tracking-wider font-sans font-semibold rounded-lg transition-colors ${
                    location.pathname === '/rooms'
                      ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                      : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
                  }`}
                >
                  {t('Rooms', 'Kamar')}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3.5 py-3 text-xs uppercase tracking-wider font-sans font-semibold rounded-lg transition-colors ${
                    location.pathname === '/contact'
                      ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                      : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
                  }`}
                >
                  {t('Contact', 'Kontak')}
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3.5 py-3 text-xs uppercase tracking-wider font-sans font-semibold rounded-lg transition-colors ${
                    location.pathname === '/faq'
                      ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                      : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
                  }`}
                >
                  FAQ
                </Link>
                {user && (
                  <Link
                    to="/my-bookings"
                    onClick={() => setMenuOpen(false)}
                    className={`px-3.5 py-3 text-xs uppercase tracking-wider font-sans font-semibold rounded-lg transition-colors ${
                      location.pathname === '/my-bookings'
                        ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                        : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
                    }`}
                  >
                    {t('My Bookings', 'Reservasi Saya')}
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className={`px-3.5 py-3 text-xs uppercase tracking-wider font-sans font-semibold rounded-lg transition-colors ${
                      location.pathname.startsWith('/admin')
                        ? 'text-[#414930] dark:text-[#C5A059] bg-[#e8ece1] dark:bg-[#30312f]'
                        : 'text-[#46483f] dark:text-[#F7F5F2]/80 hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320]'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>

            {/* Drawer Bottom Footer Actions */}
            <div className="pt-5 border-t border-[#e8e6e1] dark:border-[#30312f] space-y-4">
              {/* Language & Theme Controls */}
              <div className="flex items-center justify-between px-1">
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 text-xs font-sans font-semibold tracking-wider rounded-md border border-[#e8e6e1] dark:border-[#30312f] text-[#46483f] dark:text-[#F7F5F2] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors flex items-center gap-1.5 bg-white/50 dark:bg-black/30"
                >
                  <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Language: {language}</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#46483f] dark:text-[#F7F5F2] transition-colors"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C5A059]" /> : <Moon className="w-4 h-4 text-[#414930]" />}
                </button>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSearch();
                }}
                className="w-full py-3 text-xs uppercase tracking-wider font-sans font-semibold bg-[#C5A059] text-[#1C1C19] rounded-lg hover:bg-[#b08d49] shadow-sm transition-all text-center flex items-center justify-center gap-2"
              >
                {t('Book Now', 'Pesan Sekarang')}
              </button>

              {user ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setAccountModalOpen(true);
                    }}
                    className="w-full px-3 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold text-[#46483f] dark:text-[#F7F5F2] hover:bg-[#f2ede9] dark:hover:bg-[#242320] border border-[#e8e6e1] dark:border-[#30312f] rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#C5A059]" />
                    <span>{t('My Account', 'Akun Saya')} ({user.firstName})</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-3 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold text-[#ba1a1a] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('Sign Out', 'Keluar')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 px-3 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold text-center text-[#46483f] dark:text-[#F7F5F2] border border-[#e8e6e1] dark:border-[#30312f] hover:bg-[#f2ede9] dark:hover:bg-[#242320] rounded-lg transition-colors"
                  >
                    {t('Sign In', 'Masuk')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 px-3 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold text-center text-white bg-[#414930] hover:bg-[#586146] rounded-lg transition-colors"
                  >
                    {t('Register', 'Daftar')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Account Profile Dialog */}
      <Dialog open={accountModalOpen} onOpenChange={setAccountModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#fbf9f6] dark:bg-[#1C1C19] border border-[#e8e6e1] dark:border-[#30312f] text-[#1c1b19] dark:text-[#F7F5F2] rounded-2xl p-6 shadow-2xl z-[300]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-medium text-[#1c1b19] dark:text-[#F7F5F2]">
              {t('My Account', 'Akun Saya')}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#827D75] dark:text-[#ded9d6] font-sans">
              {t('Manage your personal details and contact information', 'Kelola detail pribadi dan informasi kontak Anda')}
            </DialogDescription>
          </DialogHeader>

          {/* User Role Card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#242320] border border-[#e8e6e1] dark:border-[#30312f] mt-1">
            <div className="w-12 h-12 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] font-display font-semibold text-lg uppercase shrink-0">
              {(user?.firstName?.[0] || user?.email?.[0] || 'U')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-base text-[#1c1b19] dark:text-[#F7F5F2] truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] truncate">
                {user?.email}
              </p>
            </div>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-[#e8ece1] dark:bg-[#30312f] text-[#414930] dark:text-[#C5A059] border border-[#C5A059]/20">
              {user?.role}
            </span>
          </div>

          {/* Account Details List (Non-editable) */}
          <div className="mt-2 space-y-2.5 bg-white dark:bg-[#242320] rounded-xl border border-[#e8e6e1] dark:border-[#30312f] p-4 text-xs font-sans">
            <div className="flex items-center justify-between py-2 border-b border-[#e8e6e1] dark:border-[#30312f]">
              <span className="text-[#827D75] dark:text-[#ded9d6] uppercase tracking-wider font-semibold">
                {t('First Name', 'Nama Depan')}
              </span>
              <span className="font-medium text-sm text-[#1c1b19] dark:text-[#F7F5F2]">
                {user?.firstName || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#e8e6e1] dark:border-[#30312f]">
              <span className="text-[#827D75] dark:text-[#ded9d6] uppercase tracking-wider font-semibold">
                {t('Last Name', 'Nama Belakang')}
              </span>
              <span className="font-medium text-sm text-[#1c1b19] dark:text-[#F7F5F2]">
                {user?.lastName || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#e8e6e1] dark:border-[#30312f]">
              <span className="text-[#827D75] dark:text-[#ded9d6] uppercase tracking-wider font-semibold">
                {t('Email Address', 'Alamat Email')}
              </span>
              <span className="font-medium text-sm text-[#1c1b19] dark:text-[#F7F5F2]">
                {user?.email || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#e8e6e1] dark:border-[#30312f]">
              <span className="text-[#827D75] dark:text-[#ded9d6] uppercase tracking-wider font-semibold">
                {t('Phone Number', 'Nomor Telepon')}
              </span>
              <span className="font-medium text-sm text-[#1c1b19] dark:text-[#F7F5F2]">
                {user?.phone || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#827D75] dark:text-[#ded9d6] uppercase tracking-wider font-semibold">
                {t('Account Status', 'Status Akun')}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-xs text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                {t('Active', 'Aktif')}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
