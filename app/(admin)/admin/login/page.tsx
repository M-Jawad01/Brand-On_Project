'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } else {
      toast.error('Invalid password');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-base">
      <div className="bg-brand-secondary rounded-xl p-8 w-full max-w-md border border-brand-accent/30">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}