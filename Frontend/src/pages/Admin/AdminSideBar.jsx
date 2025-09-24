import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Wrench,
    LogOut,
    Menu,
    X,
    Settings,
    Bell,
    User,
    ChevronDown
} from 'lucide-react';
import "../../styles/AdminSideBar.css";
import Header2 from "../../Components/layout/Header2.jsx";

const AdminSidebar = ({ activeTab, onTabChange, onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard'
        },
        {
            id: 'users',
            label: 'User Management',
            icon: Users,
            path: '/admin/users'
        },
        {
            id: 'technicians',
            label: 'Technician Management',
            icon: Wrench,
            path: '/admin/technicians'
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

    return (
        <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <div className="logo-section">
                    {!isCollapsed && (
                        <>
                            <Header2 isSidebar={true}/>
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
                    {!isCollapsed && <div className="nav-title">Main Menu</div>}
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

            {/* Admin Profile Section */}
            <div className="sidebar-footer">
                <div className="admin-profile">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            <User size={20} />
                        </div>
                        {!isCollapsed && (
                            <div className="profile-details">
                                <div className="profile-name">Admin User</div>
                                <div className="profile-role">System Administrator</div>
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

export default AdminSidebar;