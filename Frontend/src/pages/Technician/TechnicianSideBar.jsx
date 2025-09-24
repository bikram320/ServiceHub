import React, { useState } from 'react';
import {
    LayoutDashboard,
    User,
    Clock,
    FileText,
    LogOut,
    Menu,
    X,
    Settings,
    Bell,
    ChevronDown,
    Wrench,
    Newspaper
} from 'lucide-react';
import Header2 from "../../Components/layout/Header2.jsx";
import styles from "../../styles/UserSideBar.module.css";

const TechnicianSidebar = ({ activeTab,
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
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/technician/dashboard'
        },
        // {
        //     id: 'profile',
        //     label: 'Technician Profile',
        //     icon: User,
        //     path: '/technician/profile'
        // },
        {
            id: 'profile-form',
            label: 'Profile Form',
            icon: Newspaper,
            path: '/technician/profile-form'
        },
        {
            id: 'service-requests',
            label: 'Service Requests',
            icon: Clock,
            path: '/technician/service-requests'
        },
        {
            id: 'job-history',
            label: 'Job History',
            icon: FileText,
            path: '/technician/job-history'
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
        return 'T';
    };

    return (
        <div className={`${styles['user-sidebar']} ${isCollapsed ? styles.collapsed : ''}`}>
            {/* Sidebar Header */}
            <div className={styles['sidebar-header']}>
                <div className={styles['logo-section']}>
                    {!isCollapsed && (
                        <>
                            <Header2 isSidebar={true}/>
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

            {/*Navigation Menu*/}
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
                                    {userInfo.fullName || 'Technician'}
                                </div>
                                <div className={styles['profile-role']}>Professional</div>
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
                                            handleNavClick('profile-form');
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
                    onClick={() => onToggleCollapse(true)}
                />
            )}
        </div>
    );
};

export default TechnicianSidebar;