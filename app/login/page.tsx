// app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "../../firebase/config";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1. Sign in the user with Firebase Auth
            await signInWithEmailAndPassword(auth, email, password);
            // 2. Start the top progress bar and navigate to the profile
           
            router.replace('/profile');
            // We don't setLoading(false) on success because the page is changing
        } catch (err) {
            // 3. Handle specific Firebase authentication errors
            const authError = err as AuthError;
            console.error("Firebase Auth Error:", authError.code);
            
            if (authError.code === 'auth/invalid-credential') {
                setError("Incorrect email or password. Please try again.");
            } else if (authError.code === 'auth/invalid-email') {
                setError("The email address is not valid. Please check the format.");
            } else if (authError.code === 'auth/too-many-requests') {
                setError("Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
         
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper" style={{ paddingTop: '6.5rem' }}>
            <div className="card">
                <h1>Log In</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
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
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? <span className="loader"></span> : "Log In"}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    Don&apos;t have an account? <Link href="/" style={{ color: '#8a2be2' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}