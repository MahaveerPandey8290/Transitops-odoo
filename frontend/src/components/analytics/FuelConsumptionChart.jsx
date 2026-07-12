import React from "react";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts";


const data=[

{
month:"Jan",
fuel:450
},

{
month:"Feb",
fuel:520
},

{
month:"Mar",
fuel:430
},

{
month:"Apr",
fuel:620
},

{
month:"May",
fuel:700
}

];



const FuelConsumptionChart=()=>{


return(

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

Fuel Consumption

</h2>



<ResponsiveContainer width="100%" height={250}>


<BarChart data={data}>


<CartesianGrid strokeDasharray="3 3"/>


<XAxis dataKey="month"/>


<YAxis/>


<Tooltip/>


<Bar
dataKey="fuel"
fill="#F59E0B"
/>


</BarChart>


</ResponsiveContainer>



</div>


)

}


export default FuelConsumptionChart;