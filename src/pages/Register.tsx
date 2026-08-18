import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/** Strip HTML tags and trim whitespace from user text input */
function sanitizeText(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

/** Validate password: min 8 chars, at least one letter and one number */
function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'Password must be at least 8 characters.';
  if (!/[a-zA-Z]/.test(pw)) return 'Password must contain at least one letter.';
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.';
  return null;
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const firstName = sanitizeText(form.firstName);
    const lastName = sanitizeText(form.lastName);
    const email = form.email.trim().toLowerCase();
    const phone = sanitizeText(form.phone);

    if (!firstName || !lastName || !email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const pwError = validatePassword(form.password);
    if (pwError) {
      setError(pwError);
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        email,
        password: form.password,
        firstName,
        lastName,
        phone: phone || undefined,
      });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error ?? 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={`${import.meta.env.BASE_URL}images/logo/waminna_logo.png`} alt="Waminna Hotel Logo" className="h-8 w-auto" />
          </Link>
          <h1 className="text-2xl font-semibold text-[#1a1917] mb-1">Create Account</h1>
          <p className="text-sm text-[#8a8984]">Join us for exclusive perks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div role="alert" className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-first-name" className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                First Name
              </label>
              <input
                id="reg-first-name"
                type="text"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                required
                autoComplete="given-name"
                className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
            <div>
              <label htmlFor="reg-last-name" className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
                Last Name
              </label>
              <input
                id="reg-last-name"
                type="text"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                required
                autoComplete="family-name"
                className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="reg-phone" className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
              Phone Number
            </label>
            <input
              id="reg-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              autoComplete="tel"
              className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="Optional"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="Min 8 chars, include a number"
            />
          </div>

          <div>
            <label htmlFor="reg-confirm-password" className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1">
              Confirm Password
            </label>
            <input
              id="reg-confirm-password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#8a8984] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
