
import React, { useState, useEffect } from 'react';
import UserSidebar from './UserSidebar';
import UserDashboard from './UserDashboard';
import UserProfileForm from '../Auth/UserProfileForm';
import FindServices from './FindServices';
import BookingDetail from './BookingDetail';
import { useNavigate } from "react-router-dom";
import AppointmentHistory from './AppointmentHistory';
import UpcomingAppointments from './UpcomingAppointments';

const UserLayout = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        avatar: null,
        preferredLanguage: 'English',
        timezone: 'Asia/Kathmandu (UTC+05:45)',
        verificationStatus: null,
        verificationDate: null
    });
    const [loading, setLoading] = useState(true);

    // Fetch user data on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // Helper function to get profile image URL (same as in your UserProfileForm)
    const getProfileImageUrl = (dbPath) => {
        if (!dbPath) return null;

        // Use the full path from database directly
        const cleanPath = dbPath.startsWith('/') ? dbPath.substring(1) : dbPath;
        return `http://localhost:8080/${cleanPath}`;
    };

    // Fetch user data from backend (using same logic as UserProfileForm)
    const fetchUserData = async () => {
        try {
            // Get email from localStorage (same as your UserProfileForm)
            const email = localStorage.getItem('userEmail');
            if (!email) {
                console.error('No email found in localStorage');
                // Redirect to login if no email found
                navigate('/UserLayout');
                return;
            }

            const response = await fetch(`api/users/profile?email=${email}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();

                console.log('Fetched user data for sidebar:', data);

                const avatarUrl = getProfileImageUrl(data.profileImagePath);

                // Map backend data to userInfo state (same structure as your UserProfileForm)
                setUserInfo({
                    fullName: data.username || '',
                    email: data.email || '',
                    phoneNumber: data.phone || '',
                    address: data.address || '',
                    avatar: avatarUrl || null,
                    preferredLanguage: 'English', // You can add this field to your backend if needed
                    timezone: 'Asia/Kathmandu (UTC+05:45)', // You can add this field to your backend if needed
                    verificationStatus: data.status,
                    verificationDate: data.verifiedAt || null
                });

                // Update localStorage with fresh data
                if (data.username) localStorage.setItem('userName', data.username);
                if (data.email) localStorage.setItem('userEmail', data.email);

            } else if (response.status === 401) {
                // User not authenticated, redirect to login
                console.error('User not authenticated');
                navigate('/LoginSignup');
            } else {
                console.error('Failed to fetch profile:', response.status);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    // Updated to refresh sidebar data when profile is updated
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

        console.log('Profile updated, sidebar will refresh:', updatedProfile);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                console.log("User logged out successfully");
                // Clear localStorage
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
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

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <UserDashboard userInfo={userInfo} sidebarCollapsed={sidebarCollapsed} />;
            case 'profile':
                return (
                    <UserProfileForm
                        userInfo={userInfo}
                        sidebarCollapsed={sidebarCollapsed}
                        onUpdateProfile={handleUpdateProfile}
                    />
                );
            case 'find-services':
                return <FindServices />;
           case 'upcoming-appointments':
               return <UpcomingAppointments />;
           case 'appointment-history':
                return <AppointmentHistory />;
            default:
                return <UserDashboard userInfo={userInfo} sidebarCollapsed={sidebarCollapsed} />;
        }
    };

    // Loading state while fetching user data
    if (loading) {
        return (
            <div className="user-layout loading">
                <div className="loading-spinner">Loading user data...</div>
            </div>
        );
    }

    return (
        <div className="user-layout">
            <UserSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={handleLogout}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={setSidebarCollapsed}
            />

            <div className="user-content">
                {renderActiveComponent()}
            </div>
        </div>
    );
};

export default UserLayout;