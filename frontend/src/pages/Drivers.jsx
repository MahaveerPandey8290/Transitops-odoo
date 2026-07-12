import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
import { Users, Plus, Trash2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { driverApi, getStoredUser } from '../api/client';

export default function Drivers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openAddDriverModal) {
      setIsModalOpen(true);
      setEditDriver(null);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const user = getStoredUser();
  const canWrite = user?.role === 'FLEET_MANAGER' || user?.role === 'SAFETY_OFFICER';

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Map backend enum status → display string used by existing child components
  const mapDriver = (d) => ({
    id: d.id,
    name: d.name,
    empId: d.employeeId ?? d.id.slice(0, 8).toUpperCase(),
    phone: d.phone,
    email: d.email ?? '',
    address: d.address ?? '',
    licenseNumber: d.licenseNumber,
    licenseCategory: d.licenseCategory,
    licenseExpiry: d.licenseExpiryDate?.slice(0, 10) ?? '',
    yearsExperience: d.yearsExperience ?? 0,
    bloodGroup: d.bloodGroup ?? '',
    avatarUrl: '',
    status: { AVAILABLE: 'Available', ON_TRIP: 'On Trip', OFF_DUTY: 'Off Duty', SUSPENDED: 'Suspended' }[d.status] ?? d.status,
    safetyScore: d.safetyScore ?? 85,
    tripCompletionRate: 95,
    completedTrips: 0,
    cancelledTrips: 0,
    totalDistance: 0,
    assignedVehicle: '',
    region: d.region,
  });

  const loadDrivers = useCallback(async () => {
    setLoading(true); setApiError('');
    try {
      const res = await driverApi.list({ limit: 100 });
      setDrivers((res.data?.drivers ?? []).map(mapDriver));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDrivers(); }, [loadDrivers]);

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
  const handleOpenRegisterModal = () => { setEditDriver(null); setIsModalOpen(true); };
  const handleOpenEditModal = (drv) => { setEditDriver(drv); setIsModalOpen(true); setIsDrawerOpen(false); };

  const handleSaveDriver = async (formData) => {
    try {
      if (formData.id) {
        await driverApi.update(formData.id, {
          name: formData.name, phone: formData.phone, email: formData.email,
          licenseExpiryDate: formData.licenseExpiry ? new Date(formData.licenseExpiry).toISOString() : undefined,
          region: formData.region,
        });
        showToast(`Driver ${formData.name} updated!`);
      } else {
        await driverApi.create({
          name: formData.name, phone: formData.phone, email: formData.email,
          licenseNumber: formData.licenseNumber, licenseCategory: formData.licenseCategory,
          licenseExpiryDate: new Date(formData.licenseExpiry).toISOString(),
          region: formData.region ?? 'North',
        });
        showToast(`Driver ${formData.name} added!`);
      }
      await loadDrivers();
    } catch (err) { showToast(`Error: ${err.message}`); }
    setIsModalOpen(false);
  };

  const handleSuspendDriver = async (drv) => {
    try { await driverApi.update(drv.id, { status: 'SUSPENDED' }); await loadDrivers(); showToast(`Driver ${drv.name} suspended.`); }
    catch (err) { showToast(`Error: ${err.message}`); }
  };

  const handleReactivateDriver = async (drv) => {
    try { await driverApi.update(drv.id, { status: 'AVAILABLE' }); await loadDrivers(); showToast(`Driver ${drv.name} reactivated.`); }
    catch (err) { showToast(`Error: ${err.message}`); }
  };

  const handleAssignTrip = (drv) => showToast(`Navigate to Trip Dispatcher to assign a trip to ${drv.name}`);
  const handleDeleteTrigger = (drv) => setDeleteConfirmationId(drv.id);

  const confirmDelete = async () => {
    // Backend has no driver DELETE — mark as OFF_DUTY instead
    const drv = drivers.find(d => d.id === deleteConfirmationId);
    try { await driverApi.update(deleteConfirmationId, { status: 'OFF_DUTY' }); await loadDrivers(); showToast(`Driver ${drv?.name ?? ''} removed from active roster.`); }
    catch (err) { showToast(`Error: ${err.message}`); }
    setDeleteConfirmationId(null); setIsDrawerOpen(false);
  };

  const handleRenewLicense = async (drv) => {
    const newExpiry = new Date(); newExpiry.setFullYear(newExpiry.getFullYear() + 3);
    try { await driverApi.update(drv.id, { licenseExpiryDate: newExpiry.toISOString() }); await loadDrivers(); showToast(`License renewed for ${drv.name}!`); }
    catch (err) { showToast(`Error: ${err.message}`); }
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
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium">Manage drivers, licenses, availability and safety compliance.</p>
            </div>
            {canWrite && (
              <button onClick={handleOpenRegisterModal}
                className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5 active:scale-95 self-start sm:self-auto">
                <Plus size={16} /><span>Add Driver</span>
              </button>
            )}
          </div>

          {/* Summary + Filters */}
          {loading ? (
            <div className="flex items-center justify-center h-40 gap-2 text-[#9CA3AF]">
              <Loader2 size={22} className="animate-spin" /><span className="text-sm font-medium">Loading driver data...</span>
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">{apiError}</div>
          ) : (
            <>
              <DriverSummaryCards stats={statsSummary} />
              <DriverFilters onFilterChange={(f) => { setFilters(f); setCurrentPage(1); }}
                onRefresh={loadDrivers} onExportPDF={() => window.print()} />

              {/* Main Layout Split */}
              {filteredDrivers.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
                  {/* Driver Grid Table */}
                  <div className="xl:col-span-3 space-y-5">
                    <DriverTable
                      drivers={paginatedDrivers}
                      onView={(drv) => { setSelectedDriver(drv); setIsDrawerOpen(true); }}
                      onEdit={handleOpenEditModal}
                      onAssignTrip={handleAssignTrip}
                      onSuspend={handleSuspendDriver}
                      onReactivate={handleReactivateDriver}
                      onDelete={handleDeleteTrigger}
                      onSort={(key, dir) => setSortConfig({ key, direction: dir })}
                      sortConfig={sortConfig}
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredDrivers.length}
                      pageSize={pageSize}
                      onPageChange={(page) => setCurrentPage(page)}
                      onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                    />
                  </div>

                  {/* Sidebar Panel Widgets */}
                  <div className="xl:col-span-1 space-y-5">
                    <SafetyInsights drivers={drivers} />
                    <LicenseAlerts
                      drivers={drivers}
                      onViewProfile={(drv) => { setSelectedDriver(drv); setIsDrawerOpen(true); }}
                      onRenew={handleRenewLicense}
                    />
                    <DriverBusinessRulesCard />
                  </div>
                </div>
              ) : (
                <EmptyState
                  onAction={handleOpenRegisterModal}
                  title="No Drivers Found"
                  description="Verify your search queries or register a new fleet driver."
                  buttonText="Add Driver"
                  icon={Users}
                />
              )}
            </>
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
