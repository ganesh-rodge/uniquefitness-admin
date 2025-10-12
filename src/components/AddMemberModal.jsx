import { useState } from 'react';
import { createAdminUser } from '../api';
import { toast } from 'react-toastify';

const initialState = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  height: '',
  weight: '',
  gender: 'Male',
  dob: '',
  address: '',
};

export default function AddMemberModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.fullName || !form.email || !form.password || !form.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!aadhaarPhoto || !livePhoto) {
      toast.error('Please upload both Aadhaar and Live photos');
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append('fullName', form.fullName);
      fd.append('email', form.email);
      fd.append('password', form.password);
      fd.append('phone', form.phone);
      fd.append('height', form.height);
      fd.append('weight', form.weight);
      fd.append('gender', form.gender);
      fd.append('dob', form.dob);
      fd.append('address', form.address);
      fd.append('aadhaarPhoto', aadhaarPhoto);
      fd.append('livePhoto', livePhoto);

      const res = await createAdminUser(fd);
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Member created successfully');
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data?.message || 'Failed to create member');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl text-white animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Full Name*</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email*</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password*</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone*</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Height (cm)</label>
            <input type="number" name="height" value={form.height} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Weight (kg)</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Aadhaar Photo*</label>
            <button
              type="button"
              onClick={() => document.getElementById('aadhaarPhotoInput').click()}
              className="w-full px-4 py-2 bg-primary cursor-pointer bg-yellow-300 text-gray-900 rounded mb-2"
            >
              {aadhaarPhoto ? `Selected: ${aadhaarPhoto.name}` : 'Choose Aadhaar Photo'}
            </button>
            <input
              id="aadhaarPhotoInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, setAadhaarPhoto)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Live Photo*</label>
            <button
              type="button"
              onClick={() => document.getElementById('livePhotoInput').click()}
              className="w-full px-4 py-2 bg-primary cursor-pointer bg-yellow-300 text-gray-900 rounded mb-2"
            >
              {livePhoto ? `Selected: ${livePhoto.name}` : 'Choose Live Photo'}
            </button>
            <input
              id="livePhotoInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, setLivePhoto)}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary cursor-pointer bg-yellow-300 text-gray-900 rounded disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
