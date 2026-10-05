import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Lock, ChevronLeft, Shield, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getRoomById, createBooking, HOTEL_ADDONS, getPhotoUrl } from '@/lib/data';
import { validateStayDates } from '@/lib/dateUtils';
import { createMidtransSnapToken, verifyMidtransPayment } from '@/lib/midtrans';
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

  const [selectedAddons] = useState<string[]>([]);
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
        firstName: user.firstName || prev.firstName || '',
        lastName: user.lastName || prev.lastName || '',
        email: user.email || prev.email || '',
        phone: user.phone || prev.phone || '',
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('First name is required', 'Nama depan wajib diisi');
    if (!formData.lastName.trim()) newErrors.lastName = t('Last name is required', 'Nama belakang wajib diisi');
    if (!formData.email.trim()) newErrors.email = t('Email is required', 'Email wajib diisi');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('Invalid email address', 'Alamat email tidak valid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (validateForm()) {
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

      const proceedWithBooking = async (
        bookingStatus: 'confirmed' | 'pending' = 'confirmed',
        paymentStatus: 'paid' | 'pending' = 'paid'
      ) => {
        const booking = await createBooking({
          bookingReference: orderId,
          status: bookingStatus,
          paymentStatus: paymentStatus,
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
          onSuccess: async (result: any) => {
            console.log('Midtrans Payment Success event:', result);
            // Server-side verification of payment before confirming
            try {
              const verifyRes = await verifyMidtransPayment(orderId);
              if (
                verifyRes.isPaid ||
                result?.transaction_status === 'settlement' ||
                (result?.transaction_status === 'capture' && result?.fraud_status === 'accept')
              ) {
                await proceedWithBooking('confirmed', 'paid');
              } else if (verifyRes.isPending || result?.transaction_status === 'pending') {
                await proceedWithBooking('pending', 'pending');
              } else {
                setIsSubmitting(false);
                setErrors({
                  submit: t(
                    'Payment was not verified by the payment gateway. Please contact hotel support if your account was charged.',
                    'Pembayaran belum dapat diverifikasi oleh gateway pembayaran. Silakan hubungi hotel jika saldo Anda terpotong.'
                  ),
                });
              }
            } catch {
              // Fallback to SDK result check if verification endpoint experiences network blip
              if (
                result?.transaction_status === 'settlement' ||
                (result?.transaction_status === 'capture' && result?.fraud_status === 'accept')
              ) {
                await proceedWithBooking('confirmed', 'paid');
              } else {
                setIsSubmitting(false);
                setErrors({
                  submit: t('Payment verification failed. Please try again.', 'Verifikasi pembayaran gagal. Silakan coba lagi.'),
                });
              }
            }
          },
          onPending: async (result: any) => {
            console.log('Midtrans Payment Pending event:', result);
            // A payment code/VA was issued but payment is not complete yet
            await proceedWithBooking('pending', 'pending');
          },
          onError: (err: any) => {
            console.error('Midtrans Payment Error:', err);
            setIsSubmitting(false);
            setErrors({
              submit: t(
                'Payment was declined or failed with Midtrans. Please choose another payment method or try again.',
                'Pembayaran ditolak atau gagal melalui Midtrans. Silakan gunakan metode lain atau coba lagi.'
              ),
            });
          },
          onClose: () => {
            console.log('Midtrans Snap modal closed without completing payment');
            setIsSubmitting(false);
            setErrors({
              submit: t(
                'Payment was cancelled or closed. Your reservation was not placed.',
                'Pembayaran dibatalkan atau ditutup. Reservasi Anda belum dibuat.'
              ),
            });
          },
        });
      } else if (snapResponse?.redirectUrl) {
        // Fallback for full page redirect if popup is blocked
        window.location.href = snapResponse.redirectUrl;
      } else {
        // Secure fallback: NEVER auto-confirm booking if payment modal cannot open
        setIsSubmitting(false);
        setErrors({
          submit: t(
            'Unable to launch payment modal. Please refresh the page and try again.',
            'Tidak dapat membuka jendela pembayaran. Silakan muat ulang halaman dan coba lagi.'
          ),
        });
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
                {t('Reservation Checkout', 'Checkout Reservasi')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-normal text-[#1c1b19]">
                {t('Review Stay & Guest Details', 'Tinjau Menginap & Data Tamu')}
              </h1>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 font-sans font-semibold text-xs text-[#76786e]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e8e6e1] rounded-full text-[#414930] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#414930]" />
                {t('Secure Checkout', 'Checkout Aman')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Form */}
        <main className="flex-1 space-y-6">
          {/* Review Stay */}
          <div className="bg-white rounded-xl border border-warm-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1a1917] mb-4">
              {t('Review Your Stay', 'Tinjau Menginap Anda')}
            </h2>
            <div className="flex gap-4 p-4 bg-warm-bg dark:bg-[#1C1C19] rounded-lg mb-6 items-center">
              <div className="w-24 h-20 min-w-[96px] overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800 border border-warm-border/50">
                <img
                  src={getPhotoUrl(room.photos?.[0])}
                  alt={room.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getPhotoUrl('images/rooms/standard/standard.png');
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1917] dark:text-[#F7F5F2]">{room.name}</h3>
                <p className="text-sm text-[#8a8984] dark:text-[#ded9d6]">{formatCurrency(room.pricePerNight)}/night</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="p-3 bg-warm-bg rounded-lg">
                <Calendar className="w-4 h-4 text-brand mx-auto mb-1" />
                <p className="text-[11px] text-[#8a8984]">{t('Check-in', 'Check-in')}</p>
                <p className="text-sm font-medium">{new Date(checkIn).toLocaleDateString()}</p>
              </div>
              <div className="p-3 bg-warm-bg rounded-lg">
                <Calendar className="w-4 h-4 text-brand mx-auto mb-1" />
                <p className="text-[11px] text-[#8a8984]">{t('Check-out', 'Check-out')}</p>
                <p className="text-sm font-medium">{new Date(checkOut).toLocaleDateString()}</p>
              </div>
              <div className="p-3 bg-warm-bg rounded-lg">
                <Users className="w-4 h-4 text-brand mx-auto mb-1" />
                <p className="text-[11px] text-[#8a8984]">{t('Guests', 'Tamu')}</p>
                <p className="text-sm font-medium">{guests}</p>
              </div>
            </div>
            <p className="text-sm text-[#5c5a54] text-center">
              {nights} night{nights > 1 ? 's' : ''} stay
            </p>
          </div>

          {/* Guest Info */}
          <div className="bg-white rounded-xl border border-warm-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">
                {t('Guest Information', 'Informasi Tamu')}
              </h2>
              {user && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#785927] dark:text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" />
                  {t('Locked to account data', 'Terkunci sesuai data akun')}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                  {t('First Name', 'Nama Depan')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  readOnly={!!user}
                  className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none ${
                    user
                      ? 'bg-neutral-100 dark:bg-[#1C1C19] text-neutral-600 dark:text-neutral-300 cursor-not-allowed border-warm-border'
                      : errors.firstName
                      ? 'border-red-400 focus:ring-2 focus:ring-brand/20 focus:border-brand'
                      : 'border-warm-border focus:ring-2 focus:ring-brand/20 focus:border-brand'
                  }`}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                  {t('Last Name', 'Nama Belakang')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  readOnly={!!user}
                  className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none ${
                    user
                      ? 'bg-neutral-100 dark:bg-[#1C1C19] text-neutral-600 dark:text-neutral-300 cursor-not-allowed border-warm-border'
                      : errors.lastName
                      ? 'border-red-400 focus:ring-2 focus:ring-brand/20 focus:border-brand'
                      : 'border-warm-border focus:ring-2 focus:ring-brand/20 focus:border-brand'
                  }`}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                {t('Email Address', 'Alamat Email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                readOnly={!!user}
                className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none ${
                  user
                    ? 'bg-neutral-100 dark:bg-[#1C1C19] text-neutral-600 dark:text-neutral-300 cursor-not-allowed border-warm-border'
                    : errors.email
                    ? 'border-red-400 focus:ring-2 focus:ring-brand/20 focus:border-brand'
                    : 'border-warm-border focus:ring-2 focus:ring-brand/20 focus:border-brand'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                {t('Phone Number', 'Nomor Telepon')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                readOnly={!!user && !!user.phone}
                className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none ${
                  user && user.phone
                    ? 'bg-neutral-100 dark:bg-[#1C1C19] text-neutral-600 dark:text-neutral-300 cursor-not-allowed border-warm-border'
                    : 'border-warm-border focus:ring-2 focus:ring-brand/20 focus:border-brand'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                {t('Special Requests (optional)', 'Permintaan Khusus (opsional)')}
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => updateField('specialRequests', e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
              />
            </div>
          </div>

          {/* Secure Payment Note */}
          <div className="p-4 bg-white dark:bg-[#242320] rounded-xl border border-warm-border dark:border-[#30312f] shadow-sm flex items-start gap-3">
            <Lock className="w-4 h-4 text-brand dark:text-[#C5A059] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[#5c5a54] dark:text-[#ded9d6] space-y-1">
              <p className="font-semibold text-[#1a1917] dark:text-[#F7F5F2]">
                {t('Secure Payment with Midtrans', 'Pembayaran Aman dengan Midtrans')}
              </p>
              <p className="leading-relaxed">
                {t(
                  'Clicking "Pay" opens the encrypted payment window to pay using QRIS, Virtual Accounts (BCA, Mandiri, BNI, BRI), or Credit Cards.',
                  'Klik "Bayar" untuk membuka jendela pembayaran terenkripsi menggunakan QRIS, Transfer Virtual Account (BCA, Mandiri, BNI, BRI), atau Kartu Kredit.'
                )}
              </p>
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center font-medium">{errors.submit}</p>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate(`/rooms/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-warm-border-strong rounded-md text-sm font-medium text-[#5c5a54] hover:bg-warm-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> {t('Back', 'Kembali')}
            </button>
            <button
              onClick={handlePay}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-8 py-2.5 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50 min-w-[120px] shadow-sm"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t('Pay', 'Bayar')
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
