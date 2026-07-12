import {
    CheckCircle2,
    Truck,
    UserCheck,
    MapPin,
    Clock3,
  } from "lucide-react";
  
  const timeline = [
    {
      title: "Driver Assigned",
      description: "Rahul Sharma accepted the trip.",
      time: "09:05 AM",
      icon: UserCheck,
      color: "bg-blue-500",
    },
    {
      title: "Vehicle Allocated",
      description: "RJ14 AB 1234 is ready.",
      time: "09:10 AM",
      icon: Truck,
      color: "bg-amber-500",
    },
    {
      title: "Trip Started",
      description: "Vehicle departed from Jaipur.",
      time: "09:25 AM",
      icon: MapPin,
      color: "bg-green-500",
    },
    {
      title: "Checkpoint Reached",
      description: "Reached Ajmer Highway.",
      time: "10:45 AM",
      icon: Clock3,
      color: "bg-purple-500",
    },
    {
      title: "Delivery Completed",
      description: "Trip completed successfully.",
      time: "01:30 PM",
      icon: CheckCircle2,
      color: "bg-emerald-500",
    },
  ];
  
  export default function DispatchTimeline() {
    return (
      <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 shadow-lg h-full">
  
        {/* Header */}
  
        <div className="flex items-center justify-between mb-8">
  
          <div>
  
            <h2 className="text-xl font-bold text-white">
              Live Dispatch
            </h2>
  
            <p className="text-sm text-gray-400">
              Real-time trip updates
            </p>
  
          </div>
  
          <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
  
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
  
            LIVE
  
          </div>
  
        </div>
  
        {/* Timeline */}
  
        <div className="relative">
  
          {timeline.map((item, index) => {
  
            const Icon = item.icon;
  
            return (
  
              <div
                key={index}
                className="relative flex gap-4 pb-8"
              >
  
                {index !== timeline.length - 1 && (
  
                  <div className="absolute left-5 top-12 h-full w-0.5 bg-[#2B3038]" />
  
                )}
  
                <div
                  className={`h-10 w-10 rounded-xl ${item.color} flex items-center justify-center text-white shrink-0 shadow-lg`}
                >
  
                  <Icon size={18} />
  
                </div>
  
                <div className="flex-1">
  
                  <div className="flex justify-between items-start">
  
                    <h3 className="font-semibold text-white">
                      {item.title}
                    </h3>
  
                    <span className="text-xs text-gray-500">
                      {item.time}
                    </span>
  
                  </div>
  
                  <p className="text-sm text-gray-400 mt-1">
                    {item.description}
                  </p>
  
                </div>
  
              </div>
  
            );
  
          })}
  
        </div>
  
        {/* Summary */}
  
        <div className="mt-4 pt-5 border-t border-[#2B3038]">
  
          <div className="flex justify-between text-sm">
  
            <span className="text-gray-400">
              Active Trips
            </span>
  
            <span className="font-semibold text-white">
              14
            </span>
  
          </div>
  
          <div className="flex justify-between mt-2 text-sm">
  
            <span className="text-gray-400">
              On-Time Delivery
            </span>
  
            <span className="font-semibold text-green-400">
              96%
            </span>
  
          </div>
  
        </div>
  
      </div>
    );
  }