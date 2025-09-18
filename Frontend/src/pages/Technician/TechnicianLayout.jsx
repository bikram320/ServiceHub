import React, { useState } from 'react';
import TechnicianSidebar from './TechnicianSidebar';
import TechnicianDashboard from './TechnicianDashboard';
import TechnicianProfileForm from '../Auth/TechnicianProfileForm';
import ServiceRequests from './ServiceRequests';
import JobHistory from './JobHistory';

const TechnicianLayout = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
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

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleUpdateProfile = (updatedProfile) => {
        setUserInfo(updatedProfile);
        // Usually make an API call to update the technician's profile
        console.log('Technician profile updated:', updatedProfile);
    };

    const handleLogout = () => {
        // Clear technician session and redirect to login
        console.log('Technician logged out');
        // To redirect to login page or clear authentication tokens
    };

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <TechnicianDashboard userInfo={userInfo} />;
            case 'profile':
                return (
                    <TechnicianProfileForm
                        userInfo={userInfo}
                        onUpdateProfile={handleUpdateProfile}
                    />
                );
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
            />
            <div className="technician-content">
                {renderActiveComponent()}
            </div>
        </div>
    );
};

export default TechnicianLayout;