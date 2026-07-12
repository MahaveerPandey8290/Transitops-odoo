import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2, Fuel } from "lucide-react";

// data prop: array of { month: string, liters: number }
// Passed from Analytics.jsx which fetches from /api/reports/fuel-efficiency
const FuelConsumptionChart = ({ data = [], loading = false }) => {
  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#3B82F6]/10 rounded-lg">
          <Fuel size={16} className="text-[#3B82F6]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Fuel Consumption</h3>
          <p className="text-[10px] text-[#9CA3AF]">Liters used per period</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[200px] gap-2 text-[#9CA3AF]">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-[#9CA3AF] text-xs">
          No fuel data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B3038" />
            <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#171A21', border: '1px solid #2B3038', borderRadius: 8, color: '#fff', fontSize: 11 }}
              cursor={{ fill: '#2B3038' }}
            />
            <Bar dataKey="liters" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FuelConsumptionChart;