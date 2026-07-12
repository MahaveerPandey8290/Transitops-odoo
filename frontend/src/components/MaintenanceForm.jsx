import React from "react";

export default function MaintenanceForm() {
  return (
    <div className="bg-[#171A21] rounded-2xl p-6 border border-[#2B3038] shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">
        Maintenance Form
      </h2>

      <div className="space-y-4">

        {/* Vehicle */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Vehicle
          </label>
          <select className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white">
            <option>Select Vehicle</option>
            <option>Van-05</option>
            <option>Truck-01</option>
            <option>Mini Truck-03</option>
          </select>
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Service Type
          </label>
          <select className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white">
            <option>Select Service</option>
            <option>Oil Change</option>
            <option>Engine Repair</option>
            <option>Brake Service</option>
            <option>Tyre Replacement</option>
            <option>Battery Replacement</option>
          </select>
        </div>

        {/* Cost */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Cost (₹)
          </label>
          <input
            type="number"
            placeholder="Enter Cost"
            className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Service Date
          </label>
          <input
            type="date"
            className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Status
          </label>
          <select className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white">
            <option>In Shop</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Technician */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Technician Name
          </label>
          <input
            type="text"
            placeholder="Enter Technician Name"
            className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Odometer */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Odometer Reading (km)
          </label>
          <input
            type="number"
            placeholder="Enter Odometer"
            className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Priority
          </label>
          <select className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Remarks
          </label>
          <textarea
            rows="3"
            placeholder="Enter Remarks..."
            className="w-full bg-[#0F1115] border border-[#2B3038] rounded-lg px-4 py-3 text-white resize-none"
          ></textarea>
        </div>

        {/* Button */}
        <button className="w-full bg-[#F59E0B] hover:bg-[#D97706] transition rounded-lg py-3 font-semibold text-white">
          Save Maintenance
        </button>

      </div>
    </div>
  );
}