import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import DashboardHeader from "../components/DashboardHeader";
import FilterBar from "../components/FilterBar";
import KPICard from "../components/KPICard";

import TripAssignmentCard from "../components/TripAssignmentCard";
import DispatchTimeline from "../components/DispatchTimeline";
import ActiveTripsTable from "../components/ActiveTripsTable";

import {
  Route,
  Truck,
  Users,
  Clock,
  CheckCircle,
  MapPinned,
} from "lucide-react";

export default function TripDispatcher() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const kpis = [
    {
      title: "Today's Trips",
      value: "55",
      trend: "+12%",
      trendType: "up",
      icon: Route,
      iconBg: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Available Fleet",
      value: "42",
      trend: "Ready",
      trendType: "neutral",
      icon: Truck,
      iconBg: "bg-green-500/10 text-green-400",
    },
    {
      title: "Drivers Active",
      value: "26",
      trend: "Online",
      trendType: "neutral",
      icon: Users,
      iconBg: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Pending Dispatch",
      value: "07",
      trend: "Urgent",
      trendType: "down",
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    {
      title: "Completed",
      value: "48",
      trend: "+9%",
      trendType: "up",
      icon: CheckCircle,
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Live Routes",
      value: "14",
      trend: "Tracking",
      trendType: "neutral",
      icon: MapPinned,
      iconBg: "bg-cyan-500/10 text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() =>
          setSidebarCollapsed(!sidebarCollapsed)
        }
      />

      <div className="flex-1 flex flex-col min-h-screen">

        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          <DashboardHeader />

          <FilterBar />

          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

            {kpis.map((item, index) => (
              <KPICard
                key={index}
                title={item.title}
                value={item.value}
                trend={item.trend}
                trendType={item.trendType}
                icon={item.icon}
                iconBgColor={item.iconBg}
              />
            ))}

          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            <div className="xl:col-span-2">
              <TripAssignmentCard />
            </div>

            <DispatchTimeline />

          </section>

          <ActiveTripsTable />

        </main>

      </div>

    </div>
  );
}