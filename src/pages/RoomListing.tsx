import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { getRooms, getAvailableRooms, initializeData } from '@/lib/data';
import type { Room, RoomType, BedType } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RoomListing() {
  const [searchParams] = useSearchParams();
  const urlCheckIn = searchParams.get('checkIn') || '';
  const urlCheckOut = searchParams.get('checkOut') || '';
  const urlGuests = searchParams.get('guests') || '2';

  const [checkIn] = useState(urlCheckIn);
  const [checkOut] = useState(urlCheckOut);
  const [guests] = useState(urlGuests);
  const [sortBy, setSortBy] = useState('price-asc');
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<RoomType[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<BedType[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    initializeData();
  }, []);

  const rooms = useMemo(() => {
    let result: Room[];
    if (checkIn && checkOut) {
      result = getAvailableRooms(checkIn, checkOut, parseInt(guests) || 2);
    } else {
      result = getRooms();
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
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedBeds.length > 0 || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-warm-bg">
      <Header />

      {/* Search Summary */}
      <div className="pt-16 bg-warm-secondary border-b border-warm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            {(checkIn || checkOut) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-[#5c5a54] border border-warm-border">
                {checkIn && checkOut
                  ? `${new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : 'Select dates'}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-[#5c5a54] border border-warm-border">
              {guests} {parseInt(guests) === 1 ? 'Guest' : 'Guests'}
            </span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-sm text-[#5c5a54] border border-warm-border"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
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
            <div className="absolute inset-0 bg-black/30 lg:hidden" onClick={() => setShowFilters(false)} />
          )}
          <div className="relative w-72 lg:w-full bg-white lg:bg-transparent lg:border-r lg:border-warm-border p-5 lg:pr-6 overflow-y-auto">
            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-4 right-4 lg:hidden"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1a1917]">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-teal hover:underline">
                  Reset
                </button>
              )}
            </div>

            {/* Room Type */}
            <div className="mb-5">
              <h4 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-2.5">
                Room Type
              </h4>
              {(['standard', 'deluxe', 'suite'] as RoomType[]).map((type) => (
                <label key={type} className="flex items-center gap-2.5 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 rounded border-warm-border text-teal focus:ring-teal"
                  />
                  <span className="text-sm text-[#5c5a54] capitalize">{type}</span>
                </label>
              ))}
            </div>

            {/* Bed Type */}
            <div className="mb-5">
              <h4 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-2.5">
                Bed Type
              </h4>
              {(['king', 'queen', 'twin'] as BedType[]).map((bed) => (
                <label key={bed} className="flex items-center gap-2.5 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBeds.includes(bed)}
                    onChange={() => toggleBed(bed)}
                    className="w-4 h-4 rounded border-warm-border text-teal focus:ring-teal"
                  />
                  <span className="text-sm text-[#5c5a54] capitalize">{bed}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <h4 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-2.5">
                Price Range
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                />
                <span className="text-[#8a8984]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[#8a8984]">Showing {rooms.length} rooms</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-warm-border rounded-md text-sm text-[#5c5a54] bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-[#5c5a54] mb-2">No rooms match your criteria</p>
              <p className="text-sm text-[#8a8984] mb-4">Try adjusting your filters or dates</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-teal text-white rounded-md text-sm font-medium hover:bg-teal-dark transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex flex-col sm:flex-row bg-white border border-warm-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="sm:w-36 sm:min-w-[144px] md:w-44 md:min-w-[176px] aspect-[4/3] sm:aspect-auto sm:h-32 overflow-hidden">
                    <img
                      src={room.photos[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[#1a1917] mb-1">{room.name}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="px-2 py-0.5 bg-teal-light text-teal text-[11px] font-medium rounded-full capitalize">
                          {room.type}
                        </span>
                        <span className="px-2 py-0.5 bg-warm-secondary text-[#5c5a54] text-[11px] font-medium rounded-full">
                          {room.capacity} guests
                        </span>
                      </div>
                      <p className="text-sm text-[#8a8984] line-clamp-2">{room.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-semibold text-[#1a1917]">
                        ${room.pricePerNight}
                        <span className="text-xs font-normal text-[#8a8984]">/night</span>
                      </span>
                      <Link
                        to={`/rooms/${room.id}${checkIn ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : ''}`}
                        className="text-sm font-medium text-teal hover:underline"
                      >
                        View details
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
