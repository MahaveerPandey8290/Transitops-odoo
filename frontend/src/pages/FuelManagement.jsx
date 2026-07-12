import React from "react";
import Sidebar from "../components/Sidebar";
import FuelStats from "../components/FuelStats";
import FuelTable from "../components/FuelTable";

const FuelManagement = () => {

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
              Fuel Management
            </h1>

            <p className="text-gray-500 mt-1">
              Track vehicle fuel consumption and expenses
            </p>

          </div>


          <button
            className="
            bg-[#F59E0B]
            hover:bg-[#D97706]
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            "
          >
            + Add Fuel Entry
          </button>


        </div>



        {/* Stats Cards */}
        <FuelStats />



        {/* Fuel Table */}
        <div className="mt-8">

          <FuelTable />

        </div>


      </div>


    </div>
  );
};


export default FuelManagement;