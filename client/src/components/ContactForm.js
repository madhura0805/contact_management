import React, { useState } from 'react';
import '../index.css';

const ContactForm = ({ onContactAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$|^\d{3}-\d{3}-\d{4}$|^\(\d{3}\)\s?\d{3}-\d{4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ submit: result.message || 'Failed to submit form' });
        return;
      }

      // Success
      setSuccessMessage('Contact added successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      setErrors({});

      // Call parent callback to refresh contacts list
      if (onContactAdded) {
        onContactAdded(result.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: 'Error submitting form. Please try again.' });
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.phone.trim() && Object.keys(errors).length === 0;

  return (
    <form className="max-w-xl bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Contact</h2>

      {successMessage && <div className="mb-4 p-3 bg-green-500 text-white rounded">{successMessage}</div>}
      {errors.submit && <div className="mb-4 p-3 bg-red-500 text-white rounded">{errors.submit}</div>}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-300`}
        />
        {errors.name && <span className="text-red-600 text-sm mt-1 block">{errors.name}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-300`}
        />
        {errors.email && <span className="text-red-600 text-sm mt-1 block">{errors.email}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone (10 digits)"
          className={`w-full px-3 py-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-300`}
        />
        {errors.phone && <span className="text-red-600 text-sm mt-1 block">{errors.phone}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Enter your message (optional)"
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || loading}
        className={`w-full py-2 rounded font-semibold text-white ${(!isFormValid || loading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default ContactForm;
