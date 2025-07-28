"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link'; // Import Link for proper navigation
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { app } from "../../firebase/config";
import { Typewriter } from "react-simple-typewriter";
import { addDoc, serverTimestamp } from "firebase/firestore";
import Footer from "@/components/Footer";

const db = getFirestore(app);

// FIX: Added a specific type for message objects to remove the 'any' type error.
interface Message {
  id: string;
  to: string;
  text: string;
  timestamp: Timestamp;
}

// Utility to get a cookie value by name
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

// Helper function to format Firestore Timestamps
const formatTimestamp = (fbTimestamp: Timestamp | null): string => {
  if (!fbTimestamp) {
    return "Just now";
  }
  const date = fbTimestamp.toDate();
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function UserProfilePage() {
  const { username } = useParams();
  const usernameStr = Array.isArray(username) ? username[0] : username;
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]); // Using the new Message type
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState("");
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  // IMPROVEMENT: Defined message fetching logic once to avoid duplication.
  const fetchMessages = useCallback(async () => {
    if (isOwner && usernameStr) {
      setLoading(true);
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("to", "==", usernameStr),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      setMessages(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message))
      );
      setLoading(false);
    }
  }, [isOwner, usernameStr]); // Dependencies for useCallback

  useEffect(() => {
    setMounted(true);
    setPageUrl(`${window.location.origin}/${usernameStr}`);
  }, [usernameStr]);

  // Check cookie for ownership
  useEffect(() => {
    if (!usernameStr) return;
    if (typeof document !== "undefined") {
      const cookieUsername = getCookie("owner_username");
      setIsOwner(cookieUsername === usernameStr);
    }
  }, [usernameStr]);

  // Fetch messages on initial load
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleCopy = () => {
    if (!pageUrl) return;
    navigator.clipboard.writeText(pageUrl);
    setCopyStatus("Message Copied");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  const handleLogout = async () => {
    if (!usernameStr) return;
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("to", "==", usernameStr));
    const querySnapshot = await getDocs(q);
    const batchDeletes = querySnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "messages", docSnap.id))
    );
    await Promise.all(batchDeletes);
    await deleteDoc(doc(db, "users", usernameStr.toString()));
    if (typeof document !== "undefined") {
      document.cookie = "owner_username=; path=/; max-age=0";
    }
    router.push("/");
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await deleteDoc(doc(db, "messages", messageToDelete));
      setMessages((currentMessages) =>
        currentMessages.filter((msg) => msg.id !== messageToDelete)
      );
      setShowDeleteDialog(false);
      setMessageToDelete(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      setShowDeleteDialog(false);
      setMessageToDelete(null);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true);
    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        to: usernameStr,
        text: message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
      setShowRegisterPrompt(true);
      setStatus("✓ Message sent successfully!");
      setTimeout(() => setStatus(""), 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Error: Could not send message.");
      setTimeout(() => setStatus(""), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || isOwner === null) return null;

  if (isOwner) {
    return (
      <>
        <nav className="main-navbar">
          <div className="main-navbar-spacer"></div>
          <div className="main-navbar-center">
            <span className="main-navbar-title">Anonymous Messenger</span>
          </div>
          <div className="main-navbar-logout">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="logout-icon-btn"
              aria-label="Logout"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </nav>

        {showLogoutDialog && (
          <div className="dialog-overlay">
            <div className="dialog-box">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="dialog-close-btn"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="dialog-header">Logout Confirmation</h2>
              <p className="dialog-text">
                Are you sure you want to logout? This will{" "}
                <b>delete all of your data</b>.
              </p>
              <div className="dialog-actions">
                <button className="btn" onClick={handleLogout}>
                  Yes
                </button>
                <button
                  className="btn"
                  onClick={() => setShowLogoutDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteDialog && (
          <div className="dialog-overlay">
            <div className="dialog-box">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="dialog-close-btn"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="dialog-header">Delete Message?</h2>
              <p className="dialog-text">
                Are you sure you want to delete this message.
              </p>
              <div className="dialog-actions-horizontal">
                <button className="btn-small" onClick={handleDeleteMessage}>
                  YES
                </button>
                <button
                  className="btn-small bordered"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container content-wrapper">
          <div className="card text-center">
            <h1 className="card-titlecopylink ">Your Link</h1>
            <p className="card-subtitle">
              Share this link with your friends and recieve anonymous messages!
            </p>
            <div className="link-display-box">{pageUrl}</div>
            <button onClick={handleCopy} className="btn">
              Copy This Link
            </button>
            {copyStatus && <span className="copy-status">{copyStatus}</span>}
          </div>

          <div className="card">
            <div className="inbox-header">
              <h2
                className="card-title text-center"
                style={{ margin: 0, paddingBottom: "2rem" }}
              >
                Inbox
              </h2>
              <button
                className="refresh-icon-btn"
                title="Refresh"
                aria-label="Refresh messages"
                onClick={fetchMessages} // Calling the single, efficient function
                disabled={loading}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
            {loading ? (
              <p className="text-center">Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="empty-messages-placeholder">
                No Messages Yet! Share your link on social media to start the
                fun.
              </div>
            ) : (
              <ul className="messages-list">
                {messages.map((msg) => (
                  <li key={msg.id} className="message-item">
                    <div className="message-bubble">
                      <p className="message-text">{msg.text}</p>
                    </div>
                    <div className="message-meta">
                      <p className="message-time">
                        {formatTimestamp(msg.timestamp)}
                      </p>
                      <button
                        onClick={() => {
                          setMessageToDelete(msg.id);
                          setShowDeleteDialog(true);
                        }}
                        className="delete-message-btn"
                        aria-label="Delete message"
                        title="Delete message"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Visitor View
  return (
    <>
      <header>
        <h1>Anonymous Messenger</h1>
        <div className="subtitle">
          <Typewriter
            words={[`Send anonymous messages to ${usernameStr}.`]}
            cursor
            cursorStyle=""
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
              {isLoading ? "Sending..." : "Send Message"}
            </button>
            {status && <p className="form-status">{status}</p>}
            {showRegisterPrompt && (
              <p className="registerLink">
                Register to create your own anonymous link{" "}
                {/* FIX: Replaced <a> with <Link> to fix navigation error */}
                <Link href="/">
                  Click here
                </Link>
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

      <footer
        style={{
          width: "100%",
          backgroundColor: "#1a1a1a",
          color: "#888",
          padding: "2rem 1rem",
          borderTop: "1px solid rgba(138, 43, 226, 0.2)",
          textAlign: "center",
          marginTop: "4rem",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <p className="footer-text">
            &copy; {new Date().getFullYear()} Anonymous Messenger | Made in
            <span> Kashmir 🍁</span>
          </p>
          <p className="footer-tagline">
            Stop stalking 👀... you could&rsquo;ve just sent a message, y&apos;know?
          </p>
        </div>
      </footer>
    </>
  );
}