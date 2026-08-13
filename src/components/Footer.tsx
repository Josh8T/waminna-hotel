import { Link } from 'react-router-dom';
import { BedDouble } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1917] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={`${import.meta.env.BASE_URL}images/logo/waminna_logo.png`} alt="Waminna Hotel Logo" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              123 Boutique Boulevard<br />
              Jakarta, Indonesia 10110<br />
              Experience timeless elegance & warmth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
              Explore
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/rooms" className="text-sm text-white/60 hover:text-white transition-colors">
                Rooms & Suites
              </Link>
              <Link to="/contact" className="text-sm text-white/60 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link to="/faq" className="text-sm text-white/60 hover:text-white transition-colors">
                FAQs & Support
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
              Policies
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm text-white/60 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-white/60">reservations@waminnahotel.com</span>
              <span className="text-sm text-white/60">+62 21 5555 8888</span>
              <span className="text-sm text-white/60">Concierge Desk: 24/7</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center sm:text-left">
            &copy; 2026 Waminna Hotel. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/40">
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
