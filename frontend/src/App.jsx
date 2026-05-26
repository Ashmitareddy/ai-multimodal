import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogEntryForm from './components/LogEntryForm';
import Timeline from './components/Timeline';
import { BookHeart } from 'lucide-react';

function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/api/diary');
      if (response.data.success) {
        setEntries(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch entries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEntryAdded = (newEntry) => {
    setEntries(prev => [newEntry, ...prev]);
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-textDark flex items-center gap-2">
            <BookHeart className="text-accentPink" size={32} />
            Digital Vibe Diary
          </h1>
          <p className="text-textMuted mt-1">Log your thoughts and photo dumps.</p>
        </div>
      </header>

      <main className="space-y-8">
        <LogEntryForm onEntryAdded={handleEntryAdded} />
        {loading ? (
          <div className="text-center text-textMuted">Loading timeline...</div>
        ) : (
          <Timeline entries={entries} />
        )}
      </main>
    </div>
  );
}

export default App;
