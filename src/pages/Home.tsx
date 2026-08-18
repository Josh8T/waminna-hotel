import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wifi, Car, Coffee, Waves, ArrowRight, Calendar, Users } from 'lucide-react';
import { initializeData } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

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
  const navigate = useNavigate();
  const { t } = useThemeLanguage();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeData();

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
    navigate(`/rooms?${params.toString()}`);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  return (
    <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] transition-colors">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-16 px-4 md:px-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/stitch/hero_twilight.jpg`}
            alt="Waminna Hotel Twilight Exterior"
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C19]/90 via-[#1C1C19]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-start gap-6 text-white">
          <h1 className="font-display text-4xl sm:text-6xl text-[#F7F5F2] max-w-[800px] font-normal leading-tight drop-shadow-sm">
            {t('Experience Urban Tranquility', 'Rasakan Ketenangan Perkotaan')}
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#F7F5F2]/90 max-w-[520px] font-light leading-relaxed">
            {t(
              'A boutique sanctuary in the heart of Batam. Where city chic sophistication meets affordable luxury.',
              'Suaka butik di pusat kota Batam. Tempat di mana kemewahan kota bertemu dengan kenyamanan elegan.'
            )}
          </p>

          {/* Floating Availability Search Bar */}
          <div id="search-bar" ref={searchRef} className="w-full max-w-[900px] bg-[#F7F5F2] dark:bg-[#242320] rounded-lg p-2.5 mt-4 flex flex-col md:flex-row items-center gap-3 border border-[#827D75]/20 dark:border-[#30312f] shadow-[0_8px_30px_rgb(0,0,0,0.15)] text-[#1C1C19] dark:text-[#F7F5F2]">
            <div className="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-[#827D75]/20 dark:border-[#30312f]">
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#46483F] dark:text-[#ded9d6] mb-1 font-sans">
                {t('Check In', 'Tanggal Masuk')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827D75] dark:text-[#C5A059]" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={tomorrow.toISOString().split('T')[0]}
                  className="w-full pl-6 bg-transparent border-none p-0 focus:ring-0 text-sm font-sans text-[#1C1C19] dark:text-[#F7F5F2]"
                />
              </div>
            </div>

            <div className="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-[#827D75]/20 dark:border-[#30312f]">
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#46483F] dark:text-[#ded9d6] mb-1 font-sans">
                {t('Check Out', 'Tanggal Keluar')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827D75] dark:text-[#C5A059]" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || dayAfter.toISOString().split('T')[0]}
                  className="w-full pl-6 bg-transparent border-none p-0 focus:ring-0 text-sm font-sans text-[#1C1C19] dark:text-[#F7F5F2]"
                />
              </div>
            </div>

            <div className="flex-1 w-full px-4 py-2">
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#46483F] dark:text-[#ded9d6] mb-1 font-sans">
                {t('Guests', 'Tamu')}
              </label>
              <div className="relative">
                <Users className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827D75] dark:text-[#C5A059]" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-6 bg-transparent border-none p-0 focus:ring-0 text-sm font-sans text-[#1C1C19] dark:text-[#F7F5F2] cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n} className="dark:bg-[#242320]">
                      {n} {n === 1 ? t('Guest', 'Tamu') : t('Guests', 'Tamu')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-3.5 bg-[#C5A059] hover:bg-[#b08d49] text-[#1C1C19] font-medium text-xs uppercase tracking-wider rounded transition-all whitespace-nowrap shadow-sm flex items-center justify-center gap-2"
            >
              {t('Check Availability', 'Cek Ketersediaan')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Accommodations (Bento Grid) */}
      <section className="py-20 px-4 md:px-12 max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#827D75]/20 dark:border-[#30312f] pb-6 reveal">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1C1C19] dark:text-[#F7F5F2] mb-2 font-normal">
              {t('Curated Spaces', 'Ruang Pilihan')}
            </h2>
            <p className="font-sans text-sm text-[#46483F] dark:text-[#ded9d6]">
              {t(
                'Thoughtfully designed rooms offering sweeping views of the Batam skyline.',
                'Kamar berdesain indah dengan pemandangan cakrawala kota Batam.'
              )}
            </p>
          </div>
          <Link
            to="/rooms"
            className="font-sans text-xs font-semibold tracking-widest uppercase text-[#775a19] dark:text-[#C5A059] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5"
          >
            {t('View All Rooms', 'Lihat Semua Kamar')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
          {/* Large Feature Card - Skyline Suite (ID: 5) */}
          <Link
            to="/rooms/5"
            className="md:col-span-8 row-span-2 group relative rounded-xl overflow-hidden border border-[#827D75]/20 dark:border-[#30312f] shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-[#242320]"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/stitch/skyline_suite.jpg`}
              alt="The Skyline Suite"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C19]/90 via-[#1C1C19]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded text-[#F7F5F2] font-sans font-semibold text-[10px] uppercase tracking-widest mb-3 border border-white/20">
                  {t('Signature', 'Utama')}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-[#F7F5F2] mb-2 font-normal">
                  The Skyline Suite
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#F7F5F2]/80 max-w-md leading-relaxed">
                  {t(
                    'Our premier offering with panoramic corner views, a dedicated living area, and premium amenities tailored for the modern traveler.',
                    'Suite unggulan kami dengan pemandangan sudut panorama, ruang keluarga khusus, dan fasilitas premium.'
                  )}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="block font-sans text-[10px] text-[#F7F5F2]/70 uppercase tracking-widest mb-1">{t('From', 'Mulai')}</span>
                <span className="font-sans text-2xl font-bold text-[#C5A059]">$199</span>
                <span className="font-sans text-xs text-[#F7F5F2]/70"> / {t('night', 'malam')}</span>
              </div>
            </div>
          </Link>

          {/* Small Feature Card 1 - Executive Deluxe (ID: 3) */}
          <Link
            to="/rooms/3"
            className="md:col-span-4 row-span-1 group relative rounded-xl overflow-hidden border border-[#827D75]/20 dark:border-[#30312f] shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-[#242320]"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/stitch/urban_deluxe.jpg`}
              alt="Executive Deluxe"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C19]/85 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="font-display text-lg text-[#F7F5F2] mb-1 font-normal">
                Executive Deluxe
              </h3>
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs text-[#F7F5F2]/80">{t('City View', 'Pemandangan Kota')}</span>
                <span className="font-sans text-lg font-bold text-[#C5A059]">
                  $129<span className="text-xs font-sans text-[#F7F5F2]/70"> / {t('nt', 'mlm')}</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Small Feature Card 2 - Penthouse Suite (ID: 6) */}
          <Link
            to="/rooms/6"
            className="md:col-span-4 row-span-1 group relative rounded-xl overflow-hidden border border-[#827D75]/20 dark:border-[#30312f] shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-[#242320]"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/stitch/executive_studio.jpg`}
              alt="Penthouse Suite"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C19]/85 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="font-display text-lg text-[#F7F5F2] mb-1 font-normal">
                Penthouse Suite
              </h3>
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs text-[#F7F5F2]/80">{t('Panoramic Views', 'Pemandangan Panorama')}</span>
                <span className="font-sans text-lg font-bold text-[#C5A059]">
                  $249<span className="text-xs font-sans text-[#F7F5F2]/70"> / {t('nt', 'mlm')}</span>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Guest Review Section (Minimalist Quotes) */}
      <section className="py-20 px-4 md:px-12 bg-[#f5f3f0] dark:bg-[#242320] border-y border-[#827D75]/10 dark:border-[#30312f]">
        <div className="max-w-[800px] mx-auto text-center reveal">
          <span className="block font-serif text-5xl text-[#C5A059] mb-4 opacity-80 leading-none">
            “
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-[#1C1C19] dark:text-[#F7F5F2] mb-8 italic font-normal leading-relaxed">
            {t(
              '"A true sanctuary amidst the bustle of Batam. The attention to detail in the design, combined with the spectacular city views, made it feel incredibly premium yet wonderfully accessible."',
              '"Tempat perlindungan sejati di tengah keramaian Batam. Perhatian terhadap detail desain dan pemandangan kota yang spektakuler membuatnya terasa sangat istimewa."'
            )}
          </h2>
          <div className="flex flex-col items-center gap-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#46483F] dark:text-[#ded9d6]">
              Sarah Jenkins
            </span>
            <span className="font-sans text-xs text-[#827D75] dark:text-white/60">
              {t('Business Traveler, Singapore', 'Wisatawan Bisnis, Singapura')}
            </span>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 px-4 md:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#775a19] dark:text-[#C5A059] font-sans">
            {t('Hotel Experiences', 'Pengalaman Hotel')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#1C1C19] dark:text-[#F7F5F2] mt-2">
            {t('Tailored Amenities for Modern Stays', 'Fasilitas Terbaik Untuk Masa Menginap Anda')}
          </h2>
        </div>
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Wifi, label: t('High-Speed Wi-Fi', 'Wi-Fi Cepat'), desc: t('Complimentary fiber optic', 'Serat optik gratis') },
            { icon: Car, label: t('Valet Parking', 'Layanan Valet'), desc: t('Secure subterranean parking', 'Parkir bawah tanah aman') },
            { icon: Coffee, label: t('Artisanal Breakfast', 'Sarapan Spesial'), desc: t('Fresh local & continental', 'Lokal & kontinental segar') },
            { icon: Waves, label: t('Skyline Pool & Spa', 'Kolam & Spa Skyline'), desc: t('Overlooking the city horizon', 'Pemandangan cakrawala kota') },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="text-center p-6 rounded-xl bg-white dark:bg-[#242320] border border-[#827D75]/20 dark:border-[#30312f] shadow-xs hover:border-[#C5A059]/40 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#f5f3f0] dark:bg-[#30312f]">
                <Icon className="w-6 h-6 text-[#161d08] dark:text-[#C5A059]" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-[#1C1C19] dark:text-[#F7F5F2] font-sans">{label}</p>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1 font-sans">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
