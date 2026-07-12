import React from "react";
import { Fuel, IndianRupee, Truck, Gauge } from "lucide-react";


const FuelStats = () => {

const cards = [
{
 title:"Total Fuel Used",
 value:"4500 L",
 icon:<Fuel/>
},
{
 title:"Fuel Expense",
 value:"₹2,45,000",
 icon:<IndianRupee/>
},
{
 title:"Vehicles",
 value:"86",
 icon:<Truck/>
},
{
 title:"Average Mileage",
 value:"8.5 km/L",
 icon:<Gauge/>
}
];


return (

<div className="grid grid-cols-1 md:grid-cols-4 gap-5">


{
cards.map((card,index)=>(

<div 
key={index}
className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center"
>


<div>

<p className="text-gray-500 text-sm">
{card.title}
</p>

<h2 className="text-2xl font-bold mt-2">
{card.value}
</h2>

</div>


<div className="bg-blue-100 text-blue-600 p-3 rounded-full">
{card.icon}
</div>


</div>

))
}


</div>

);

};

export default FuelStats;