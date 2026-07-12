import React from "react";
import Sidebar from "../components/Sidebar";

import {
  BarChart3,
  TrendingUp,
  Fuel,
  Truck,
  Calendar,
  Download,
} from "lucide-react";

import TripPerformanceChart from "../components/analytics/TripPerformanceChart";
import FuelConsumptionChart from "../components/analytics/FuelConsumptionChart";
import VehicleUtilizationChart from "../components/analytics/VehicleUtilizationChart";


const Analytics = () => {


  const stats = [
    {
      title: "Total Trips",
      value: "1,250",
      icon: Truck,
      change: "+12%",
    },
    {
      title: "Fuel Expense",
      value: "₹2.4L",
      icon: Fuel,
      change: "+8%",
    },
    {
      title: "Maintenance Cost",
      value: "₹85K",
      icon: BarChart3,
      change: "-5%",
    },
    {
      title: "Vehicle Utilization",
      value: "92%",
      icon: TrendingUp,
      change: "+15%",
    },
  ];


  return (

    <div className="flex min-h-screen bg-[#F3F4F6]">


      {/* Sidebar */}

      <Sidebar />



      {/* Main Content */}

      <div className="flex-1 p-6 overflow-x-hidden">


        {/* Header */}

        <div className="flex justify-between items-center mb-6">


          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Analytics & Reports
            </h1>


            <p className="text-gray-500">
              Monitor fleet performance and operational insights
            </p>

          </div>



          <button
          className="
          flex
          items-center
          gap-2
          bg-[#F59E0B]
          text-white
          px-5
          py-3
          rounded-xl
          "
          >

          <Download size={18}/>

          Export Report

          </button>


        </div>





        {/* Filters */}

        <div className="
        bg-white
        p-5
        rounded-xl
        mb-6
        flex
        gap-4
        ">


          <button
          className="
          flex
          items-center
          gap-2
          border
          px-4
          py-2
          rounded-lg
          "
          >

          <Calendar size={18}/>

          This Month

          </button>



          <select
          className="
          border
          rounded-lg
          px-4
          "
          >

          <option>
          All Vehicles
          </option>

          <option>
          RJ14 AB1234
          </option>


          </select>


        </div>






        {/* Stats */}

        <div className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-5
        ">


        {
          stats.map((item,index)=>{

            const Icon=item.icon;


            return(

              <div
              key={index}
              className="
              bg-white
              p-5
              rounded-xl
              shadow-sm
              "
              >


              <div className="flex justify-between">


              <div>

              <p className="text-gray-500">
              {item.title}
              </p>


              <h2 className="text-2xl font-bold">
              {item.value}
              </h2>


              </div>



              <Icon
              className="text-[#F59E0B]"
              />



              </div>


              <p className="text-green-600 mt-3 text-sm">
              {item.change}
              </p>


              </div>


            )

          })
        }


        </div>







        {/* Charts */}

        <div className="
        grid
        lg:grid-cols-3
        gap-6
        mt-8
        ">


        <TripPerformanceChart />

        <FuelConsumptionChart />

        <VehicleUtilizationChart />


        </div>



      </div>


    </div>

  );

};


export default Analytics;