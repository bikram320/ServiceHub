import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserDashboard from './UserDashboard';
import UserProfileForm from '../Auth/UserProfileForm';
import FindServices from './FindServices';
import BookingDetail from './BookingDetail';

const UserLayout = () => {
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

    const handleLogout = () => {
        // Clear user session and redirect to login
        console.log('User logged out');
        // to redirect to login page or clear authentication tokens
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