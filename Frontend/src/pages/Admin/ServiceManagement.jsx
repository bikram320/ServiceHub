import React, { useState, useMemo, useEffect } from 'react';
import {
    Wrench,
    Search,
    Eye,
    AlertTriangle,
    CheckCircle,
    Clock,
    X,
    RefreshCw,
    Calendar,
    MapPin,
    User,
    DollarSign,
    TrendingUp,
    XCircle,
    Download
} from 'lucide-react';
const ServiceManagement = ({ sidebarCollapsed = false }) => {
    const API_BASE_URL = "http://localhost:8080";

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('appointmentTime');
    const [sortOrder, setSortOrder] = useState('desc');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [dashboard, setDashboard] = useState({
        totalServices: 0,
        completedServices: 0,
        ongoingServices: 0,
        cancelledServices: 0,
        rejectedServices: 0,
        pendingServices: 0
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    const fetchServiceDashboard = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/service-dashboard`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                const data = await response.json();
                setDashboard(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };

    const fetchAllServices = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No admin token found. Please log in again.');
            }

            const response = await fetch(`${API_BASE_URL}/admin/track-service-request`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch services data');
            }

            const data = await response.json();
            const transformedServices = data.map(service => ({
                id: service.requestId,
                requestId: service.requestId,
                paymentId: service.paymentId,
                userName: service.userName,
                userEmail: service.userEmail,
                serviceName: service.serviceName,
                technicianName: service.technicianName,
                technicianEmail: service.technicianEmail,
                description: service.description,
                status: service.status,
                appointmentTime: service.appointmentTime,
                feeCharge: service.feeCharge,
                paymentStatus: service.paymentStatus
            }));

            setServices(transformedServices);
            addNotification('Services loaded successfully', 'success');
        } catch (error) {
            console.error('Error fetching services:', error);
            setError(error.message);
            addNotification('Failed to load services', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReleasePayment = async (paymentId) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/release/${paymentId}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to release payment');
            }

            addNotification('Payment released successfully', 'success');
            setShowModal(false);
            setSelectedService(null);
            await fetchAllServices();
            await fetchServiceDashboard();
        } catch (error) {
            console.error('Error releasing payment:', error);
            addNotification(error.message || 'Failed to release payment', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRefundPayment = async (paymentId) => {
        try {
            setActionLoading(true);

            const response = await fetch(`${API_BASE_URL}/admin/refund/${paymentId}`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to refund payment');
            }

            addNotification('Payment refunded successfully', 'success');
            setShowModal(false);
            setSelectedService(null);
            await fetchAllServices();
            await fetchServiceDashboard();
        } catch (error) {
            console.error('Error refunding payment:', error);
            addNotification(error.message || 'Failed to refund payment', 'error');
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

    const matchesSearchTerm = (service, term) => {
        if (!term || term.trim() === '') return true;
        const cleanTerm = term.toLowerCase().trim();
        const searchableText = [
            service.userName || '',
            service.userEmail || '',
            service.technicianName || '',
            service.serviceName || '',
            service.description || ''
        ].join(' ').toLowerCase();
        return searchableText.includes(cleanTerm);
    };

    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase().trim().replace(/\s+/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filteredServices = useMemo(() => {
        let filtered = services.filter(service => {
            const matchesSearch = matchesSearchTerm(service, searchTerm);
            const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'appointmentTime') {
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
    }, [services, searchTerm, statusFilter, sortBy, sortOrder]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'IN_PROGRESS': return '#f59e0b';
            case 'CANCELLED': return '#dc2626';
            case 'PENDING': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'COMPLETED': return CheckCircle;
            case 'IN_PROGRESS': return Clock;
            case 'CANCELLED': return XCircle;
            case 'PENDING': return AlertTriangle;
            default: return AlertTriangle;
        }
    };

    const handleServiceAction = (service, action) => {
        setSelectedService(service);
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
        fetchAllServices();
        fetchServiceDashboard();
    }, []);

    if (loading) {
        return (
            <div className={`admin-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <div className="user-management">
                    <div className="user-management-container">
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            <Wrench size={48} style={{ margin: '0 auto 1rem' }} />
                            <h3>Loading services...</h3>
                            <p>Please wait while we fetch service data</p>
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
                            <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Error Loading Services</h3>
                            <p style={{ color: '#991b1b', marginBottom: '1rem' }}>{error}</p>
                            <button onClick={fetchAllServices} style={{
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
                                <TrendingUp size={28} />
                                Service Management
                            </h1>
                            <button className="export-btn" onClick={() => {
                                fetchAllServices();
                                fetchServiceDashboard();
                            }}>
                                <RefreshCw size={16} />
                                Refresh Data
                            </button>
                        </div>
                        <p className="page-subtitle">Track service requests, manage payments, and monitor service delivery</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="summary-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="summary-card">
                            <div className="summary-icon total">
                                <Wrench size={24} />
                            </div>
                            <div>
                                <div className="summary-value">{dashboard.totalServices}</div>
                                <div className="summary-label">Total Services</div>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon active">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <div className="summary-value">{dashboard.completedServices}</div>
                                <div className="summary-label">Completed</div>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon pending">
                                <Clock size={24} />
                            </div>
                            <div>
                                <div className="summary-value">{dashboard.ongoingServices}</div>
                                <div className="summary-label">In Progress</div>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon pending">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <div className="summary-value">{dashboard.pendingServices}</div>
                                <div className="summary-label">Pending</div>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon blocked">
                                <XCircle size={24} />
                            </div>
                            <div>
                                <div className="summary-value">{dashboard.cancelledServices}</div>
                                <div className="summary-label">Cancelled</div>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon blocked">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <div className="summary-value">{dashboard.rejectedServices}</div>
                                <div className="summary-label">Rejected</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="filters-section">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search by user, technician, or service..."
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
                                <option value="COMPLETED">Completed</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="PENDING">Pending</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="REJECTED">Rejected</option>
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
                                <option value="appointmentTime-desc">Latest First</option>
                                <option value="appointmentTime-asc">Oldest First</option>
                                <option value="userName-asc">User A-Z</option>
                                <option value="userName-desc">User Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Services Table */}
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Service</th>
                                <th>Technician</th>
                                <th>Appointment</th>
                                <th>Fee</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredServices.map(service => {
                                const StatusIcon = getStatusIcon(service.status);
                                return (
                                    <tr key={service.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="user-name">{service.userName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                        {service.userEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-type">
                                                <div style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' }}>
                                                    {service.serviceName}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' }}>
                                                    {service.technicianName}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                    {service.technicianEmail}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-info">
                                                <Calendar size={12} />
                                                {new Date(service.appointmentTime).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
                                                <DollarSign size={14} />
                                                {service.feeCharge}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="status-badge" style={{ color: getStatusColor(service.status) }}>
                                                <StatusIcon size={14} />
                                                {service.status}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-btn view"
                                                    onClick={() => handleServiceAction(service, 'details')}
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {service.status === 'COMPLETED' && service.paymentStatus === 'HOLD' && (
                                                    <>
                                                        <button
                                                            className="action-btn approve"
                                                            onClick={() => handleServiceAction(service, 'release')}
                                                            title="Release Payment"
                                                        >
                                                            <DollarSign size={16} />
                                                        </button>
                                                        <button
                                                            className="action-btn reject"
                                                            onClick={() => handleServiceAction(service, 'refund')}
                                                            title="Refund Payment"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {(service.status === 'CANCELLED' || service.status === 'REJECTED') && service.paymentStatus === 'HOLD' && (
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleServiceAction(service, 'refund')}
                                                        title="Refund Payment"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {filteredServices.length === 0 && (
                            <div className="no-results">
                                <Wrench size={48} />
                                <h3>No services found</h3>
                                <p>Try adjusting your search criteria or filters</p>
                            </div>
                        )}
                    </div>

                    {/* Modals */}
                    <Modal show={showModal} onClose={() => setShowModal(false)}>
                        {selectedService && (
                            <>
                                {modalType === 'details' && (
                                    <div className="modal-body">
                                        <div className="modal-header">
                                            <h3>Service Details</h3>
                                            <button onClick={() => setShowModal(false)}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="profile-details">
                                            <div className="profile-section">
                                                <h4>Service Information</h4>
                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <label>Service Request ID</label>
                                                        <span>{selectedService.requestId}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Service Type</label>
                                                        <span>{selectedService.serviceName}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Status</label>
                                                        <span style={{
                                                            color: getStatusColor(selectedService.status),
                                                            fontWeight: '600',
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {selectedService.status}
                                                        </span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Appointment Time</label>
                                                        <span>{new Date(selectedService.appointmentTime).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="profile-section">
                                                <h4>User Information</h4>
                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <label>User Name</label>
                                                        <span>{selectedService.userName}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Email</label>
                                                        <span>{selectedService.userEmail}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="profile-section">
                                                <h4>Technician Information</h4>
                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <label>Technician Name</label>
                                                        <span>{selectedService.technicianName}</span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Email</label>
                                                        <span>{selectedService.technicianEmail}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="profile-section">
                                                <h4>Payment Information</h4>
                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <label>Fee Charged</label>
                                                        <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10b981' }}>
                                                            ${selectedService.feeCharge}
                                                        </span>
                                                    </div>
                                                    <div className="profile-item">
                                                        <label>Payment Status</label>
                                                        <span style={{
                                                            padding: '0.375rem 0.75rem',
                                                            borderRadius: '6px',
                                                            backgroundColor: selectedService.paymentStatus === 'HOLD' ? '#fef3c7' :
                                                                selectedService.paymentStatus === 'RELEASED' ? '#d1fae5' :
                                                                    selectedService.paymentStatus === 'REFUNDED' ? '#fee2e2' : '#e0e7ff',
                                                            color: selectedService.paymentStatus === 'HOLD' ? '#92400e' :
                                                                selectedService.paymentStatus === 'RELEASED' ? '#065f46' :
                                                                    selectedService.paymentStatus === 'REFUNDED' ? '#7f1d1d' : '#312e81',
                                                            fontWeight: '600',
                                                            fontSize: '0.875rem',
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {selectedService.paymentStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="profile-section">
                                                <h4>Service Description</h4>
                                                <div style={{
                                                    backgroundColor: '#f8fafc',
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    color: '#475569',
                                                    fontSize: '0.875rem',
                                                    lineHeight: '1.6'
                                                }}>
                                                    {selectedService.description || 'No description provided'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'release' && (
                                    <div className="modal-body">
                                        <div className="modal-header">
                                            <h3>Release Payment</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="confirmation-content">
                                            <DollarSign size={48} color="#10b981" />
                                            <p>Release payment of <strong>${selectedService.feeCharge}</strong> to <strong>{selectedService.technicianName}</strong>?</p>
                                            <p>This will transfer the payment from hold to the technician's earnings.</p>
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
                                                    onClick={() => handleReleasePayment(selectedService.paymentId)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Releasing...' : 'Release Payment'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalType === 'refund' && (
                                    <div className="modal-body">
                                        <div className="modal-header">
                                            <h3>Refund Payment</h3>
                                            <button onClick={() => setShowModal(false)} disabled={actionLoading}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="confirmation-content">
                                            <X size={48} color="#dc2626" />
                                            <p>Refund payment of <strong>${selectedService.feeCharge}</strong> to <strong>{selectedService.userName}</strong>?</p>
                                            <p style={{ color: '#dc2626', fontWeight: '500' }}>This will return the payment to the user's account.</p>
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
                                                    onClick={() => handleRefundPayment(selectedService.paymentId)}
                                                    disabled={actionLoading}
                                                    style={{ opacity: actionLoading ? 0.6 : 1 }}
                                                >
                                                    {actionLoading ? 'Refunding...' : 'Refund Payment'}
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

export default ServiceManagement;