import { Link } from 'react-router-dom';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function Footer() {
  const { t } = useThemeLanguage();

  return (
    <footer className="bg-[#161d08] dark:bg-[#11110f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img
                src={`${import.meta.env.BASE_URL}images/logo/waminna_logo_lockup_horizontal_white.png`}
                alt="Waminna Hotel"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-sans">
              Jl. Komp. Penuin Centre, Block JA No. 7-10, Batu Selicin, Lubuk Baja, Batam 29432, Indonesia<br />
              {t('Boutique Sanctuary & Urban Escapes', 'Suaka Butik & Liburan Perkotaan')}<br />
              <span className="text-xs text-[#C5A059] mt-1 inline-block font-sans font-semibold">EST. 2026</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
              {t('Explore', 'Jelajahi')}
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/rooms" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('Rooms & Suites', 'Kamar & Suite')}
              </Link>
              <Link to="/contact" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('Contact Us', 'Hubungi Kami')}
              </Link>
              <Link to="/faq" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('FAQs & Support', 'Pertanyaan Umum')}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
              {t('Policies', 'Kebijakan')}
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('Terms & Conditions', 'Syarat & Ketentuan')}
              </Link>
              <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('Privacy Policy', 'Kebijakan Privasi')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
              {t('Get in Touch', 'Hubungi Kami')}
            </h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:info@waminnahotel.com" className="text-sm text-white/60 hover:text-white transition-colors">info@waminnahotel.com</a>
              <a href="mailto:reservation@waminnahotel.com" className="text-sm text-white/60 hover:text-white transition-colors">reservation@waminnahotel.com</a>
              <a href="https://wa.me/6282227891010" target="_blank" rel="noreferrer" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
                <span>+62 822 2789 1010</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center sm:text-left">
            &copy; 2026 Waminna Hotel. {t('All rights reserved.', 'Hak cipta dilindungi undang-undang.')}
          </p>
          <div className="flex gap-4 text-xs text-white/40">
            <Link to="/terms" className="hover:text-white">{t('Terms', 'Syarat')}</Link>
            <Link to="/privacy" className="hover:text-white">{t('Privacy', 'Privasi')}</Link>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
