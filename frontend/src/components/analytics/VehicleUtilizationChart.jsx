import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Loader2, BarChart3 } from "lucide-react";

const COLORS = ['#22C55E', '#9CA3AF', '#F59E0B'];

// data prop: array of { name: string, value: number }
// e.g. [{ name: 'Active', value: 12 }, { name: 'Idle', value: 5 }, { name: 'Maintenance', value: 2 }]
// Derived in Analytics.jsx from the /api/vehicles response
const VehicleUtilizationChart = ({ data = [], loading = false }) => {
  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#22C55E]/10 rounded-lg">
          <BarChart3 size={16} className="text-[#22C55E]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Vehicle Utilization</h3>
          <p className="text-[10px] text-[#9CA3AF]">Current fleet status distribution</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[200px] gap-2 text-[#9CA3AF]">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : data.length === 0 || data.every(d => d.value === 0) ? (
        <div className="flex items-center justify-center h-[200px] text-[#9CA3AF] text-xs">
          No vehicle data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={75} innerRadius={45}
              paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#171A21', border: '1px solid #2B3038', borderRadius: 8, color: '#fff', fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default VehicleUtilizationChart;