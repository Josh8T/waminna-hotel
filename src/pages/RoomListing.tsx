import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { getRooms, getAvailableRooms, initializeData, getPhotoUrl, syncRoomsWithSupabase } from '@/lib/data';
import type { Room, RoomType, BedType } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function RoomListing() {
  const { t } = useThemeLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';

  const [sortBy, setSortBy] = useState('price-asc');
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<RoomType[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<BedType[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    initializeData();
    syncRoomsWithSupabase().then(() => {
      setRefreshKey((k) => k + 1);
    });
  }, []);

  const rooms = useMemo(() => {
    let result: Room[];
    if (checkIn && checkOut) {
      result = getAvailableRooms(checkIn, checkOut, guests ? parseInt(guests) : undefined);
    } else {
      result = getRooms();
      if (guests && parseInt(guests) > 0) {
        result = result.filter((r) => r.capacity >= parseInt(guests));
      }
    }

    // Apply filters
    if (selectedTypes.length > 0) {
      result = result.filter((r) => selectedTypes.includes(r.type));
    }
    if (selectedBeds.length > 0) {
      result = result.filter((r) => selectedBeds.includes(r.bedType));
    }
    if (minPrice) {
      result = result.filter((r) => r.pricePerNight >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter((r) => r.pricePerNight <= parseInt(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price-desc':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'capacity':
        result.sort((a, b) => b.capacity - a.capacity);
        break;
    }

    return result;
  }, [checkIn, checkOut, guests, selectedTypes, selectedBeds, minPrice, maxPrice, sortBy]);

  const toggleType = (type: RoomType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleBed = (bed: BedType) => {
    setSelectedBeds((prev) =>
      prev.includes(bed) ? prev.filter((b) => b !== bed) : [...prev, bed]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedBeds([]);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedBeds.length > 0 || minPrice || maxPrice || checkIn || checkOut || guests;

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] transition-colors">
      <Header />

      {/* Search Summary & Header Banner */}
      <div className="pt-20 pb-8 bg-[#f2ede9] dark:bg-[#242320] border-b border-[#e8e6e1] dark:border-[#30312f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#785927] dark:text-[#C5A059] font-sans">
            {t('Accommodation Catalog', 'Katalog Akomodasi')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-normal text-[#1c1b19] dark:text-[#F7F5F2] mt-1 mb-3">
            {t('Rooms & Sanctuary Suites', 'Kamar & Suite Suaka')}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {checkIn && checkOut && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-[#191816] rounded-full text-xs font-sans text-[#414930] dark:text-[#C5A059] border border-[#e8e6e1] dark:border-[#30312f]">
                {`${new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </span>
            )}
            {guests && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-[#191816] rounded-full text-xs font-sans text-[#414930] dark:text-[#C5A059] border border-[#e8e6e1] dark:border-[#30312f]">
                {guests} {parseInt(guests) === 1 ? t('Guest', 'Tamu') : t('Guests', 'Tamu')}
              </span>
            )}
            {(checkIn || checkOut || guests) && (
              <button
                onClick={() => setSearchParams({})}
                className="text-xs text-[#C5A059] hover:underline"
              >
                {t('Clear search', 'Hapus pencarian')}
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-[#242320] rounded-md text-xs font-sans text-[#414930] dark:text-[#C5A059] border border-[#e8e6e1] dark:border-[#30312f]"
            >
              <SlidersHorizontal className="w-4 h-4" /> {t('Filters', 'Filter')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-0">
        {/* Filters Sidebar */}
        <aside
          className={`${
            showFilters ? 'fixed inset-0 z-50 flex' : 'hidden'
          } lg:block lg:static lg:w-60 lg:min-w-[240px] lg:mr-6`}
        >
          {showFilters && (
            <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setShowFilters(false)} />
          )}
          <div className="relative w-72 lg:w-full bg-white dark:bg-[#242320] lg:bg-transparent lg:border-r lg:border-[#e8e6e1] dark:lg:border-[#30312f] p-5 lg:pr-6 overflow-y-auto">
            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-4 right-4 lg:hidden"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 text-[#1b1c1a] dark:text-[#F7F5F2]" />
              </button>
            )}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1a1917] dark:text-[#F7F5F2]">{t('Filters', 'Filter')}</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-[#C5A059] hover:underline">
                  {t('Reset', 'Atur Ulang')}
                </button>
              )}
            </div>

            {/* Room Type */}
            <div className="mb-5">
              <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-2.5 font-sans">
                {t('Room Type', 'Tipe Kamar')}
              </h4>
              {(['standard', 'deluxe', 'suite'] as RoomType[]).map((type) => (
                <label key={type} className="flex items-center gap-2.5 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 rounded border-[#e8e6e1] dark:border-[#30312f] text-[#414930] dark:text-[#C5A059] focus:ring-[#C5A059]"
                  />
                  <span className="text-sm text-[#46483f] dark:text-[#ded9d6] capitalize">{type}</span>
                </label>
              ))}
            </div>

            {/* Bed Type */}
            <div className="mb-5">
              <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-2.5 font-sans">
                {t('Bed Type', 'Tipe Tempat Tidur')}
              </h4>
              {(['king', 'queen', 'twin'] as BedType[]).map((bed) => (
                <label key={bed} className="flex items-center gap-2.5 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBeds.includes(bed)}
                    onChange={() => toggleBed(bed)}
                    className="w-4 h-4 rounded border-[#e8e6e1] dark:border-[#30312f] text-[#414930] dark:text-[#C5A059] focus:ring-[#C5A059]"
                  />
                  <span className="text-sm text-[#46483f] dark:text-[#ded9d6] capitalize">{bed}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#827D75] dark:text-[#ded9d6] mb-2.5 font-sans">
                {t('Price Range', 'Rentang Harga')}
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] rounded-md text-sm text-[#1c1b19] dark:text-[#F7F5F2] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
                <span className="text-[#827D75]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] rounded-md text-sm text-[#1c1b19] dark:text-[#F7F5F2] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[#827D75] dark:text-[#ded9d6]">
              {t(`Showing ${rooms.length} rooms`, `Menampilkan ${rooms.length} kamar`)}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-[#e8e6e1] dark:border-[#30312f] rounded-md text-sm text-[#46483f] dark:text-[#F7F5F2] bg-white dark:bg-[#242320] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
            >
              <option value="price-asc">{t('Price: Low to High', 'Harga: Rendah ke Tinggi')}</option>
              <option value="price-desc">{t('Price: High to Low', 'Harga: Tinggi ke Rendah')}</option>
              <option value="capacity">{t('Capacity', 'Kapasitas')}</option>
            </select>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#242320] rounded-xl border border-[#e8e6e1] dark:border-[#30312f]">
              <p className="text-lg text-[#1c1b19] dark:text-[#F7F5F2] mb-2">{t('No rooms match your criteria', 'Tidak ada kamar yang sesuai kriteria Anda')}</p>
              <p className="text-sm text-[#827D75] dark:text-[#ded9d6] mb-4">{t('Try adjusting your filters or dates', 'Coba sesuaikan filter atau tanggal Anda')}</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#C5A059] text-[#1C1C19] rounded-md text-sm font-medium hover:bg-[#b08d49] transition-colors"
              >
                {t('Clear Filters', 'Hapus Filter')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex flex-col sm:flex-row bg-white dark:bg-[#242320] border border-[#e8e6e1] dark:border-[#30312f] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="sm:w-44 sm:min-w-[176px] aspect-[4/3] sm:aspect-auto sm:h-36 overflow-hidden">
                    <img
                      src={getPhotoUrl(room.photos?.[0])}
                      alt={room.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getPhotoUrl('images/rooms/standard/standard.png');
                      }}
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[#1c1b19] dark:text-[#F7F5F2] mb-1 font-display">{room.name}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="px-2 py-0.5 bg-[#e8ece1] dark:bg-[#30312f] text-[#414930] dark:text-[#C5A059] text-[11px] font-sans font-semibold rounded-full capitalize">
                          {room.type}
                        </span>
                        <span className="px-2 py-0.5 bg-[#f5f3f0] dark:bg-[#191816] text-[#46483f] dark:text-[#ded9d6] text-[11px] font-sans font-medium rounded-full">
                          {room.capacity} {t('guests', 'tamu')}
                        </span>
                      </div>
                      <p className="text-sm text-[#827D75] dark:text-[#ded9d6] line-clamp-2">{room.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 border-t border-[#e8e6e1]/50 dark:border-[#30312f] pt-2">
                      <span className="text-base font-sans font-bold text-[#414930] dark:text-[#C5A059]">
                        ${room.pricePerNight}
                        <span className="text-xs font-sans font-normal text-[#827D75] dark:text-white/60"> / {t('night', 'malam')}</span>
                      </span>
                      <Link
                        to={`/rooms/${room.id}${checkIn ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : ''}`}
                        className="text-xs font-sans font-semibold uppercase tracking-wider text-[#C5A059] hover:underline"
                      >
                        {t('View Details', 'Lihat Detail')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
