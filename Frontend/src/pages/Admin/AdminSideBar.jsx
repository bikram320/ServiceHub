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
    ChevronDown,
    TrendingUp
} from 'lucide-react';
import styles from "../../styles/UserSideBar.module.css";
import Header2 from "../../Components/layout/Header2.jsx";

const AdminSidebar = ({ activeTab,
                          onTabChange,
                          onLogout,
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
        },
        {
            id: 'services',
            label: 'Service Management',
            icon: TrendingUp,
            path: '/admin/services'
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

            {/* Navigation Menu */}
            <nav className={styles['sidebar-nav']}>
                <div className={styles['nav-section']}>
                    {!isCollapsed && <div className={styles['nav-title']}>Main Menu</div>}
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

            {/* Admin Profile Section */}
            <div className={styles['sidebar-footer']}>
                <div className={styles['user-profile']}>
                    <div className={styles['profile-info']}>
                        <div className={styles['profile-avatar']}>
                            <User size={20} />
                        </div>
                        {!isCollapsed && (
                            <div className={styles['profile-details']}>
                                <div className={styles['profile-name']}>Admin</div>
                                <div className={styles['profile-role']}>System Administrator</div>
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

export default AdminSidebar;