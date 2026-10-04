import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Lock, ChevronLeft, ChevronRight, Shield, AlertTriangle, QrCode, Building2, ShieldCheck } from 'lucide-react';
import { getRoomById, createBooking, HOTEL_ADDONS, getPhotoUrl } from '@/lib/data';
import { validateStayDates } from '@/lib/dateUtils';
import { createMidtransSnapToken } from '@/lib/midtrans';
import Header from '@/components/Header';
import { useThemeLanguage } from '@/context/ThemeLanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

export default function BookingFlow() {
  const { t } = useThemeLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = parseInt(searchParams.get('roomId') || '0');
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  const [step, setStep] = useState(1);
  const [selectedAddons] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'qris' | 'va' | 'card'>('qris');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName: prev.lastName || user.lastName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

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
    setErrors({});

    try {
      const tempRefNum = Math.floor(10000 + Math.random() * 90000);
      const bookingRef = `BK-${tempRefNum}`;
      const orderId = `${bookingRef}-${Date.now().toString().slice(-4)}`;

      // 1. Request Snap Token from Midtrans
      const snapResponse = await createMidtransSnapToken({
        orderId,
        grossAmountIdr: total,
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || '',
        },
        itemDetails: [
          {
            id: `room-${roomId}`,
            price: total,
            quantity: 1,
            name: `${room.name} (${nights} night${nights > 1 ? 's' : ''})`,
          },
        ],
      });

      const proceedWithBooking = async () => {
        const booking = await createBooking({
          roomId,
          checkIn,
          checkOut,
          guestsCount: parseInt(guests),
          guestFirstName: formData.firstName,
          guestLastName: formData.lastName,
          guestEmail: formData.email,
          guestPhone: formData.phone || undefined,
          specialRequests: formData.specialRequests || undefined,
          userId: user?.id || null,
        });
        navigate(`/booking-confirmation?ref=${booking.bookingReference}&email=${encodeURIComponent(formData.email)}`);
      };

      // 2. Trigger Midtrans Snap popup
      if (window.snap && typeof window.snap.pay === 'function' && snapResponse?.token) {
        window.snap.pay(snapResponse.token, {
          onSuccess: async (result: unknown) => {
            console.log('Midtrans Payment Success:', result);
            await proceedWithBooking();
          },
          onPending: async (result: unknown) => {
            console.log('Midtrans Payment Pending:', result);
            await proceedWithBooking();
          },
          onError: (err: unknown) => {
            console.error('Midtrans Payment Error:', err);
            setErrors({ submit: 'Payment failed with Midtrans. Please choose another payment method or try again.' });
            setIsSubmitting(false);
          },
          onClose: () => {
            setIsSubmitting(false);
          },
        });
      } else if (snapResponse?.redirectUrl) {
        // Fallback for full page redirect if popup is blocked
        window.location.href = snapResponse.redirectUrl;
      } else {
        // Fallback if snap modal blocked or direct test mode
        await proceedWithBooking();
      }
    } catch (err: any) {
      console.error('Payment checkout error:', err);
      setErrors({ submit: err?.message || 'Failed to initiate payment. Please try again.' });
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
            <div className="flex items-center gap-2 sm:gap-3 font-sans font-semibold text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  step === 1
                    ? 'bg-[#414930] text-white border-[#414930] shadow-sm'
                    : 'bg-white text-[#76786e] border-[#e8e6e1] hover:border-[#414930]'
                }`}
              >
                1. {t('Review & Stay', 'Tinjau & Menginap')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && validateStep()) setStep(2);
                }}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  step === 2
                    ? 'bg-[#414930] text-white border-[#414930] shadow-sm'
                    : 'bg-white text-[#76786e] border-[#e8e6e1] hover:border-[#414930]'
                }`}
              >
                2. {t('Guest & Midtrans Payment', 'Tamu & Pembayaran Midtrans')}
              </button>
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
                  <p className="text-sm text-[#8a8984]">{formatCurrency(room.pricePerNight)}/night</p>
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
              <p className="text-sm text-[#5c5a54] text-center mb-6">
                {nights} night{nights > 1 ? 's' : ''} stay
              </p>

              {/* Step 1 Payment Preview Callout */}
              <div className="pt-5 border-t border-warm-border dark:border-[#30312f]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand dark:text-[#C5A059]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1a1917] dark:text-[#F7F5F2]">
                      {t('Payment Methods (Midtrans Gateway)', 'Metode Pembayaran (Midtrans Gateway)')}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Bank Indonesia Regulated
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg border border-warm-border dark:border-[#30312f] bg-[#fbf9f6] dark:bg-[#1C1C19]">
                    <QrCode className="w-5 h-5 text-brand dark:text-[#C5A059] mx-auto mb-1" />
                    <span className="text-xs font-semibold text-[#1a1917] dark:text-[#F7F5F2] block">QRIS</span>
                    <span className="text-[10px] text-[#8a8984] dark:text-[#ded9d6]">GoPay, BCA, OVO</span>
                  </div>
                  <div className="p-3 rounded-lg border border-warm-border dark:border-[#30312f] bg-[#fbf9f6] dark:bg-[#1C1C19]">
                    <Building2 className="w-5 h-5 text-brand dark:text-[#C5A059] mx-auto mb-1" />
                    <span className="text-xs font-semibold text-[#1a1917] dark:text-[#F7F5F2] block">Virtual Account</span>
                    <span className="text-[10px] text-[#8a8984] dark:text-[#ded9d6]">BCA, Mandiri, BRI</span>
                  </div>
                  <div className="p-3 rounded-lg border border-warm-border dark:border-[#30312f] bg-[#fbf9f6] dark:bg-[#1C1C19]">
                    <CreditCard className="w-5 h-5 text-brand dark:text-[#C5A059] mx-auto mb-1" />
                    <span className="text-xs font-semibold text-[#1a1917] dark:text-[#F7F5F2] block">Credit Cards</span>
                    <span className="text-[10px] text-[#8a8984] dark:text-[#ded9d6]">Visa, Mastercard, JCB</span>
                  </div>
                </div>
              </div>
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

              {/* Midtrans Payment Options */}
              <div className="bg-white dark:bg-[#242320] rounded-xl border border-warm-border dark:border-[#30312f] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-brand dark:text-[#C5A059]" />
                  <h2 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984] dark:text-[#ded9d6]">
                    {t('Payment Method (Midtrans Gateway)', 'Metode Pembayaran (Midtrans Gateway)')}
                  </h2>
                </div>

                <div className="space-y-3 mb-6 font-sans">
                  {/* QRIS */}
                  <label
                    onClick={() => setSelectedPaymentMethod('qris')}
                    className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'qris'
                        ? 'border-brand dark:border-[#C5A059] bg-brand-light/20 dark:bg-[#C5A059]/10 ring-1 ring-brand/30 dark:ring-[#C5A059]/30'
                        : 'border-warm-border dark:border-[#30312f] hover:border-warm-border-strong dark:hover:border-neutral-600 bg-white dark:bg-[#1C1C19]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPaymentMethod === 'qris'}
                      onChange={() => setSelectedPaymentMethod('qris')}
                      className="mt-1 text-brand dark:text-[#C5A059] focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1a1917] dark:text-[#F7F5F2] flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-brand dark:text-[#C5A059]" /> QRIS Instant Pay
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#8a8984] dark:text-[#C5A059]">Instant</span>
                      </div>
                      <p className="text-xs text-[#8a8984] dark:text-[#ded9d6] mt-0.5">
                        GoPay, BCA Mobile, OVO, Dana, LinkAja, ShopeePay
                      </p>
                    </div>
                  </label>

                  {/* Virtual Account */}
                  <label
                    onClick={() => setSelectedPaymentMethod('va')}
                    className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'va'
                        ? 'border-brand dark:border-[#C5A059] bg-brand-light/20 dark:bg-[#C5A059]/10 ring-1 ring-brand/30 dark:ring-[#C5A059]/30'
                        : 'border-warm-border dark:border-[#30312f] hover:border-warm-border-strong dark:hover:border-neutral-600 bg-white dark:bg-[#1C1C19]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPaymentMethod === 'va'}
                      onChange={() => setSelectedPaymentMethod('va')}
                      className="mt-1 text-brand dark:text-[#C5A059] focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1a1917] dark:text-[#F7F5F2] flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-brand dark:text-[#C5A059]" /> Virtual Account / Bank Transfer
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#8a8984] dark:text-[#C5A059]">Auto-Check</span>
                      </div>
                      <p className="text-xs text-[#8a8984] dark:text-[#ded9d6] mt-0.5">
                        BCA, Bank Mandiri, BNI, BRI, Permata Bank
                      </p>
                    </div>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'card'
                        ? 'border-brand dark:border-[#C5A059] bg-brand-light/20 dark:bg-[#C5A059]/10 ring-1 ring-brand/30 dark:ring-[#C5A059]/30'
                        : 'border-warm-border dark:border-[#30312f] hover:border-warm-border-strong dark:hover:border-neutral-600 bg-white dark:bg-[#1C1C19]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPaymentMethod === 'card'}
                      onChange={() => setSelectedPaymentMethod('card')}
                      className="mt-1 text-brand dark:text-[#C5A059] focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1a1917] dark:text-[#F7F5F2] flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-brand dark:text-[#C5A059]" /> Credit &amp; Debit Card (3D Secure)
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#8a8984] dark:text-[#C5A059]">PCI-DSS</span>
                      </div>
                      <p className="text-xs text-[#8a8984] dark:text-[#ded9d6] mt-0.5">
                        Visa, Mastercard, JCB, American Express
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-3 bg-warm-secondary/60 dark:bg-[#1C1C19] rounded-lg border border-warm-border dark:border-[#30312f] flex items-start gap-2.5 text-[#5c5a54] dark:text-[#ded9d6]">
                  <Lock className="w-4 h-4 text-brand dark:text-[#C5A059] mt-0.5 flex-shrink-0" />
                  <p className="text-xs leading-relaxed">
                    <strong>End-to-End Encrypted:</strong> {t('Your payment is securely processed through Midtrans PCI-DSS Level 1 gateway. Waminna Hotel does not store your card details.', 'Pembayaran Anda diproses secara aman melalui gateway Midtrans berstandar PCI-DSS Level 1. Waminna Hotel tidak menyimpan data kartu Anda.')}
                  </p>
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-500 text-center font-medium">{errors.submit}</p>
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
                <ChevronLeft className="w-4 h-4" /> {t('Back', 'Kembali')}
              </button>
            ) : (
              <button
                onClick={() => navigate(`/rooms/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-warm-border-strong rounded-md text-sm font-medium text-[#5c5a54] hover:bg-warm-secondary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> {t('Cancel', 'Batal')}
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
                t('Pay with Midtrans', 'Bayar dengan Midtrans')
              ) : (
                <>
                  {t('Continue', 'Lanjut')} <ChevronRight className="w-4 h-4" />
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
                <span className="text-[#1a1917]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5c5a54]">Taxes (10%)</span>
                <span className="text-[#1a1917]">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-warm-border">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
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
