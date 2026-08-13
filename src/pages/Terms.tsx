import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Shield, AlertCircle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-warm-bg flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="bg-[#1a1917] text-white py-14 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
              Legal Documentation
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif mt-4 mb-2 font-normal">
              Terms & Conditions
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
                <FileText className="w-5 h-5 text-brand" /> 1. Reservation & Acceptance
              </h2>
              <p>
                By placing a booking at Waminna Hotel through our website, mobile interface, or guest relations desk, you agree to comply with all terms and conditions set forth below. Bookings are subject to room availability and confirmation by hotel management.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917] flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand" /> 2. Check-in & Security Deposit
              </h2>
              <p>
                Guests must present valid government-issued photo identification (Passport, National ID card) upon check-in. Standard check-in time starts at 3:00 PM. A refundable security deposit of IDR 500,000 / USD $50 per stay is required at check-in for incidental coverage.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-brand" /> 3. Cancellation Policy
              </h2>
              <p>
                Cancellations made 48 hours or more prior to the scheduled check-in date will receive a 100% refund. Cancellations made within 48 hours of check-in, or no-show reservations, will incur a penalty equivalent to one night&apos;s stay.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917]">
                4. Hotel Rules & Damage Liability
              </h2>
              <p>
                Waminna Hotel maintains a strictly non-smoking policy inside all guest rooms and indoor public areas. Any violation will result in a cleaning fee of $150. Guests are held financially liable for any intentional damage caused to hotel property or equipment during their stay.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-semibold text-[#1a1917]">
                5. Limitation of Liability
              </h2>
              <p>
                Waminna Hotel is not liable for lost, stolen, or damaged personal valuables left unattended in rooms or public areas. In-room electronic safes are provided in all room categories for guest convenience.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
