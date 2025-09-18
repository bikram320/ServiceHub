import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import TechnicianManagement from './TechnicianManagement';


const AdminLayout = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleLogout = () => {
        // Add your logout logic here
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'users':
                return <UserManagement />;
            case 'technicians':
                return <TechnicianManagement />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={handleLogout}
            />
            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminLayout;