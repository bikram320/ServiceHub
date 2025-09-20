import React, { useState } from 'react';
import {
    LayoutDashboard,
    User,
    Search,
    Calendar,
    LogOut,
    Menu,
    X,
    Settings,
    Bell,
    ChevronDown,
    Newspaper
} from 'lucide-react';
import "../../styles/UserSidebar.css";

const UserSidebar = ({ activeTab, onTabChange, onLogout, userInfo = {} }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'My Services',
            icon: LayoutDashboard,
            path: '/user/dashboard'
        },
        // {
        //     id: 'profile-form',
        //     label: 'My Profile Form',
        //     icon: Newspaper,
        //     path: '/user/profile-form'
        // },
        {
            id: 'profile',
            label: 'User Profile',
            icon: User,
            path: '/user/profile'
        },
        {
            id: 'find-services',
            label: 'Find Services',
            icon: Search,
            path: '/user/find-services'
        },
        {
            id: 'booking-details',
            label: 'Booking Details',
            icon: Calendar,
            path: '/user/booking-details'
        }
    ];

    const handleNavClick = (itemId) => {
        onTabChange(itemId);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            onLogout();
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (userInfo.fullName) {
            return userInfo.fullName.split(' ')
                .map(name => name.charAt(0))
                .slice(0, 2)
                .join('')
                .toUpperCase();
        }
        return 'U';
    };

    return (
        <div className={`user-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <div className="logo-section">
                    {!isCollapsed && (
                        <>
                            <div className="logo">
                                <div className="logo-icon">
                                    Q
                                </div>
                                <span className="logo-text">QuestX</span>
                            </div>
                        </>
                    )}
                </div>
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    {!isCollapsed && <div className="nav-title">Menu</div>}
                    <ul className="nav-list">
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <li key={item.id} className="nav-item">
                                    <button
                                        className={`nav-link ${isActive ? 'active' : ''}`}
                                        onClick={() => handleNavClick(item.id)}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <div className="nav-icon">
                                            <IconComponent size={20} />
                                        </div>
                                        {!isCollapsed && (
                                            <span className="nav-label">{item.label}</span>
                                        )}
                                        {isActive && <div className="active-indicator" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* User Profile Section */}
            <div className="sidebar-footer">
                <div className="admin-profile">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {userInfo.avatar ? (
                                <img src={userInfo.avatar} alt="Profile" className="avatar-image" />
                            ) : (
                                <span className="avatar-initials">{getUserInitials()}</span>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="profile-details">
                                <div className="profile-name">
                                    {userInfo.fullName || 'User'}
                                </div>
                                <div className="profile-role">Client</div>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className="profile-actions">
                            <button
                                className="profile-dropdown-btn"
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                title="Profile options"
                            >
                                <ChevronDown size={16} />
                            </button>

                            {showProfileDropdown && (
                                <div className="profile-dropdown">
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            handleNavClick('profile');
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        <User size={16} />
                                        My Profile
                                    </button>

                                    <div className="dropdown-divider" />
                                    <button
                                        className="dropdown-item logout"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Logout Button (when collapsed) */}
                {isCollapsed && (
                    <button
                        className="quick-logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>

            {/* Overlay for mobile */}
            {!isCollapsed && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsCollapsed(true)}
                />
            )}
        </div>
    );
};

export default UserSidebar;