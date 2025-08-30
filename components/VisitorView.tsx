//vistorView.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Typewriter } from 'react-simple-typewriter';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Footer from './Footer';

// --- Component Props ---
interface VisitorViewProps {
  username: string;
}

// --- Component ---
export default function VisitorView({ username }: VisitorViewProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        to: username,
        text: message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
      setShowRegisterPrompt(true);
      setStatus("✓ Message sent successfully!");
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Error: Could not send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <header>
        <h1>Anonymous Messenger</h1>
        <div className="subtitle">
            <Typewriter
                words={[`Send an anonymous message to ${username}.`]}
                cursor
                cursorStyle="_"
                typeSpeed={70}
            />
        </div>
      </header>
      <main>
        <div className="card">
            <form id="messageForm" onSubmit={sendMessage}>
                <div className="form-group">
                    <label htmlFor="message">Your Secret Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What's on your mind?"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn" disabled={isSending}>
                    {isSending ? "Sending..." : "Send Message"}
                </button>
                {status && <p className="form-status">{status}</p>}
                {showRegisterPrompt && (
                    <p className="registerLink">
                        Want to receive your own anonymous messages?{" "}
                        <Link href="/">Create your link here</Link>
                    </p>
                )}
            </form>
        </div>
        <div className="card terms-card">
          <h3 className="terms-header">Terms of Use</h3>
          <div className="terms-content">
            <p>
              <strong>Please be respectful and responsible:</strong>
            </p>
            <ul>
              <li>❌ No spam, harassment, or inappropriate messages</li>
              <li>❌ No personal information or doxxing</li>
              <li>❌ No threats, hate speech, or bullying</li>
            </ul>
            <p className="terms-note">
              Note: The receiver will not know who sent the message. All messages are anonymous.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}