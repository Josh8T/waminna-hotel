import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, Eye, Server, ShieldCheck } from 'lucide-react';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function Privacy() {
  const { t } = useThemeLanguage();

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="bg-[#161d08] dark:bg-[#11110f] text-white py-14 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/20">
              {t('Data Protection', 'Perlindungan Data')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-display mt-4 mb-2 font-normal">
              {t('Privacy Policy', 'Kebijakan Privasi')}
            </h1>
            <p className="text-xs text-white/60">
              {t('Waminna Hotel · Effective Date: January 1, 2026', 'Waminna Hotel · Berlaku Sejak: 1 Januari 2026')}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white dark:bg-[#242320] rounded-xl p-6 sm:p-10 border border-[#e8e6e1] dark:border-[#30312f] shadow-sm space-y-8 text-sm text-[#5c5a54] dark:text-[#ded9d6] leading-relaxed">

            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#C5A059]" /> 1. {t('Information We Collect', 'Informasi Yang Kami Kumpulkan')}
              </h2>
              <p>
                {t(
                  'We collect personal information necessary to fulfill your hotel bookings and enhance your hospitality experience. This includes your name, email address, phone number, stay preferences, payment records, and special requests.',
                  'Kami mengumpulkan informasi pribadi yang diperlukan untuk memproses reservasi hotel Anda dan meningkatkan pengalaman menginap Anda. Ini mencakup nama, alamat email, nomor telepon, preferensi menginap, catatan pembayaran, dan permintaan khusus.'
                )}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <Server className="w-5 h-5 text-[#C5A059]" /> 2. {t('How We Use Your Data', 'Bagaimana Kami Menggunakan Data Anda')}
              </h2>
              <p>
                {t('Your personal details are used strictly for:', 'Data pribadi Anda digunakan secara ketat untuk:')}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#5c5a54] dark:text-[#ded9d6]">
                <li>{t('Processing and confirming your room reservations and addon services.', 'Memproses dan mengonfirmasi reservasi kamar serta layanan tambahan Anda.')}</li>
                <li>{t('Sending booking status notifications, check-in reminders, and receipts.', 'Mengirimkan notifikasi status pemesanan, pengingat check-in, dan tanda terima.')}</li>
                <li>{t('Improving hotel services and responding to guest customer support inquiries.', 'Meningkatkan layanan hotel dan merespons pertanyaan bantuan pelanggan.')}</li>
                <li>{t('Complying with local hotel licensing regulations and safety standards.', 'Mematuhi peraturan perizinan perhotelan dan standar keselamatan setempat.')}</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C5A059]" /> 3. {t('Data Protection & Security', 'Perlindungan & Keamanan Data')}
              </h2>
              <p>
                {t(
                  'Waminna Hotel implements industry-standard encryption protocols (SSL/TLS) to secure all guest communications and data transmissions. We never sell, rent, or trade guest personal information to third-party marketing companies.',
                  'Waminna Hotel menerapkan protokol enkripsi standar industri (SSL/TLS) untuk mengamankan semua komunikasi dan transmisi data tamu. Kami tidak pernah menjual, menyewakan, atau memperdagangkan data pribadi tamu kepada pihak ketiga.'
                )}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" /> 4. {t('Cookies & Web Tracking', 'Cookie & Pelacakan Web')}
              </h2>
              <p>
                {t(
                  'Our website utilizes essential browser cookies to manage active user sessions, remember room search dates, and provide a seamless navigation experience. You may choose to disable non-essential cookies via your browser settings.',
                  'Situs web kami menggunakan cookie penting untuk mengelola sesi pengguna, mengingat tanggal pencarian kamar, dan memberikan pengalaman navigasi yang lancar.'
                )}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2]">
                5. {t('Guest Rights & Contact', 'Hak Tamu & Kontak')}
              </h2>
              <p>
                {t(
                  'You have the right to request access to, correction of, or deletion of your personal data stored with us. For privacy inquiries, email our team at',
                  'Anda berhak meminta akses, perbaikan, atau penghapusan data pribadi Anda yang tersimpan pada kami. Untuk pertanyaan privasi, kirim email ke'
                )}{' '}
                <a href="mailto:info@waminnahotel.com" className="text-[#C5A059] font-medium hover:underline">info@waminnahotel.com</a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

