import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, Eye, Server, ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-warm-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="bg-[#1a1917] text-white py-14 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
              Data Protection
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif mt-4 mb-2 font-normal">
              Privacy Policy
            </h1>
            <p className="text-xs text-white/60">
              Effective Date: January 1, 2026 | Last Updated: August 2026
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-xl p-6 sm:p-10 border border-warm-border shadow-sm space-y-8 text-sm text-[#5c5a54] leading-relaxed">

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917] flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand" /> 1. Information We Collect
              </h2>
              <p>
                We collect personal information necessary to fulfill your hotel bookings and enhance your hospitality experience. This includes your name, email address, phone number, stay preferences, payment records, and special requests.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917] flex items-center gap-2">
                <Server className="w-5 h-5 text-brand" /> 2. How We Use Your Data
              </h2>
              <p>
                Your personal details are used strictly for:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#5c5a54]">
                <li>Processing and confirming your room reservations and addon services.</li>
                <li>Sending booking status notifications, check-in reminders, and receipts.</li>
                <li>Improving hotel services and responding to guest customer support inquiries.</li>
                <li>Complying with local hotel licensing regulations and safety standards.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917] flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand" /> 3. Data Protection & Security
              </h2>
              <p>
                Waminna Hotel implements industry-standard encryption protocols (SSL/TLS) to secure all guest communications and data transmissions. We never sell, rent, or trade guest personal information to third-party marketing companies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand" /> 4. Cookies & Web Tracking
              </h2>
              <p>
                Our website utilizes essential browser cookies to manage active user sessions, remember room search dates, and provide a seamless navigation experience. You may choose to disable non-essential cookies via your browser settings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917]">
                5. Guest Rights & Contact
              </h2>
              <p>
                You have the right to request access to, correction of, or deletion of your personal data stored with us. For privacy inquiries, email our Data Officer at <span className="text-brand font-medium">privacy@waminnahotel.com</span>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
