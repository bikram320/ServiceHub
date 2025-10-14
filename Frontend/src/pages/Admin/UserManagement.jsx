import React, { useState, useMemo, useEffect } from 'react';
import {
    Users,
    Search,
    Eye,
    Check,
    X,
    Shield,
    Calendar,
    MapPin,
    User,
    AlertTriangle,
    CheckCircle,
    Clock,
    Ban,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    FileText,
    Download
} from 'lucide-react';
import styles from "../../styles/UserManagement.module.css";

const UserManagement = ({ sidebarCollapsed = false }) => {
    const API_BASE_URL = "http://localhost:8080";

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        return `${API_BASE_URL}/${cleanPath}`;
    };

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No admin token found. Please log in again.');
            }

            const [pendingUsersRes, activeUsersRes, rejectedUsersRes, blockedUsersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/users-request`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                }),
                fetch(`${API_BASE_URL}/admin/users-active`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                }),
                fetch(`${API_BASE_URL}/admin/users-rejected`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                }),
                fetch(`${API_BASE_URL}/admin/users-blocked`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                })
            ]);

            if (!pendingUsersRes.ok || !activeUsersRes.ok || !rejectedUsersRes.ok || !blockedUsersRes.ok) {
                throw new Error('Failed to fetch users data');
            }

            const pendingUsers = await pendingUsersRes.json();
            const activeUsers = await activeUsersRes.json();
            const rejectedUsers = await rejectedUsersRes.json();
            const blockedUsers = await blockedUsersRes.json();

            const allUsers = [
                ...pendingUsers.map(u => transformUserData(u, 'pending')),
                ...activeUsers.map(u => transformUserData(u, 'active')),
                ...rejectedUsers.map(u => transformUserData(u, 'rejected')),
                ...blockedUsers.map(u => transformUserData(u, 'blocked'))
            ];

            setUsers(allUsers);
            addNotification('Users loaded successfully', 'success');
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
            addNotification('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const transformUserData = (userData, status) => {
        return {
            id: userData.userId || Date.now(),
            name: userData.username || 'N/A',
            email: userData.email || 'N/A',
            phone: userData.phone || 'N/A',
            location: userData.address || 'N/A',
            address: userData.address || 'N/A',
            userType: 'Customer',
            registrationDate: userData.createdAt || new Date().toISOString(),
            status: status,
            profileImagePath: userData.profileImagePath || null,
            documentPath: userData.documentPath || null,
            isEmailVerified: userData.isEmailVerified || false,
            servicesUsed: userData.servicesUsed || 0,
            totalSpent: userData.totalSpent || 0,
            paymentsMade: userData.paymentsMade || 0,
            refunds: userData.refunds || 0
        };
    };

    const handleApproveUser = async (user) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/users-request-approved?email=${encodeURIComponent(user.email)}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to approve user');

            setUsers(prevUsers =>
                prevUsers.map(u => u.email === user.email ? { ...u, status: 'active' } : u)
            );

            addNotification(`${user.name} has been approved successfully`, 'success');
            setShowModal(false);
        } catch (error) {
            console.error('Error approving user:', error);
            addNotification('Failed to approve user', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectUser = async (user) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/users-request-rejected?email=${encodeURIComponent(user.email)}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to reject user');

            setUsers(prevUsers =>
                prevUsers.map(u => u.email === user.email ? { ...u, status: 'rejected' } : u)
            );

            addNotification(`${user.name}'s request has been rejected`, 'warning');
            setShowModal(false);
        } catch (error) {
            console.error('Error rejecting user:', error);
            addNotification('Failed to reject user', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlockUser = async (user) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/users-block?email=${encodeURIComponent(user.email)}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to block user');

            setUsers(prevUsers =>
                prevUsers.map(u => u.email === user.email ? { ...u, status: 'blocked' } : u)
            );

            addNotification(`${user.name} has been blocked`, 'warning');
            setShowModal(false);
        } catch (error) {
            console.error('Error blocking user:', error);
            addNotification('Failed to block user', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnblockUser = async (user) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/users-unblock?email=${encodeURIComponent(user.email)}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to unblock user');

            setUsers(prevUsers =>
                prevUsers.map(u => u.email === user.email ? { ...u, status: 'active' } : u)
            );

            addNotification(`${user.name} has been unblocked`, 'success');
            setShowModal(false);
        } catch (error) {
            console.error('Error unblocking user:', error);
            addNotification('Failed to unblock user', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const addNotification = (message, type) => {
        const newNotification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 3000);
    };

    const matchesSearchTerm = (user, term) => {
        if (!term || term.trim() === '') return true;
        const cleanTerm = term.toLowerCase().trim();
        const searchableText = [
            user.name || '',
            user.email || '',
            user.phone || '',
            user.location || '',
            user.address || ''
        ].join(' ').toLowerCase();
        return searchableText.includes(cleanTerm);
    };

    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase().trim().replace(/\s+/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filteredUsers = useMemo(() => {
        let filtered = users.filter(user => {
            const matchesSearch = matchesSearchTerm(user, searchTerm);
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            const matchesDate = dateFilter === 'all' || (() => {
                const regDate = new Date(user.registrationDate);
                const now = new Date();
                const daysDiff = (now - regDate) / (1000 * 60 * 60 * 24);
                switch (dateFilter) {
                    case 'today': return daysDiff <= 1;
                    case 'week': return daysDiff <= 7;
                    case 'month': return daysDiff <= 30;
                    default: return true;
                }
            })();
            return matchesSearch && matchesStatus && matchesDate;
        });

        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'registrationDate') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (typeof aVal === 'string' && typeof bVal === 'string') {
                aVal = normalizeText(aVal);
                bVal = normalizeText(bVal);
            }

            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return sortOrder === 'asc' ? 1 : -1;
            if (bVal == null) return sortOrder === 'asc' ? -1 : 1;

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });

        return filtered;
    }, [users, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

    const statusCounts = useMemo(() => {
        return users.reduce((acc, user) => {
            acc[user.status] = (acc[user.status] || 0) + 1;
            acc.total = (acc.total || 0) + 1;
            return acc;
        }, {});
    }, [users]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'rejected': return '#dc2626';
            case 'blocked': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return CheckCircle;
            case 'pending': return Clock;
            case 'rejected': return X;
            case 'blocked': return Ban;
            default: return AlertTriangle;
        }
    };

    const handleUserAction = (user, action) => {
        setSelectedUser(user);
        setModalType(action);
        setShowModal(true);
    };

    const Modal = ({ show, onClose, children }) => {
        if (!show) return null;
        return (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    if (loading) {
        return (
            <div className={styles.userManagement}>
                <div className={styles.userManagementContainer}>
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                        <Users size={48} style={{ margin: '0 auto 1rem' }} />
                        <h3>Loading users...</h3>
                        <p>Please wait while we fetch user data</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.userManagement}>
                <div className={styles.userManagementContainer}>
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        margin: '2rem',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px'
                    }}>
                        <AlertTriangle size={48} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Error Loading Users</h3>
                        <p style={{ color: '#991b1b', marginBottom: '1rem' }}>{error}</p>
                        <button onClick={fetchAllUsers} style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
            <div className={styles.userManagement}>
                <div className={styles.notifications}>
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`${styles.notification} ${styles[`notification-${notification.type}`]}`}>
                            <p className={styles['notification-message']}>{notification.message}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.userManagementContainer}>
                    <div className={styles.pageHeader}>
                        <div className={styles.pageHeaderTop}>
                            <h1 className={styles.pageTitle}>
                                <Users size={28} />
                                User Management
                            </h1>
                            <button className={styles.exportBtn} onClick={fetchAllUsers}>
                                <RefreshCw size={16} />
                                Refresh Data
                            </button>
                        </div>
                        <p className={styles.pageSubtitle}>Manage user accounts, approvals, and permissions</p>
                    </div>

                    <div className={styles.summaryCards}>
                        <div className={styles.summaryCard}>
                            <div className={`${styles.summaryIcon} ${styles.total}`}>
                                <Users size={24} />
                            </div>
                            <div>
                                <div className={styles.summaryValue}>{statusCounts.total || 0}</div>
                                <div className={styles.summaryLabel}>Total Users</div>
                            </div>
                        </div>
                        <div className={styles.summaryCard}>
                            <div className={`${styles.summaryIcon} ${styles.active}`}>
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <div className={styles.summaryValue}>{statusCounts.active || 0}</div>
                                <div className={styles.summaryLabel}>Active Users</div>
                            </div>
                        </div>
                        <div className={styles.summaryCard}>
                            <div className={`${styles.summaryIcon} ${styles.pending}`}>
                                <Clock size={24} />
                            </div>
                            <div>
                                <div className={styles.summaryValue}>{statusCounts.pending || 0}</div>
                                <div className={styles.summaryLabel}>Pending Approval</div>
                            </div>
                        </div>
                        <div className={styles.summaryCard}>
                            <div className={`${styles.summaryIcon} ${styles.blocked}`}>
                                <Ban size={24} />
                            </div>
                            <div>
                                <div className={styles.summaryValue}>{statusCounts.blocked || 0}</div>
                                <div className={styles.summaryLabel}>Blocked Users</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.filtersSection}>
                        <div className={styles.searchBox}>
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className={styles.filters}>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterSelect}>
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                                <option value="blocked">Blocked</option>
                            </select>

                            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={styles.filterSelect}>
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>

                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-');
                                    setSortBy(field);
                                    setSortOrder(order);
                                }}
                                className={styles.filterSelect}
                            >
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="registrationDate-desc">Newest First</option>
                                <option value="registrationDate-asc">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.usersTable}>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Payment</th>
                                <th>Registration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map(user => {
                                const StatusIcon = getStatusIcon(user.status);
                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className={styles.userInfo}>
                                                <div className={styles.userAvatar}>
                                                    {user.profileImagePath ? (
                                                        <img
                                                            src={getImageUrl(user.profileImagePath)}
                                                            alt={user.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                                                            }}
                                                        />
                                                    ) : (
                                                        <User size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={styles.userName}>{user.name}</div>
                                                    <div className={styles.userLocation}>
                                                        <MapPin size={12} />
                                                        {user.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.paymentInfo}>
                                                <div className={styles.paymentItem}>
                                                    <TrendingDown size={12} color="#dc2626" />
                                                    <span className={styles.paymentMade}>₨{user.paymentsMade || 0}</span>
                                                </div>
                                                <div className={styles.paymentItem}>
                                                    <TrendingUp size={12} color="#10b981" />
                                                    <span className={styles.refundReceived}>₨{user.refunds || 0}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.dateInfo}>
                                                <Calendar size={12} />
                                                {new Date(user.registrationDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.statusBadge} style={{ color: getStatusColor(user.status) }}>
                                                <StatusIcon size={14} />
                                                {user.status === 'active' ? 'Active' :
                                                    user.status === 'pending' ? 'Pending' :
                                                        user.status === 'rejected' ? 'Rejected' :
                                                            user.status === 'blocked' ? 'Blocked' : user.status}                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.view}`}
                                                    onClick={() => handleUserAction(user, 'profile')}
                                                    title="View Profile"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {user.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.approve}`}
                                                            onClick={() => handleUserAction(user, 'approve')}
                                                            title="Approve User"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.reject}`}
                                                            onClick={() => handleUserAction(user, 'reject')}
                                                            title="Reject User"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}

                                                {user.status === 'active' && (
                                                    <button
                                                        className={`${styles.actionBtn} ${styles.block}`}
                                                        onClick={() => handleUserAction(user, 'block')}
                                                        title="Block User"
                                                    >
                                                        <Ban size={16} />
                                                    </button>
                                                )}

                                                {user.status === 'rejected' && (
                                                    <>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.block}`}
                                                            onClick={() => handleUserAction(user, 'block')}
                                                            title="Block User"
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                    </>
                                                )}

                                                {user.status === 'blocked' && (
                                                    <button
                                                        className={`${styles.actionBtn} ${styles.unblock}`}
                                                        onClick={() => handleUserAction(user, 'unblock')}
                                                        title="Unblock User"
                                                    >
                                                        <Shield size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className={styles.noResults}>
                                <Users size={48} />
                                <h3>No users found</h3>
                                <p>Try adjusting your search criteria or filters</p>
                            </div>
                        )}
                    </div>

                    <Modal show={showModal} onClose={() => setShowModal(false)}>
                        {selectedUser && (
                            <>
                                {modalType === 'profile' && (
                                    <div className={styles.modalBody}>
                                        <div className={styles.modalHeader}>
                                            <h3>User Profile</h3>
                                            <button onClick={() => setShowModal(false)}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className={styles.profileDetails}>
                                            {selectedUser.profileImagePath && (
                                                <div className={styles.profileSection}>
                                                    <h4>Profile Image</h4>
                                                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                                                        <img
                                                            src={getImageUrl(selectedUser.profileImagePath)}
                                                            alt="Profile"
                                                            style={{
                                                                width: '120px',
                                                                height: '120px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                border: '3px solid #e5e7eb',
                                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = '<div style="color: #6b7280; padding: 2rem;"><div style="font-size: 3rem; margin-bottom: 1rem;">📷</div><p>Image not available</p></div>';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className={styles.profileSection}>
                                                <h4>Personal Information</h4>
                                                <div className={styles.profileGrid}>
                                                    <div className={styles.profileItem}>
                                                        <label>Name</label>
                                                        <span>{selectedUser.name}</span>
                                                    </div>
                                                    <div className={styles.profileItem}>
                                                        <label>Email</label>
                                                        <span>{selectedUser.email}</span>
                                                    </div>
                                                    <div className={styles.profileItem}>
                                                        <label>Phone</label>
                                                        <span>{selectedUser.phone}</span>
                                                    </div>
                                                    <div className={styles.profileItem}>
                                                        <label>Address</label>
                                                        <span>{selectedUser.address}</span>
                                                    </div>
                                                    <div className={styles.profileItem}>
                                                        <label>Email Verified</label>
                                                        <span style={{
                                                            color: selectedUser.isEmailVerified ? '#10b981' : '#dc2626',
                                                            fontWeight: '600'
                                                        }}>
                                                        {selectedUser.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.profileSection}>
                                                <h4>Account Details</h4>
                                                <div className={styles.profileGrid}>
                                                    <div className={styles.profileItem}>
                                                        <label>User Type</label>
                                                        <span>{selectedUser.userType}</span>
                                                    </div>
                                                    <div className={styles.profileItem}>
                                                        <label>Registration Date</label>
                                                        <span>{new Date(selectedUser.registrationDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className={styles.profileItem}>
                                                        <label>Status</label>
                                                        <span style={{
                                                            color: getStatusColor(selectedUser.status),
                                                            fontWeight: '600',
                                                            textTransform: 'capitalize'
                                                        }}>
                                                        {selectedUser.status}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.profileSection}>
                                                <h4>Payment Information</h4>
                                                <div className={styles.profileGrid}>
                                                    <div className={styles.profileItem}>
                                                        <label>Payments Made</label>
                                                        <span style={{ color: '#dc2626', fontWeight: '600' }}>₨{selectedUser.paymentsMade || 0}</span>
                                                    </div>
                                                    <div className={styles.profileItem}>
                                                        <label>Refunds</label>
                                                        <span style={{ color: '#10b981', fontWeight: '600' }}>₨{selectedUser.refunds || 0}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.profileSection}>
                                                <h4>Service Stats</h4>
                                                <div className={styles.profileGrid}>
                                                    <div className={styles.profileItem}>
                                                        <label>Services Used</label>
                                                        <span style={{ fontWeight: '600' }}>{selectedUser.servicesUsed || 0}</span>
                                                    </div>
                                                    <div className={styles.profileItem}>
                                                        <label>Total Spent</label>
                                                        <span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '1.1rem' }}>₨{selectedUser.totalSpent || 0}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedUser.documentPath && (
                                                <div className={styles.profileSection}>
                                                    <h4>Identity Documents</h4>
                                                    <div style={{
                                                        backgroundColor: '#f9fafb',
                                                        padding: '1.5rem',
                                                        borderRadius: '8px',
                                                        border: '2px dashed #d1d5db'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '1rem'
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <FileText size={24} color="#3b82f6" />
                                                                <div>
                                                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>Identity Document</div>
                                                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                                        {selectedUser.documentPath.split('/').pop()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={getImageUrl(selectedUser.documentPath)}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem',
                                                                    padding: '0.5rem 1rem',
                                                                    backgroundColor: '#3b82f6',
                                                                    color: 'white',
                                                                    borderRadius: '6px',
                                                                    textDecoration: 'none',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '500',
                                                                    transition: 'background-color 0.2s'
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                                            >
                                                                <Download size={16} />
                                                                Download
                                                            </a>
                                                        </div>
                                                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                                            {selectedUser.documentPath.toLowerCase().endsWith('.pdf') ? (
                                                                <div style={{
                                                                    width: '100%',
                                                                    height: '500px',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '8px',
                                                                    overflow: 'hidden'
                                                                }}>
                                                                    <iframe
                                                                        src={getImageUrl(selectedUser.documentPath)}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            border: 'none'
                                                                        }}
                                                                        title="PDF Document"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={getImageUrl(selectedUser.documentPath)}
                                                                    alt="Document"
                                                                    style={{
                                                                        maxWidth: '100%',
                                                                        maxHeight: '400px',
                                                                        borderRadius: '8px',
                                                                        objectFit: 'contain',
                                                                        border: '1px solid #e5e7eb',
                                                                        backgroundColor: 'white'
                                                                    }}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.parentElement.innerHTML = '<div style="color: #6b7280; padding: 2rem;"><div style="font-size: 3rem; margin-bottom: 1rem;">📄</div><p>Document preview not available</p><p style="font-size: 0.875rem; margin-top: 0.5rem;">Click download to view the file</p></div>';
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {modalType === 'approve' && (
                                    <div className={styles.modalBody}>
                                        <div className={styles.modalHeader}>
                                            <h3>Approve User</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className={styles.confirmationContent}>
                                            <CheckCircle size={48} color="#10b981" />
                                            <p>Are you sure you want to approve <strong>{selectedUser.name}</strong>?</p>
                                            <p>This will grant them access to the platform.</p>
                                            <div className={styles.modalActions}>
                                                <button
                                                    className={styles.btnSecondary}
                                                    onClick={() => setShowModal(false)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={styles.btnApprove}
                                                    onClick={() => handleApproveUser(selectedUser)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Approving...' : 'Approve User'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'reject' && (
                                    <div className={styles.modalBody}>
                                        <div className={styles.modalHeader}>
                                            <h3>Reject User Request</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className={styles.confirmationContent}>
                                            <X size={48} color="#dc2626" />
                                            <p>Are you sure you want to reject <strong>{selectedUser.name}</strong>'s registration request?</p>
                                            <p style={{ color: '#dc2626', fontWeight: '500' }}>This will mark their request as rejected. You can block or approve them later.</p>
                                            <div className={styles.modalActions}>
                                                <button
                                                    className={styles.btnSecondary}
                                                    onClick={() => setShowModal(false)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={styles.btnReject}
                                                    onClick={() => handleRejectUser(selectedUser)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Rejecting...' : 'Reject Request'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'block' && (
                                    <div className={styles.modalBody}>
                                        <div className={styles.modalHeader}>
                                            <h3>Block User</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className={styles.confirmationContent}>
                                            <Ban size={48} color="#dc2626" />
                                            <p>Are you sure you want to block <strong>{selectedUser.name}</strong>?</p>
                                            <p>This will prevent them from accessing the platform but keep their account data.</p>
                                            <div className={styles.modalActions}>
                                                <button
                                                    className={styles.btnSecondary}
                                                    onClick={() => setShowModal(false)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={styles.btnBlock}
                                                    onClick={() => handleBlockUser(selectedUser)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Blocking...' : 'Block User'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'unblock' && (
                                    <div className={styles.modalBody}>
                                        <div className={styles.modalHeader}>
                                            <h3>Unblock User</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className={styles.confirmationContent}>
                                            <Shield size={48} color="#10b981" />
                                            <p>Are you sure you want to unblock <strong>{selectedUser.name}</strong>?</p>
                                            <p>This will restore their access to the platform.</p>
                                            <div className={styles.modalActions}>
                                                <button
                                                    className={styles.btnSecondary}
                                                    onClick={() => setShowModal(false)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={styles.btnApprove}
                                                    onClick={() => handleUnblockUser(selectedUser)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Unblocking...' : 'Unblock User'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </Modal>
                </div>
            </div>
    );
};

export default UserManagement;