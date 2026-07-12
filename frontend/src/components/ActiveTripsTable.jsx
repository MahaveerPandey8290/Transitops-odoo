import { motion } from "framer-motion";
import { MapPin, Eye } from "lucide-react";

const activeTrips = [
  {
    id: "TRP-1024",
    vehicle: "BUS-401",
    driver: "Raj Sharma",
    route: "Jodhpur → Jaipur",
    startTime: "08:30 AM",
    location: "Pali Highway",
    progress: 65,
    status: "On Route",
  },
  {
    id: "TRP-1025",
    vehicle: "BUS-208",
    driver: "Amit Singh",
    route: "Jodhpur → Udaipur",
    startTime: "09:15 AM",
    location: "Ranakpur",
    progress: 42,
    status: "On Route",
  },
  {
    id: "TRP-1026",
    vehicle: "BUS-115",
    driver: "Vikas Meena",
    route: "Jaipur → Ajmer",
    startTime: "10:00 AM",
    location: "Kishangarh",
    progress: 80,
    status: "Delayed",
  },
];


const statusStyle = {
  "On Route":
    "bg-green-100 text-green-700",
  Delayed:
    "bg-red-100 text-red-700",
};


const ActiveTripsTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Active Trips
          </h2>

          <p className="text-sm text-gray-500">
            Currently running vehicle trips
          </p>
        </div>

        <button className="text-sm text-orange-600 font-medium hover:underline">
          View All
        </button>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b text-gray-500 text-sm">

              <th className="py-3">
                Trip ID
              </th>

              <th>
                Vehicle
              </th>

              <th>
                Driver
              </th>

              <th>
                Route
              </th>

              <th>
                Location
              </th>

              <th>
                Progress
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>
          </thead>



          <tbody>

          {activeTrips.map((trip,index)=>(

            <motion.tr
              key={trip.id}
              initial={{opacity:0}}
              animate={{opacity:1}}
              transition={{delay:index*0.1}}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-4 font-medium text-gray-800">
                {trip.id}
              </td>


              <td className="text-gray-700">
                {trip.vehicle}
              </td>


              <td className="text-gray-700">
                {trip.driver}
              </td>


              <td className="text-gray-700">
                {trip.route}
              </td>


              <td>
                <div className="flex items-center gap-1 text-gray-600">

                  <MapPin size={15}
                    className="text-orange-500"
                  />

                  {trip.location}

                </div>
              </td>


              {/* Progress */}

              <td>

                <div className="w-28">

                  <div className="h-2 bg-gray-200 rounded-full">

                    <div
                      className="h-2 bg-orange-500 rounded-full"
                      style={{
                        width:`${trip.progress}%`
                      }}
                    />

                  </div>


                  <p className="text-xs text-gray-500 mt-1">
                    {trip.progress}% completed
                  </p>

                </div>

              </td>



              {/* Status */}

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[trip.status]}`}
                >
                  {trip.status}
                </span>

              </td>



              {/* Action */}

              <td>

                <button
                  className="
                  flex items-center gap-1
                  text-sm
                  text-orange-600
                  hover:text-orange-800
                  "
                >

                  <Eye size={16}/>

                  View

                </button>

              </td>


            </motion.tr>

          ))}


          </tbody>


        </table>

      </div>


    </motion.div>
  );
};


export default ActiveTripsTable;