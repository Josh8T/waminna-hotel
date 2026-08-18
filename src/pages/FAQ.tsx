import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, ChevronDown, HelpCircle, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function FAQ() {
  const { t } = useThemeLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ '1': true });

  const FAQ_ITEMS = [
    {
      id: '1',
      category: 'booking',
      question: t('What are the standard check-in and check-out times?', 'Berapakah waktu standar masuk dan keluar?'),
      answer: t(
        'Standard check-in begins at 3:00 PM, and check-out is by 12:00 PM (Noon). Guaranteed early check-in or late check-out options can be added during your booking process.',
        'Waktu masuk standar dimulai pukul 15:00 WIB, dan waktu keluar pukul 12:00 WIB. Pilihan masuk lebih awal atau keluar lebih lambat dapat ditambahkan saat reservasi.'
      ),
    },
    {
      id: '2',
      category: 'booking',
      question: t('Can I cancel or modify my room reservation?', 'Apakah saya dapat membatalkan atau mengubah reservasi kamar saya?'),
      answer: t(
        'Yes! Free cancellation is allowed up to 48 hours prior to your scheduled check-in date. Cancellations within 48 hours are subject to a one-night room charge.',
        'Ya! Pembatalan gratis diperbolehkan hingga 48 jam sebelum tanggal masuk yang dijadwalkan.'
      ),
    },
    {
      id: '4',
      category: 'amenities',
      question: t('Does Waminna Hotel offer free high-speed Wi-Fi?', 'Apakah Waminna Hotel menyediakan Wi-Fi cepat gratis?'),
      answer: t(
        'Complimentary high-speed fiber Wi-Fi is available across all guest rooms, suites, executive lounges, and public areas within the hotel premises.',
        'Wi-Fi serat optik cepat gratis tersedia di semua kamar tamu, suite, lounge eksekutif, dan area publik.'
      ),
    },
    {
      id: '6',
      category: 'policies',
      question: t('What payment methods do you accept at check-in?', 'Metode pembayaran apa saja yang diterima saat check-in?'),
      answer: t(
        'We accept major credit cards (Visa, MasterCard, American Express), debit cards, QRIS, and cash.',
        'Kami menerima kartu kredit utama (Visa, MasterCard, American Express), kartu debit, QRIS, dan tunai.'
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
              {t('Help & Support Center', 'Pusat Bantuan & Dukungan')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display mt-4 mb-4 font-normal tracking-tight">
              {t('Frequently Asked Questions', 'Pertanyaan Yang Sering Diajukan')}
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {t(
                'Find instant answers to common questions regarding reservations, hotel amenities, policies, and guest services.',
                'Temukan jawaban cepat untuk pertanyaan umum mengenai reservasi, fasilitas hotel, kebijakan, dan layanan tamu.'
              )}
            </p>

            {/* Search Input */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#827D75]" />
              <input
                type="text"
                placeholder={t('Search questions (e.g. breakfast, check-in, wifi)...', 'Cari pertanyaan (mis. sarapan, check-in, wifi)...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#242320] text-[#1c1b19] dark:text-[#F7F5F2] text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A059] shadow-lg border border-[#e8e6e1] dark:border-[#30312f]"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'all', label: t('All Questions', 'Semua Pertanyaan'), icon: HelpCircle },
              { id: 'booking', label: t('Reservations', 'Reservasi'), icon: Clock },
              { id: 'amenities', label: t('Amenities', 'Fasilitas'), icon: ShieldCheck },
              { id: 'policies', label: t('Payments & Rules', 'Pembayaran & Aturan'), icon: CreditCard },
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
                      : 'bg-white dark:bg-[#242320] text-[#46483f] dark:text-[#ded9d6] border border-[#e8e6e1] dark:border-[#30312f]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Accordion FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = !!openItems[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-[#242320] rounded-xl border border-[#e8e6e1] dark:border-[#30312f] overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-medium text-[#1c1b19] dark:text-[#F7F5F2] transition-colors"
                    >
                      <span className="text-base font-display font-normal">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#C5A059] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-[#46483f] dark:text-[#ded9d6] leading-relaxed border-t border-[#e8e6e1]/50 dark:border-[#30312f]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white dark:bg-[#242320] rounded-xl border border-[#e8e6e1] dark:border-[#30312f]">
                <HelpCircle className="w-12 h-12 text-[#827D75] mx-auto mb-3" />
                <h3 className="text-lg font-display text-[#1c1b19] dark:text-[#F7F5F2]">{t('No questions found', 'Tidak ada pertanyaan ditemukan')}</h3>
                <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1 font-sans">
                  {t('Try adjusting your search keyword or selecting another category.', 'Coba sesuaikan kata kunci pencarian Anda atau pilih kategori lain.')}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
