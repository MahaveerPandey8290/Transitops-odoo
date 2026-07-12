import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import DriverSummaryCards from '../components/DriverSummaryCards';
import DriverFilters from '../components/DriverFilters';
import DriverTable from '../components/DriverTable';
import DriverDrawer from '../components/DriverDrawer';
import DriverModal from '../components/DriverModal';
import LicenseAlerts from '../components/LicenseAlerts';
import SafetyInsights from '../components/SafetyInsights';
import DriverBusinessRulesCard from '../components/DriverBusinessRulesCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { Users, Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Drivers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 1. Core State: Drivers compliance data list
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Marcus Aurelius', empId: 'EMP-1001', phone: '+91 9029104821', email: 'marcus.aurelius@transitops.com', address: '12 Rome Way, Sector 1, Jaipur', licenseNumber: 'DL-142021004A', licenseCategory: 'Trailer', issueDate: '2021-03-12', licenseExpiry: '2027-08-30', yearsExperience: 12, emergencyContact: 'Faustina (Wife) - 90291048', bloodGroup: 'O+', vehiclePreference: 'Volvo FH16 Heavy', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', status: 'On Trip', safetyScore: 91, tripCompletionRate: 98, completedTrips: 145, cancelledTrips: 2, totalDistance: 92300, assignedVehicle: 'VOL-822' },
    { id: 2, name: 'Sarah Connor', empId: 'EMP-1002', phone: '+91 9829018401', email: 'sarah.connor@transitops.com', address: '45 Resistance Drive, Sector 5, Jodhpur', licenseNumber: 'DL-142022002B', licenseCategory: 'HMV', issueDate: '2022-01-15', licenseExpiry: '2028-04-12', yearsExperience: 8, emergencyContact: 'John Connor (Son) - 98290180', bloodGroup: 'AB-', vehiclePreference: 'Ford Courier Van', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80', status: 'Available', safetyScore: 96, tripCompletionRate: 100, completedTrips: 88, cancelledTrips: 0, totalDistance: 45200, assignedVehicle: '' },
    { id: 3, name: 'Tony Stark', empId: 'EMP-1003', phone: '+91 8029184910', email: 'tony.stark@transitops.com', address: '108 Stark Towers, Malviya Nagar, Jaipur', licenseNumber: 'DL-142023009C', licenseCategory: 'LMV', issueDate: '2023-06-20', licenseExpiry: '2028-09-30', yearsExperience: 15, emergencyContact: 'Pepper Potts (Wife) - 80291840', bloodGroup: 'A+', vehiclePreference: 'Audi Delivery Van', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80', status: 'Off Duty', safetyScore: 98, tripCompletionRate: 95, completedTrips: 210, cancelledTrips: 5, totalDistance: 135400, assignedVehicle: '' },
    { id: 4, name: 'James Miller', empId: 'EMP-1004', phone: '+91 7890123456', email: 'james.miller@transitops.com', address: '88 Kingsway Road, Mansarovar, Jaipur', licenseNumber: 'DL-142020082D', licenseCategory: 'HMV', issueDate: '2020-09-12', licenseExpiry: '2026-10-25', yearsExperience: 5, emergencyContact: 'Mary Miller (Wife) - 78901234', bloodGroup: 'B+', vehiclePreference: 'Reefer Truck', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', status: 'Suspended', safetyScore: 72, tripCompletionRate: 84, completedTrips: 64, cancelledTrips: 8, totalDistance: 38200, assignedVehicle: '' },
    { id: 5, name: 'Priya Sharma', empId: 'EMP-1005', phone: '+91 9414012345', email: 'priya.sharma@transitops.com', address: '302 Lotus Apartments, Vaishali Nagar, Jaipur', licenseNumber: 'DL-142018041E', licenseCategory: 'HMV', issueDate: '2018-04-10', licenseExpiry: '2026-07-09', yearsExperience: 9, emergencyContact: 'Rakesh Sharma (Father) - 94140120', bloodGroup: 'O-', vehiclePreference: 'Volvo VNL Heavy', avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a131ffd107fd?auto=format&fit=crop&w=80&q=80', status: 'Off Duty', safetyScore: 84, tripCompletionRate: 91, completedTrips: 112, cancelledTrips: 3, totalDistance: 78900, assignedVehicle: '' },
    { id: 6, name: 'John Carter', empId: 'EMP-1006', phone: '+91 9612048192', email: 'john.carter@transitops.com', address: '12 Virginia Lane, Sector 9, Jaipur', licenseNumber: 'DL-142021088F', licenseCategory: 'Trailer', issueDate: '2021-07-17', licenseExpiry: '2026-07-17', yearsExperience: 6, emergencyContact: 'Dejah Thoris (Spouse) - 96120480', bloodGroup: 'B-', vehiclePreference: 'Flatbed Trailer', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80', status: 'Available', safetyScore: 80, tripCompletionRate: 90, completedTrips: 76, cancelledTrips: 4, totalDistance: 54300, assignedVehicle: '' }
  ]);

  // 2. Active Interactivity UI States
  const [filters, setFilters] = useState({ search: '', category: 'all', status: 'all', licenseStatus: 'all', safetyScore: 'all' });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals & Drawers state
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDriver, setEditDriver] = useState(null); // null means Register mode
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // Success Toasts
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // 3. Filter and Sort Logic
  const filteredDrivers = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return drivers
      .filter((drv) => {
        // Text Search
        const matchesSearch = 
          drv.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          drv.licenseNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          drv.phone.includes(filters.search);
        
        // License Category
        const matchesCategory = filters.category === 'all' || drv.licenseCategory === filters.category;
        
        // Status
        const matchesStatus = filters.status === 'all' || drv.status === filters.status;
        
        // License Expiry Status (Valid, Expiring, Expired)
        const expDate = new Date(drv.licenseExpiry);
        const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
        let matchesLicenseStatus = true;
        if (filters.licenseStatus === 'Expired') {
          matchesLicenseStatus = diffDays <= 0;
        } else if (filters.licenseStatus === 'Expiring') {
          matchesLicenseStatus = diffDays > 0 && diffDays <= 30;
        } else if (filters.licenseStatus === 'Valid') {
          matchesLicenseStatus = diffDays > 30;
        }

        // Safety score brackets
        let matchesSafety = true;
        if (filters.safetyScore === 'Excellent') matchesSafety = drv.safetyScore >= 90;
        else if (filters.safetyScore === 'Good') matchesSafety = drv.safetyScore >= 80 && drv.safetyScore < 90;
        else if (filters.safetyScore === 'Average') matchesSafety = drv.safetyScore >= 70 && drv.safetyScore < 80;
        else if (filters.safetyScore === 'Poor') matchesSafety = drv.safetyScore < 70;

        return matchesSearch && matchesCategory && matchesStatus && matchesLicenseStatus && matchesSafety;
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
  }, [drivers, filters, sortConfig]);

  // Pagination bounds calculation
  const totalPages = Math.ceil(filteredDrivers.length / pageSize);
  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDrivers.slice(start, start + pageSize);
  }, [filteredDrivers, currentPage, pageSize]);

  // Recalculating totals for Summary Cards
  const statsSummary = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let expiringSoon = 0;
    drivers.forEach(d => {
      const expDate = new Date(d.licenseExpiry);
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays <= 30) expiringSoon++;
    });

    return {
      total: drivers.length,
      available: drivers.filter(d => d.status === 'Available').length,
      onTrip: drivers.filter(d => d.status === 'On Trip').length,
      offDuty: drivers.filter(d => d.status === 'Off Duty').length,
      suspended: drivers.filter(d => d.status === 'Suspended').length,
      expiringSoon
    };
  }, [drivers]);

  // CRUD Operations
  const handleOpenRegisterModal = () => {
    setEditDriver(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (drv) => {
    setEditDriver(drv);
    setIsModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleSaveDriver = (formData) => {
    if (formData.id) {
      setDrivers(drivers.map(d => d.id === formData.id ? { ...d, ...formData } : d));
      showToast(`Driver ${formData.name} updated successfully!`);
    } else {
      const newId = drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
      setDrivers([...drivers, { id: newId, ...formData }]);
      showToast(`Driver ${formData.name} added successfully!`);
    }
    setIsModalOpen(false);
  };

  const handleAssignTrip = (drv) => {
    setDrivers(drivers.map(d => d.id === drv.id ? { ...d, status: 'On Trip' } : d));
    showToast(`Trip assigned to ${drv.name}!`);
  };

  const handleSuspendDriver = (drv) => {
    setDrivers(drivers.map(d => d.id === drv.id ? { ...d, status: 'Suspended' } : d));
    showToast(`Driver ${drv.name} has been suspended.`);
  };

  const handleReactivateDriver = (drv) => {
    setDrivers(drivers.map(d => d.id === drv.id ? { ...d, status: 'Available' } : d));
    showToast(`Driver ${drv.name} reactivated.`);
  };

  const handleDeleteTrigger = (drv) => {
    setDeleteConfirmationId(drv.id);
  };

  const confirmDelete = () => {
    const deletedDrv = drivers.find(d => d.id === deleteConfirmationId);
    setDrivers(drivers.filter(d => d.id !== deleteConfirmationId));
    showToast(`Driver ${deletedDrv ? deletedDrv.name : ''} deleted successfully.`);
    setDeleteConfirmationId(null);
    setIsDrawerOpen(false);
  };

  const handleRefresh = () => {
    showToast('Driver registry database refreshed!');
  };

  const handleExportPDF = () => {
    showToast('Exporting PDF... Opening print window.');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  const handleRenewLicense = (drv) => {
    // Add 3 years to current license
    const newExpiry = new Date();
    newExpiry.setFullYear(newExpiry.getFullYear() + 3);
    const dateStr = newExpiry.toISOString().split('T')[0];

    setDrivers(drivers.map(d => d.id === drv.id ? { ...d, licenseExpiry: dateStr } : d));
    showToast(`License renewed for ${drv.name} until ${dateStr}!`);
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

      {/* Main Content shell */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navigation */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Global Toast Alerts */}
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
                  <h4 className="font-bold text-white text-sm">Delete Driver Profile?</h4>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2 font-medium leading-relaxed">
                  Are you sure you want to delete this driver profile? This action is permanent and will remove all corresponding safety reports.
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
                    <span>Delete Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">Drivers & Safety Profiles</h1>
              <p className="text-xs md:text-sm text-[#9CA3AF] mt-1 font-medium">Manage drivers, licenses, availability and safety compliance across your fleet.</p>
            </div>
            
            <button
              onClick={handleOpenRegisterModal}
              className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5 active:scale-95 self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>Add Driver</span>
            </button>
          </div>

          {/* Summary Cards Grid */}
          <DriverSummaryCards stats={statsSummary} />

          {/* Filter Bar Panel */}
          <DriverFilters 
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }} 
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
          />

          {/* Main Layout Split */}
          {filteredDrivers.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
              {/* Driver Grid Table */}
              <div className="xl:col-span-3 space-y-5">
                <DriverTable 
                  drivers={paginatedDrivers}
                  onView={(drv) => {
                    setSelectedDriver(drv);
                    setIsDrawerOpen(true);
                  }}
                  onEdit={handleOpenEditModal}
                  onAssignTrip={handleAssignTrip}
                  onSuspend={handleSuspendDriver}
                  onReactivate={handleReactivateDriver}
                  onDelete={handleDeleteTrigger}
                  onSort={(key, dir) => setSortConfig({ key, direction: dir })}
                  sortConfig={sortConfig}
                />
                
                {/* Pagination Controls */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredDrivers.length}
                  pageSize={pageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Sidebar Panel Widgets */}
              <div className="xl:col-span-1 space-y-5">
                
                {/* Safety Insights charts */}
                <SafetyInsights drivers={drivers} />

                {/* License Expiry warning alerts */}
                <LicenseAlerts 
                  drivers={drivers} 
                  onViewProfile={(drv) => {
                    setSelectedDriver(drv);
                    setIsDrawerOpen(true);
                  }}
                  onRenew={handleRenewLicense}
                />

                {/* Driver rules card */}
                <DriverBusinessRulesCard />
              </div>
            </div>
          ) : (
            /* Empty State fallbacks */
            <EmptyState 
              onAction={handleOpenRegisterModal} 
              title="No Drivers Found"
              description="Verify your search queries or register a new fleet driver operator to begin scheduling assignments."
              buttonText="Add Driver"
              icon={Users}
            />
          )}

        </main>
      </div>

      {/* Profile details slider drawer */}
      <DriverDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        driver={selectedDriver}
        onEdit={handleOpenEditModal}
      />

      {/* Operator creation modal */}
      <DriverModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        driver={editDriver}
        onSave={handleSaveDriver}
        existingDrivers={drivers}
      />

    </div>
  );
}
