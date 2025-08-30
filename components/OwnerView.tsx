//components/OwnerView.tsx
"use client";

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc, getDocs, Timestamp } from 'firebase/firestore';
import { signOut, deleteUser, User, AuthError } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import Footer from './Footer';

// --- Interfaces & Helper Functions ---
interface Message {
  id: string;
  to: string;
  text: string;
  timestamp: Timestamp;
}

const formatTimestamp = (fbTimestamp: Timestamp | null): string => {
  if (!fbTimestamp) return "Just now";
  return fbTimestamp.toDate().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// --- Component Props ---
interface OwnerViewProps {
  username: string;
  currentUser: User;
}

// --- Component ---
export default function OwnerDashboard({ username, currentUser }: OwnerViewProps) {
  const router = useRouter();
  
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [pageUrl, setPageUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  
  // Dialog states
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showDeleteMessageDialog, setShowDeleteMessageDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  useEffect(() => {
    setPageUrl(`${window.location.origin}/${username}`);
  }, [username]);

  // Real-time message listener effect
  useEffect(() => {
    setLoadingMessages(true);
    const q = query(collection(db, "messages"), where("to", "==", username), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message));
      setMessages(msgs);
      setLoadingMessages(false);
    });
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [username]);
  
  // --- Action Handlers ---
  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopyStatus("Link Copied!");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setShowSignOutDialog(false);
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      const messagesQuery = query(collection(db, "messages"), where("to", "==", username));
      const messagesSnapshot = await getDocs(messagesQuery);
      const deletePromises = messagesSnapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
      await deleteDoc(doc(db, "users", username));
      await deleteUser(currentUser);
      router.push("/");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error deleting account:", authError);
      if (authError.code === 'auth/requires-recent-login') {
        alert("This is a sensitive operation. Please log out and log back in before deleting your account.");
        await signOut(auth);
        router.push('/login');
      }
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    await deleteDoc(doc(db, "messages", messageToDelete));
    setShowDeleteMessageDialog(false);
    setMessageToDelete(null);
  };

  return (
    <>
      <nav className="main-navbar">
        <div className="main-navbar-spacer"></div>
        <div className="main-navbar-center">
            
            <span className="main-navbar-title">Anonymous Messenger</span>
        </div>


        <div className="main-navbar-logout">
            {/* Kept new buttons but you can style them further if needed */}
            <button 
              type="button"
              onClick={() => setShowSignOutDialog(true)} className="btn-secondary">Sign Out</button>
            <button 
              type="button"
              onClick={() => setShowDeleteAccountDialog(true)} className="btn-danger">Delete Account</button>
        </div>
      </nav>
      
      {/* --- Dialogs / Modals (with old styling) --- */}
      {showSignOutDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <button onClick={() => setShowSignOutDialog(false)} className="dialog-close-btn" aria-label="Close">&times;</button>
            <h2 className="dialog-header">Sign Out?</h2>
            <p className="dialog-text">Are you sure you want to sign out?</p>
            <div className="dialog-actions">
              <button className="btn" onClick={handleSignOut}>Yes, Sign Out</button>
              <button className="btn" onClick={() => setShowSignOutDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteAccountDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <button onClick={() => setShowDeleteAccountDialog(false)} className="dialog-close-btn" aria-label="Close">&times;</button>
            <h2 className="dialog-header">Delete Account?</h2>
            <p className="dialog-text">This is permanent and cannot be undone. All your messages and your link will be deleted forever.</p>
            <div className="dialog-actions">
              <button className="btn" onClick={handleDeleteAccount}>Yes, Delete Everything</button>
              <button className="btn" onClick={() => setShowDeleteAccountDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteMessageDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <button onClick={() => setShowDeleteMessageDialog(false)} className="dialog-close-btn" aria-label="Close">&times;</button>
            <h2 className="dialog-header">Delete Message?</h2>
            <p className="dialog-text">Are you sure you want to delete this message forever?</p>
            {/* Applied old horizontal button style */}
            <div className="dialog-actions-horizontal">
              <button className="btn-small" onClick={handleDeleteMessage}>YES</button>
              <button className="btn-small bordered" onClick={() => setShowDeleteMessageDialog(false)}>NO</button>
            </div>
          </div>
        </div>
      )}

      <div className="container content-wrapper">
        {/* --- Link Card (with old styling) --- */}
        <div className="card text-center">
          <h1 className="card-titlecopylink">Your Link</h1>
          <p className="card-subtitle">
            Share this link with your friends and receive anonymous messages!
          </p>
          <div className="link-display-box">{pageUrl}</div>
          <button onClick={handleCopy} className="btn">Copy This Link</button>
          {/* Added separate span for copy status to match old design */}
          {copyStatus && <span className="copy-status">{copyStatus}</span>}
        </div>

        {/* --- Inbox Card (with old styling) --- */}
        <div className="card">
          {/* Added inbox-header div for structure */}
          <div className="inbox-header">
            <h2 className="card-title text-center" style={{ margin: 0, paddingBottom: "2rem" }}>Inbox</h2>
          </div>
          {loadingMessages ? (
            <p className="text-center">Loading messages...</p>
          ) : messages.length === 0 ? (
            <div className="empty-messages-placeholder">
              You haven&apos;t received any messages yet. Share your link to get started!
            </div>
          ) : (
            <ul className="messages-list">
              {messages.map((msg) => (
                <li key={msg.id} className="message-item">
                  <div className="message-bubble">
                    <p className="message-text">{msg.text}</p>
                  </div>
                  <div className="message-meta">
                    <p className="message-time">{formatTimestamp(msg.timestamp)}</p>
                    <button
                      onClick={() => {
                        setMessageToDelete(msg.id);
                        setShowDeleteMessageDialog(true);
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