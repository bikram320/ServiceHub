import React, { useState, useMemo } from 'react';
import {
    Users,
    Search,
    Filter,
    Eye,
    Check,
    X,
    Shield,
    ShieldOff,
    KeyRound,
    Calendar,
    MapPin,
    Phone,
    Mail,
    User,
    AlertTriangle,
    CheckCircle,
    Clock,
    Ban,
    MoreVertical,
    Download
} from 'lucide-react';
import "../../styles/UserManagement.css";

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'profile', 'approve', 'reject', 'reset'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Sample user data
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@email.com',
            phone: '+977-9841234567',
            location: 'Kathmandu, Nepal',
            userType: 'Customer',
            registrationDate: '2024-11-15',
            lastActive: '2024-11-16',
            status: 'pending',
            profilePicture: null,
            address: 'Thamel, Kathmandu',
            joinedServices: 0,
            totalSpent: 0,
            documents: ['citizenship_front.jpg', 'citizenship_back.jpg']
        },
        {
            id: 2,
            name: 'Dipesh Thapa',
            email: 'dipesh.thapa@email.com',
            phone: '+977-9851234567',
            location: 'Lalitpur, Nepal',
            userType: 'Technician',
            specialization: 'Plumbing',
            registrationDate: '2024-11-14',
            lastActive: '2024-11-16',
            status: 'pending',
            profilePicture: null,
            address: 'Patan, Lalitpur',
            completedJobs: 0,
            rating: 0,
            documents: ['citizenship_front.jpg', 'license.jpg', 'experience_cert.pdf']
        },
        {
            id: 3,
            name: 'Sita Sharma',
            email: 'sita.sharma@email.com',
            phone: '+977-9861234567',
            location: 'Pokhara, Nepal',
            userType: 'Customer',
            registrationDate: '2024-11-10',
            lastActive: '2024-11-16',
            status: 'active',
            profilePicture: null,
            address: 'Lakeside, Pokhara',
            joinedServices: 5,
            totalSpent: 12500,
            documents: ['citizenship_front.jpg']
        },
        {
            id: 4,
            name: 'Ram Bahadur',
            email: 'ram.bahadur@email.com',
            phone: '+977-9871234567',
            location: 'Bhaktapur, Nepal',
            userType: 'Technician',
            specialization: 'Electrical',
            registrationDate: '2024-11-08',
            lastActive: '2024-11-15',
            status: 'active',
            profilePicture: null,
            address: 'Durbar Square, Bhaktapur',
            completedJobs: 23,
            rating: 4.8,
            documents: ['citizenship_front.jpg', 'license.jpg']
        },
        {
            id: 5,
            name: 'Maya Gurung',
            email: 'maya.gurung@email.com',
            phone: '+977-9881234567',
            location: 'Kathmandu, Nepal',
            userType: 'Customer',
            registrationDate: '2024-11-05',
            lastActive: '2024-11-12',
            status: 'blocked',
            profilePicture: null,
            address: 'New Baneshwor, Kathmandu',
            joinedServices: 8,
            totalSpent: 8500,
            documents: ['citizenship_front.jpg']
        }
    ]);

    // Simplified and immediate search function
    const matchesSearchTerm = (user, term) => {
        // If no search term, show all users
        if (!term || term.trim() === '') return true;

        // Clean the search term
        const cleanTerm = term.toLowerCase().trim();

        // Simple fields to search (guaranteed to work immediately)
        const searchableText = [
            user.name || '',
            user.email || '',
            user.phone || '',
            user.location || '',
            user.address || '',
            user.userType || '',
            user.specialization || ''
        ].join(' ').toLowerCase();

        // Simple contains check - works from first character
        return searchableText.includes(cleanTerm);
    };

    //helper function for better search
    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .normalize('NFD') // Handle accented characters
            .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
    };

    // Filter and search users
    const filteredUsers = useMemo(() => {
        let filtered = users.filter(user => {
            // Enhanced search matching
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

        // Enhanced sorting
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            // Handle different data types
            if (sortBy === 'registrationDate' || sortBy === 'lastActive') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (typeof aVal === 'string' && typeof bVal === 'string') {
                aVal = normalizeText(aVal);
                bVal = normalizeText(bVal);
            }

            // Handle null/undefined values
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

    // Status counts
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
            case 'blocked': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return CheckCircle;
            case 'pending': return Clock;
            case 'blocked': return Ban;
            default: return AlertTriangle;
        }
    };

    const handleUserAction = (user, action) => {
        setSelectedUser(user);
        setModalType(action);
        setShowModal(true);
    };

    const handleApproveUser = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: 'active' } : user
        ));
        setShowModal(false);
    };

    const handleRejectUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
        setShowModal(false);
    };

    const handleBlockUser = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: 'blocked' } : user
        ));
        setShowModal(false);
    };

    const handleUnblockUser = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: 'active' } : user
        ));
        setShowModal(false);
    };

    const handleResetPassword = (userId) => {
        // In real implementation, this would trigger password reset email
        alert(`Password reset email sent to ${selectedUser.email}`);
        setShowModal(false);
    };

    const Modal = ({ show, onClose, children }) => {
        if (!show) return null;

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="user-management">
            <div className="user-management-container">
                {/* Header */}
                <div className="page-header">
                    <div className="page-header-top">
                        <h1 className="page-title">
                            <Users size={28} />
                            User Management
                        </h1>
                        <button className="export-btn">
                            <Download size={16} />
                            Export Users
                        </button>
                    </div>
                    <p className="page-subtitle">Manage user accounts, approvals, and permissions</p>
                </div>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-icon total">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{statusCounts.total || 0}</div>
                            <div className="summary-label">Total Users</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon active">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{statusCounts.active || 0}</div>
                            <div className="summary-label">Active Users</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon pending">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{statusCounts.pending || 0}</div>
                            <div className="summary-label">Pending Approval</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon blocked">
                            <Ban size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{statusCounts.blocked || 0}</div>
                            <div className="summary-label">Blocked Users</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="filters-section">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="blocked">Blocked</option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="filter-select"
                        >
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
                            className="filter-select"
                        >
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="registrationDate-desc">Newest First</option>
                            <option value="registrationDate-asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Contact</th>
                            <th>Type</th>
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
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="user-name">{user.name}</div>
                                                <div className="user-location">
                                                    <MapPin size={12} />
                                                    {user.location}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <div className="contact-item">
                                                <Mail size={12} />
                                                {user.email}
                                            </div>
                                            <div className="contact-item">
                                                <Phone size={12} />
                                                {user.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-type">
                                            {user.userType}
                                            {user.specialization && (
                                                <div className="specialization">{user.specialization}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-info">
                                            <Calendar size={12} />
                                            {new Date(user.registrationDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="status-badge" style={{ color: getStatusColor(user.status) }}>
                                            <StatusIcon size={14} />
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view"
                                                onClick={() => handleUserAction(user, 'profile')}
                                                title="View Profile"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {user.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="action-btn approve"
                                                        onClick={() => handleUserAction(user, 'approve')}
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleUserAction(user, 'reject')}
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}

                                            {user.status === 'active' && (
                                                <button
                                                    className="action-btn block"
                                                    onClick={() => handleUserAction(user, 'block')}
                                                    title="Block User"
                                                >
                                                    <ShieldOff size={16} />
                                                </button>
                                            )}

                                            {user.status === 'blocked' && (
                                                <button
                                                    className="action-btn unblock"
                                                    onClick={() => handleUserAction(user, 'unblock')}
                                                    title="Unblock User"
                                                >
                                                    <Shield size={16} />
                                                </button>
                                            )}

                                            <button
                                                className="action-btn reset"
                                                onClick={() => handleUserAction(user, 'reset')}
                                                title="Reset Password"
                                            >
                                                <KeyRound size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="no-results">
                            <Users size={48} />
                            <h3>No users found</h3>
                            <p>Try adjusting your search criteria or filters</p>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    {selectedUser && (
                        <>
                            {modalType === 'profile' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>User Profile</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="profile-details">
                                        <div className="profile-section">
                                            <h4>Personal Information</h4>
                                            <div className="profile-grid">
                                                <div className="profile-item">
                                                    <label>Name</label>
                                                    <span>{selectedUser.name}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Email</label>
                                                    <span>{selectedUser.email}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Phone</label>
                                                    <span>{selectedUser.phone}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Address</label>
                                                    <span>{selectedUser.address}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="profile-section">
                                            <h4>Account Details</h4>
                                            <div className="profile-grid">
                                                <div className="profile-item">
                                                    <label>User Type</label>
                                                    <span>{selectedUser.userType}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Registration Date</label>
                                                    <span>{new Date(selectedUser.registrationDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Status</label>
                                                    <span className="status-badge" style={{ color: getStatusColor(selectedUser.status) }}>
                                                        {selectedUser.status}
                                                    </span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Last Active</label>
                                                    <span>{new Date(selectedUser.lastActive).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedUser.userType === 'Technician' && (
                                            <div className="profile-section">
                                                <h4>Technician Details</h4>
                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <label>Specialization</label>
                                                        <span>{selectedUser.specialization}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Completed Jobs</label>
                                                        <span>{selectedUser.completedJobs || 0}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Rating</label>
                                                        <span>{selectedUser.rating || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedUser.userType === 'Customer' && (
                                            <div className="profile-section">
                                                <h4>Customer Stats</h4>
                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <label>Services Used</label>
                                                        <span>{selectedUser.joinedServices || 0}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Total Spent</label>
                                                        <span>₨{selectedUser.totalSpent || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="profile-section">
                                            <h4>Documents</h4>
                                            <div className="documents-list">
                                                {selectedUser.documents?.map((doc, index) => (
                                                    <div key={index} className="document-item">
                                                        <span>{doc}</span>
                                                        <button className="view-doc-btn">View</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'approve' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Approve User</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <CheckCircle size={48} color="#10b981" />
                                        <p>Are you sure you want to approve <strong>{selectedUser.name}</strong>?</p>
                                        <p>This will grant them access to the platform.</p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleApproveUser(selectedUser.id)}
                                            >
                                                Approve User
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'reject' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Reject User</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <X size={48} color="#dc2626" />
                                        <p>Are you sure you want to reject <strong>{selectedUser.name}</strong>?</p>
                                        <p>This will permanently remove their registration from the system.</p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleRejectUser(selectedUser.id)}
                                            >
                                                Reject User
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'block' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Block User</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <Ban size={48} color="#dc2626" />
                                        <p>Are you sure you want to block <strong>{selectedUser.name}</strong>?</p>
                                        <p>This will prevent them from accessing the platform.</p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-block"
                                                onClick={() => handleBlockUser(selectedUser.id)}
                                            >
                                                Block User
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'unblock' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Unblock User</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <Shield size={48} color="#10b981" />
                                        <p>Are you sure you want to unblock <strong>{selectedUser.name}</strong>?</p>
                                        <p>This will restore their access to the platform.</p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleUnblockUser(selectedUser.id)}
                                            >
                                                Unblock User
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'reset' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Reset Password</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <KeyRound size={48} color="#0ea5e9" />
                                        <p>Reset password for <strong>{selectedUser.name}</strong>?</p>
                                        <p>A password reset email will be sent to <strong>{selectedUser.email}</strong></p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleResetPassword(selectedUser.id)}
                                            >
                                                Send Reset Email
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