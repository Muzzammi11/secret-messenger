"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../firebase/config";
//import footer
import Footer from "../components/Footer";
const db = getFirestore(app);

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const trimmed = username.trim().toLowerCase();
    if (!trimmed || trimmed.length < 3) {
      setError("Username must be at least 3 characters.");
      setLoading(false);
      return;
    }
    try {
      const userRef = doc(db, "users", trimmed);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setError("Username is already taken.");
        setLoading(false);
        return;
      }
      await setDoc(userRef, { createdAt: Date.now() });
     
      if (typeof window !== 'undefined') {
        document.cookie = `owner_username=${trimmed}; path=/; max-age=${60 * 60 * 24 * 365 * 10}`;
      }
      router.push(`/${trimmed}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Navbar (same style as owner navbar, no logout) */}
      <nav className="main-navbar">
        <div className="main-navbar-center">
          <span className="main-navbar-title">
            Anonymous Messenger
          </span>
        </div>
      </nav>
      {/* Main content with padding for navbar */}
      <div className="content-wrapper" style={{ paddingTop: '6.5rem' }}>
        <div className="card" >
          <h1>Enter Your Username</h1>
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
                minLength={3}
                autoFocus
              />
            </div>
            {error && (
              <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>
            )}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Creating..." : "Create Your Link"}
            </button>
          </form>
        </div>

        <div className="card terms-card">
          <div className="terms-content">
            <h2 className=" appinfo ">More about Anonymous Messenger</h2>
            <p>
              This platform allows you to receive anonymous messages from anyone who has your unique link. 
              Share your profile and see what your friends, family, or colleagues have to say without revealing their identity.
            </p>
            <br />
            <h4>How it works:</h4>
            <ul>
              <li><strong>1. Create your Link:</strong> This creates your unique link.</li>
              <li><strong>2. Share your link:</strong> Post it on social media or send it directly to friends.</li>
              <li><strong>3. Receive messages:</strong> Anyone with the link can send you an anonymous message.</li>
              <li><strong>4. View your messages:</strong> Check your dashboard to see what people have sent.</li>
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