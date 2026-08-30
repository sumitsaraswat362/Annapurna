'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, register, user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'farmer' | 'wholesaler'>('farmer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.push(user.role === 'wholesaler' ? '/wholesaler' : '/nerve-center');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name, role);
      }
      router.push(role === 'wholesaler' ? '/wholesaler' : '/nerve-center');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Annapurna</h1>
          <p className="text-white/40 text-sm mt-2">AI-Powered Agricultural Marketplace</p>
        </div>

        <div className="bg-[#1c1c1e] rounded-2xl border border-white/10 p-6">
          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button onClick={() => setMode('login')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-[#007AFF] text-white shadow-lg' : 'text-white/50 hover:text-white/70'}`}>Sign In</button>
            <button onClick={() => setMode('register')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-[#007AFF] text-white shadow-lg' : 'text-white/50 hover:text-white/70'}`}>Create Account</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007AFF]/50" placeholder="Rajesh Patel" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">I am a</label>
                  <select value={role} onChange={(e) => setRole(e.target.value as 'farmer' | 'wholesaler')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007AFF]/50 appearance-none">
                    <option value="farmer" className="bg-[#1c1c1e]">Farmer</option>
                    <option value="wholesaler" className="bg-[#1c1c1e]">Buyer / Wholesaler</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007AFF]/50" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007AFF]/50" placeholder="Min. 6 characters" />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-[#007AFF] hover:bg-[#0071E3] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] text-white/30">🔒 Secured with Firebase Authentication & Google Cloud Secret Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}
