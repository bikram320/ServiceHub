import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserDashboard from './UserDashboard';
import UserProfileForm from '../Auth/UserProfileForm';
import FindServices from './FindServices';
import BookingDetail from './BookingDetail';
import { useNavigate } from "react-router-dom";


const UserLayout = () => {

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [userInfo, setUserInfo] = useState({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+977-9876543210',
        address: 'Thamel, Kathmandu',
        avatar: null, //  set this to a URL if user has uploaded an avatar
        preferredLanguage: 'English',
        timezone: 'Asia/Kathmandu (UTC+05:45)'
    });

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleUpdateProfile = (updatedProfile) => {
        setUserInfo(updatedProfile);
        // usually make an API call to update the user's profile
        console.log('Profile updated:', updatedProfile);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include", // important to send cookies (Access + Refresh)
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log("User logged out successfully");

                localStorage.removeItem("user");
                sessionStorage.clear();

                // Redirect to homepage
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
                return <UserDashboard />;
            case 'profile':
                return (
                    <UserProfileForm
                        userInfo={userInfo}
                        onUpdateProfile={handleUpdateProfile}
                    />
                );
            case 'find-services':
                return <FindServices />;
            case 'booking-details':
                return <BookingDetail />;
            default:
                return <UserDashboard />;
        }
    };

    return (
        <div className="user-layout">
            <UserSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={handleLogout}
                userInfo={userInfo}
            />
            <div className="user-content">
                {renderActiveComponent()}
            </div>
        </div>
    );
};

export default UserLayout;