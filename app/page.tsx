"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { db, auth } from "../firebase/config";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    setLoading(true);
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedUsername || trimmedUsername.length < 4) {
      setError("Username must be at least 4 characters.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
    }

    try {
      // 1. Check if username is already taken in Firestore
      const userRef = doc(db, "users", trimmedUsername);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setError("Username is already taken. Please choose another.");
        setLoading(false);
        return;
      }

      // 2. If username is available, create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Store user data in Firestore, linking the username to the unique UID
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });
      
      
        setLoading(false);
      
      
      
        router.replace('/profile');
      

    } catch (err) {
      const authError = err as AuthError;
      if (authError.code === 'auth/email-already-in-use') {
          setError("This email is already registered. Please log in.");
      } else {
          setError("Something went wrong. Please try again.");
      }
      console.error(authError);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="content-wrapper" style={{ paddingTop: '6.5rem' }}>
        <div className="card">
          <h1>Create Your Anonymous Messenger Account</h1>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={4}
                disabled={loading }
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading }
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading }
              />
            </div>
            {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
            
            <button type="submit" className="btn" disabled={loading }>
                {loading ? (
                  <span className="loader"></span>
                ) : "Create Account"}
            </button>
           
          </form>
          <p className="alreadyHaveAcc">
            Already have an account? <Link href="/login" style={{ color: '#8a2be2' }}>Log In</Link>
          </p>
        </div>
        
        <div className="card terms-card">
          <div className="terms-content">
            <h2 className="appinfo">More about Anonymous Messenger</h2>
            <p>
              This platform allows you to receive anonymous messages from anyone who has your unique link. 
              Share your profile Link and see what your friends, family, or colleagues have to say without revealing their identity.
            </p>
            <br />
            <h4>How it works:</h4>
            <ul>
              <li><strong>1. Sign Up:</strong> Create an account to get your unique link.</li>
              <li><strong>2. Share your link:</strong> Post it on social media or send it directly to friends.</li>
              <li><strong>3. Receive messages:</strong> Anyone with the link can send you an anonymous message.</li>
              <li><strong>4. View your messages:</strong> Check your Profile to see what people have sent.</li>
            </ul>
            <div className="terms-note">
              Note: All messages are stored securely and are only visible to you. We do not track who sends messages.
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}