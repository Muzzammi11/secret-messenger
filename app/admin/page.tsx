"use client";

import { useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import  './admin.css'

// Define a type for our message objects
interface Message {
  id: string;
  text: string;
  timestamp: Timestamp | null;
  ip?: string;
  city?: string;
  country?: string;
}

export default function AdminPage() {
  // State for messages
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  
  // State for loading and authentication
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State for filters, same as your original project
  const [searchTerm, setSearchTerm] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Effect for authentication and initial data fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const messagesRef = collection(db, "messages");
          const q = query(messagesRef, orderBy("timestamp", "desc"));
          const querySnapshot = await getDocs(q);
          const fetchedMessages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Message[];
          setAllMessages(fetchedMessages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Effect for filtering and sorting messages
  useEffect(() => {
    let messages = [...allMessages];

    if (searchTerm) {
      messages = messages.filter(msg => msg.text.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (ipFilter) {
      messages = messages.filter(msg => msg.ip?.includes(ipFilter));
    }
    if (countryFilter) {
      messages = messages.filter(msg => msg.country?.toLowerCase().includes(countryFilter.toLowerCase()));
    }
    if (sortOrder === 'oldest') {
      messages.sort((a, b) => (a.timestamp?.toMillis() ?? 0) - (b.timestamp?.toMillis() ?? 0));
    } else {
      messages.sort((a, b) => (b.timestamp?.toMillis() ?? 0) - (a.timestamp?.toMillis() ?? 0));
    }

    setFilteredMessages(messages);
  }, [allMessages, searchTerm, ipFilter, countryFilter, sortOrder]);

  // Calculate stats using useMemo for efficiency
  const stats = useMemo(() => {
    const uniqueIPs = new Set(allMessages.map(msg => msg.ip).filter(Boolean));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMessages = allMessages.filter(msg => msg.timestamp && msg.timestamp.toDate() >= today).length;
    
    return {
      total: allMessages.length,
      uniqueIPs: uniqueIPs.size,
      today: todayMessages,
    };
  }, [allMessages]);

  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'No date';
    return timestamp.toDate().toLocaleString();
  };

  return (
    <div className="admin-container">
      
      <div className="admin-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem' }}>
        <button className='homeButton' onClick={() => router.push('/')} >
          Go Back
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1><i className="fas fa-shield-alt"></i> Admin Panel</h1>
          <p>Monitor messages and user activity</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.uniqueIPs}</div>
          <div className="stat-label">Unique IPs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.today}</div>
          <div className="stat-label">Today&apos;s Messages</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input type="text" className="filter-input" placeholder="Search messages..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <input type="text" className="filter-input" placeholder="Filter by IP..." value={ipFilter} onChange={e => setIpFilter(e.target.value)} />
        <input type="text" className="filter-input" placeholder="Filter by country..." value={countryFilter} onChange={e => setCountryFilter(e.target.value)} />
        <select className="filter-input" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Messages Grid */}
      <div className="messages-grid">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="message-content">{msg.text}</div>
              <div className="message-meta">
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>{formatDate(msg.timestamp)}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-globe"></i>
                  <span>{msg.ip || 'Unknown'}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{msg.city && msg.country ? `${msg.city}, ${msg.country}` : 'Unknown Location'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-messages">No messages match your filters.</div>
        )}
      </div>
    </div>
  );
}