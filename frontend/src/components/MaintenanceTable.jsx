import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const maintenanceData = [
  {
    id: "M001",
    vehicle: "RJ14 AB1234",
    serviceType: "Engine Repair",
    serviceDate: "12-07-2026",
    nextService: "12-10-2026",
    cost: "₹8500",
    technician: "Rahul",
    status: "Completed",
  },
  {
    id: "M002",
    vehicle: "RJ07 XY4567",
    serviceType: "Oil Change",
    serviceDate: "15-07-2026",
    nextService: "15-10-2026",
    cost: "₹2500",
    technician: "Amit",
    status: "Scheduled",
  },
  {
    id: "M003",
    vehicle: "RJ19 PQ7890",
    serviceType: "Tire Replacement",
    serviceDate: "18-07-2026",
    nextService: "18-01-2027",
    cost: "₹12000",
    technician: "Suresh",
    status: "In Progress",
  },
];

const MaintenanceTable = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          Maintenance Records
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Maintenance
        </button>
      </div>


      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-100 text-gray-700">

              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Vehicle</th>
              <th className="p-3 text-left">Service Type</th>
              <th className="p-3 text-left">Service Date</th>
              <th className="p-3 text-left">Next Service</th>
              <th className="p-3 text-left">Cost</th>
              <th className="p-3 text-left">Technician</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>

            </tr>
          </thead>


          <tbody>

            {maintenanceData.map((item)=>(
              <tr 
                key={item.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-3">
                  {item.id}
                </td>

                <td className="p-3">
                  {item.vehicle}
                </td>

                <td className="p-3">
                  {item.serviceType}
                </td>

                <td className="p-3">
                  {item.serviceDate}
                </td>

                <td className="p-3">
                  {item.nextService}
                </td>

                <td className="p-3 font-semibold">
                  {item.cost}
                </td>

                <td className="p-3">
                  {item.technician}
                </td>


                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded-full text-sm
                    ${
                      item.status==="Completed"
                      ? "bg-green-100 text-green-700"
                      :
                      item.status==="In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      :
                      "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>


                <td className="p-3 flex gap-3">

                  <button className="text-blue-600">
                    <Eye size={18}/>
                  </button>

                  <button className="text-green-600">
                    <Edit size={18}/>
                  </button>

                  <button className="text-red-600">
                    <Trash2 size={18}/>
                  </button>

                </td>


              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};


export default MaintenanceTable;