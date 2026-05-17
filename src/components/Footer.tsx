import { Link } from 'react-router-dom';
import { BedDouble } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1917] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BedDouble className="w-5 h-5 text-teal" />
              <span className="text-lg font-semibold">Charles&apos;s Stay</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              123 Boutique Lane<br />
              Jakarta, Indonesia 10110<br />
              A warm welcome awaits you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/rooms" className="text-sm text-white/60 hover:text-white transition-colors">
                Rooms
              </Link>
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
                Contact
              </Link>
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-white/60">hello@charlesstay.com</span>
              <span className="text-sm text-white/60">+62 21 1234 5678</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="text-xs text-white/40 text-center">
            &copy; 2026 Charles&apos;s Stay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
