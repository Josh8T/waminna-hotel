import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, ChevronDown, HelpCircle, ShieldCheck, Clock, CreditCard, Sparkles } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'booking' | 'stay' | 'amenities' | 'policies';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    category: 'booking',
    question: 'What are the standard check-in and check-out times?',
    answer: 'Standard check-in begins at 3:00 PM, and check-out is by 12:00 PM (Noon). Guaranteed early check-in or late check-out options can be added during your booking process.',
  },
  {
    id: '2',
    category: 'booking',
    question: 'Can I cancel or modify my room reservation?',
    answer: 'Yes! Free cancellation is allowed up to 48 hours prior to your scheduled check-in date. Cancellations within 48 hours are subject to a one-night room charge.',
  },
  {
    id: '3',
    category: 'stay',
    question: 'Is breakfast included with room bookings?',
    answer: 'Select room packages include daily gourmet buffet breakfast. If your room rate does not include breakfast, you can easily add our Gourmet Buffet Breakfast add-on during checkout for $25/night.',
  },
  {
    id: '4',
    category: 'amenities',
    question: 'Does Waminna Hotel offer free high-speed Wi-Fi?',
    answer: 'Complimentary high-speed fiber Wi-Fi is available across all guest rooms, suites, executive lounges, and public areas within the hotel premises.',
  },
  {
    id: '5',
    category: 'stay',
    question: 'Do you offer airport transfer and shuttle services?',
    answer: 'Yes, we provide luxury private airport transfers to and from Jakarta International Airport. You can reserve your private transfer while completing your online booking.',
  },
  {
    id: '6',
    category: 'policies',
    question: 'What payment methods do you accept at check-in?',
    answer: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, and cash. A refundable security deposit is required at check-in.',
  },
  {
    id: '7',
    category: 'amenities',
    question: 'Are pets allowed at Waminna Hotel?',
    answer: 'To ensure maximum comfort for all guests, only certified service animals are permitted inside room accommodations and public areas.',
  },
  {
    id: '8',
    category: 'policies',
    question: 'What is the hotel policy on smoking?',
    answer: 'Waminna Hotel is a 100% non-smoking establishment. Designated outdoor smoking areas are available on the ground terrace.',
  },
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ '1': true });

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
    <div className="min-h-screen bg-warm-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Header Banner */}
        <div className="bg-[#1a1917] text-white py-16 px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-semibold text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
              Help & Support Center
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif mt-4 mb-4 font-normal tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Find instant answers to common questions regarding reservations, hotel amenities, policies, and guest services.
            </p>

            {/* Search Input */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions (e.g. breakfast, check-in, wifi)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-[#1a1917] text-sm focus:outline-none focus:ring-2 focus:ring-brand shadow-lg placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'all', label: 'All Questions', icon: HelpCircle },
              { id: 'booking', label: 'Reservations', icon: Clock },
              { id: 'stay', label: 'Stay & Dining', icon: Sparkles },
              { id: 'amenities', label: 'Amenities', icon: ShieldCheck },
              { id: 'policies', label: 'Payments & Rules', icon: CreditCard },
            ].map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-white text-[#5c5a54] hover:bg-warm-secondary border border-warm-border'
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
                    className="bg-white rounded-xl border border-warm-border overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-medium text-[#1a1917] hover:bg-warm-secondary/40 transition-colors"
                    >
                      <span className="text-base font-serif font-semibold">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-brand shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-[#5c5a54] leading-relaxed border-t border-warm-border/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-warm-border">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-serif font-medium text-[#1a1917]">No questions found</h3>
                <p className="text-xs text-[#8a8984] mt-1">
                  Try adjusting your search keyword or selecting another category.
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
