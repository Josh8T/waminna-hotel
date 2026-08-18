import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function Contact() {
  const { t } = useThemeLanguage();
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
      toast.error(t('Please fill in all required fields.', 'Harap isi semua kolom yang wajib diisi.'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success(t('Thank you! Your message has been received.', 'Terima kasih! Pesan Anda telah diterima.'));
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-[#161d08] dark:bg-[#11110f] text-white py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-3.5 py-1 rounded-full border border-[#C5A059]/20">
              {t('Get In Touch', 'Hubungi Kami')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display mt-4 mb-4 font-normal tracking-tight">
              {t('We Are Here For You', 'Kami Siap Melayani Anda')}
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {t(
                'Have questions about room reservations? Contact our 24/7 guest relations team.',
                'Punya pertanyaan tentang reservasi kamar? Hubungi tim kami 24/7.'
              )}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-[#242320] rounded-xl p-6 shadow-sm border border-[#e8e6e1] dark:border-[#30312f] space-y-6">
                <h2 className="text-xl font-display text-[#1c1b19] dark:text-[#F7F5F2] font-normal border-b border-[#e8e6e1] dark:border-[#30312f] pb-4">
                  {t('Contact Information', 'Informasi Kontak')}
                </h2>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f3f0] dark:bg-[#30312f] flex items-center justify-center shrink-0 text-[#C5A059]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">{t('Hotel Address', 'Alamat Hotel')}</h3>
                    <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1 leading-relaxed">
                      Jl. Komp. Penuin Centre, Block JA No. 7-10<br />
                      Batu Selicin, Kec. Lubuk Baja, Kota Batam<br />
                      Kepulauan Riau 29432, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f3f0] dark:bg-[#30312f] flex items-center justify-center shrink-0 text-[#C5A059]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">{t('Phone & WhatsApp', 'Telepon & WhatsApp')}</h3>
                    <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1">
                      Direct: +62 21 5555 8888<br />
                      Reservations: +62 21 5555 8889
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f3f0] dark:bg-[#30312f] flex items-center justify-center shrink-0 text-[#C5A059]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">{t('Email Inquiry', 'Pertanyaan Email')}</h3>
                    <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1">
                      info@waminnahotel.com<br />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f3f0] dark:bg-[#30312f] flex items-center justify-center shrink-0 text-[#C5A059]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">{t('Check-in / Check-out', 'Masuk / Keluar')}</h3>
                    <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1">
                      {t('Check-in: 3:00 PM onwards', 'Masuk: Mulai pukul 15:00 WIB')}<br />
                      {t('Check-out: 12:00 PM (Noon)', 'Keluar: Pukul 12:00 WIB (Siang)')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Preview Card */}
              <div className="bg-white dark:bg-[#242320] rounded-xl p-6 shadow-sm border border-[#e8e6e1] dark:border-[#30312f]">
                <h3 className="text-sm font-semibold text-[#1c1b19] dark:text-[#F7F5F2] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059]" /> {t('Location Map', 'Peta Lokasi')}
                </h3>
                <div className="w-full h-44 rounded-lg bg-[#f5f3f0] dark:bg-[#191816] flex flex-col items-center justify-center border border-[#e8e6e1] dark:border-[#30312f] p-4 text-center">
                  <MapPin className="w-8 h-8 text-[#C5A059] mb-2 animate-bounce" />
                  <span className="text-xs font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">Waminna Hotel Batam</span>
                  <span className="text-[11px] text-[#827D75] dark:text-[#ded9d6] mt-1">Penuin Centre, Lubuk Baja</span>
                  <a
                    href="https://maps.app.goo.gl/34oNnVqM3EoH1MZe9"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-xs font-sans font-semibold text-[#C5A059] hover:underline"
                  >
                    {t('Open in Google Maps', 'Buka di Google Maps')} &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#242320] rounded-xl p-6 sm:p-10 shadow-sm border border-[#e8e6e1] dark:border-[#30312f]">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-[#C5A059] mx-auto" />
                    <h2 className="text-2xl font-display font-normal text-[#1c1b19] dark:text-[#F7F5F2]">
                      {t('Message Sent Successfully', 'Pesan Berhasil Terkirim')}
                    </h2>
                    <p className="text-sm text-[#827D75] dark:text-[#ded9d6] max-w-md mx-auto leading-relaxed font-sans">
                      {t(
                        'Thank you for contacting Waminna Hotel. Our concierge desk will review your inquiry and get back to you within 2-4 hours.',
                        'Terima kasih telah menghubungi Waminna Hotel. Tim resepsionis kami akan meninjau pesan Anda dan membalas dalam 2-4 jam.'
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                      }}
                      className="mt-6 px-6 py-2.5 bg-[#C5A059] text-[#1C1C19] font-sans font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-[#b08d49] transition-colors"
                    >
                      {t('Send Another Message', 'Kirim Pesan Lain')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display text-[#1c1b19] dark:text-[#F7F5F2] font-normal">
                        {t('Send Us a Message', 'Kirim Pesan Kepada Kami')}
                      </h2>
                      <p className="text-xs text-[#827D75] dark:text-[#ded9d6] mt-1 font-sans">
                        {t('Fill in the form below and we will get back to you promptly.', 'Isi formulir di bawah ini dan kami akan segera membalas Anda.')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-[#1c1b19] dark:text-[#F7F5F2] mb-1.5 font-sans">
                          {t('Your Full Name', 'Nama Lengkap')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Jane Doe"
                          className="w-full px-4 py-2.5 text-sm border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#1c1b19] dark:text-[#F7F5F2] mb-1.5 font-sans">
                          {t('Email Address', 'Alamat Email')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jane@example.com"
                          className="w-full px-4 py-2.5 text-sm border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-[#1c1b19] dark:text-[#F7F5F2] mb-1.5 font-sans">
                          {t('Phone Number (Optional)', 'Nomor Telepon (Opsional)')}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+62 812 3456 7890"
                          className="w-full px-4 py-2.5 text-sm border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#1c1b19] dark:text-[#F7F5F2] mb-1.5 font-sans">
                          {t('Subject Topic', 'Topik Subjek')}
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                        >
                          <option value="General Inquiry">{t('General Inquiry', 'Pertanyaan Umum')}</option>
                          <option value="Room Reservation">{t('Room Reservation', 'Reservasi Kamar')}</option>
                          <option value="Ferry Terminal Transport">{t('Ferry Terminal Transport', 'Penjemputan Ferry Terminal')}</option>
                          <option value="Feedback">{t('Guest Feedback', 'Umpan Balik Tamu')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1c1b19] dark:text-[#F7F5F2] mb-1.5 font-sans">
                        {t('Your Message', 'Pesan Anda')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t('Tell us how we can assist you...', 'Beri tahu kami bagaimana kami dapat membantu Anda...')}
                        className="w-full px-4 py-2.5 text-sm border border-[#e8e6e1] dark:border-[#30312f] bg-white dark:bg-[#191816] text-[#1c1b19] dark:text-[#F7F5F2] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A059] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3 bg-[#C5A059] text-[#1C1C19] font-sans uppercase tracking-wider text-xs font-semibold rounded-md hover:bg-[#b08d49] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          {t('Sending...', 'Mengirim...')}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> {t('Send Message', 'Kirim Pesan')}
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
