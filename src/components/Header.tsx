import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function Header() {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage, t } = useThemeLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 -ml-2 text-[#1c1b19] dark:text-[#F7F5F2]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}images/stitch/waminna_emblem.png`}
            alt="Waminna Hotel Logo"
            className="h-9 w-auto object-contain transition-transform hover:scale-105"
          />
          <span className="font-display font-normal text-xl tracking-normal text-[#1c1b19] dark:text-[#F7F5F2] hidden sm:inline-block">
            Waminna Hotel
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
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
          {/* Language Selector */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 text-xs font-sans font-semibold tracking-wider rounded border border-[#e8e6e1] dark:border-[#30312f] text-[#46483f] dark:text-[#F7F5F2] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors flex items-center gap-1.5 bg-white/50 dark:bg-black/30"
            title="Switch Language (EN / ID)"
          >
            <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{language}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-[#46483f] dark:text-[#F7F5F2] hover:text-[#C5A059] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C5A059]" /> : <Moon className="w-4 h-4 text-[#414930]" />}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#46483f] dark:text-[#F7F5F2]/80 font-sans font-semibold">
                {user.firstName}
              </span>
              <button
                onClick={logout}
                className="text-xs uppercase tracking-wider text-[#827d75] hover:text-[#1c1b19] dark:hover:text-[#F7F5F2] transition-colors font-sans font-semibold"
              >
                {t('Sign Out', 'Keluar')}
              </button>
            </div>
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
            className="px-5 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold bg-[#C5A059] text-[#1C1C19] rounded hover:bg-[#b08d49] shadow-sm transition-all whitespace-nowrap"
          >
            {t('Book Now', 'Pesan Sekarang')}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#fbf9f6] dark:bg-[#1C1C19] text-[#1c1b19] dark:text-[#F7F5F2] z-50 shadow-2xl p-6 border-r border-[#e8e6e1] dark:border-[#30312f] flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#e8e6e1] dark:border-[#30312f]">
                <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                  <img
                    src={`${import.meta.env.BASE_URL}images/stitch/waminna_nobg.png`}
                    alt="Waminna Hotel Logo"
                    className="h-9 w-auto object-contain"
                  />
                  <span className="font-display font-normal text-lg text-[#1c1b19] dark:text-[#F7F5F2]">
                    Waminna Hotel
                  </span>
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
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full px-3 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold text-[#ba1a1a] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-center transition-colors"
                >
                  {t('Sign Out', 'Keluar')}
                </button>
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
        </div>
      )}
    </header>
  );
}
