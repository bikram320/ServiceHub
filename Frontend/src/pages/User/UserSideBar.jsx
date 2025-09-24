import React, { useState } from 'react';
import {
    LayoutDashboard,
    User,
    Search,
    Calendar,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Newspaper
} from 'lucide-react';
import styles from "../../styles/UserSideBar.module.css";
import Header2 from "../../Components/layout/Header2.jsx";

const UserSidebar = ({  activeTab,
                         onTabChange,
                         onLogout,
                         userInfo = {},
                         isCollapsed,
                         onToggleCollapse }) => {

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const handleToggleCollapse = () => {
        onToggleCollapse(!isCollapsed);
    };

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'My Services',
            icon: LayoutDashboard,
            path: '/user/dashboard'
        },
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
            id: 'upcoming-appointments',
            label: 'Upcoming Appointments',
            icon: Calendar,
            path: '/user/upcoming-appointments'
        },
        {
            id: 'appointment-history',
            label: 'Appointment History',
            icon: Newspaper,
            path: '/user/appointment-history'

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
        <div className={`${styles['user-sidebar']} ${isCollapsed ? styles.collapsed : ''}`}>
            {/* Sidebar Header */}
            <div className={styles['sidebar-header']}>
                <div className={styles['logo-section']}>
                    {!isCollapsed && (
                        <>
                            <Header2 isSidebar={true} />
                        </>
                    )}
                </div>
                <button
                    className={styles['collapse-btn']}
                    onClick={handleToggleCollapse}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className={styles['sidebar-nav']}>
                <div className={styles['nav-section']}>
                    {!isCollapsed && <div className={styles['nav-title']}>Menu</div>}
                    <ul className={styles['nav-list']}>
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <li key={item.id} className={styles['nav-item']}>
                                    <button
                                        className={`${styles['nav-link']} ${isActive ? styles.active : ''}`}
                                        onClick={() => handleNavClick(item.id)}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <div className={styles['nav-icon']}>
                                            <IconComponent size={20} />
                                        </div>
                                        {!isCollapsed && (
                                            <span className={styles['nav-label']}>{item.label}</span>
                                        )}
                                        {isActive && <div className={styles['active-indicator']} />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* User Profile Section */}
            <div className={styles['sidebar-footer']}>
                <div className={styles['admin-profile']}>
                    <div className={styles['profile-info']}>
                        <div className={styles['profile-avatar']}>
                            {userInfo.avatar ? (
                                <img src={userInfo.avatar} alt="Profile" className={styles['avatar-image']} />
                            ) : (
                                <span className={styles['avatar-initials']}>{getUserInitials()}</span>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className={styles['profile-details']}>
                                <div className={styles['profile-name']}>
                                    {userInfo.fullName || 'User'}
                                </div>
                                <div className={styles['profile-role']}>Client</div>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className={styles['profile-actions']}>
                            <button
                                className={styles['profile-dropdown-btn']}
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                title="Profile options"
                            >
                                <ChevronDown size={16} />
                            </button>

                            {showProfileDropdown && (
                                <div className={styles['profile-dropdown']}>
                                    <button
                                        className={styles['dropdown-item']}
                                        onClick={() => {
                                            handleNavClick('profile');
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        <User size={16} />
                                        My Profile
                                    </button>

                                    <div className={styles['dropdown-divider']} />
                                    <button
                                        className={`${styles['dropdown-item']} ${styles.logout}`}
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
                        className={styles['quick-logout-btn']}
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
                    className={styles['sidebar-overlay']}
                    onClick={() => setIsCollapsed(true)}
                />
            )}
        </div>
    );
};

export default UserSidebar;