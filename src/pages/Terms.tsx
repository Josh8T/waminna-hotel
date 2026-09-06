import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, AlertCircle, Ban, Bed, Clock, CreditCard, Info } from 'lucide-react';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function Terms() {
  const { t } = useThemeLanguage();

  return (
    <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2] flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Header Banner */}
        <div className="bg-[#161d08] dark:bg-[#11110f] text-white py-14 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/20">
              {t('Official Guest Policies', 'Kebijakan Resmi Tamu')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-display mt-4 mb-2 font-normal">
              {t('Hotel Policies & Terms of Stay', 'Kebijakan Hotel & Syarat Menginap')}
            </h1>
            <p className="text-xs text-white/60">
              {t('Waminna Hotel · Penuin Centre, Batam · Updated September 2026', 'Waminna Hotel · Penuin Centre, Batam · Diperbarui September 2026')}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          {/* Quick Policy Summary Table */}
          <div className="bg-white dark:bg-[#242320] rounded-xl border border-[#e8e6e1] dark:border-[#30312f] shadow-sm overflow-hidden">
            <div className="bg-[#161d08] dark:bg-[#11110f] px-6 py-4 text-white">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-[#C5A059]">
                {t('Policy Overview at a Glance', 'Ringkasan Kebijakan Utama')}
              </h3>
            </div>
            <div className="divide-y divide-[#e8e6e1] dark:divide-[#30312f] text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 gap-2">
                <span className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{t('Check-in / Check-out', 'Waktu Masuk / Keluar')}</span>
                <span className="sm:col-span-2 text-[#5c5a54] dark:text-[#ded9d6]">{t('Check-in from 2:00 PM · Check-out by 12:00 noon', 'Check-in mulai 14:00 WIB · Check-out maksimal 12:00 WIB')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 gap-2">
                <span className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{t('Payment Requirement', 'Ketentuan Pembayaran')}</span>
                <span className="sm:col-span-2 text-[#5c5a54] dark:text-[#ded9d6]">{t('Full payment upon booking (IDR, cash, cards, bank transfer; taxes & service included)', 'Pembayaran penuh saat reservasi (IDR, tunai, kartu, transfer bank; pajak & servis termasuk)')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 gap-2">
                <span className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{t('Cancellation & No-Show', 'Pembatalan & Ketidakhadiran')}</span>
                <span className="sm:col-span-2 text-[#5c5a54] dark:text-[#ded9d6] font-medium text-amber-700 dark:text-amber-400">
                  {t('All confirmed bookings are non-cancellable and non-refundable. No-shows forfeit full payment.', 'Semua reservasi terkonfirmasi tidak dapat dibatalkan dan tidak dapat dikembalikan. Ketidakhadiran menghanguskan pembayaran.')}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 gap-2">
                <span className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{t('Security Deposit', 'Deposit Jaminan')}</span>
                <span className="sm:col-span-2 text-[#5c5a54] dark:text-[#ded9d6]">{t('IDR 100,000 refundable security deposit collected at check-in', 'IDR 100.000 deposit jaminan dapat dikembalikan saat check-in')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 gap-2">
                <span className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{t('Smoking Policy', 'Kebijakan Merokok')}</span>
                <span className="sm:col-span-2 text-[#5c5a54] dark:text-[#ded9d6]">{t('100% Non-smoking in all guest rooms. IDR 1,000,000 cleaning fee for violations.', '100% Bebas asap rokok di semua kamar. Denda pembersihan IDR 1.000.000 untuk pelanggaran.')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 gap-2">
                <span className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{t('Extra Bed & Children', 'Tempat Tidur Tambahan & Anak')}</span>
                <span className="sm:col-span-2 text-[#5c5a54] dark:text-[#ded9d6]">{t('Children 8 & under stay free with existing bedding. Extra bed: IDR 150,000 / bed / night.', 'Anak usia 8 tahun ke bawah gratis menggunakan tempat tidur yang ada. Kasur ekstra: IDR 150.000 / kasur / malam.')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 gap-2">
                <span className="font-medium text-[#1c1b19] dark:text-[#F7F5F2]">{t('Pets', 'Hewan Peliharaan')}</span>
                <span className="sm:col-span-2 text-[#5c5a54] dark:text-[#ded9d6]">{t('Pets are strictly not permitted.', 'Hewan peliharaan dilarang keras masuk area hotel.')}</span>
              </div>
            </div>
          </div>

          {/* Detailed Policy Sections */}
          <div className="bg-white dark:bg-[#242320] rounded-xl p-6 sm:p-10 border border-[#e8e6e1] dark:border-[#30312f] shadow-sm space-y-8 text-sm text-[#5c5a54] dark:text-[#ded9d6] leading-relaxed">
            
            {/* 1. Reservations and Payment */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C5A059]" /> 1. {t('Reservations and Payment', 'Reservasi dan Pembayaran')}
              </h2>
              <p>
                {t(
                  'Guests can book directly through the Waminna Hotel website. Full payment is required at the time of making a reservation. We accept cash, major credit and debit cards, and bank transfers. All prices and payments are processed in Indonesian Rupiah (IDR). All government taxes and service charges are included in the room rates displayed on our website.',
                  'Tamu dapat memesan langsung melalui situs web Waminna Hotel. Pembayaran penuh diperlukan saat melakukan reservasi. Kami menerima tunai, kartu kredit dan debit utama, serta transfer bank. Semua harga dan pembayaran diproses dalam Rupiah (IDR). Pajak pemerintah dan biaya layanan sudah termasuk dalam tarif yang ditampilkan.'
                )}
              </p>
              <div className="p-3.5 rounded-lg bg-[#f5f3f0] dark:bg-[#191816] border border-[#e8e6e1] dark:border-[#30312f] text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  {t(
                    'Automated Confirmation Notice: Confirmation emails are generated automatically from reservation@waminnahotel.com. For questions or booking assistance, please contact info@waminnahotel.com or WhatsApp +62 822-2789-1010.',
                    'Pemberitahuan Konfirmasi Otomatis: Email konfirmasi dikirim otomatis dari reservation@waminnahotel.com. Untuk pertanyaan atau bantuan reservasi, hubungi info@waminnahotel.com atau WhatsApp +62 822-2789-1010.'
                  )}
                </span>
              </div>
            </section>

            {/* 2. Cancellation and No-Show Policy */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#C5A059]" /> 2. {t('Cancellation & No-Show Policy', 'Kebijakan Pembatalan & Ketidakhadiran')}
              </h2>
              <p>
                {t(
                  'All confirmed room bookings are non-cancellable and non-refundable. If a guest does not arrive on the scheduled check-in date without prior arrangement, the booking will be treated as a no-show and the full payment will be forfeited. Date changes are subject to hotel availability and prior management approval.',
                  'Semua pemesanan kamar yang telah dikonfirmasi bersifat non-cancellable dan non-refundable (tidak dapat dibatalkan dan tidak dapat dikembalikan). Jika tamu tidak hadir pada tanggal check-in, reservasi dianggap no-show dan seluruh biaya hangus. Perubahan tanggal bergantung pada ketersediaan dan persetujuan manajemen.'
                )}
              </p>
            </section>

            {/* 3. Check-in, Identification & Security Deposit */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C5A059]" /> 3. {t('Check-in, Identification & Security Deposit', 'Check-in, Identitas & Deposit Jaminan')}
              </h2>
              <p>
                {t(
                  'Check-in begins from 2:00 PM, and check-out is by 12:00 noon. The front reception desk operates 24 hours daily with English- and Indonesian-speaking staff. International guests must present a valid passport upon arrival; Indonesian citizens and permanent residents must present a valid KTP or accepted government-issued photo identification.',
                  'Check-in dimulai dari pukul 14:00 WIB, dan check-out maksimal pukul 12:00 WIB siang. Meja resepsionis beroperasi 24 jam setiap hari dengan staf yang melayani dalam bahasa Inggris dan Indonesia. Tamu internasional wajib menunjukkan paspor yang masih berlaku; warga negara Indonesia wajib menunjukkan KTP atau kartu identitas resmi berfoto lainnya.'
                )}
              </p>
              <p>
                {t(
                  'A refundable incidental security deposit of IDR 100,000 is collected upon check-in. The deposit is fully returned upon check-out, provided there is no room damage, missing inventory, or outstanding charges. Early check-in or late check-out requests are subject to room availability on the day.',
                  'Deposit jaminan sebesar IDR 100.000 dikumpulkan saat check-in dan akan dikembalikan sepenuhnya saat check-out jika tidak ada kerusakan kamar atau biaya tambahan. Permintaan check-in awal atau check-out terlambat bergantung pada ketersediaan kamar.'
                )}
              </p>
            </section>

            {/* 4. Room Occupancy & Children */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#C5A059]" /> 4. {t('Room Occupancy, Children & Extra Beds', 'Kapasitas Kamar, Anak & Kasur Tambahan')}
              </h2>
              <p>
                {t(
                  'Standard room capacities: Waminna Deluxe Double (2 guests), Waminna Deluxe Twin (2 guests), Waminna Deluxe Triple (3 guests), Waminna Family Loft (4 guests), and Waminna Signature Suite (up to 3 guests with sofa bed). Children aged 8 years and under stay free when using existing bedding, counting toward the maximum room occupancy. Extra beds are available upon request for IDR 150,000 per bed per night, subject to room layout suitability. Daily housekeeping is provided for all occupied rooms.',
                  'Kapasitas standar: Waminna Deluxe Double (2 tamu), Waminna Deluxe Twin (2 tamu), Waminna Deluxe Triple (3 tamu), Waminna Family Loft (4 tamu), dan Waminna Signature Suite (hingga 3 tamu dengan sofa bed). Anak berusia 8 tahun ke bawah menginap gratis dengan tempat tidur yang tersedia. Kasur tambahan tersedia dengan biaya IDR 150.000 per kasur per malam. Layanan tata graha (housekeeping) harian disediakan untuk kamar yang terisi.'
                )}
              </p>
            </section>

            {/* 5. House Rules, Smoking & Damages */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <Ban className="w-5 h-5 text-[#C5A059]" /> 5. {t('House Rules, Smoking Ban & Damage Liability', 'Tata Tertib, Larangan Merokok & Ganti Rugi')}
              </h2>
              <p>
                {t(
                  'All guest rooms and indoor areas are strictly non-smoking. Smoking inside a guest room will incur an IDR 1,000,000 specialist cleaning fee to restore the room to freshness. Pets are strictly not permitted. Guests are held financially liable for the full repair or replacement cost of any property damage or loss exceeding the initial security deposit.',
                  'Seluruh kamar tamu dan area dalam ruangan adalah area bebas rokok. Merokok di dalam kamar akan dikenakan denda pembersihan khusus sebesar IDR 1.000.000. Hewan peliharaan dilarang keras. Tamu bertanggung jawab penuh atas biaya perbaikan atau penggantian jika terjadi kerusakan properti melebihi nilai deposit.'
                )}
              </p>
            </section>

            {/* 6. Facilities & Transportation */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-[#1c1b19] dark:text-[#F7F5F2] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#C5A059]" /> 6. {t('Facilities, Wi-Fi & Transportation', 'Fasilitas, Wi-Fi & Transportasi')}
              </h2>
              <p>
                {t(
                  'Complimentary Wi-Fi is accessible in all guest rooms and public areas. Complimentary guest parking is available on-site, subject to space availability (spaces cannot be pre-reserved). Dedicated airport or ferry transfers, room service, and laundry facilities are not currently provided; our 24-hour reception desk will gladly assist with booking metered local taxis or ride-hailing services.',
                  'Wi-Fi gratis dapat diakses di seluruh kamar dan area publik. Parkir gratis tersedia berdasarkan ketersediaan tempat saat kedatangan. Antar-jemput bandara/ferry, room service, dan laundry saat ini belum tersedia; staf resepsionis 24 jam kami siap membantu pemesanan taksi lokal.'
                )}
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

