import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Search,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Clock,
  CreditCard,
  Wifi,
  Car,
  Ban,
  Phone,
  Bed,
  MapPin,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function FAQ() {
  const { t } = useThemeLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ 'q-1': true, 'q-8': true });

  const QUICK_FACTS = [
    { label: t('Check-in', 'Waktu Masuk'), value: t('From 2:00 PM', 'Mulai 14:00 WIB'), icon: Clock },
    { label: t('Check-out', 'Waktu Keluar'), value: t('By 12:00 noon', 'Maksimal 12:00 WIB'), icon: Clock },
    { label: t('Reception Desk', 'Meja Resepsionis'), value: t('Open 24 Hours', 'Buka 24 Jam'), icon: Phone },
    { label: t('Wi-Fi', 'Internet Wi-Fi'), value: t('Complimentary', 'Gratis di seluruh area'), icon: Wifi },
    { label: t('Parking', 'Parkir Kendaraan'), value: t('Complimentary (on availability)', 'Gratis (tergantung ketersediaan)'), icon: Car },
    { label: t('Smoking Policy', 'Kebijakan Merokok'), value: t('100% Non-smoking rooms', '100% Bebas asap rokok'), icon: Ban },
    { label: t('Pets Policy', 'Hewan Peliharaan'), value: t('Not permitted', 'Dilarang masuk'), icon: Ban },
    { label: t('Security Deposit', 'Deposit Jaminan'), value: t('IDR 100,000 (refundable)', 'IDR 100.000 (dapat dikembalikan)'), icon: ShieldCheck },
  ];

  const FAQ_ITEMS = [
    // 1. Reservations and Payment
    {
      id: 'q-1',
      category: 'booking',
      question: t('How can I book a room?', 'Bagaimana cara memesan kamar?'),
      answer: t(
        'Guests can book directly through the Waminna Hotel website. Full payment is required when making a reservation.',
        'Tamu dapat memesan langsung melalui situs web Waminna Hotel. Pembayaran penuh diperlukan saat membuat reservasi.'
      ),
    },
    {
      id: 'q-2',
      category: 'booking',
      question: t('Which payment methods are accepted?', 'Metode pembayaran apa saja yang diterima?'),
      answer: t(
        'We accept cash, credit and debit cards, and bank transfers. All prices and payments are processed in Indonesian Rupiah (IDR).',
        'Kami menerima tunai, kartu kredit dan debit, serta transfer bank. Semua harga dan pembayaran diproses dalam Rupiah (IDR).'
      ),
    },
    {
      id: 'q-3',
      category: 'booking',
      question: t('Are taxes and service charges included in the room rates?', 'Apakah pajak dan biaya layanan sudah termasuk dalam harga kamar?'),
      answer: t(
        'Yes. All applicable government taxes and service charges are already included in the room price displayed on our website.',
        'Ya. Semua pajak pemerintah dan biaya layanan yang berlaku sudah termasuk dalam harga kamar yang ditampilkan di situs web kami.'
      ),
    },
    {
      id: 'q-4',
      category: 'booking',
      question: t('Will I receive a booking confirmation?', 'Apakah saya akan menerima konfirmasi reservasi?'),
      answer: t(
        'Yes. After payment is completed, a confirmation email will be sent automatically from reservations@waminnahotel.com. Please note this is an automated email address. For booking assistance, contact info@waminnahotel.com or WhatsApp +62 822-2789-1010.',
        'Ya. Setelah pembayaran selesai, email konfirmasi akan dikirim secara otomatis dari reservations@waminnahotel.com. Harap dicatat bahwa ini adalah email otomatis. Untuk bantuan, hubungi info@waminnahotel.com atau WhatsApp +62 822-2789-1010.'
      ),
    },
    {
      id: 'q-5',
      category: 'booking',
      question: t('Can I cancel my reservation or request a refund?', 'Dapatkah saya membatalkan reservasi atau meminta pengembalian dana?'),
      answer: t(
        'All confirmed bookings are strictly non-cancellable and non-refundable. A guest who does not arrive will be considered a no-show, and the full booking payment will be forfeited.',
        'Semua reservasi yang dikonfirmasi bersifat non-cancellable dan non-refundable (tidak dapat dibatalkan dan tidak dapat dikembalikan). Tamu yang tidak hadir dianggap no-show dan seluruh biaya pembayaran hangus.'
      ),
    },
    {
      id: 'q-6',
      category: 'booking',
      question: t('Can I change my stay dates?', 'Dapatkah saya mengubah tanggal menginap?'),
      answer: t(
        'Date changes are subject to room availability and require prior hotel approval. Please contact our reception desk directly to request a date adjustment.',
        'Perubahan tanggal bergantung pada ketersediaan kamar dan memerlukan persetujuan hotel sebelumnya. Silakan hubungi meja resepsionis kami untuk mengajukan perubahan tanggal.'
      ),
    },

    // 2. Check-in and Check-out
    {
      id: 'q-8',
      category: 'checkin',
      question: t('What time is check-in and check-out?', 'Pukul berapa waktu check-in dan check-out?'),
      answer: t(
        'Check-in begins at 2:00 PM, and check-out is by 12:00 noon.',
        'Check-in dimulai pukul 14:00 WIB, dan check-out paling lambat pukul 12:00 WIB siang.'
      ),
    },
    {
      id: 'q-9',
      category: 'checkin',
      question: t('Can I request early check-in or late check-out?', 'Dapatkah saya meminta check-in lebih awal atau check-out terlambat?'),
      answer: t(
        'Yes. Contact the hotel in advance or upon arrival. Requests are subject to room availability on the day and may incur an applicable additional fee.',
        'Ya. Hubungi hotel sebelumnya atau saat kedatangan. Permintaan bergantung pada ketersediaan kamar pada hari tersebut dan dapat dikenakan biaya tambahan.'
      ),
    },
    {
      id: 'q-10',
      category: 'checkin',
      question: t('What identification is required at check-in?', 'Identitas apa yang diperlukan saat check-in?'),
      answer: t(
        'International guests must present a valid passport. Indonesian guests must present a valid KTP or another accepted government-issued photo identity document.',
        'Tamu internasional wajib menunjukkan paspor yang masih berlaku. Tamu warga negara Indonesia wajib menunjukkan KTP atau dokumen identitas resmi berfoto lainnya.'
      ),
    },
    {
      id: 'q-11',
      category: 'checkin',
      question: t('What is the minimum age for check-in?', 'Berapa usia minimum untuk check-in?'),
      answer: t(
        'Guests must be at least 18 years of age or accompanied by an adult guardian to register and check in independently.',
        'Tamu harus berusia minimal 18 tahun atau didampingi oleh orang dewasa untuk dapat mendaftar dan check-in mandiri.'
      ),
    },
    {
      id: 'q-12',
      category: 'checkin',
      question: t('Is reception open 24 hours, and which languages are spoken?', 'Apakah resepsionis buka 24 jam, dan bahasa apa yang digunakan?'),
      answer: t(
        'Yes. The reception desk is available 24 hours a day. Our front desk team assists guests in both English and Indonesian.',
        'Ya. Meja resepsionis buka 24 jam setiap hari. Tim kami dapat melayani tamu dalam bahasa Inggris dan bahasa Indonesia.'
      ),
    },
    {
      id: 'q-13',
      category: 'checkin',
      question: t('Can the hotel store my luggage before check-in or after check-out?', 'Dapatkah hotel menyimpan bagasi saya sebelum check-in atau setelah check-out?'),
      answer: t(
        'Yes. Complimentary luggage storage is available at the front reception desk before check-in and after check-out.',
        'Ya. Penitipan bagasi gratis tersedia di meja resepsionis sebelum check-in dan setelah check-out.'
      ),
    },

    // 3. Rooms and Occupancy
    {
      id: 'q-14',
      category: 'rooms',
      question: t('What room types and standard occupancies are available?', 'Tipe kamar apa saja yang tersedia dan berapa kapasitasnya?'),
      answer: t(
        'Waminna Hotel offers: Deluxe Double (2 guests), Deluxe Twin (2 guests), Deluxe Triple (3 guests), Family Loft (4 guests), and Signature Suite (up to 3 guests with sofa bed). Daily housekeeping is provided for all occupied rooms.',
        'Waminna Hotel menawarkan: Deluxe Double (2 tamu), Deluxe Twin (2 tamu), Deluxe Triple (3 tamu), Family Loft (4 tamu), dan Signature Suite (hingga 3 tamu dengan sofa bed). Layanan kebersihan harian disediakan untuk kamar yang terisi.'
      ),
    },
    {
      id: 'q-15',
      category: 'rooms',
      question: t('Are extra beds available and what is the fee?', 'Apakah tempat tidur tambahan tersedia dan berapa biayanya?'),
      answer: t(
        'Yes. Extra rollaway beds are available for IDR 150,000 per bed, per night, subject to room layout and space suitability.',
        'Ya. Kasur tambahan tersedia dengan biaya IDR 150.000 per kasur per malam, bergantung pada kesesuaian ruang dan tipe kamar.'
      ),
    },
    {
      id: 'q-16',
      category: 'rooms',
      question: t('What amenities are provided in the rooms?', 'Fasilitas apa saja yang disediakan di dalam kamar?'),
      answer: t(
        'All guest rooms feature air conditioning, flat-screen television, electric kettle, complimentary bottled mineral water, quality toiletries, hair dryer, and an in-room digital safe.',
        'Semua kamar tamu dilengkapi pendingin ruangan (AC), TV layar datar, teko listrik, air mineral kemasan gratis, perlengkapan mandi, pengering rambut (hair dryer), dan brankas digital.'
      ),
    },
    {
      id: 'q-17',
      category: 'rooms',
      question: t('Are children welcome and what is the policy?', 'Apakah anak-anak diperbolehkan dan bagaimana kebijakannya?'),
      answer: t(
        'Yes. Children aged 8 years and under stay free when using existing bedding. Children count toward the room\'s maximum permitted guest occupancy.',
        'Ya. Anak-anak berusia 8 tahun ke bawah menginap gratis jika menggunakan tempat tidur yang sudah ada. Anak tetap dihitung dalam kapasitas maksimum kamar.'
      ),
    },
    {
      id: 'q-18',
      category: 'rooms',
      question: t('Does the hotel have a lift (elevator) and is it wheelchair accessible?', 'Apakah hotel memiliki lift dan apakah ramah kursi roda?'),
      answer: t(
        'The hotel has a passenger lift providing access to all guest-room floors. While the elevator serves all floors, the hotel does not currently offer dedicated specialized wheelchair-accessible rooms or guaranteed step-free access throughout.',
        'Hotel memiliki lift penumpang yang melayani semua lantai kamar tamu. Meskipun ada lift, saat ini hotel belum menyediakan kamar khusus difabel atau akses bebas tangga secara menyeluruh.'
      ),
    },

    // 4. Hotel Policies
    {
      id: 'q-19',
      category: 'policies',
      question: t('Is smoking permitted in the rooms?', 'Apakah diperbolehkan merokok di dalam kamar?'),
      answer: t(
        'No. All guest rooms and indoor public areas are strictly 100% non-smoking. Smoking inside a room will incur a specialized room-deodorizing cleaning charge of IDR 1,000,000.',
        'Tidak. Seluruh kamar tamu dan area publik dalam ruangan adalah 100% bebas rokok. Merokok di dalam kamar akan dikenakan denda pembersihan khusus sebesar IDR 1.000.000.'
      ),
    },
    {
      id: 'q-20',
      category: 'policies',
      question: t('Are pets allowed?', 'Apakah hewan peliharaan diperbolehkan?'),
      answer: t(
        'No. Pets of any kind are strictly not permitted on hotel grounds.',
        'Tidak. Hewan peliharaan dilarang keras berada di area hotel.'
      ),
    },
    {
      id: 'q-21',
      category: 'policies',
      question: t('Is a security deposit required upon arrival?', 'Apakah deposit jaminan diperlukan saat kedatangan?'),
      answer: t(
        'Yes. A refundable incidental security deposit of IDR 100,000 is collected at check-in. It will be returned in full upon check-out, provided there is no damage, missing inventory, or outstanding charges. Guests are responsible for full repair or replacement costs exceeding the deposit amount.',
        'Ya. Deposit jaminan insidental sebesar IDR 100.000 dikumpulkan saat check-in dan akan dikembalikan saat check-out jika tidak ada kerusakan atau tagihan tertunggak. Tamu bertanggung jawab penuh atas biaya perbaikan jika terjadi kerusakan melebihi deposit.'
      ),
    },

    // 5. Facilities & Services
    {
      id: 'q-22',
      category: 'facilities',
      question: t('Is Wi-Fi and parking free?', 'Apakah Wi-Fi dan parkir gratis?'),
      answer: t(
        'Yes. Complimentary Wi-Fi is available across all guest rooms and public areas. Complimentary parking is also provided on-site, subject to space availability on arrival (spaces cannot be pre-reserved).',
        'Ya. Wi-Fi gratis tersedia di semua kamar dan area umum. Parkir gratis juga tersedia di lokasi tergantung ketersediaan saat tiba (tempat tidak dapat dipesan sebelumnya).'
      ),
    },
    {
      id: 'q-23',
      category: 'facilities',
      question: t('Does the hotel provide room service, laundry, or have a cafe?', 'Apakah hotel menyediakan room service, laundry, atau memiliki kafe?'),
      answer: t(
        'Room service, laundry, and dry-cleaning services are not currently offered. The hotel does not have dedicated meeting rooms. Our first-floor cafe is currently preparing for its upcoming opening.',
        'Layanan kamar (room service), laundry, dan dry-cleaning saat ini belum tersedia. Hotel juga belum memiliki ruang rapat. Kafe di lantai 1 saat ini sedang dalam persiapan pembukaan.'
      ),
    },

    // 6. Transportation & Exploring Batam
    {
      id: 'q-24',
      category: 'travel',
      question: t('Does the hotel provide airport or ferry terminal transfers?', 'Apakah hotel menyediakan antar-jemput bandara atau terminal feri?'),
      answer: t(
        'Dedicated airport and ferry terminal transfers are not currently available. However, our 24-hour reception desk can gladly help arrange reputable local taxis or transport services (fares paid by guest).',
        'Layanan antar-jemput khusus bandara dan terminal feri saat ini belum tersedia. Namun, resepsionis 24 jam kami siap membantu memanggilkan taksi lokal resmi (biaya ditanggung tamu).'
      ),
    },
    {
      id: 'q-25',
      category: 'travel',
      question: t('Where can international travelers check ferry and immigration guidelines?', 'Di mana wisatawan internasional dapat memeriksa jadwal feri dan imigrasi?'),
      answer: t(
        'Ferry schedules, visa requirements, and immigration regulations can change. We recommend checking directly with official ferry operators (BatamFast, Majestic Fast Ferry, Horizon Ferry), airlines, and the official Indonesian Directorate General of Immigration website before traveling.',
        'Jadwal feri, ketentuan visa, dan aturan imigrasi dapat berubah. Kami menyarankan untuk memeriksa langsung dengan operator feri resmi (BatamFast, Majestic, Horizon), maskapai, dan situs resmi Imigrasi Indonesia sebelum bepergian.'
      ),
    },
    {
      id: 'q-26',
      category: 'travel',
      question: t('What shopping and culinary hotspots are nearby in Penuin?', 'Pusat belanja dan kuliner apa saja yang dekat di Penuin?'),
      answer: t(
        'Waminna Hotel is located in the heart of Penuin Centre: within walking distance to Penuin shophouses, Pasar Penuin, Grand Batam Mall, Batam City Square (BCS) Mall, and TOP 100 Penuin. Famous local eateries include A2 Food Court, Astro Kopitiam, Kedai Kopi Jaya, Kopitiam Long Shu Siah, Uncle Lim, and Sup Ikan 96.',
        'Waminna Hotel berada di pusat Penuin Centre: sangat dekat dengan ruko Penuin, Pasar Penuin, Grand Batam Mall, BCS Mall, dan TOP 100. Pilihan kuliner populer di sekitarnya meliputi A2 Food Court, Astro Kopitiam, Kedai Kopi Jaya, Kopitiam Long Shu Siah, Uncle Lim, dan Sup Ikan 96.'
      ),
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Header Banner */}
        <div className="bg-[#161d08] dark:bg-[#11110f] text-white py-16 px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-3.5 py-1 rounded-full border border-[#C5A059]/20">
              {t('Waminna Hotel FAQ & Guest Guide', 'FAQ & Panduan Tamu Waminna Hotel')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display mt-4 mb-4 font-normal tracking-tight">
              {t('Frequently Asked Questions', 'Pertanyaan Yang Sering Diajukan')}
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {t(
                'Find answers about reservations, payments, check-in policies, room amenities, and local travel in Penuin, Batam.',
                'Temukan jawaban seputar reservasi, pembayaran, kebijakan check-in, fasilitas kamar, dan panduan wisata di Penuin, Batam.'
              )}
            </p>

            {/* Search Input */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#827D75]" />
              <input
                type="text"
                placeholder={t('Search questions (e.g. check-in, deposit, wifi, cancellation)...', 'Cari pertanyaan (mis. check-in, deposit, wifi, pembatalan)...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#242320] text-[#1c1b19] dark:text-[#F7F5F2] text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A059] shadow-lg border border-[#e8e6e1] dark:border-[#30312f]"
              />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {/* Quick Stay Facts Grid */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-display text-[#1c1b19] dark:text-[#F7F5F2]">
                {t('Quick Stay Facts', 'Fakta Cepat Menginap')}
              </h2>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1 font-sans">
                {t('Key essentials for your stay at a glance', 'Informasi penting menginap dalam sekejap')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {QUICK_FACTS.map((fact, idx) => {
                const Icon = fact.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-[#242320] border border-[#e8e6e1] dark:border-[#30312f] shadow-sm flex flex-col items-center text-center space-y-1.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#f5f3f0] dark:bg-[#191816] flex items-center justify-center text-[#C5A059]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-[#827D75] dark:text-[#ded9d6] font-semibold">
                      {fact.label}
                    </span>
                    <span className="text-xs font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">
                      {fact.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {[
                { id: 'all', label: t('All Questions', 'Semua'), icon: HelpCircle },
                { id: 'booking', label: t('Reservations & Payment', 'Reservasi & Pembayaran'), icon: CreditCard },
                { id: 'checkin', label: t('Check-in & Stay', 'Check-in & Kedatangan'), icon: Clock },
                { id: 'rooms', label: t('Rooms & Amenities', 'Kamar & Fasilitas'), icon: Bed },
                { id: 'policies', label: t('Hotel Policies', 'Kebijakan Hotel'), icon: ShieldCheck },
                { id: 'travel', label: t('Travel & Exploring', 'Transportasi & Wisata'), icon: MapPin },
              ].map((cat) => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all ${
                      active
                        ? 'bg-[#C5A059] text-[#1C1C19] shadow-sm'
                        : 'bg-white dark:bg-[#242320] text-[#46483f] dark:text-[#ded9d6] border border-[#e8e6e1] dark:border-[#30312f] hover:border-[#C5A059]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Accordion FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = !!openItems[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className="bg-white dark:bg-[#242320] rounded-xl border border-[#e8e6e1] dark:border-[#30312f] overflow-hidden transition-all shadow-sm hover:border-[#C5A059]/40"
                    >
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-medium text-[#1c1b19] dark:text-[#F7F5F2] transition-colors"
                      >
                        <span className="text-sm sm:text-base font-display font-medium text-[#1c1b19] dark:text-[#F7F5F2]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#C5A059] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 pt-1 text-sm text-[#46483f] dark:text-[#ded9d6] leading-relaxed border-t border-[#e8e6e1]/50 dark:border-[#30312f] font-sans">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white dark:bg-[#242320] rounded-xl border border-[#e8e6e1] dark:border-[#30312f]">
                  <HelpCircle className="w-12 h-12 text-[#827D75] mx-auto mb-3" />
                  <h3 className="text-lg font-display text-[#1c1b19] dark:text-[#F7F5F2]">
                    {t('No matching questions found', 'Tidak ada pertanyaan yang cocok')}
                  </h3>
                  <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1 font-sans">
                    {t('Try adjusting your search keyword or switching category tabs.', 'Coba ubah kata kunci pencarian Anda atau pilih kategori lain.')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Need Further Assistance Box */}
          <div className="bg-[#f5f3f0] dark:bg-[#242320] rounded-2xl p-6 sm:p-8 border border-[#e8e6e1] dark:border-[#30312f] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">
                {t('Still have questions?', 'Masih memiliki pertanyaan?')}
              </h3>
              <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1 max-w-lg leading-relaxed font-sans">
                {t(
                  'Our 24-hour guest relations desk is always happy to assist. Email us at info@waminnahotel.com or message directly on WhatsApp.',
                  'Tim resepsionis 24 jam kami selalu siap membantu. Kirim email ke info@waminnahotel.com atau chat langsung via WhatsApp.'
                )}
              </p>
              <p className="text-[11px] text-[#827D75]/80 dark:text-[#ded9d6]/70 mt-1 italic font-sans">
                {t(
                  'Notice: Booking confirmations are automatically issued from reservation@waminnahotel.com.',
                  'Catatan: Konfirmasi pemesanan diterbitkan secara otomatis dari reservation@waminnahotel.com.'
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="https://wa.me/6282227891010"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold shadow hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:info@waminnahotel.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] border border-[#e8e6e1] dark:border-[#30312f] text-xs font-semibold hover:border-[#C5A059] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>info@waminnahotel.com</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

