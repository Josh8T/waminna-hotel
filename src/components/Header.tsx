import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, logout, hasRole } = useAuth();
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
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 -ml-2 text-[#1a1917]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}images/logo/waminna_logo.png`} alt="Waminna Hotel Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            to="/rooms"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname === '/rooms'
                ? 'text-brand bg-brand-light'
                : 'text-[#5c5a54] hover:text-[#1a1917] hover:bg-warm-secondary'
            }`}
          >
            Rooms
          </Link>
          <Link
            to="/contact"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname === '/contact'
                ? 'text-brand bg-brand-light'
                : 'text-[#5c5a54] hover:text-[#1a1917] hover:bg-warm-secondary'
            }`}
          >
            Contact
          </Link>
          <Link
            to="/faq"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname === '/faq'
                ? 'text-brand bg-brand-light'
                : 'text-[#5c5a54] hover:text-[#1a1917] hover:bg-warm-secondary'
            }`}
          >
            FAQ
          </Link>
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/my-bookings'
                    ? 'text-brand bg-brand-light'
                    : 'text-[#5c5a54] hover:text-[#1a1917] hover:bg-warm-secondary'
                }`}
              >
                My Bookings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'text-brand bg-brand-light'
                      : 'text-[#5c5a54] hover:text-[#1a1917] hover:bg-warm-secondary'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </>
          ) : null}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-[#5c5a54]">
                {user.firstName}
              </span>
              <button
                onClick={logout}
                className="text-sm text-[#8a8984] hover:text-[#1a1917] transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-[#5c5a54] hover:text-[#1a1917] transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
          <button
            onClick={scrollToSearch}
            className="px-4 py-2 text-sm font-medium bg-brand text-white rounded-md hover:bg-brand-dark transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-xl p-6">
            <button
              className="absolute top-4 right-4 p-2 text-[#5c5a54]"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <div className="mt-12 flex flex-col gap-2">
              <Link to="/" className="px-3 py-2.5 text-sm font-medium text-[#1a1917] hover:bg-warm-secondary rounded-md">
                Home
              </Link>
              <Link to="/rooms" className="px-3 py-2.5 text-sm font-medium text-[#1a1917] hover:bg-warm-secondary rounded-md">
                Rooms
              </Link>
              <Link to="/contact" className="px-3 py-2.5 text-sm font-medium text-[#1a1917] hover:bg-warm-secondary rounded-md">
                Contact
              </Link>
              <Link to="/faq" className="px-3 py-2.5 text-sm font-medium text-[#1a1917] hover:bg-warm-secondary rounded-md">
                FAQ
              </Link>
              {user && (
                <Link to="/my-bookings" className="px-3 py-2.5 text-sm font-medium text-[#1a1917] hover:bg-warm-secondary rounded-md">
                  My Bookings
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="px-3 py-2.5 text-sm font-medium text-[#1a1917] hover:bg-warm-secondary rounded-md">
                  Dashboard
                </Link>
              )}
              <hr className="border-warm-border my-2" />
              {user ? (
                <button onClick={logout} className="px-3 py-2.5 text-sm font-medium text-[#dc2626] hover:bg-red-50 rounded-md text-left">
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2.5 text-sm font-medium text-[#1a1917] hover:bg-warm-secondary rounded-md">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-3 py-2.5 text-sm font-medium text-brand hover:bg-brand-light rounded-md">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
