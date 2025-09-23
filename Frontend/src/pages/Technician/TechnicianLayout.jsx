import React, { useState } from 'react';
import TechnicianSidebar from './TechnicianSidebar';
import TechnicianDashboard from './TechnicianDashboard';
import TechnicianProfileForm from '../Auth/TechnicianProfileForm';
import ServiceRequests from './ServiceRequests';
import JobHistory from './JobHistory';
import TechnicianProfile from './TechnicianProfile';
import {useNavigate} from "react-router-dom";
// import {useNavigate} from "react-router-dom";

const TechnicianLayout = () =>{

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userInfo, setUserInfo] = useState({
        fullName: 'Alex Thompson',
        email: 'alex.thompson@techpro.com',
        phoneNumber: '+977-9876543211',
        address: 'Baneshwor, Kathmandu',
        avatar: null, // set this to a URL if technician has uploaded an avatar
        specialization: 'Electrical & Plumbing',
        experience: '5 years',
        rating: 4.8,
        completedJobs: 127,
        certifications: ['Licensed Electrician', 'Plumbing Specialist'],
        availability: 'Available',
        workingHours: '8:00 AM - 6:00 PM',
        preferredLanguage: 'English',
        timezone: 'Asia/Kathmandu (UTC+05:45)'
    });
    // const navigate = useNavigate();

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleUpdateProfile = (updatedProfile) => {
        setUserInfo(updatedProfile);
        // Usually make an API call to update the technician's profile
        console.log('Technician profile updated:', updatedProfile);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("api/auth/logout", {
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

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <TechnicianDashboard userInfo={userInfo} />;
            case 'profile-form':
                return (
                    <TechnicianProfileForm
                        userInfo={userInfo}
                        onUpdateProfile={handleUpdateProfile}
                    />
                );
            case 'profile':
                return <TechnicianProfile userInfo={userInfo} />;
            case 'service-requests':
                return <ServiceRequests technicianInfo={userInfo} />;
            case 'job-history':
                return <JobHistory technicianInfo={userInfo} />;
            default:
                return <TechnicianDashboard userInfo={userInfo} />;
        }
    };

    return (
        <div className="technician-layout">
            <TechnicianSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={handleLogout}
                userInfo={userInfo}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={setSidebarCollapsed}
            />
            <div className="technician-content">
                {renderActiveComponent()}
            </div>
        </div>
    );
};

export default TechnicianLayout;

