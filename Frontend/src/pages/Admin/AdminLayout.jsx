import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import TechnicianManagement from './TechnicianManagement';
import { useNavigate } from "react-router-dom";
import  '../../styles/AdminLayout.css';
const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                console.log("User logged out successfully");
                navigate("/");
            } else {
                console.error("Logout failed:", await response.text());
                alert("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Something went wrong while logging out.");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard sidebarCollapsed={sidebarCollapsed} />;
            case 'users':
                return <UserManagement sidebarCollapsed={sidebarCollapsed} />;
            case 'technicians':
                return <TechnicianManagement sidebarCollapsed={sidebarCollapsed} />;
            default:
                return <AdminDashboard sidebarCollapsed={sidebarCollapsed} />;
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={handleLogout}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={setSidebarCollapsed}
            />
            <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminLayout;