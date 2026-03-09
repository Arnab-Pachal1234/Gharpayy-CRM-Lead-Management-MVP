import { useState } from 'react';
import api from '../services/api';

const LeadForm = ({ onLeadAdded, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', source: 'Website Form' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/leads/capture', formData);
      onLeadAdded(response.data.lead);
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md border border-gray-200 mb-6">
      <h3 className="text-lg font-bold mb-4">Add New Lead</h3>
      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input required type="text" className="w-full border p-2 rounded" 
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Phone</label>
          <input required type="text" className="w-full border p-2 rounded" 
            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Source</label>
          <select className="w-full border p-2 rounded bg-white" 
            value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})}>
            <option>WhatsApp</option>
            <option>Website Form</option>
            <option>Social Media</option>
            <option>Lead Form</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;