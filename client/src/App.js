import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

function App() {
  const [contacts, setContacts] = useState([]);
  const [sortBy, setSortBy] = useState('date-new');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/contacts');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch contacts');
      }

      setContacts(result.data || []);
    } catch (err) {
      setError('Failed to load contacts. Make sure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdded = (newContact) => {
    setContacts((prev) => [newContact, ...prev]);
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete contact');
      }

      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError('Failed to delete contact. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-center py-8 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Contact Management
        </h1>
        <p className="text-base md:text-lg opacity-90">
          Add, view, and manage your contacts
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 bg-yellow-100 text-yellow-800 px-4 py-3 rounded border-l-4 border-yellow-500">
              {error}
            </div>
          )}

          <div className="flex justify-center mb-10">
                <div className="w-full max-w-xl">
                    <ContactForm onContactAdded={handleContactAdded} />
                </div>
            </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 text-gray-600 text-lg">
              Loading contacts...
            </div>
          ) : (
            <ContactList
              contacts={contacts}
              onDelete={handleDeleteContact}
              sortBy={sortBy}
              onSort={setSortBy}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
