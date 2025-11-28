import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminUser } from '../api';
import { toast } from 'react-toastify';

const initialState = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  height: '',
  weight: '',
  gender: 'Male',
  dob: '',
  address: '',
  branch: '',
  purpose: '',
};

const branchOptions = [
  { value: '', label: 'Select branch' },
  { value: 'b1', label: 'B1' },
  { value: 'b2', label: 'B2' },
];

const purposeOptions = [
  { value: '', label: 'Select purpose' },
  { value: 'gain', label: 'Weight Gain' },
  { value: 'loose', label: 'Weight Loss' },
  { value: 'maintain', label: 'Maintain' },
];

export default function CreateMember() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const aadhaarInputRef = useRef(null);
  const liveInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event, setter) => {
    const file = event.target.files?.[0] || null;
    setter(file);
  };

  const triggerFileSelect = (ref) => {
    ref.current?.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName || !form.username || !form.email || !form.password || !form.phone || !form.branch || !form.purpose) {
      toast.error('Please fill all required fields marked with *');
      return;
    }

    if (!aadhaarPhoto || !livePhoto) {
      toast.error('Please upload both Aadhaar and live photos');
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append('fullName', form.fullName.trim());
      fd.append('username', form.username.trim());
      fd.append('email', form.email.trim());
      fd.append('password', form.password);
      fd.append('phone', form.phone.trim());
      fd.append('height', form.height);
      fd.append('weight', form.weight);
      fd.append('gender', form.gender);
      fd.append('dob', form.dob);
      fd.append('address', form.address.trim());
      fd.append('branch', form.branch);
      fd.append('purpose', form.purpose);
      fd.append('aadhaarPhoto', aadhaarPhoto);
      fd.append('livePhoto', livePhoto);

      const res = await createAdminUser(fd);
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Member created successfully');
        setForm(initialState);
        setAadhaarPhoto(null);
        setLivePhoto(null);
        navigate('/members', { replace: true });
      } else {
        toast.error(res.data?.message || 'Failed to create member');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Create New Member</h1>
            <p className="text-gray-400 mt-2">Fill in the details below to register a new member.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => navigate('/members')}
              className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
            >
              View Members
            </button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm mb-1">Full Name*</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Username*</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email*</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password*</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Phone*</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Branch*</label>
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {branchOptions.map((option) => (
                  <option key={option.value || 'blank'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Purpose*</label>
              <select
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {purposeOptions.map((option) => (
                  <option key={option.value || 'blank'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Aadhaar Photo*</label>
              <button
                type="button"
                onClick={() => triggerFileSelect(aadhaarInputRef)}
                className="w-full px-4 py-2 bg-primary cursor-pointer bg-yellow-300 text-gray-900 rounded mb-2 hover:opacity-90 transition-opacity"
              >
                {aadhaarPhoto ? `Selected: ${aadhaarPhoto.name}` : 'Choose Aadhaar Photo'}
              </button>
              <input
                ref={aadhaarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFileChange(event, setAadhaarPhoto)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Live Photo*</label>
              <button
                type="button"
                onClick={() => triggerFileSelect(liveInputRef)}
                className="w-full px-4 py-2 bg-primary cursor-pointer bg-yellow-300 text-gray-900 rounded mb-2 hover:opacity-90 transition-opacity"
              >
                {livePhoto ? `Selected: ${livePhoto.name}` : 'Choose Live Photo'}
              </button>
              <input
                ref={liveInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFileChange(event, setLivePhoto)}
              />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => navigate('/members')}
                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary cursor-pointer bg-yellow-300 text-gray-900 rounded font-medium disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Create Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
