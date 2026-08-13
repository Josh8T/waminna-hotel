import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Thank you! Your message has been received.');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-[#1a1917] text-white py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-semibold text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif mt-4 mb-4 font-normal tracking-tight">
              We Are Here For You
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Have questions about room reservations, special events, or concierge services? Contact our 24/7 guest relations team.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-warm-border space-y-6">
                <h2 className="text-xl font-serif text-[#1a1917] font-semibold border-b border-warm-border pb-4">
                  Contact Information
                </h2>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0 text-brand">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1a1917]">Hotel Address</h3>
                    <p className="text-xs text-[#5c5a54] mt-1 leading-relaxed">
                      123 Boutique Boulevard, Suite 500<br />
                      Jakarta, Indonesia 10110
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0 text-brand">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1a1917]">Phone & WhatsApp</h3>
                    <p className="text-xs text-[#5c5a54] mt-1">
                      Direct: +62 21 5555 8888<br />
                      Reservations: +62 21 5555 8889
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0 text-brand">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1a1917]">Email Inquiry</h3>
                    <p className="text-xs text-[#5c5a54] mt-1">
                      reservations@waminnahotel.com<br />
                      concierge@waminnahotel.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0 text-brand">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1a1917]">Check-in / Check-out</h3>
                    <p className="text-xs text-[#5c5a54] mt-1">
                      Check-in: 3:00 PM onwards<br />
                      Check-out: 12:00 PM (Noon)
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Preview Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-warm-border">
                <h3 className="text-sm font-semibold text-[#1a1917] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand" /> Location Map
                </h3>
                <div className="w-full h-44 rounded-lg bg-gradient-to-br from-brand/10 to-brand/30 flex flex-col items-center justify-center border border-brand/20 p-4 text-center">
                  <MapPin className="w-8 h-8 text-brand mb-2 animate-bounce" />
                  <span className="text-xs font-semibold text-[#1a1917]">Waminna Hotel Jakarta</span>
                  <span className="text-[11px] text-[#5c5a54] mt-1">Central Business District</span>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-xs font-medium text-brand hover:underline"
                  >
                    Open in Google Maps &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 sm:p-10 shadow-sm border border-warm-border">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h2 className="text-2xl font-serif font-semibold text-[#1a1917]">
                      Message Sent Successfully
                    </h2>
                    <p className="text-sm text-[#5c5a54] max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Waminna Hotel. Our concierge desk will review your inquiry and get back to you within 2-4 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                      }}
                      className="mt-6 px-6 py-2.5 bg-brand text-white font-medium text-sm rounded-lg hover:bg-brand-dark transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-serif text-[#1a1917] font-semibold">
                        Send Us a Message
                      </h2>
                      <p className="text-xs text-[#8a8984] mt-1">
                        Fill in the form below and we will get back to you promptly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-[#1a1917] mb-1.5">
                          Your Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Jane Doe"
                          className="w-full px-4 py-2.5 text-sm border border-warm-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#1a1917] mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jane@example.com"
                          className="w-full px-4 py-2.5 text-sm border border-warm-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-[#1a1917] mb-1.5">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+62 812 3456 7890"
                          className="w-full px-4 py-2.5 text-sm border border-warm-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#1a1917] mb-1.5">
                          Subject Topic
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm border border-warm-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Room Reservation">Room Reservation</option>
                          <option value="Event & Wedding">Event & Wedding</option>
                          <option value="Airport Transport">Airport Transport</option>
                          <option value="Feedback">Guest Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1a1917] mb-1.5">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can assist you..."
                        className="w-full px-4 py-2.5 text-sm border border-warm-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3 bg-brand text-white font-medium text-sm rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
