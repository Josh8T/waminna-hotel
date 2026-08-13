import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
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
          <h1 className="text-2xl font-semibold text-[#1a1917] mb-1">Welcome back</h1>
          <p className="text-sm text-[#8a8984]">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8a8984] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="Enter your password"
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
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#8a8984] mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-brand font-medium hover:underline">
            Create one
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-warm-border text-center">
          <p className="text-xs text-[#8a8984] mb-2">Demo credentials</p>
          <p className="text-xs text-[#8a8984]">Admin: admin@charlesstay.com / admin123</p>
          <p className="text-xs text-[#8a8984]">Staff: staff@charlesstay.com / staff123</p>
        </div>
      </div>
    </div>
  );
}
