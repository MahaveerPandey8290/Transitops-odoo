import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';

export default function DriverModal({ isOpen, onClose, driver, onSave, existingDrivers = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    licenseCategory: 'HMV',
    issueDate: '',
    licenseExpiry: '',
    yearsExperience: '',
    emergencyContact: '',
    bloodGroup: 'O+',
    vehiclePreference: '',
    avatarUrl: '',
    status: 'Available',
    safetyScore: 90,
    tripCompletionRate: 100,
    completedTrips: 0,
    cancelledTrips: 0,
    totalDistance: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (driver) {
      setFormData({
        id: driver.id,
        name: driver.name || '',
        empId: driver.empId || '',
        phone: driver.phone || '',
        email: driver.email || '',
        address: driver.address || '',
        licenseNumber: driver.licenseNumber || '',
        licenseCategory: driver.licenseCategory || 'HMV',
        issueDate: driver.issueDate || '2020-05-10',
        licenseExpiry: driver.licenseExpiry || '',
        yearsExperience: driver.yearsExperience || '',
        emergencyContact: driver.emergencyContact || '',
        bloodGroup: driver.bloodGroup || 'O+',
        vehiclePreference: driver.vehiclePreference || '',
        avatarUrl: driver.avatarUrl || '',
        status: driver.status || 'Available',
        safetyScore: driver.safetyScore || 90,
        tripCompletionRate: driver.tripCompletionRate || 100,
        completedTrips: driver.completedTrips || 0,
        cancelledTrips: driver.cancelledTrips || 0,
        totalDistance: driver.totalDistance || 0
      });
    } else {
      setFormData({
        name: '',
        empId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        phone: '',
        email: '',
        address: '',
        licenseNumber: '',
        licenseCategory: 'HMV',
        issueDate: new Date().toISOString().split('T')[0],
        licenseExpiry: '',
        yearsExperience: '',
        emergencyContact: '',
        bloodGroup: 'O+',
        vehiclePreference: '',
        avatarUrl: '',
        status: 'Available',
        safetyScore: 90,
        tripCompletionRate: 100,
        completedTrips: 0,
        cancelledTrips: 0,
        totalDistance: 0
      });
    }
    setErrors({});
  }, [driver, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Driver Name is required.';
    }

    if (!formData.empId.trim()) {
      newErrors.empId = 'Employee ID is required.';
    }

    // Phone validation
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(phoneTrimmed)) {
      newErrors.phone = 'Invalid phone number format.';
    }

    // License validation
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License Number is required.';
    }

    // Expiry date past validation
    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = 'Expiry Date is required.';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(formData.licenseExpiry);
      if (expiry < today) {
        newErrors.licenseExpiry = 'Expiry Date cannot be in the past.';
      }
    }

    // Years experience numeric positive
    if (formData.yearsExperience !== '') {
      const expNum = Number(formData.yearsExperience);
      if (isNaN(expNum) || expNum < 0) {
        newErrors.yearsExperience = 'Must be a non-negative number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        yearsExperience: formData.yearsExperience !== '' ? Number(formData.yearsExperience) : 0
      });
    }
  };

  const handleMockUpload = (docName) => {
    alert(`File "${docName}" simulated upload complete!`);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Modal Dialog container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#15181E] border border-[#2B3038] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col justify-between max-h-[90vh] text-left animate-[fadeInUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#2B3038] flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">
              {driver ? 'Edit Driver Profile' : 'Register New Fleet Driver'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-[#0F1115] border border-[#2B3038] text-[#9CA3AF] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
            
            {/* Top Photo Uploader */}
            <div className="flex flex-col items-center justify-center pb-3">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-[#0F1115] border-2 border-dashed border-[#2B3038] group-hover:border-[#F59E0B] flex items-center justify-center overflow-hidden transition-all relative">
                  {formData.avatarUrl ? (
                    <img 
                      src={formData.avatarUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#9CA3AF] group-hover:text-white transition-colors">
                      <Upload size={20} className="mb-1" />
                      <span className="text-[8px] font-bold uppercase tracking-wider">Photo</span>
                    </div>
                  )}
                  <label 
                    htmlFor="avatar-file-input" 
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-opacity rounded-full"
                  >
                    Change
                  </label>
                </div>
                <input 
                  type="file" 
                  id="avatar-file-input" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </div>
              <span className="text-[10px] text-[#9CA3AF] mt-2 font-semibold">Upload passport size image</span>
            </div>
            
            {/* Grid 1: Basic details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Driver Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Connor"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.name}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Employee ID *</label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  placeholder="e.g. EMP-9021"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono uppercase ${
                    errors.empId ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.empId && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.empId}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9829018401"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.phone}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. sarah.c@transitops.com"
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
                />
              </div>
            </div>

            {/* Grid 2: Licenses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g. DL-142021004"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono uppercase ${
                    errors.licenseNumber ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.licenseNumber && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.licenseNumber}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">License Category</label>
                <select
                  name="licenseCategory"
                  value={formData.licenseCategory}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer"
                >
                  <option value="LMV">LMV (Light Motor)</option>
                  <option value="HMV">HMV (Heavy Motor)</option>
                  <option value="Trailer">Trailer License</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">License Expiry Date *</label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer font-mono ${
                    errors.licenseExpiry ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.licenseExpiry && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.licenseExpiry}</p>}
              </div>
            </div>

            {/* Grid 3: Operational */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Experience (Years)</label>
                <input
                  type="text"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all ${
                    errors.yearsExperience ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.yearsExperience && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.yearsExperience}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Vehicle Preference</label>
                <input
                  type="text"
                  name="vehiclePreference"
                  value={formData.vehiclePreference}
                  onChange={handleChange}
                  placeholder="e.g. Volvo FH16 Heavy"
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
                />
              </div>
            </div>

            {/* Grid 4: Status */}
            <div>
              <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Work Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Active Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Emergency Contact & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Emergency Contact Name & Phone</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="e.g. John Doe (Brother) - 90291048"
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 102 Fleet Avenue, Sector 4, Jaipur"
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
                />
              </div>
            </div>

            {/* Document Upload Simulation */}
            <div className="space-y-2.5">
              <label className="text-[10px] text-[#9CA3AF] font-bold block uppercase tracking-wide font-sans">Document Attachments</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleMockUpload('Driving License PDF')}
                  className="h-10 px-3 border border-dashed border-[#2B3038] hover:border-[#F59E0B]/50 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-[#9CA3AF] hover:text-white transition-all cursor-pointer bg-[#0F1115]/30"
                >
                  <Upload size={14} />
                  <span>Upload License</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMockUpload('Medical Fitness Certificate')}
                  className="h-10 px-3 border border-dashed border-[#2B3038] hover:border-[#F59E0B]/50 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-[#9CA3AF] hover:text-white transition-all cursor-pointer bg-[#0F1115]/30"
                >
                  <Upload size={14} />
                  <span>Upload Medical Cert</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMockUpload('National ID Verification')}
                  className="h-10 px-3 border border-dashed border-[#2B3038] hover:border-[#F59E0B]/50 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-[#9CA3AF] hover:text-white transition-all cursor-pointer bg-[#0F1115]/30"
                >
                  <Upload size={14} />
                  <span>Upload ID Card</span>
                </button>
              </div>
            </div>

          </form>

          {/* Footer */}
          <div className="p-4 border-t border-[#2B3038] bg-[#0F1115] flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 bg-[#171A21] hover:bg-[#2B3038] border border-[#2B3038] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 h-11 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#F59E0B]/10 hover:-translate-y-0.5 active:scale-95"
            >
              <Check size={14} />
              <span>Save Driver</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
