import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";


const data = [
  {
    month:"Jan",
    trips:120
  },
  {
    month:"Feb",
    trips:180
  },
  {
    month:"Mar",
    trips:150
  },
  {
    month:"Apr",
    trips:220
  },
  {
    month:"May",
    trips:260
  },
];


const TripPerformanceChart = () => {

return (

<div className="
bg-white
rounded-xl
p-6
shadow-sm
">


<h2 className="
font-bold
text-lg
mb-5
">

Trip Performance

</h2>



<ResponsiveContainer width="100%" height={250}>

<LineChart data={data}>


<CartesianGrid strokeDasharray="3 3"/>


<XAxis dataKey="month"/>


<YAxis/>


<Tooltip/>


<Line
type="monotone"
dataKey="trips"
stroke="#F59E0B"
strokeWidth={3}
/>


</LineChart>


</ResponsiveContainer>



</div>

);

};


export default TripPerformanceChart;