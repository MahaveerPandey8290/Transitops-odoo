import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const TripDispatcher = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [tripData, setTripData] = useState({
    passenger: "",
    pickup: "",
    drop: "",
    vehicle: "",
    driver: "",
    priority: "Normal",
  });

  const [trips, setTrips] = useState([
    {
      id: 1,
      passenger: "Rahul Sharma",
      pickup: "Railway Station",
      drop: "Airport",
      vehicle: "Bus-102",
      driver: "Amit",
      status: "Assigned",
    },
    {
      id: 2,
      passenger: "Priya Singh",
      pickup: "City Mall",
      drop: "University",
      vehicle: "Cab-205",
      driver: "Rakesh",
      status: "Pending",
    },
  ]);

  const handleChange = (e) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value,
    });
  };

  const dispatchTrip = () => {
    if (
      !tripData.passenger ||
      !tripData.pickup ||
      !tripData.drop
    ) {
      alert("Please fill required fields");
      return;
    }

    const newTrip = {
      id: trips.length + 1,
      ...tripData,
      status: "Assigned",
    };

    setTrips([...trips, newTrip]);

    setTripData({
      passenger: "",
      pickup: "",
      drop: "",
      vehicle: "",
      driver: "",
      priority: "Normal",
    });
  };

  return (
    <div className="h-screen w-screen bg-[#0F1115] text-white flex font-sans selection:bg-[#F59E0B]/20 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content shell */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Trip Dispatcher
              </h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl leading-relaxed">
                Create and assign trips to available vehicles
              </p>
            </div>
          </div>

          {/* Dispatch Form */}
          <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
            <h2 className="text-base font-bold text-white mb-4">
              Dispatch New Trip
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Passenger Name *</label>
                <input
                  type="text"
                  name="passenger"
                  placeholder="Passenger Name"
                  value={tripData.passenger}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Pickup Location *</label>
                <input
                  type="text"
                  name="pickup"
                  placeholder="Pickup Location"
                  value={tripData.pickup}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Drop Location *</label>
                <input
                  type="text"
                  name="drop"
                  placeholder="Drop Location"
                  value={tripData.drop}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Vehicle</label>
                <select
                  name="vehicle"
                  value={tripData.vehicle}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors cursor-pointer"
                >
                  <option value="">Select Vehicle</option>
                  <option>Bus-101</option>
                  <option>Bus-102</option>
                  <option>Cab-205</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Driver</label>
                <select
                  name="driver"
                  value={tripData.driver}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors cursor-pointer"
                >
                  <option value="">Select Driver</option>
                  <option>Amit</option>
                  <option>Rakesh</option>
                  <option>Suresh</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Priority</label>
                <select
                  name="priority"
                  value={tripData.priority}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors cursor-pointer"
                >
                  <option>Normal</option>
                  <option>High</option>
                  <option>Emergency</option>
                </select>
              </div>
            </div>

            <button
              onClick={dispatchTrip}
              className="mt-6 h-11 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5"
            >
              Dispatch Trip
            </button>
          </div>

          {/* Active Trips Table */}
          <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
            <h2 className="text-base font-bold text-white mb-4">
              Active Trips
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-semibold">
                <thead>
                  <tr className="border-b border-[#2B3038] text-[#9CA3AF] text-left">
                    <th className="pb-3 pr-4">Passenger</th>
                    <th className="pb-3 px-4">Pickup</th>
                    <th className="pb-3 px-4">Drop</th>
                    <th className="pb-3 px-4">Vehicle</th>
                    <th className="pb-3 px-4">Driver</th>
                    <th className="pb-3 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B3038]/50">
                  {trips.map((trip) => (
                    <tr key={trip.id} className="text-white hover:bg-[#121419]/30 transition-colors">
                      <td className="py-4 pr-4">{trip.passenger}</td>
                      <td className="py-4 px-4 text-[#9CA3AF]">{trip.pickup}</td>
                      <td className="py-4 px-4 text-[#9CA3AF]">{trip.drop}</td>
                      <td className="py-4 px-4">{trip.vehicle || "-"}</td>
                      <td className="py-4 px-4">{trip.driver || "-"}</td>
                      <td className="py-4 pl-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TripDispatcher;