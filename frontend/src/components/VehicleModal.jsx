import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';

export default function VehicleModal({ isOpen, onClose, vehicle, onSave, existingVehicles = [] }) {
  const [formData, setFormData] = useState({
    regNumber: '',
    name: '',
    model: '',
    type: 'Truck',
    manufacturer: '',
    capacity: '',
    fuelType: 'Diesel',
    cost: '',
    purchaseDate: '',
    odometer: '',
    region: 'North Zone',
    status: 'Available',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        id: vehicle.id,
        regNumber: vehicle.regNumber || '',
        name: vehicle.name || '',
        model: vehicle.model || '',
        type: vehicle.type || 'Truck',
        manufacturer: vehicle.manufacturer || '',
        capacity: vehicle.capacity || '',
        fuelType: vehicle.fuelType || 'Diesel',
        cost: vehicle.cost || '',
        purchaseDate: vehicle.purchaseDate || '',
        odometer: vehicle.odometer || '',
        region: vehicle.region || 'North Zone',
        status: vehicle.status || 'Available',
        imageUrl: vehicle.imageUrl || ''
      });
    } else {
      setFormData({
        regNumber: '',
        name: '',
        model: '',
        type: 'Truck',
        manufacturer: '',
        capacity: '',
        fuelType: 'Diesel',
        cost: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        odometer: '',
        region: 'North Zone',
        status: 'Available',
        imageUrl: ''
      });
    }
    setErrors({});
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Reg number required
    if (!formData.regNumber.trim()) {
      newErrors.regNumber = 'Registration Number is required.';
    } else {
      // 2. Reg number unique (only check if creating new or changing reg number of existing)
      const isDuplicate = existingVehicles.some(v => 
        v.regNumber.toLowerCase().trim() === formData.regNumber.toLowerCase().trim() && 
        (!vehicle || v.id !== vehicle.id)
      );
      if (isDuplicate) {
        newErrors.regNumber = 'This Registration Number is already registered.';
      }
    }

    // 3. Capacity numeric positive
    const capacityNum = Number(formData.capacity);
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required.';
    } else if (isNaN(capacityNum) || capacityNum <= 0) {
      newErrors.capacity = 'Capacity must be a positive number.';
    }

    // 4. Cost numeric positive
    const costNum = Number(formData.cost);
    if (!formData.cost) {
      newErrors.cost = 'Acquisition Cost is required.';
    } else if (isNaN(costNum) || costNum < 0) {
      newErrors.cost = 'Acquisition Cost must be a positive value.';
    }

    // 5. Odometer numeric non-negative
    const odometerNum = Number(formData.odometer);
    if (formData.odometer === '') {
      newErrors.odometer = 'Odometer reading is required.';
    } else if (isNaN(odometerNum) || odometerNum < 0) {
      newErrors.odometer = 'Odometer reading must be non-negative.';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Vehicle Name is required.';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        capacity: Number(formData.capacity),
        cost: Number(formData.cost),
        odometer: Number(formData.odometer)
      });
    }
  };

  // Mock document upload helper
  const handleMockUpload = (docName) => {
    alert(`Document "${docName}" simulated upload complete!`);
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
              {vehicle ? 'Edit Vehicle Profile' : 'Register New Fleet Asset'}
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
            
            {/* Grid 1: Basic Identifiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Registration Number *</label>
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  onChange={handleChange}
                  placeholder="e.g. RJ14AB4521"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono uppercase ${
                    errors.regNumber ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.regNumber && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.regNumber}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Vehicle Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Volvo Heavy Truck"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.name}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Manufacturer Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. VOL-822"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all ${
                    errors.model ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.model && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.model}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Manufacturer Brand</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. Volvo Trucks"
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
                />
              </div>
            </div>

            {/* Grid 2: Class Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Vehicle Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer"
                >
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Trailer">Trailer</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Fuel Configuration</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Load Capacity (lbs) *</label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 15000"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all ${
                    errors.capacity ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.capacity && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.capacity}</p>}
              </div>
            </div>

            {/* Grid 3: Operational Logistics & Valuations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Acquisition Cost ($) *</label>
                <input
                  type="text"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="e.g. 75000"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all ${
                    errors.cost ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.cost && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.cost}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Current Odometer (mi) *</label>
                <input
                  type="text"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  placeholder="e.g. 45000"
                  className={`w-full h-11 px-4 bg-[#0F1115] border rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all ${
                    errors.odometer ? 'border-red-500 focus:border-red-500' : 'border-[#2B3038] focus:border-[#F59E0B]'
                  }`}
                />
                {errors.odometer && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.odometer}</p>}
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer font-mono"
                />
              </div>
            </div>

            {/* Grid 4: Region & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Assigned Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer"
                >
                  <option value="North Zone">North Zone</option>
                  <option value="South Zone">South Zone</option>
                  <option value="East Zone">East Zone</option>
                  <option value="West Zone">West Zone</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Active Trip</option>
                  <option value="Maintenance">In Maintenance</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>

            {/* Image URL Mock */}
            <div>
              <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Asset Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or leave blank for default placeholder"
                className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
              />
            </div>

            {/* Document Upload Simulation buttons */}
            <div className="space-y-2.5">
              <label className="text-[10px] text-[#9CA3AF] font-bold block uppercase tracking-wide">Document Attachments</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleMockUpload('RC Certification Document')}
                  className="h-10 px-3 border border-dashed border-[#2B3038] hover:border-[#F59E0B]/50 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-[#9CA3AF] hover:text-white transition-all cursor-pointer bg-[#0F1115]/30"
                >
                  <Upload size={14} />
                  <span>Upload RC Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMockUpload('Insurance Policy Document')}
                  className="h-10 px-3 border border-dashed border-[#2B3038] hover:border-[#F59E0B]/50 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-[#9CA3AF] hover:text-white transition-all cursor-pointer bg-[#0F1115]/30"
                >
                  <Upload size={14} />
                  <span>Upload Insurance</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMockUpload('Vehicle Fitness Certificate')}
                  className="h-10 px-3 border border-dashed border-[#2B3038] hover:border-[#F59E0B]/50 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-[#9CA3AF] hover:text-white transition-all cursor-pointer bg-[#0F1115]/30"
                >
                  <Upload size={14} />
                  <span>Upload Fitness Cert</span>
                </button>
              </div>
            </div>
          </form>

          {/* Footer Actions */}
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
              <span>Save Vehicle</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
