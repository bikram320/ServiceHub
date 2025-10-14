import React, { useState, useMemo, useEffect } from 'react';
import {
    Wrench,
    Search,
    Eye,
    Check,
    X,
    Shield,
    ShieldOff,
    Calendar,
    MapPin,
    User,
    AlertTriangle,
    CheckCircle,
    Clock,
    Ban,
    RefreshCw,
    FileText,
    Download,
    Zap,
    Droplets,
    Settings,
    Home,
    Hammer
} from 'lucide-react';
import '../../styles/TechnicianManagement.css';

const TechnicianManagement = ({ sidebarCollapsed = false }) => {
    const API_BASE_URL = "http://localhost:8080";

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);

    // Categories with icons
    const categories = {
        'Electrician': { icon: Zap, color: '#eab308' },
        'Plumber': { icon: Droplets, color: '#3b82f6' },
        'Carpenter': { icon: Hammer, color: '#8b5cf6' },
        'AC Technician': { icon: Settings, color: '#10b981' },
        'Home Appliance': { icon: Home, color: '#f59e0b' }
    };

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

    const fetchAllTechnicians = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No admin token found. Please log in again.');
            }

            const [pendingRes, activeRes, rejectedRes, blockedRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/technicians-request`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                }),
                fetch(`${API_BASE_URL}/admin/technicians-active`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                }),
                fetch(`${API_BASE_URL}/admin/technicians-rejected`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                }),
                fetch(`${API_BASE_URL}/admin/technicians-blocked`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                })
            ]);

            if (!pendingRes.ok || !activeRes.ok || !rejectedRes.ok || !blockedRes.ok) {
                throw new Error('Failed to fetch technicians data');
            }

            const pendingTechs = await pendingRes.json();
            const activeTechs = await activeRes.json();
            const rejectedTechs = await rejectedRes.json();
            const blockedTechs = await blockedRes.json();

            const allTechnicians = [
                ...pendingTechs.map(t => transformTechnicianData(t, 'pending')),
                ...activeTechs.map(t => transformTechnicianData(t, 'active')),
                ...rejectedTechs.map(t => transformTechnicianData(t, 'rejected')),
                ...blockedTechs.map(t => transformTechnicianData(t, 'blocked'))
            ];

            setTechnicians(allTechnicians);
            addNotification('Technicians loaded successfully', 'success');
        } catch (error) {
            console.error('Error fetching technicians:', error);
            setError(error.message);
            addNotification('Failed to load technicians', 'error');
        } finally {
            setLoading(false);
        }
    };

    const transformTechnicianData = (techData, status) => {
        return {
            id: techData.email || Date.now(),
            name: techData.name || 'N/A',
            email: techData.email || 'N/A',
            phone: techData.phone || 'N/A',
            location: techData.address || 'N/A',
            address: techData.address || 'N/A',
            category: techData.serviceCategory || 'N/A', // Default, you may need to add this to DTO
            registrationDate: techData.createdAt ,
            status: status,
            profileImagePath: techData.profileImagePath || null,
            documentPath: techData.documentPath || null,
            identityPath: techData.identityPath || null,
            isEmailVerified: techData.isEmailVerified || false
        };
    };

    const handleApproveTechnician = async (technician) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/technician-request-approved?email=${encodeURIComponent(technician.email)}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to approve technician');

            setTechnicians(prevTechs =>
                prevTechs.map(t => t.email === technician.email ? { ...t, status: 'active' } : t)
            );

            addNotification(`${technician.name} has been approved successfully`, 'success');
            setShowModal(false);
        } catch (error) {
            console.error('Error approving technician:', error);
            addNotification('Failed to approve technician', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectTechnician = async (technician) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/technician-request-rejected?email=${encodeURIComponent(technician.email)}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to reject technician');

            setTechnicians(prevTechs =>
                prevTechs.map(t => t.email === technician.email ? { ...t, status: 'rejected' } : t)
            );

            addNotification(`${technician.name}'s request has been rejected`, 'warning');
            setShowModal(false);
        } catch (error) {
            console.error('Error rejecting technician:', error);
            addNotification('Failed to reject technician', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlockTechnician = async (technician) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/technicians-block?email=${encodeURIComponent(technician.email)}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to block technician');

            setTechnicians(prevTechs =>
                prevTechs.map(t => t.email === technician.email ? { ...t, status: 'blocked' } : t)
            );

            addNotification(`${technician.name} has been blocked`, 'warning');
            setShowModal(false);
        } catch (error) {
            console.error('Error blocking technician:', error);
            addNotification('Failed to block technician', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnblockTechnician = async (technician) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/technician-unblock?email=${encodeURIComponent(technician.email)}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to unblock technician');

            setTechnicians(prevTechs =>
                prevTechs.map(t => t.email === technician.email ? { ...t, status: 'active' } : t)
            );

            addNotification(`${technician.name} has been unblocked`, 'success');
            setShowModal(false);
        } catch (error) {
            console.error('Error unblocking technician:', error);
            addNotification('Failed to unblock technician', 'error');
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

    const matchesSearchTerm = (technician, term) => {
        if (!term || term.trim() === '') return true;
        const cleanTerm = term.toLowerCase().trim();
        const searchableText = [
            technician.name || '',
            technician.email || '',
            technician.phone || '',
            technician.location || '',
            technician.address || '',
            technician.category || ''
        ].join(' ').toLowerCase();
        return searchableText.includes(cleanTerm);
    };

    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase().trim().replace(/\s+/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filteredTechnicians = useMemo(() => {
        let filtered = technicians.filter(tech => {
            const matchesSearch = matchesSearchTerm(tech, searchTerm);
            const matchesStatus = statusFilter === 'all' || tech.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || tech.category === categoryFilter;
            const matchesDate = dateFilter === 'all' || (() => {
                const regDate = new Date(tech.registrationDate);
                const now = new Date();
                const daysDiff = (now - regDate) / (1000 * 60 * 60 * 24);
                switch (dateFilter) {
                    case 'today': return daysDiff <= 1;
                    case 'week': return daysDiff <= 7;
                    case 'month': return daysDiff <= 30;
                    default: return true;
                }
            })();
            return matchesSearch && matchesStatus && matchesCategory && matchesDate;
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
    }, [technicians, searchTerm, statusFilter, categoryFilter, dateFilter, sortBy, sortOrder]);

    const statusCounts = useMemo(() => {
        return technicians.reduce((acc, tech) => {
            acc[tech.status] = (acc[tech.status] || 0) + 1;
            acc.total = (acc.total || 0) + 1;
            return acc;
        }, {});
    }, [technicians]);

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

    const handleTechnicianAction = (technician, action) => {
        setSelectedTechnician(technician);
        setModalType(action);
        setShowModal(true);
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

    useEffect(() => {
        fetchAllTechnicians();
    }, []);

    if (loading) {
        return (
            <div className={`admin-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <div className="user-management">
                    <div className="user-management-container">
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            <Wrench size={48} style={{ margin: '0 auto 1rem' }} />
                            <h3>Loading technicians...</h3>
                            <p>Please wait while we fetch technician data</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`admin-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <div className="user-management">
                    <div className="user-management-container">
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            margin: '2rem',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px'
                        }}>
                            <AlertTriangle size={48} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Error Loading Technicians</h3>
                            <p style={{ color: '#991b1b', marginBottom: '1rem' }}>{error}</p>
                            <button onClick={fetchAllTechnicians} style={{
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
            </div>
        );
    }

    return (
        <>
            <div className="notifications">
                {notifications.map((notification) => (
                    <div key={notification.id} className={`notification notification-${notification.type}`}>
                        <p className="notification-message">{notification.message}</p>
                    </div>
                ))}
            </div>

            <div className="user-management">
                <div className="user-management-container">
                    {/* Header */}
                    <div className="page-header">
                        <div className="page-header-top">
                            <h1 className="page-title">
                                <Wrench size={28} />
                                Technician Management
                            </h1>
                            <button className="export-btn" onClick={fetchAllTechnicians}>
                                <RefreshCw size={16} />
                                Refresh Data
                            </button>
                        </div>
                        <p className="page-subtitle">Manage technician accounts, approvals, and performance tracking</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="summary-cards">
                        <div className="summary-card">
                            <div className="summary-icon total">
                                <Wrench size={24} />
                            </div>
                            <div>
                                <div className="summary-value">{statusCounts.total || 0}</div>
                                <div className="summary-label">Total Technicians</div>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon active">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <div className="summary-value">{statusCounts.active || 0}</div>
                                <div className="summary-label">Active Technicians</div>
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
                                <div className="summary-label">Blocked Technicians</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="filters-section">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or category..."
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
                                <option value="rejected">Rejected</option>
                                <option value="blocked">Blocked</option>
                            </select>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Categories</option>
                                {[...new Set(technicians.map(t => t.category).filter(c => c && c !== 'N/A'))].sort().map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
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

                    {/* Technicians Table */}
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                            <tr>
                                <th>Technician</th>
                                <th>Category</th>
                                <th>Registration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTechnicians.map(tech => {
                                const StatusIcon = getStatusIcon(tech.status);
                                const CategoryIcon = categories[tech.category]?.icon || Settings;
                                return (
                                    <tr key={tech.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {tech.profileImagePath ? (
                                                        <img
                                                            src={getImageUrl(tech.profileImagePath)}
                                                            alt={tech.name}
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
                                                    <div className="user-name">{tech.name}</div>
                                                    <div className="user-location">
                                                        <MapPin size={12} />
                                                        {tech.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-type">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <CategoryIcon size={14} color={categories[tech.category]?.color} />
                                                    {tech.category}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-info">
                                                <Calendar size={12} />
                                                {new Date(tech.registrationDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="status-badge" style={{ color: getStatusColor(tech.status) }}>
                                                <StatusIcon size={14} />
                                                {tech.status === 'active' ? 'Active' :
                                                    tech.status === 'pending' ? 'Pending' :
                                                        tech.status === 'rejected' ? 'Rejected' :
                                                            tech.status === 'blocked' ? 'Blocked' : tech.status}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-btn view"
                                                    onClick={() => handleTechnicianAction(tech, 'profile')}
                                                    title="View Profile"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {tech.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="action-btn approve"
                                                            onClick={() => handleTechnicianAction(tech, 'approve')}
                                                            title="Approve"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            className="action-btn reject"
                                                            onClick={() => handleTechnicianAction(tech, 'reject')}
                                                            title="Reject"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}

                                                {tech.status === 'active' && (
                                                    <button
                                                        className="action-btn block"
                                                        onClick={() => handleTechnicianAction(tech, 'block')}
                                                        title="Block Technician"
                                                    >
                                                        <ShieldOff size={16} />
                                                    </button>
                                                )}

                                                {tech.status === 'rejected' && (
                                                    <button
                                                        className="action-btn block"
                                                        onClick={() => handleTechnicianAction(tech, 'block')}
                                                        title="Block Technician"
                                                    >
                                                        <Ban size={16} />
                                                    </button>
                                                )}

                                                {tech.status === 'blocked' && (
                                                    <button
                                                        className="action-btn unblock"
                                                        onClick={() => handleTechnicianAction(tech, 'unblock')}
                                                        title="Unblock Technician"
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

                        {filteredTechnicians.length === 0 && (
                            <div className="no-results">
                                <Wrench size={48} />
                                <h3>No technicians found</h3>
                                <p>Try adjusting your search criteria or filters</p>
                            </div>
                        )}
                    </div>

                    {/* Modals */}
                    <Modal show={showModal} onClose={() => setShowModal(false)}>
                        {selectedTechnician && (
                            <>
                                {modalType === 'profile' && (
                                    <div className="modal-body">
                                        <div className="modal-header">
                                            <h3>Technician Profile</h3>
                                            <button onClick={() => setShowModal(false)}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="profile-details">
                                            {selectedTechnician.profileImagePath && (
                                                <div className="profile-section">
                                                    <h4>Profile Image</h4>
                                                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                                                        <img
                                                            src={getImageUrl(selectedTechnician.profileImagePath)}
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

                                            <div className="profile-section">
                                                <h4>Personal Information</h4>
                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <label>Full Name</label>
                                                        <span>{selectedTechnician.name}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Email</label>
                                                        <span>{selectedTechnician.email}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Phone</label>
                                                        <span>{selectedTechnician.phone}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Address</label>
                                                        <span>{selectedTechnician.address}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Email Verified</label>
                                                        <span style={{
                                                            color: selectedTechnician.isEmailVerified ? '#10b981' : '#dc2626',
                                                            fontWeight: '600'
                                                        }}>
                                                            {selectedTechnician.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="profile-section">
                                                <h4>Professional Information</h4>
                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <label>Category</label>
                                                        <span>{selectedTechnician.category}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Registration Date</label>
                                                        <span>{new Date(selectedTechnician.registrationDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Status</label>
                                                        <span style={{
                                                            color: getStatusColor(selectedTechnician.status),
                                                            fontWeight: '600',
                                                            textTransform: 'capitalize'
                                                        }}>
                                                            {selectedTechnician.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedTechnician.documentPath && (
                                                <div className="profile-section">
                                                    <h4>Documents</h4>
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
                                                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>Document</div>
                                                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                                        {selectedTechnician.documentPath.split('/').pop()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={getImageUrl(selectedTechnician.documentPath)}
                                                                download
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
                                                                    fontWeight: '500'
                                                                }}
                                                            >
                                                                <Download size={16} />
                                                                Download
                                                            </a>
                                                        </div>
                                                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                                            <img
                                                                src={getImageUrl(selectedTechnician.documentPath)}
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
                                                                    e.target.parentElement.innerHTML = '<div style="color: #6b7280; padding: 2rem;"><div style="font-size: 3rem; margin-bottom: 1rem;">📄</div><p>Document preview not available</p></div>';
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedTechnician.identityPath && (
                                                <div className="profile-section">
                                                    <h4>Identity Document</h4>
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
                                                                <FileText size={24} color="#8b5cf6" />
                                                                <div>
                                                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>Identity Proof</div>
                                                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                                        {selectedTechnician.identityPath.split('/').pop()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={getImageUrl(selectedTechnician.identityPath)}
                                                                download
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem',
                                                                    padding: '0.5rem 1rem',
                                                                    backgroundColor: '#8b5cf6',
                                                                    color: 'white',
                                                                    borderRadius: '6px',
                                                                    textDecoration: 'none',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '500'
                                                                }}
                                                            >
                                                                <Download size={16} />
                                                                Download
                                                            </a>
                                                        </div>
                                                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                                            <img
                                                                src={getImageUrl(selectedTechnician.identityPath)}
                                                                alt="Identity"
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
                                                                    e.target.parentElement.innerHTML = '<div style="color: #6b7280; padding: 2rem;"><div style="font-size: 3rem; margin-bottom: 1rem;">📄</div><p>Identity preview not available</p></div>';
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {modalType === 'approve' && (
                                    <div className="modal-body">
                                        <div className="modal-header">
                                            <h3>Approve Technician</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="confirmation-content">
                                            <CheckCircle size={48} color="#10b981" />
                                            <p>Are you sure you want to approve <strong>{selectedTechnician.name}</strong>?</p>
                                            <p>This will grant them access to receive job requests on the platform.</p>
                                            <div className="modal-actions">
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => setShowModal(false)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleApproveTechnician(selectedTechnician)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Approving...' : 'Approve Technician'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'reject' && (
                                    <div className="modal-body">
                                        <div className="modal-header">
                                            <h3>Reject Technician</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="confirmation-content">
                                            <X size={48} color="#dc2626" />
                                            <p>Are you sure you want to reject <strong>{selectedTechnician.name}</strong>?</p>
                                            <p style={{ color: '#dc2626', fontWeight: '500' }}>This will mark their registration request as rejected.</p>
                                            <div className="modal-actions">
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => setShowModal(false)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleRejectTechnician(selectedTechnician)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Rejecting...' : 'Reject Technician'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'block' && (
                                    <div className="modal-body">
                                        <div className="modal-header">
                                            <h3>Block Technician</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="confirmation-content">
                                            <Ban size={48} color="#dc2626" />
                                            <p>Are you sure you want to block <strong>{selectedTechnician.name}</strong>?</p>
                                            <p>This will prevent them from receiving new job requests and accessing the platform.</p>
                                            <div className="modal-actions">
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => setShowModal(false)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="btn-block"
                                                    onClick={() => handleBlockTechnician(selectedTechnician)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Blocking...' : 'Block Technician'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'unblock' && (
                                    <div className="modal-body">
                                        <div className="modal-header">
                                            <h3>Unblock Technician</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="confirmation-content">
                                            <Shield size={48} color="#10b981" />
                                            <p>Are you sure you want to unblock <strong>{selectedTechnician.name}</strong>?</p>
                                            <p>This will restore their access to receive job requests on the platform.</p>
                                            <div className="modal-actions">
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => setShowModal(false)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleUnblockTechnician(selectedTechnician)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Unblocking...' : 'Unblock Technician'}
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
        </>
    );
};

export default TechnicianManagement;