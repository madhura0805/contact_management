import React from 'react';
import '../index.css';

const ContactList = ({ contacts, onDelete, sortBy, onSort }) => {
  const sortedContacts = [...contacts].sort((a, b) => {
    if (sortBy === 'date-new') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'date-old') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  if (contacts.length === 0) {
    return (
      <div className="p-6 bg-white rounded shadow text-center text-gray-500">
        No contacts yet. Add one to get started!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          Contacts ({contacts.length})
        </h2>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSort(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="date-new">Newest First</option>
            <option value="date-old">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sortedContacts.map((contact) => (
          <div
            key={contact._id}
            className="bg-gray-50 border border-gray-200 rounded p-4 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium text-gray-800">
                {contact.name}
              </h3>

              <button
                className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
                onClick={() => {
                  if (window.confirm(`Delete contact "${contact.name}"?`)) {
                    onDelete(contact._id);
                  }
                }}
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Email: </span>
                <a href={`mailto:${contact.email}`} className="text-green-600">
                  {contact.email}
                </a>
              </div>

              <div>
                <span className="font-semibold">Phone: </span>
                <a href={`tel:${contact.phone}`} className="text-green-600">
                  {contact.phone}
                </a>
              </div>

              {contact.message && (
                <div>
                  <span className="font-semibold">Message: </span>
                  <p>{contact.message}</p>
                </div>
              )}

              <div className="pt-2 border-t text-xs text-gray-500">
                Added: {formatDate(contact.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString();

export default ContactList;
