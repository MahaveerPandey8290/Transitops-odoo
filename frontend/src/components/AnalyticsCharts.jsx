import React from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

// Custom Tooltip component for dark mode theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#171A21] border border-[#2B3038] p-3 rounded-xl shadow-xl text-left">
        <p className="text-xs font-bold text-[#9CA3AF] mb-1.5">{label}</p>
        {payload.map((pld, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.fill || pld.color || pld.stroke }} />
            <span className="text-white">{pld.name}:</span>
            <span className="text-[#F59E0B] font-mono">{pld.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ==========================================
   WIDGET 1: Fuel Consumption (Area Chart)
   ========================================== */
export function FuelConsumptionChart() {
  const data = [
    { day: 'Mon', consumption: 420 },
    { day: 'Tue', consumption: 510 },
    { day: 'Wed', consumption: 460 },
    { day: 'Thu', consumption: 620 },
    { day: 'Fri', consumption: 580 },
    { day: 'Sat', consumption: 320 },
    { day: 'Sun', consumption: 210 },
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl h-[320px] flex flex-col justify-between text-left animate-fade-in">
      <div>
        <h4 className="text-sm font-bold text-white mb-0.5">Fuel Consumption</h4>
        <p className="text-[10px] text-[#9CA3AF] font-semibold mb-4">Total gallons consumed daily.</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B3038" vertical={false} />
            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="consumption" name="Fuel (Gal)" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorFuel)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ==========================================
   WIDGET 2: Fleet Utilization (Line Chart)
   ========================================== */
export function FleetUtilizationChart() {
  const data = [
    { day: 'Mon', utilization: 78 },
    { day: 'Tue', utilization: 82 },
    { day: 'Wed', utilization: 80 },
    { day: 'Thu', utilization: 85 },
    { day: 'Fri', utilization: 88 },
    { day: 'Sat', utilization: 72 },
    { day: 'Sun', utilization: 65 },
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl h-[320px] flex flex-col justify-between text-left animate-fade-in">
      <div>
        <h4 className="text-sm font-bold text-white mb-0.5">Fleet Utilization</h4>
        <p className="text-[10px] text-[#9CA3AF] font-semibold mb-4">Percentage of operational active vehicles.</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B3038" vertical={false} />
            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="utilization" name="Utilization (%)" stroke="#F59E0B" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ==========================================
   WIDGET 3: Trips per Day (Bar Chart)
   ========================================== */
export function TripsPerDayChart() {
  const data = [
    { day: 'Mon', trips: 18 },
    { day: 'Tue', trips: 22 },
    { day: 'Wed', trips: 19 },
    { day: 'Thu', trips: 25 },
    { day: 'Fri', trips: 24 },
    { day: 'Sat', trips: 14 },
    { day: 'Sun', trips: 9 },
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl h-[320px] flex flex-col justify-between text-left animate-fade-in">
      <div>
        <h4 className="text-sm font-bold text-white mb-0.5">Trips per Day</h4>
        <p className="text-[10px] text-[#9CA3AF] font-semibold mb-4">Total active trip dispatches.</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B3038" vertical={false} />
            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="trips" name="Dispatched Trips" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ==========================================
   WIDGET 4: Vehicle Type Distribution (Donut Chart)
   ========================================== */
export function VehicleTypeDonutChart() {
  const data = [
    { name: 'Heavy Trucks', value: 24, color: '#3B82F6' },
    { name: 'Delivery Vans', value: 16, color: '#22C55E' },
    { name: 'Reefer Vans', value: 8, color: '#F59E0B' },
    { name: 'Flatbed Trailers', value: 5, color: '#EF4444' },
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl h-[320px] flex flex-col justify-between text-left animate-fade-in">
      <div>
        <h4 className="text-sm font-bold text-white mb-0.5">Vehicle Distribution</h4>
        <p className="text-[10px] text-[#9CA3AF] font-semibold mb-4">Asset configuration count breakdown.</p>
      </div>

      <div className="flex-grow flex items-center justify-center min-h-0 relative">
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              iconSize={8}
              iconType="circle"
              content={({ payload }) => (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2">
                  {payload.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#E2E8F0]">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span>{entry.value} ({data[index].value})</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Total label inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
          <span className="text-xl font-extrabold text-white">53</span>
          <span className="text-[9px] font-bold text-[#9CA3AF] tracking-wider uppercase mt-0.5">Assets</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   DEFAULT EXPORT: Analytics Section Wrapper
   ========================================== */
export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <FuelConsumptionChart />
      <FleetUtilizationChart />
      <TripsPerDayChart />
      <VehicleTypeDonutChart />
    </div>
  );
}
