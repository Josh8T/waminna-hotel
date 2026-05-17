import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Wifi, Car, Coffee, Waves, ArrowRight, Calendar, Users } from 'lucide-react';
import { getRooms, initializeData } from '@/lib/data';
import type { Room } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  useReveal();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeData();
    const allRooms = getRooms();
    setRooms(allRooms.slice(0, 3));

    const params = new URLSearchParams(window.location.search);
    if (params.get('scrollToSearch') && searchRef.current) {
      setTimeout(() => searchRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', guests);
    window.location.href = `/rooms?${params.toString()}`;
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  return (
    <div className="min-h-screen bg-warm-bg">
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] max-h-[700px] flex items-center justify-center overflow-hidden">
        <img
          src="/images/hero-bg.jpg"
          alt="Charles's Stay boutique hotel exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,25,23,0.6)] via-[rgba(26,25,23,0.2)] to-[rgba(26,25,23,0.1)]" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 tracking-tight">
            Your Home Away From Home
          </h1>
          <p className="text-lg text-white/85 mb-8 max-w-md mx-auto">
            Experience warm hospitality in the heart of the city
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/rooms"
              className="px-5 py-2.5 border border-white text-white rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Browse Rooms
            </Link>
            <button
              onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 bg-teal text-white rounded-md text-sm font-medium hover:bg-teal-dark transition-colors"
            >
              Check Availability
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-pulse-soft">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* Search Bar */}
      <section id="search-bar" ref={searchRef} className="relative z-20 -mt-6 px-4">
        <div className="max-w-[900px] mx-auto bg-white rounded-xl shadow-lg p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1.5">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8984]" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={tomorrow.toISOString().split('T')[0]}
                  className="w-full pl-9 pr-3 py-2.5 border border-warm-border rounded-md text-sm text-[#1a1917] focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1.5">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8984]" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || dayAfter.toISOString().split('T')[0]}
                  className="w-full pl-9 pr-3 py-2.5 border border-warm-border rounded-md text-sm text-[#1a1917] focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1.5">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8984]" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-warm-border rounded-md text-sm text-[#1a1917] focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal appearance-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full py-2.5 bg-teal text-white rounded-md text-sm font-medium hover:bg-teal-dark transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 reveal">
            <span className="text-[11px] font-medium tracking-widest uppercase text-teal">
              Our Rooms
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a1917] mt-2">
              Handpicked for Your Comfort
            </h2>
          </div>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border border-warm-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={room.photos[0]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#1a1917] mb-1">{room.name}</h3>
                  <p className="text-sm text-[#8a8984] line-clamp-2 mb-3">{room.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1a1917]">
                      ${room.pricePerNight}
                      <span className="text-xs font-normal text-[#8a8984]">/night</span>
                    </span>
                    <Link
                      to={`/rooms/${room.id}`}
                      className="text-sm font-medium text-teal hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline"
            >
              View All Rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 sm:py-20 px-4 bg-warm-secondary">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 reveal">
            <span className="text-[11px] font-medium tracking-widest uppercase text-teal">
              Amenities
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a1917] mt-2">
              Everything You Need
            </h2>
          </div>
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Wifi, label: 'Free Wi-Fi', desc: 'High-speed internet throughout' },
              { icon: Car, label: 'Free Parking', desc: 'Secure on-site parking' },
              { icon: Coffee, label: 'Breakfast Included', desc: 'Fresh breakfast every morning' },
              { icon: Waves, label: 'Swimming Pool', desc: 'Relax in our outdoor pool' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-teal" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-[#1a1917]">{label}</p>
                <p className="text-xs text-[#8a8984] mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
