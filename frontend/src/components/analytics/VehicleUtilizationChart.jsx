import React from "react";

import {
PieChart,
Pie,
Cell,
Tooltip,
ResponsiveContainer
} from "recharts";


const data=[

{
name:"Active",
value:70
},

{
name:"Idle",
value:20
},

{
name:"Maintenance",
value:10
}

];


const VehicleUtilizationChart=()=>{


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

Vehicle Utilization

</h2>


<ResponsiveContainer width="100%" height={250}>


<PieChart>


<Pie
data={data}
dataKey="value"
outerRadius={90}
label
>


{
data.map((entry,index)=>(

<Cell
key={index}
/>

))
}


</Pie>


<Tooltip/>


</PieChart>


</ResponsiveContainer>



</div>

)


}


export default VehicleUtilizationChart;