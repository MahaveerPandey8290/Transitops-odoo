import {
    Truck,
    User,
    MapPin,
    Calendar,
    Flag,
    FileText,
  } from "lucide-react";
  
  export default function TripAssignmentCard() {
    return (
      <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 shadow-lg">
  
        {/* Header */}
  
        <div className="mb-6">
  
          <h2 className="text-xl font-bold text-white">
            Create Trip Assignment
          </h2>
  
          <p className="text-sm text-gray-400 mt-1">
            Assign a driver and vehicle to a new trip.
          </p>
  
        </div>
  
        {/* Form */}
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  
          {/* Trip ID */}
  
          <div>
            <label className="text-sm text-gray-400">
              Trip ID
            </label>
  
            <input
              placeholder="TRP-1025"
              className="mt-2 w-full bg-[#0F1115] border border-[#2B3038] rounded-xl px-4 py-3 text-white outline-none focus:border-[#F59E0B]"
            />
          </div>
  
          {/* Priority */}
  
          <div>
            <label className="text-sm text-gray-400">
              Priority
            </label>
  
            <select className="mt-2 w-full bg-[#0F1115] border border-[#2B3038] rounded-xl px-4 py-3 text-white outline-none focus:border-[#F59E0B]">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
  
          {/* Driver */}
  
          <div>
            <label className="text-sm text-gray-400">
              Driver
            </label>
  
            <div className="relative mt-2">
  
              <User
                size={18}
                className="absolute left-4 top-4 text-gray-500"
              />
  
              <input
                placeholder="Select Driver"
                className="w-full bg-[#0F1115] border border-[#2B3038] rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-[#F59E0B]"
              />
  
            </div>
          </div>
  
          {/* Vehicle */}
  
          <div>
            <label className="text-sm text-gray-400">
              Vehicle
            </label>
  
            <div className="relative mt-2">
  
              <Truck
                size={18}
                className="absolute left-4 top-4 text-gray-500"
              />
  
              <input
                placeholder="RJ14 AB 1234"
                className="w-full bg-[#0F1115] border border-[#2B3038] rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-[#F59E0B]"
              />
  
            </div>
          </div>
  
          {/* Source */}
  
          <div>
            <label className="text-sm text-gray-400">
              Pickup Location
            </label>
  
            <div className="relative mt-2">
  
              <MapPin
                size={18}
                className="absolute left-4 top-4 text-gray-500"
              />
  
              <input
                placeholder="Jaipur"
                className="w-full bg-[#0F1115] border border-[#2B3038] rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-[#F59E0B]"
              />
  
            </div>
          </div>
  
          {/* Destination */}
  
          <div>
            <label className="text-sm text-gray-400">
              Destination
            </label>
  
            <div className="relative mt-2">
  
              <Flag
                size={18}
                className="absolute left-4 top-4 text-gray-500"
              />
  
              <input
                placeholder="Delhi"
                className="w-full bg-[#0F1115] border border-[#2B3038] rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-[#F59E0B]"
              />
  
            </div>
          </div>
  
          {/* Departure */}
  
          <div>
            <label className="text-sm text-gray-400">
              Departure Time
            </label>
  
            <div className="relative mt-2">
  
              <Calendar
                size={18}
                className="absolute left-4 top-4 text-gray-500"
              />
  
              <input
                type="datetime-local"
                className="w-full bg-[#0F1115] border border-[#2B3038] rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-[#F59E0B]"
              />
  
            </div>
          </div>
  
          {/* Distance */}
  
          <div>
            <label className="text-sm text-gray-400">
              Estimated Distance
            </label>
  
            <input
              placeholder="275 km"
              className="mt-2 w-full bg-[#0F1115] border border-[#2B3038] rounded-xl px-4 py-3 text-white outline-none focus:border-[#F59E0B]"
            />
          </div>
  
        </div>
  
        {/* Notes */}
  
        <div className="mt-5">
  
          <label className="text-sm text-gray-400">
            Dispatch Notes
          </label>
  
          <div className="relative mt-2">
  
            <FileText
              size={18}
              className="absolute left-4 top-4 text-gray-500"
            />
  
            <textarea
              rows={4}
              placeholder="Add dispatch instructions..."
              className="w-full bg-[#0F1115] border border-[#2B3038] rounded-xl py-3 pl-11 pr-4 text-white outline-none resize-none focus:border-[#F59E0B]"
            />
  
          </div>
  
        </div>
  
        {/* Button */}
  
        <button className="mt-6 w-full bg-[#F59E0B] hover:bg-[#E89B08] text-black font-semibold py-3 rounded-xl transition duration-300">
          Assign Trip
        </button>
  
      </div>
    );
  }