import React from "react";
import {Eye, Edit, Trash2} from "lucide-react";


const fuelData=[

{
id:"F001",
vehicle:"RJ14 AB1234",
driver:"Rahul",
fuel:"Diesel",
date:"12-07-2026",
quantity:"50 L",
cost:"₹4600",
mileage:"8.5 km/L",
status:"Paid"
},

{
id:"F002",
vehicle:"RJ07 XY4567",
driver:"Amit",
fuel:"Diesel",
date:"15-07-2026",
quantity:"40 L",
cost:"₹3680",
mileage:"7.8 km/L",
status:"Pending"
},

{
id:"F003",
vehicle:"RJ19 PQ7890",
driver:"Suresh",
fuel:"CNG",
date:"18-07-2026",
quantity:"35 Kg",
cost:"₹2800",
mileage:"12 km/Kg",
status:"Paid"
}

];


const FuelTable=()=>{


return(

<div className="bg-white rounded-xl shadow-md p-6">


<div className="flex justify-between mb-5">

<h2 className="text-xl font-bold">
Fuel Records
</h2>


<input
placeholder="Search Vehicle..."
className="border rounded-lg px-4 py-2"
/>


</div>



<div className="overflow-x-auto">

<table className="w-full">


<thead>

<tr className="bg-gray-100">

<th className="p-3 text-left">Vehicle</th>
<th className="p-3 text-left">Driver</th>
<th className="p-3 text-left">Fuel</th>
<th className="p-3 text-left">Date</th>
<th className="p-3 text-left">Quantity</th>
<th className="p-3 text-left">Cost</th>
<th className="p-3 text-left">Mileage</th>
<th className="p-3 text-left">Status</th>
<th className="p-3">Action</th>

</tr>

</thead>


<tbody>


{
fuelData.map((item)=>(

<tr 
key={item.id}
className="border-b hover:bg-gray-50"
>


<td className="p-3">
{item.vehicle}
</td>


<td className="p-3">
{item.driver}
</td>


<td className="p-3">
{item.fuel}
</td>


<td className="p-3">
{item.date}
</td>


<td className="p-3">
{item.quantity}
</td>


<td className="p-3 font-semibold">
{item.cost}
</td>


<td className="p-3">
{item.mileage}
</td>


<td className="p-3">

<span
className={`px-3 py-1 rounded-full text-sm
${
item.status==="Paid"
?
"bg-green-100 text-green-700"
:
"bg-yellow-100 text-yellow-700"
}
`}
>

{item.status}

</span>

</td>



<td className="p-3 flex gap-3">

<Eye size={18} className="text-blue-600 cursor-pointer"/>

<Edit size={18} className="text-green-600 cursor-pointer"/>

<Trash2 size={18} className="text-red-600 cursor-pointer"/>


</td>



</tr>


))

}


</tbody>


</table>

</div>


</div>


)

}


export default FuelTable;