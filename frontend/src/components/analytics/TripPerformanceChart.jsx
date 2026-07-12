import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2, TrendingUp } from "lucide-react";

// data prop: array of { month: string, trips: number }
// Passed from Analytics.jsx which fetches from /api/reports/fleet-utilization
const TripPerformanceChart = ({ data = [], loading = false }) => {
  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
          <TrendingUp size={16} className="text-[#F59E0B]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Trip Performance</h3>
          <p className="text-[10px] text-[#9CA3AF]">Trips dispatched over time</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[200px] gap-2 text-[#9CA3AF]">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-[#9CA3AF] text-xs">
          No trip data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B3038" />
            <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#171A21', border: '1px solid #2B3038', borderRadius: 8, color: '#fff', fontSize: 11 }}
              cursor={{ stroke: '#F59E0B', strokeWidth: 1, strokeDasharray: '4 2' }}
            />
            <Line type="monotone" dataKey="trips" stroke="#F59E0B" strokeWidth={3} dot={{ r: 3, fill: '#F59E0B' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TripPerformanceChart;