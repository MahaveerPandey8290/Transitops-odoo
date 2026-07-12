import React from "react";

export default function ServiceLogTable() {
  return (
    <div className="bg-white text-black rounded-lg p-5 shadow">
      <h2 className="text-xl font-bold mb-4">Service Logs</h2>

      <table className="w-full">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Service</th>
            <th>Cost</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Van-05</td>
            <td>Oil Change</td>
            <td>₹2500</td>
            <td>In Shop</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}