import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const TripDispatcher = () => {
  const [tripData, setTripData] = useState({
    passenger: "",
    pickup: "",
    drop: "",
    vehicle: "",
    driver: "",
    priority: "Normal",
  });

  const [trips, setTrips] = useState([
    {
      id: 1,
      passenger: "Rahul Sharma",
      pickup: "Railway Station",
      drop: "Airport",
      vehicle: "Bus-102",
      driver: "Amit",
      status: "Assigned",
    },
    {
      id: 2,
      passenger: "Priya Singh",
      pickup: "City Mall",
      drop: "University",
      vehicle: "Cab-205",
      driver: "Rakesh",
      status: "Pending",
    },
  ]);

  const handleChange = (e) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value,
    });
  };


  const dispatchTrip = () => {
    if (
      !tripData.passenger ||
      !tripData.pickup ||
      !tripData.drop
    ) {
      alert("Please fill required fields");
      return;
    }

    const newTrip = {
      id: trips.length + 1,
      ...tripData,
      status: "Assigned",
    };

    setTrips([...trips, newTrip]);

    setTripData({
      passenger: "",
      pickup: "",
      drop: "",
      vehicle: "",
      driver: "",
      priority: "Normal",
    });
  };


  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />


      <div className="flex-1">

        <TopNavbar />


        <div className="p-6">


          {/* Header */}
          <div className="mb-6">

            <h1 className="text-3xl font-bold text-gray-800">
              Trip Dispatcher
            </h1>

            <p className="text-gray-500">
              Create and assign trips to available vehicles
            </p>

          </div>



          {/* Dispatch Form */}

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">


            <h2 className="text-xl font-semibold mb-5">
              Dispatch New Trip
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


              <input
                type="text"
                name="passenger"
                placeholder="Passenger Name"
                value={tripData.passenger}
                onChange={handleChange}
                className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />


              <input
                type="text"
                name="pickup"
                placeholder="Pickup Location"
                value={tripData.pickup}
                onChange={handleChange}
                className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />


              <input
                type="text"
                name="drop"
                placeholder="Drop Location"
                value={tripData.drop}
                onChange={handleChange}
                className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />



              <select
                name="vehicle"
                value={tripData.vehicle}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              >

                <option value="">
                  Select Vehicle
                </option>

                <option>
                  Bus-101
                </option>

                <option>
                  Bus-102
                </option>

                <option>
                  Cab-205
                </option>

              </select>



              <select
                name="driver"
                value={tripData.driver}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              >

                <option value="">
                  Select Driver
                </option>

                <option>
                  Amit
                </option>

                <option>
                  Rakesh
                </option>

                <option>
                  Suresh
                </option>

              </select>



              <select
                name="priority"
                value={tripData.priority}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              >

                <option>
                  Normal
                </option>

                <option>
                  High
                </option>

                <option>
                  Emergency
                </option>

              </select>


            </div>



            <button
              onClick={dispatchTrip}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Dispatch Trip
            </button>


          </div>




          {/* Active Trips Table */}

          <div className="bg-white rounded-xl shadow-md p-6">


            <h2 className="text-xl font-semibold mb-5">
              Active Trips
            </h2>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-100 text-left">

                    <th className="p-3">
                      Passenger
                    </th>

                    <th className="p-3">
                      Pickup
                    </th>

                    <th className="p-3">
                      Drop
                    </th>

                    <th className="p-3">
                      Vehicle
                    </th>

                    <th className="p-3">
                      Driver
                    </th>

                    <th className="p-3">
                      Status
                    </th>

                  </tr>

                </thead>



                <tbody>

                  {trips.map((trip)=>(

                    <tr
                      key={trip.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {trip.passenger}
                      </td>

                      <td className="p-3">
                        {trip.pickup}
                      </td>

                      <td className="p-3">
                        {trip.drop}
                      </td>

                      <td className="p-3">
                        {trip.vehicle || "-"}
                      </td>

                      <td className="p-3">
                        {trip.driver || "-"}
                      </td>


                      <td className="p-3">

                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">

                          {trip.status}

                        </span>

                      </td>


                    </tr>

                  ))}


                </tbody>

              </table>


            </div>


          </div>


        </div>

      </div>


    </div>
  );
};


export default TripDispatcher;