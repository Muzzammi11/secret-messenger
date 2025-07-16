"use client";

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Use the imported auth instance directly
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: unknown) {
      setError('Failed to log in. Please check your email and password.');
      console.error(err);
    }
  };

  return (
    <div style={{ paddingTop: '5rem' }}>
      <div className="card" style={{ maxWidth: '500px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}