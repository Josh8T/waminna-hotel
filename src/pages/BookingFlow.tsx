import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Lock, ChevronLeft, ChevronRight, Shield, AlertTriangle } from 'lucide-react';
import { getRoomById, createBooking, HOTEL_ADDONS, getPhotoUrl } from '@/lib/data';
import { validateStayDates } from '@/lib/dateUtils';
import Header from '@/components/Header';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';

export default function BookingFlow() {
  const { t } = useThemeLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = parseInt(searchParams.get('roomId') || '0');
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  const [step, setStep] = useState(1);
  const [selectedAddons] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const room = getRoomById(roomId);
  const dateValidation = validateStayDates(checkIn, checkOut);
  const nights = dateValidation.isValid ? dateValidation.nights : 0;

  const addonTotal = selectedAddons.reduce((acc, id) => {
    const addon = HOTEL_ADDONS.find((a) => a.id === id);
    if (!addon) return acc;
    return acc + (addon.perNight ? addon.price * Math.max(1, nights) : addon.price);
  }, 0);

  const subtotal = room ? room.pricePerNight * nights : 0;
  const tax = (subtotal + addonTotal) * 0.1;
  const total = subtotal + addonTotal + tax;

  if (!room || !checkIn || !checkOut || !dateValidation.isValid) {
    const errorMsg = dateValidation.isValid
      ? t('Invalid room or booking parameters.', 'Kamar atau parameter pemesanan tidak valid.')
      : t(dateValidation.messageEn, dateValidation.messageId);

    return (
      <div className="min-h-screen bg-[#fdf8f5] dark:bg-[#191816] text-[#1b1c1a] dark:text-[#F7F5F2]">
        <Header />
        <div className="pt-28 pb-16 px-4 flex justify-center items-center">
          <div className="max-w-md w-full bg-white dark:bg-[#242320] rounded-xl border border-amber-300 dark:border-amber-800/60 p-6 text-center shadow-lg">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-display font-semibold mb-2 text-[#1c1b19] dark:text-[#F7F5F2]">
              {t('Invalid Stay Dates', 'Tanggal Menginap Tidak Valid')}
            </h2>
            <p className="text-sm text-[#827D75] dark:text-[#ded9d6] mb-6">
              {errorMsg}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => navigate(room ? `/rooms/${room.id}` : '/rooms')}
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08d49] text-[#1C1C19] font-medium text-xs uppercase tracking-wider rounded transition-colors"
              >
                {t('Select Valid Dates', 'Pilih Tanggal yang Valid')}
              </button>
              <button
                onClick={() => navigate('/rooms')}
                className="px-5 py-2.5 border border-[#827D75]/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs uppercase tracking-wider rounded transition-colors"
              >
                {t('Browse Catalog', 'Lihat Katalog')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiry.trim()) newErrors.expiry = 'Expiry date is required';
      if (!formData.cvc.trim()) newErrors.cvc = 'CVC is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (validateStep()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const validation = validateStayDates(checkIn, checkOut);
    if (!validation.isValid) {
      setErrors({ submit: t(validation.messageEn, validation.messageId) });
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = createBooking({
        roomId,
        checkIn,
        checkOut,
        guestsCount: parseInt(guests),
        guestFirstName: formData.firstName,
        guestLastName: formData.lastName,
        guestEmail: formData.email,
        guestPhone: formData.phone || undefined,
        specialRequests: formData.specialRequests || undefined,
      });
      navigate(`/booking-confirmation?ref=${booking.bookingReference}`);
    } catch {
      setErrors({ submit: 'Failed to create booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5]">
      <Header />

      {/* Progress Header */}
      <div className="pt-20 pb-8 bg-[#f2ede9] border-b border-[#e8e6e1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#414930] hover:text-[#586146] uppercase tracking-wider mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#785927] font-sans">
                Reservation Checkout
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-normal text-[#1c1b19]">
                {step === 1 ? 'Review Room & Options' : 'Guest Information & Payment'}
              </h1>
            </div>
            
            {/* Step Indicator */}
            <div className="hidden sm:flex items-center gap-3 font-sans font-semibold text-xs">
              <span className={`px-3 py-1 rounded-full border ${step === 1 ? 'bg-[#414930] text-white border-[#414930]' : 'bg-white text-[#76786e] border-[#e8e6e1]'}`}>
                1. Review & Add-ons
              </span>
              <span className={`px-3 py-1 rounded-full border ${step === 2 ? 'bg-[#414930] text-white border-[#414930]' : 'bg-white text-[#76786e] border-[#e8e6e1]'}`}>
                2. Guest & Payment
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Form */}
        <main className="flex-1">
          {/* Step 1 - Dates Review */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-warm-border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1a1917] mb-4">Review Your Stay</h2>
              <div className="flex gap-4 p-4 bg-warm-bg rounded-lg mb-6">
                <img
                  src={room.photos[0]}
                  alt={room.name}
                  className="w-24 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold text-[#1a1917]">{room.name}</h3>
                  <p className="text-sm text-[#8a8984]">${room.pricePerNight}/night</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="p-3 bg-warm-bg rounded-lg">
                  <Calendar className="w-4 h-4 text-brand mx-auto mb-1" />
                  <p className="text-[11px] text-[#8a8984]">Check-in</p>
                  <p className="text-sm font-medium">{new Date(checkIn).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-warm-bg rounded-lg">
                  <Calendar className="w-4 h-4 text-brand mx-auto mb-1" />
                  <p className="text-[11px] text-[#8a8984]">Check-out</p>
                  <p className="text-sm font-medium">{new Date(checkOut).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-warm-bg rounded-lg">
                  <Users className="w-4 h-4 text-brand mx-auto mb-1" />
                  <p className="text-[11px] text-[#8a8984]">Guests</p>
                  <p className="text-sm font-medium">{guests}</p>
                </div>
              </div>
              <p className="text-sm text-[#5c5a54] text-center">
                {nights} night{nights > 1 ? 's' : ''} stay
              </p>
            </div>
          )}

          {/* Step 2 - Guest Details + Payment */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Guest Info */}
              <div className="bg-white rounded-xl border border-warm-border p-6 shadow-sm">
                <h2 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-4">
                  Guest Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                        errors.firstName ? 'border-red-400' : 'border-warm-border'
                      }`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                        errors.lastName ? 'border-red-400' : 'border-warm-border'
                      }`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                      errors.email ? 'border-red-400' : 'border-warm-border'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                    Special Requests (optional)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => updateField('specialRequests', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
                  />
                </div>
              </div>

              {/* Mock Payment */}
              <div className="bg-white rounded-xl border border-warm-border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-brand" />
                  <h2 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                    Payment Information
                  </h2>
                </div>
                <div className="mb-4">
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={formData.cardNumber}
                    onChange={(e) => updateField('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                    className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                      errors.cardNumber ? 'border-red-400' : 'border-warm-border'
                    }`}
                  />
                  {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => updateField('expiry', e.target.value.slice(0, 5))}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                        errors.expiry ? 'border-red-400' : 'border-warm-border'
                      }`}
                    />
                    {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="XXX"
                      value={formData.cvc}
                      onChange={(e) => updateField('cvc', e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                        errors.cvc ? 'border-red-400' : 'border-warm-border'
                      }`}
                    />
                    {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-[#8a8984]">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-xs">Secure payment - Mock payment for demo</span>
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-500 text-center">{errors.submit}</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-warm-border-strong rounded-md text-sm font-medium text-[#5c5a54] hover:bg-warm-secondary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                onClick={() => navigate(`/rooms/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-warm-border-strong rounded-md text-sm font-medium text-[#5c5a54] hover:bg-warm-secondary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Cancel
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : step === 2 ? (
                'Complete Booking'
              ) : (
                <>
                  Continue <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </main>

        {/* Summary Sidebar */}
        <aside className="lg:w-72 lg:min-w-[288px]">
          <div className="bg-white rounded-xl border border-warm-border p-5 shadow-sm lg:sticky lg:top-20">
            <h3 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-3">
              Booking Summary
            </h3>
            <div className="flex gap-3 mb-4">
              <img
                src={getPhotoUrl(room.photos?.[0])}
                alt={room.name}
                className="w-16 h-14 object-cover rounded-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getPhotoUrl('images/rooms/standard/standard.png');
                }}
              />
              <div>
                <p className="text-sm font-medium text-[#1a1917]">{room.name}</p>
                <p className="text-xs text-[#8a8984]">{nights} night{nights > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-warm-border pt-3">
              <div className="flex justify-between">
                <span className="text-[#5c5a54]">Subtotal</span>
                <span className="text-[#1a1917]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5c5a54]">Taxes (10%)</span>
                <span className="text-[#1a1917]">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-warm-border">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-warm-border">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#1a1917]">Cancellation Policy</p>
                  <p className="text-[11px] text-[#8a8984]">All confirmed bookings are non-cancellable and non-refundable</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
