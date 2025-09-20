import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import TechnicianManagement from './TechnicianManagement';
import {useNavigate} from "react-router-dom";


const AdminLayout = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include", // important to send cookies
            });

            if (response.ok) {
                console.log("User logged out successfully");
                // Cookies are cleared by the backend, so no need to clear localStorage
                navigate("/"); // redirect to homepage or login
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