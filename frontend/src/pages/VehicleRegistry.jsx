import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import VehicleSummaryCards from '../components/VehicleSummaryCards';
import VehicleFilters from '../components/VehicleFilters';
import VehicleTable from '../components/VehicleTable';
import VehicleDrawer from '../components/VehicleDrawer';
import VehicleModal from '../components/VehicleModal';
import BusinessRulesCard from '../components/BusinessRulesCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { Truck, Plus, Trash2, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function VehicleRegistry() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 1. Core State: Vehicle Data List
  const [vehicles, setVehicles] = useState([
    { id: 1, regNumber: 'RJ14AB4521', name: 'VOL-822 Heavy Duty', type: 'Truck', capacity: 15000, odometer: 112500, cost: 89000, status: 'Available', driver: 'Marcus Aurelius', lastService: '2026-05-10', model: 'Volvo FH16', purchaseDate: '2024-03-12', vin: 'VIN89201840192', engineNumber: 'ENG-VOL-901', imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80', fuelType: 'Diesel', region: 'North Zone', insuranceExpiry: '2027-08-30' },
    { id: 2, regNumber: 'DL3CA8921', name: 'VAN-301 Courier', type: 'Van', capacity: 3500, odometer: 42300, cost: 35000, status: 'On Trip', driver: 'Sarah Connor', lastService: '2026-06-01', model: 'Ford Transit', purchaseDate: '2025-01-15', vin: 'VIN29103847291', engineNumber: 'ENG-FRD-402', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80', fuelType: 'Petrol', region: 'East Zone', insuranceExpiry: '2026-12-15' },
    { id: 3, regNumber: 'MH12PQ5678', name: 'REF-104 Reefer Cargo', type: 'Van', capacity: 8000, odometer: 87400, cost: 65000, status: 'Maintenance', driver: 'James Miller', lastService: '2026-02-14', model: 'Thermo King Reefer', purchaseDate: '2023-09-10', vin: 'VIN49281749281', engineNumber: 'ENG-REF-093', imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80', fuelType: 'Diesel', region: 'South Zone', insuranceExpiry: '2026-09-30' },
    { id: 4, regNumber: 'KA03MS4410', name: 'FLT-942 Flatbed', type: 'Trailer', capacity: 20000, odometer: 65000, cost: 45000, status: 'Available', driver: 'Diana Prince', lastService: '2026-04-18', model: 'Great Dane Flatbed', purchaseDate: '2024-07-22', vin: 'VIN90281948291', engineNumber: 'ENG-FLT-882', imageUrl: '', fuelType: 'Diesel', region: 'West Zone', insuranceExpiry: '2027-05-20' },
    { id: 5, regNumber: 'TX88AB1290', name: 'MIN-089 Light Loader', type: 'Mini Truck', capacity: 2500, odometer: 18500, cost: 22000, status: 'Retired', driver: '', lastService: '2025-11-05', model: 'Tata Ace', purchaseDate: '2022-04-10', vin: 'VIN12938472910', engineNumber: 'ENG-MIN-331', imageUrl: '', fuelType: 'CNG', region: 'North Zone', insuranceExpiry: '2026-04-10' },
    { id: 6, regNumber: 'CA99XY8877', name: 'VOL-910 Heavy Cargo', type: 'Truck', capacity: 18000, odometer: 135000, cost: 95000, status: 'Maintenance', driver: 'John Doe', lastService: '2026-07-02', model: 'Volvo VNL', purchaseDate: '2023-05-18', vin: 'VIN30291048291', engineNumber: 'ENG-VOL-902', imageUrl: '', fuelType: 'Diesel', region: 'West Zone', insuranceExpiry: '2027-06-15' }
  ]);

  // 2. Active Interactivity UI States
  const [filters, setFilters] = useState({ search: '', vehicleType: 'all', status: 'all', region: 'all' });
  const [sortConfig, setSortConfig] = useState({ key: 'regNumber', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals & Drawers state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null); // null means Register mode
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // Success Toasts
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // 3. Filter and Sort Logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vh) => {
        const matchesSearch = 
          vh.regNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          vh.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          vh.model.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = filters.vehicleType === 'all' || vh.type === filters.vehicleType;
        const matchesStatus = filters.status === 'all' || vh.status === filters.status;
        const matchesRegion = filters.region === 'all' || vh.region === filters.region;
        
        return matchesSearch && matchesType && matchesStatus && matchesRegion;
      })
      .sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        let valA = a[key];
        let valB = b[key];
        
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        
        if (valA < valB) return direction === 'ascending' ? -1 : 1;
        if (valA > valB) return direction === 'ascending' ? 1 : -1;
        return 0;
      });
  }, [vehicles, filters, sortConfig]);

  // Pagination bounds calculation
  const totalPages = Math.ceil(filteredVehicles.length / pageSize);
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  // Recalculating totals for Summary Cards
  const statsSummary = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter(v => v.status === 'Available').length,
      onTrip: vehicles.filter(v => v.status === 'On Trip').length,
      maintenance: vehicles.filter(v => v.status === 'Maintenance').length
    };
  }, [vehicles]);

  // 4. Quick Insights Statistics Computations
  const insights = useMemo(() => {
    if (vehicles.length === 0) return { avgOdo: 0, oldestName: 'N/A', newestName: 'N/A' };
    const totalOdo = vehicles.reduce((sum, v) => sum + v.odometer, 0);
    const sortedByDate = [...vehicles]
      .filter(v => v.purchaseDate)
      .sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));

    return {
      avgOdo: Math.round(totalOdo / vehicles.length),
      oldestName: sortedByDate.length > 0 ? sortedByDate[0].name : 'N/A',
      newestName: sortedByDate.length > 0 ? sortedByDate[sortedByDate.length - 1].name : 'N/A'
    };
  }, [vehicles]);

  // Pie chart data structure for Fleet Distribution
  const pieData = useMemo(() => {
    return [
      { name: 'Available', value: statsSummary.available, color: '#22C55E' },
      { name: 'On Trip', value: statsSummary.onTrip, color: '#3B82F6' },
      { name: 'Maint.', value: statsSummary.maintenance, color: '#F59E0B' },
      { name: 'Retired', value: vehicles.filter(v => v.status === 'Retired').length, color: '#EF4444' }
    ].filter(d => d.value > 0);
  }, [statsSummary, vehicles]);

  // Horizontal bar counts for types
  const typeCounts = useMemo(() => {
    const counts = { Truck: 0, Van: 0, 'Mini Truck': 0, Trailer: 0 };
    vehicles.forEach(v => {
      if (counts[v.type] !== undefined) counts[v.type]++;
    });
    return counts;
  }, [vehicles]);

  // 5. CRUD Callback Methods
  const handleOpenRegisterModal = () => {
    setEditVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vh) => {
    setEditVehicle(vh);
    setIsModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleSaveVehicle = (formData) => {
    if (formData.id) {
      // Edit mode
      setVehicles(vehicles.map(v => v.id === formData.id ? { ...v, ...formData } : v));
      showToast(`Vehicle ${formData.regNumber} updated successfully!`);
    } else {
      // Register mode
      const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
      setVehicles([...vehicles, { id: newId, ...formData }]);
      showToast(`Vehicle ${formData.regNumber} registered successfully!`);
    }
    setIsModalOpen(false);
  };

  const handleScheduleMaintenance = (vh) => {
    setVehicles(vehicles.map(v => v.id === vh.id ? { ...v, status: 'Maintenance' } : v));
    showToast(`Maintenance scheduled for ${vh.regNumber}!`);
  };

  const handleDeleteTrigger = (vh) => {
    setDeleteConfirmationId(vh.id);
  };

  const confirmDelete = () => {
    const deletedVeh = vehicles.find(v => v.id === deleteConfirmationId);
    setVehicles(vehicles.filter(v => v.id !== deleteConfirmationId));
    showToast(`Vehicle ${deletedVeh ? deletedVeh.regNumber : ''} deleted successfully.`);
    setDeleteConfirmationId(null);
    setIsDrawerOpen(false);
  };

  const handleRefresh = () => {
    showToast('Registry database refreshed!');
  };

  const handleExportPDF = () => {
    showToast('Exporting PDF... Opening print window.');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="h-screen w-screen bg-[#0F1115] text-white flex font-sans selection:bg-[#F59E0B]/20 antialiased overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Global Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 p-4 bg-[#171A21] border border-[#2B3038] text-white text-xs font-bold rounded-xl shadow-2xl animate-[fadeInRight_0.4s_ease-out_forwards] flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#22C55E]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmationId !== null && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmationId(null)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-[#15181E] border border-[#2B3038] rounded-xl p-5 max-w-sm w-full text-left shadow-2xl animate-fade-in">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertTriangle size={20} />
                  <h4 className="font-bold text-white text-sm">Delete Fleet Asset?</h4>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2 font-medium leading-relaxed">
                  Are you sure you want to delete this vehicle asset? This action is permanent and will remove all corresponding operational history.
                </p>
                <div className="flex items-center justify-end gap-3 mt-5 text-xs font-bold">
                  <button 
                    onClick={() => setDeleteConfirmationId(null)}
                    className="px-4 py-2 border border-[#2B3038] hover:border-slate-700 bg-[#0F1115] text-[#9CA3AF] hover:text-white rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-[#EF4444] hover:bg-red-600 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-500/10"
                  >
                    <Trash2 size={14} />
                    <span>Delete Asset</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Scrollable Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          
          {/* Header Action Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">Vehicle Registry</h1>
              <p className="text-xs md:text-sm text-[#9CA3AF] mt-1 font-medium">Manage, monitor and organize all fleet vehicles from a single place.</p>
            </div>
            
            <button
              onClick={handleOpenRegisterModal}
              className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5 active:scale-95 self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>Register Vehicle</span>
            </button>
          </div>

          {/* Top Summary Widgets */}
          <VehicleSummaryCards stats={statsSummary} />

          {/* Search Filters Container */}
          <VehicleFilters 
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }} 
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
          />

          {/* Layout Split: Table on Left, Insights on Right */}
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
              {/* Data Grid table */}
              <div className="xl:col-span-3 space-y-5">
                <VehicleTable 
                  vehicles={paginatedVehicles}
                  onView={(vh) => {
                    setSelectedVehicle(vh);
                    setIsDrawerOpen(true);
                  }}
                  onEdit={handleOpenEditModal}
                  onMaintenance={handleScheduleMaintenance}
                  onDelete={handleDeleteTrigger}
                  onSort={(key, dir) => setSortConfig({ key, direction: dir })}
                  sortConfig={sortConfig}
                />
                
                {/* Pagination Footnotes */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredVehicles.length}
                  pageSize={pageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Sidebar Insights + Regulations panels */}
              <div className="xl:col-span-1 space-y-5">
                
                {/* Insights Panel */}
                <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left space-y-5 animate-fade-in">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">Quick Insights</h4>
                    <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Real-time configuration analytics.</p>
                  </div>

                  {/* Donut Chart */}
                  {pieData.length > 0 && (
                    <div className="h-28 flex items-center justify-between border-b border-[#2B3038] pb-4">
                      <div className="w-1/2 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={25}
                              outerRadius={40}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-1/2 flex flex-col gap-1 justify-center">
                        {pieData.map((d, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[9px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-[#9CA3AF] truncate max-w-[50px]">{d.name}:</span>
                            <span className="text-white ml-auto font-mono">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Horizontal Bars */}
                  <div className="space-y-2 border-b border-[#2B3038] pb-4">
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider block">Asset Breakdown</span>
                    {Object.entries(typeCounts).map(([type, count]) => {
                      const percentage = vehicles.length > 0 ? (count / vehicles.length) * 100 : 0;
                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-white">
                            <span>{type}</span>
                            <span className="font-mono">{count}</span>
                          </div>
                          <div className="h-1.5 bg-[#0F1115] rounded-full overflow-hidden border border-[#2B3038]/30">
                            <div 
                              className="h-full bg-[#F59E0B] rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats list */}
                  <div className="space-y-2.5 text-[11px] font-semibold">
                    <div className="flex justify-between">
                      <span className="text-[#9CA3AF]">Average Odometer</span>
                      <span className="text-white font-mono">{new Intl.NumberFormat('en-US').format(insights.avgOdo)} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9CA3AF]">Oldest Asset</span>
                      <span className="text-white truncate max-w-[120px]" title={insights.oldestName}>{insights.oldestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9CA3AF]">Newest Asset</span>
                      <span className="text-white truncate max-w-[120px]" title={insights.newestName}>{insights.newestName}</span>
                    </div>
                  </div>
                </div>

                {/* Business Rules Info Card */}
                <BusinessRulesCard />
              </div>
            </div>
          ) : (
            /* Empty State Container */
            <EmptyState onRegister={handleOpenRegisterModal} />
          )}

        </main>
      </div>

      {/* Details Side-Drawer */}
      <VehicleDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        vehicle={selectedVehicle}
        onEdit={handleOpenEditModal}
      />

      {/* Registration & Editing Modal Dialog */}
      <VehicleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={editVehicle}
        onSave={handleSaveVehicle}
        existingVehicles={vehicles}
      />

    </div>
  );
}
