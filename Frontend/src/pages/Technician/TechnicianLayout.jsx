import React, { useState, useEffect } from 'react';
import TechnicianSidebar from './TechnicianSidebar';
import TechnicianDashboard from './TechnicianDashboard';
import TechnicianProfileForm from '../Auth/TechnicianProfileForm';
import ServiceRequests from './ServiceRequests';
import JobHistory from './JobHistory';
import TechnicianProfile from './TechnicianProfile';
import {useNavigate} from "react-router-dom";

const TechnicianLayout = () =>{

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        avatar: null,
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
    const [loading, setLoading] = useState(true);

    // Fetch user data on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // Helper function to get profile image URL
    const getProfileImageUrl = (dbPath) => {
        if (!dbPath) return null;

        // Use the full path from database directly
        const cleanPath = dbPath.startsWith('/') ? dbPath.substring(1) : dbPath;
        return `http://localhost:8080/${cleanPath}`;
    };

    // Fetch user data from backend
    const fetchUserData = async () => {
        try {
            // Get email from localStorage
            const email = localStorage.getItem('technicianEmail');
            if (!email) {
                console.error('No email found in localStorage');
                // Redirect to login if no email found
                navigate('/LoginSignup');
                return;
            }

            const response = await fetch(`api/technician/profile?email=${email}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();

                console.log('Fetched technician data for sidebar:', data);

                const avatarUrl = getProfileImageUrl(data.profileImagePath);

                // Map backend data to userInfo state
                setUserInfo(prev => ({
                    ...prev,
                    fullName: data.technicianName || '',
                    email: data.email || '',
                    phoneNumber: data.phone || '',
                    address: data.address || '',
                    avatar: avatarUrl || null,
                }));

                // Update localStorage with fresh data
                if (data.username) localStorage.setItem('technicianName', data.username);
                if (data.email) localStorage.setItem('technicianEmail', data.email);

            } else if (response.status === 401) {
                // User not authenticated, redirect to login
                console.error('User not authenticated');
                navigate('/LoginSignup');
            } else {
                console.error('Failed to fetch profile:', response.status);
            }
        } catch (error) {
            console.error('Error fetching technician data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleUpdateProfile = (updatedProfile) => {
        // Update userInfo state for sidebar display
        setUserInfo(prev => ({
            ...prev,
            fullName: updatedProfile.fullName || prev.fullName,
            email: updatedProfile.email || prev.email,
            phoneNumber: updatedProfile.phoneNumber || prev.phoneNumber,
            address: updatedProfile.address || prev.address,
            avatar: updatedProfile.avatar || prev.avatar,
            preferredLanguage: updatedProfile.preferredLanguage || prev.preferredLanguage,
            timezone: updatedProfile.timezone || prev.timezone
        }));

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
                // Clear localStorage
                localStorage.removeItem('technicianEmail');
                localStorage.removeItem('technicianName');
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
                return <TechnicianDashboard userInfo={userInfo} isCollapsed={sidebarCollapsed} />;
            case 'profile-form':
                return (
                    <TechnicianProfileForm
                        userInfo={userInfo}
                        onUpdateProfile={handleUpdateProfile}
                        sidebarCollapsed={sidebarCollapsed}
                    />
                );
            case 'profile':
                return <TechnicianProfile userInfo={userInfo} />;
            case 'service-requests':
                return <ServiceRequests technicianInfo={userInfo} isSidebarCollapsed={sidebarCollapsed}/>;
            case 'job-history':
                return <JobHistory technicianInfo={userInfo} isSidebarCollapsed={sidebarCollapsed}/>;
            default:
                return <TechnicianDashboard userInfo={userInfo} />;
        }
    };

    // Loading state while fetching user data
    if (loading) {
        return (
            <div className="technician-layout loading">
                <div className="loading-spinner">Loading technician data...</div>
            </div>
        );
    }

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