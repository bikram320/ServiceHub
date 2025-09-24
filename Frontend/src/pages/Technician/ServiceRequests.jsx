import React, { useState, useEffect } from 'react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    RefreshCw,
    DollarSign,
    Search,
    Wrench,
    Zap,
    Home,
    Settings,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Star
} from 'lucide-react';
import styles from '../../styles/ServiceRequests.module.css';
import FilterAndSearch from "../../Components/common/FilterAndSearch.jsx";

const ServiceRequests = ({ isSidebarCollapsed = false }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [processingRequests, setProcessingRequests] = useState(new Set());
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalRequests: 0,
        urgentResponses: 0,
        responseRate: 85,
        potentialEarnings: 0
    });

    // Get technician email from localStorage (same pattern as UpcomingAppointments)
    const getTechnicianEmail = () => {
        return localStorage.getItem('userEmail'); // Assuming technician email is stored as userEmail
    };

    // Enhanced token retrieval with better error handling
    const getAuthToken = () => {
        try {
            // Check for JWT in cookies first (more secure)
            const cookies = document.cookie.split(';');
            const accessCookie = cookies.find(cookie => cookie.trim().startsWith('Access='));
            if (accessCookie) {
                const token = accessCookie.split('=')[1];
                if (token && token !== 'undefined' && token !== 'null') {
                    return token;
                }
            }

            // Check for Authorization cookie
            const authCookie = cookies.find(cookie => cookie.trim().startsWith('Authorization='));
            if (authCookie) {
                const token = authCookie.split('=')[1];
                if (token && token !== 'undefined' && token !== 'null') {
                    return token;
                }
            }

            // Fallback to localStorage
            const localToken = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
            if (localToken && localToken !== 'undefined' && localToken !== 'null') {
                return localToken;
            }

            return null;
        } catch (error) {
            console.error('Error retrieving auth token:', error);
            return null;
        }
    };

    // Fetch current service requests using the correct endpoint
    const fetchCurrentRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const technicianEmail = getTechnicianEmail();
            if (!technicianEmail) {
                setError('Authentication required. Please log in to view service requests.');
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/technician/get-current-request?email=${encodeURIComponent(technicianEmail)}`, {
                method: 'GET',
                credentials: 'include', // Use cookies for authentication
            });

            if (response.ok) {
                const data = await response.json();
                const transformedData = transformApiDataToRequests(data);
                setServiceRequests(transformedData);
                updateStats(transformedData);
                setError(null);
            } else if (response.status === 404) {
                // No current requests found
                setServiceRequests([]);
                updateStats([]);
                setError(null);
            } else if (response.status === 401) {
                setError('Authentication required. Please log in to view service requests.');
            } else {
                throw new Error(`Failed to fetch service requests: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            if (error.message.includes('Failed to fetch')) {
                setError('Unable to connect to server. Please check your connection.');
            } else {
                setError(`Failed to load service requests: ${error.message}`);
            }
            setServiceRequests([]);
        } finally {
            setLoading(false);
        }
    };

    // Transform backend data to match frontend structure
    const transformApiDataToRequests = (apiData) => {
        if (!Array.isArray(apiData)) {
            console.warn('API response is not an array:', apiData);
            return [];
        }

        return apiData.map(item => ({
            id: item.requestId || Math.random().toString().substr(2, 6),
            requestId: `REQ${item.requestId}`,
            client: {
                name: item.username || 'Unknown Client',
                avatar: (item.username || 'UC').split(' ').map(n => n[0]).join('').substr(0, 2).toUpperCase(),
                phone: item.userPhone || '+977-XXXXXXXXXX',
                email: item.userEmail || 'N/A',
                rating: 4.0, // Default rating as it's not in the DTO
                totalBookings: 0 // Default as it's not in the DTO
            },
            service: {
                type: item.serviceName || 'General Service',
                category: getCategoryFromServiceType(item.serviceName),
                description: `${item.serviceName} service requested`,
                urgency: 'medium', // Default urgency
                estimatedDuration: '2-3 hours',
                preferredTime: formatTime(item.appointmentTime)
            },
            location: {
                address: item.userAddress || 'Location not specified',
                distance: 'N/A', // Distance calculation would need coordinates
                coordinates: {
                    lat: 27.7172, // Default Kathmandu coordinates
                    lng: 85.3240
                }
            },
            pricing: {
                budget: `₨${item.feeCharge || 0}`,
                suggestedPrice: item.feeCharge || 0,
                negotiable: true
            },
            timeline: {
                requestedDate: formatDate(item.appointmentTime),
                requestedTime: formatTime(item.appointmentTime),
                postedTime: formatTimeAgo(item.appointmentTime),
                responseDeadline: calculateResponseDeadline(item.appointmentTime),
                appointmentDateTime: new Date(item.appointmentTime)
            },
            status: mapApiStatusToComponentStatus(item.status),
            priority: getPriorityFromAppointmentTime(item.appointmentTime),
            attachments: []
        }));
    };

    // Helper functions
    const getCategoryFromServiceType = (serviceType) => {
        const type = (serviceType || '').toLowerCase();
        if (type.includes('plumb')) return 'plumbing';
        if (type.includes('electric') || type.includes('ac')) return 'electrical';
        if (type.includes('clean')) return 'cleaning';
        if (type.includes('garden')) return 'gardening';
        return 'general';
    };

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return 'Date not set';
        const date = new Date(dateTimeString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return 'Time not set';
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Just now';
        const now = new Date();
        const date = new Date(dateString);
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    const calculateResponseDeadline = (appointmentTime) => {
        if (!appointmentTime) return '6 hours';
        const appointment = new Date(appointmentTime);
        const now = new Date();
        const timeDiff = appointment - now;
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

        if (hoursDiff <= 0) return 'Overdue';
        if (hoursDiff <= 2) return 'Urgent';
        return `${hoursDiff} hours`;
    };

    const getPriorityFromAppointmentTime = (appointmentTime) => {
        if (!appointmentTime) return 'medium';
        const appointment = new Date(appointmentTime);
        const now = new Date();
        const hoursDiff = Math.floor((appointment - now) / (1000 * 60 * 60));

        if (hoursDiff <= 2) return 'high';
        if (hoursDiff <= 24) return 'medium';
        return 'low';
    };

    const mapApiStatusToComponentStatus = (apiStatus) => {
        const status = (apiStatus || '').toLowerCase();
        switch (status) {
            case 'pending': return 'pending';
            case 'in_progress': return 'in_progress';
            case 'completed': return 'completed';
            case 'rejected': return 'declined';
            default: return 'pending';
        }
    };

    const updateStats = (requests) => {
        const totalRequests = requests.length;
        const urgentRequests = requests.filter(r => r.timeline.responseDeadline === 'Urgent' || r.timeline.responseDeadline === 'Overdue').length;
        const potentialEarnings = requests.reduce((sum, r) => sum + (r.pricing.suggestedPrice || 0), 0);

        setStats({
            totalRequests,
            urgentResponses: urgentRequests,
            responseRate: 85,
            potentialEarnings
        });
    };

    // Validate appointment time before action
    const validateAppointmentTime = (appointmentDateTime, action) => {
        const now = new Date();
        const appointment = new Date(appointmentDateTime);

        if (action === 'complete') {
            // For completing, check if appointment time has passed or is very close (within 30 minutes)
            const timeDiff = appointment - now;
            const minutesDiff = Math.floor(timeDiff / (1000 * 60));

            if (minutesDiff > 30) {
                return {
                    valid: false,
                    message: `Cannot complete service before appointment time. Appointment is scheduled for ${formatDate(appointment)} at ${formatTime(appointment)}.`
                };
            }
        }

        return { valid: true };
    };

    // Accept service request
    const handleAcceptRequest = async (requestId) => {
        setProcessingRequests(prev => new Set(prev).add(requestId));

        try {
            const response = await fetch(`/api/technician/accept-service-request?requestId=${requestId}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                // Update local state
                setServiceRequests(prev =>
                    prev.map(request =>
                        request.id === requestId
                            ? { ...request, status: 'in_progress' }
                            : request
                    )
                );
                alert('Request accepted successfully! The client has been notified.');
                // Refresh to get updated data
                fetchCurrentRequests();
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to accept request');
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert(`Failed to accept request: ${error.message}`);
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    // Complete service request (only for IN_PROGRESS)
    const handleCompleteRequest = async (requestId) => {
        const request = serviceRequests.find(r => r.id === requestId);
        if (!request) return;

        // Validate appointment time
        const timeValidation = validateAppointmentTime(request.timeline.appointmentDateTime, 'complete');
        if (!timeValidation.valid) {
            alert(timeValidation.message);
            return;
        }

        if (request.status !== 'in_progress') {
            alert('Only in-progress services can be marked as completed.');
            return;
        }

        setProcessingRequests(prev => new Set(prev).add(requestId));

        try {
            const response = await fetch(`/api/technician/tick-completed-service?requestId=${requestId}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('Service marked as completed successfully!');
                // Refresh to get updated data (completed requests might be filtered out)
                fetchCurrentRequests();
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to complete service');
            }
        } catch (error) {
            console.error('Error completing service:', error);
            alert(`Failed to complete service: ${error.message}`);
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    // Reject service request (only for PENDING)
    const handleRejectRequest = (requestId) => {
        const request = serviceRequests.find(r => r.id === requestId);
        if (!request) return;

        if (request.status !== 'pending') {
            alert('Only pending requests can be rejected.');
            return;
        }

        setSelectedRequest(request);
        setConfirmAction(() => () => performRejectRequest(requestId));
        setShowConfirmModal(true);
    };

    const performRejectRequest = async (requestId) => {
        setProcessingRequests(prev => new Set(prev).add(requestId));

        try {
            const response = await fetch(`/api/technician/reject-service-request?requestId=${requestId}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('Request rejected successfully. The client has been notified.');
                // Refresh to get updated data (rejected requests might be filtered out)
                fetchCurrentRequests();
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to reject request');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert(`Failed to reject request: ${error.message}`);
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    // Refresh data
    const handleRefresh = () => {
        setSearchTerm('');
        setSelectedFilter('all');
        setError(null);
        fetchCurrentRequests();
    };

    // Load data on component mount
    useEffect(() => {
        fetchCurrentRequests();
    }, []);

    // Rest of helper functions
    const getServiceIcon = (category) => {
        switch (category) {
            case 'plumbing': return <Wrench size={20} />;
            case 'electrical': return <Zap size={20} />;
            case 'cleaning': return <Home size={20} />;
            case 'gardening': return <Settings size={20} />;
            default: return <Settings size={20} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'in_progress': return '#3b82f6';
            case 'completed': return '#10b981';
            case 'declined': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'in_progress': return 'In Progress';
            case 'completed': return 'Completed';
            case 'declined': return 'Rejected';
            default: return 'Unknown';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle size={16} />;
            case 'in_progress': return <Clock size={16} />;
            case 'completed': return <CheckCircle size={16} />;
            case 'declined': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    // Filtering and sorting logic
    const filteredRequests = serviceRequests.filter(request => {
        const matchesFilter = selectedFilter === 'all' || request.status === selectedFilter;
        const matchesSearch = request.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.location.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const sortedRequests = [...filteredRequests].sort((a, b) => {
        let aValue, bValue;
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        switch (sortBy) {
            case 'date':
                aValue = new Date(a.timeline.appointmentDateTime);
                bValue = new Date(b.timeline.appointmentDateTime);
                break;
            case 'price':
                aValue = a.pricing.suggestedPrice;
                bValue = b.pricing.suggestedPrice;
                break;
            case 'priority':
                aValue = priorityOrder[a.priority];
                bValue = priorityOrder[b.priority];
                break;
            default:
                return 0;
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const handleViewDetails = (requestId) => {
        const request = serviceRequests.find(r => r.id === requestId);
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const handleConfirmAction = async () => {
        setShowConfirmModal(false);
        if (confirmAction) {
            await confirmAction();
        }
        setConfirmAction(null);
        setSelectedRequest(null);
    };

    const handleCancelAction = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setSelectedRequest(null);
    };

    const filterOptions = [
        { value: 'all', label: 'All Requests', count: serviceRequests.length },
        { value: 'pending', label: 'Pending', count: serviceRequests.filter(r => r.status === 'pending').length },
        { value: 'in_progress', label: 'In Progress', count: serviceRequests.filter(r => r.status === 'in_progress').length },
        { value: 'completed', label: 'Completed', count: serviceRequests.filter(r => r.status === 'completed').length }
    ];

    // Loading state
    if (loading) {
        return (
            <div className={`${styles['profile-content']} ${isSidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
                <div className={styles['profile-form']}>
                    <div className={styles['loading-state']}>
                        <RefreshCw size={48} className={styles['spin']} />
                        <p>Loading service requests...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state for authentication issues
    if (error && error.includes('Authentication required')) {
        return (
            <div className={`${styles['profile-content']} ${isSidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
                <div className={styles['profile-form']}>
                    <div className={styles['error-state']}>
                        <AlertCircle size={48} style={{ color: '#ef4444' }} />
                        <h3>Authentication Required</h3>
                        <p>{error}</p>
                        <button
                            className={`${styles['action-btn']} ${styles['primary']}`}
                            onClick={() => window.location.href = '/LoginSignup'}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles['profile-content']} ${isSidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
            <div className={styles['profile-form']}>
                <div className={styles['profile-header']}>
                    <h1 className={styles['profile-title']}>Service Requests</h1>
                    <p className={styles['profile-subtitle']}>Manage and respond to incoming service requests from clients.</p>
                    {error && !error.includes('Authentication required') && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            padding: '12px',
                            marginTop: '8px',
                            color: '#dc2626'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} />
                                <strong>Error:</strong> {error}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <section className={styles['form-section']}>
                    <div className={styles['stats-grid']}>
                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#dbeafe' }}>
                                <Clock size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{stats.totalRequests}</div>
                                <div className={styles['stat-label']}>Total Requests</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>Updated now</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#fef3c7' }}>
                                <AlertCircle size={24} style={{ color: '#f59e0b' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{stats.urgentResponses}</div>
                                <div className={styles['stat-label']}>Urgent Responses</div>
                                <div className={`${styles['stat-change']} ${stats.urgentResponses > 0 ? styles['negative'] : styles['positive']}`}>
                                    {stats.urgentResponses > 0 ? 'Response overdue' : 'All current'}
                                </div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#d1fae5' }}>
                                <CheckCircle size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{stats.responseRate}%</div>
                                <div className={styles['stat-label']}>Response Rate</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>Maintaining</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#e0e7ff' }}>
                                <DollarSign size={24} style={{ color: '#6366f1' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>₨{stats.potentialEarnings.toLocaleString()}</div>
                                <div className={styles['stat-label']}>Potential Earnings</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>From current requests</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters and Controls - Assuming FilterAndSearch component exists */}
                <FilterAndSearch
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                    filterOptions={filterOptions}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    onRefresh={handleRefresh}
                />

                {/* Service Requests List */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            Current Requests ({sortedRequests.length})
                        </h3>
                    </div>
                    <div className={styles['requests-list']}>
                        {sortedRequests.map((request) => {
                            const isProcessing = processingRequests.has(request.id);
                            return (
                                <div key={`request-${request.id}`} className={styles['request-card']}>
                                    <div className={styles['request-header']}>
                                        <div className={styles['request-id-status']}>
                                            <span className={styles['request-id']}>#{request.requestId}</span>
                                            <div className={styles['status-badges']}>
                                                <span
                                                    className={styles['status-badge']}
                                                    style={{ backgroundColor: getStatusColor(request.status) }}
                                                >
                                                    {getStatusIcon(request.status)}
                                                    {getStatusText(request.status)}
                                                </span>
                                                <span
                                                    className={styles['priority-badge']}
                                                    style={{ backgroundColor: getPriorityColor(request.priority) }}
                                                >
                                                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles['request-time']}>
                                            <Clock size={14} />
                                            <span>Appointment: {request.timeline.requestedDate}</span>
                                            <span className={styles['deadline']}>at {request.timeline.requestedTime}</span>
                                        </div>
                                    </div>

                                    <div className={styles['request-body']}>
                                        <div className={styles['request-main']}>
                                            <div className={styles['service-info']}>
                                                <div className={styles['service-header']}>
                                                    <div className={styles['service-icon']}>
                                                        {getServiceIcon(request.service.category)}
                                                    </div>
                                                    <div className={styles['service-details']}>
                                                        <h4 className={styles['service-title']}>{request.service.type}</h4>
                                                        <p className={styles['service-description']}>{request.service.description}</p>
                                                    </div>
                                                </div>

                                                <div className={styles['service-meta']}>
                                                    <div className={styles['meta-item']}>
                                                        <Calendar size={14} />
                                                        <span>Scheduled: {request.timeline.requestedDate} at {request.timeline.requestedTime}</span>
                                                    </div>
                                                    <div className={styles['meta-item']}>
                                                        <Clock size={14} />
                                                        <span>Duration: {request.service.estimatedDuration}</span>
                                                    </div>
                                                    <div className={styles['meta-item']}>
                                                        <MapPin size={14} />
                                                        <span>{request.location.address}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles['client-info']}>
                                                <div className={styles['client-header']}>
                                                    <div className={styles['client-avatar']}>
                                                        {request.client.avatar}
                                                    </div>
                                                    <div className={styles['client-details']}>
                                                        <h5 className={styles['client-name']}>{request.client.name}</h5>
                                                        <div className={styles['client-rating']}>
                                                            <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                                            <span>{request.client.rating}</span>
                                                            <span className={styles['client-bookings']}>({request.client.totalBookings} bookings)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles['client-contact']}>
                                                    <div className={styles['contact-item']}>
                                                        <Phone size={12} />
                                                        <span>{request.client.phone}</span>
                                                    </div>
                                                    <div className={styles['contact-item']}>
                                                        <Mail size={12} />
                                                        <span>{request.client.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles['request-pricing']}>
                                            <div className={styles['pricing-info']}>
                                                <div className={styles['budget-range']}>
                                                    <span className={styles['budget-label']}>Service Fee:</span>
                                                    <span className={styles['budget-amount']}>{request.pricing.budget}</span>
                                                </div>
                                                <div className={styles['suggested-price']}>
                                                    <span className={styles['suggested-label']}>Amount:</span>
                                                    <span className={styles['suggested-amount']}>₨{request.pricing.suggestedPrice.toLocaleString()}</span>
                                                </div>
                                                {request.pricing.negotiable && (
                                                    <span className={styles['negotiable-badge']}>Negotiable</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles['request-actions']}>
                                        <div className={styles['action-buttons']}>
                                            <button
                                                className={`${styles['action-btn']} ${styles['secondary']}`}
                                                onClick={() => handleViewDetails(request.id)}
                                                disabled={isProcessing}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>

                                            {/* Reject button - only for pending requests */}
                                            {request.status === 'pending' && (
                                                <button
                                                    className={`${styles['action-btn']} ${styles['secondary']} ${styles['decline']}`}
                                                    onClick={() => handleRejectRequest(request.id)}
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? <RefreshCw size={16} className={styles['spin']} /> : <XCircle size={16} />}
                                                    {isProcessing ? 'Processing...' : 'Reject'}
                                                </button>
                                            )}

                                            {/* Accept button - only for pending requests */}
                                            {request.status === 'pending' && (
                                                <button
                                                    className={`${styles['action-btn']} ${styles['primary']}`}
                                                    onClick={() => handleAcceptRequest(request.id)}
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? <RefreshCw size={16} className={styles['spin']} /> : <CheckCircle size={16} />}
                                                    {isProcessing ? 'Processing...' : 'Accept'}
                                                </button>
                                            )}

                                            {/* Complete button - only for in_progress requests */}
                                            {request.status === 'in_progress' && (
                                                <button
                                                    className={`${styles['action-btn']} ${styles['primary']} ${styles['complete']}`}
                                                    onClick={() => handleCompleteRequest(request.id)}
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? <RefreshCw size={16} className={styles['spin']} /> : <CheckCircle size={16} />}
                                                    {isProcessing ? 'Processing...' : 'Mark Complete'}
                                                </button>
                                            )}
                                        </div>

                                        {request.attachments && request.attachments.length > 0 && (
                                            <div className={styles['attachments']}>
                                                <span className={styles['attachments-label']}>Attachments:</span>
                                                {request.attachments.map((file, index) => (
                                                    <span key={index} className={styles['attachment-file']}>{file}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {sortedRequests.length === 0 && (
                        <div className={styles['empty-state']}>
                            <div className={styles['empty-icon']}>
                                <Search size={48} style={{ color: '#9ca3af' }} />
                            </div>
                            <div className={styles['empty-message']}>
                                <h4>No requests found</h4>
                                <p>Try adjusting your filters or search terms to find relevant service requests.</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Confirmation Modal */}
                {showConfirmModal && selectedRequest && (
                    <div className={styles['modal-overlay']}>
                        <div className={styles['modal-content']}>
                            <div className={styles['modal-header']}>
                                <h3 className={styles['modal-title']}>Confirm Action</h3>
                                <button
                                    className={styles['modal-close']}
                                    onClick={handleCancelAction}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <div className={styles['modal-body']}>
                                <div className={styles['confirmation-message']}>
                                    <AlertCircle size={48} className={styles['warning-icon']} />
                                    <h4>Are you sure you want to reject this request?</h4>
                                    <p>This action cannot be undone and the request will be marked as rejected. The client will be notified of your decision.</p>
                                </div>
                                <div className={styles['request-summary']}>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Request ID:</span>
                                        <span className={styles['summary-value']}>#{selectedRequest.requestId}</span>
                                    </div>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Client:</span>
                                        <span className={styles['summary-value']}>{selectedRequest.client.name}</span>
                                    </div>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Service:</span>
                                        <span className={styles['summary-value']}>{selectedRequest.service.type}</span>
                                    </div>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Appointment:</span>
                                        <span className={styles['summary-value']}>{selectedRequest.timeline.requestedDate} at {selectedRequest.timeline.requestedTime}</span>
                                    </div>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Service Fee:</span>
                                        <span className={styles['summary-value']}>₨{selectedRequest.pricing.suggestedPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles['modal-actions']}>
                                <button
                                    className={`${styles['action-btn']} ${styles['secondary']}`}
                                    onClick={handleCancelAction}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`${styles['action-btn']} ${styles['decline']}`}
                                    onClick={handleConfirmAction}
                                >
                                    <XCircle size={16} />
                                    Yes, Reject Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Modal */}
                {showDetailsModal && selectedRequest && (
                    <div className={styles['modal-overlay']}>
                        <div className={styles['modal-content']} style={{ maxWidth: '800px' }}>
                            <div className={styles['modal-header']}>
                                <h3 className={styles['modal-title']}>Request Details - #{selectedRequest.requestId}</h3>
                                <button
                                    className={styles['modal-close']}
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <div className={styles['modal-body']}>
                                <div className={styles['details-grid']}>
                                    <div className={styles['details-section']}>
                                        <h4 className={styles['details-section-title']}>Service Information</h4>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Service Type:</span>
                                            <span className={styles['details-value']}>{selectedRequest.service.type}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Description:</span>
                                            <span className={styles['details-value']}>{selectedRequest.service.description}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Category:</span>
                                            <span className={styles['details-value']}>{selectedRequest.service.category}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Duration:</span>
                                            <span className={styles['details-value']}>{selectedRequest.service.estimatedDuration}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Priority:</span>
                                            <span className={`${styles['details-value']} ${styles['priority-badge']}`} style={{ backgroundColor: getPriorityColor(selectedRequest.priority) }}>
                                                {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                                            </span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Status:</span>
                                            <span className={`${styles['details-value']} ${styles['status-badge']}`} style={{ backgroundColor: getStatusColor(selectedRequest.status) }}>
                                                {getStatusIcon(selectedRequest.status)}
                                                {getStatusText(selectedRequest.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles['details-section']}>
                                        <h4 className={styles['details-section-title']}>Client Information</h4>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Name:</span>
                                            <span className={styles['details-value']}>{selectedRequest.client.name}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Phone:</span>
                                            <span className={styles['details-value']}>{selectedRequest.client.phone}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Email:</span>
                                            <span className={styles['details-value']}>{selectedRequest.client.email}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Rating:</span>
                                            <div className={styles['details-value']}>
                                                <div className={styles['rating-display']}>
                                                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                    <span>{selectedRequest.client.rating}</span>
                                                    <span className={styles['booking-count']}>({selectedRequest.client.totalBookings} bookings)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles['details-section']}>
                                        <h4 className={styles['details-section-title']}>Schedule & Location</h4>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Appointment Date:</span>
                                            <span className={styles['details-value']}>{selectedRequest.timeline.requestedDate}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Appointment Time:</span>
                                            <span className={styles['details-value']}>{selectedRequest.timeline.requestedTime}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Location:</span>
                                            <span className={styles['details-value']}>{selectedRequest.location.address}</span>
                                        </div>
                                    </div>

                                    <div className={styles['details-section']}>
                                        <h4 className={styles['details-section-title']}>Pricing</h4>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Service Fee:</span>
                                            <span className={styles['details-value']}>{selectedRequest.pricing.budget}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Amount:</span>
                                            <span className={styles['details-value']} style={{ color: '#059669', fontWeight: 'bold' }}>
                                                ₨{selectedRequest.pricing.suggestedPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Negotiable:</span>
                                            <span className={styles['details-value']}>
                                                {selectedRequest.pricing.negotiable ?
                                                    <span className={styles['negotiable-yes']}>Yes</span> :
                                                    <span className={styles['negotiable-no']}>No</span>
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                                        <div className={styles['details-section']}>
                                            <h4 className={styles['details-section-title']}>Attachments</h4>
                                            <div className={styles['attachments-list']}>
                                                {selectedRequest.attachments.map((file, index) => (
                                                    <span key={index} className={styles['attachment-file']}>
                                                        {file}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles['modal-actions']}>
                                <button
                                    className={`${styles['action-btn']} ${styles['secondary']}`}
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    Close
                                </button>

                                {/* Show appropriate action button based on status */}
                                {selectedRequest.status === 'pending' && (
                                    <>
                                        <button
                                            className={`${styles['action-btn']} ${styles['decline']}`}
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                handleRejectRequest(selectedRequest.id);
                                            }}
                                            disabled={processingRequests.has(selectedRequest.id)}
                                        >
                                            <XCircle size={16} />
                                            Reject Request
                                        </button>
                                        <button
                                            className={`${styles['action-btn']} ${styles['primary']}`}
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                handleAcceptRequest(selectedRequest.id);
                                            }}
                                            disabled={processingRequests.has(selectedRequest.id)}
                                        >
                                            <CheckCircle size={16} />
                                            Accept Request
                                        </button>
                                    </>
                                )}

                                {selectedRequest.status === 'in_progress' && (
                                    <button
                                        className={`${styles['action-btn']} ${styles['primary']} ${styles['complete']}`}
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleCompleteRequest(selectedRequest.id);
                                        }}
                                        disabled={processingRequests.has(selectedRequest.id)}
                                    >
                                        <CheckCircle size={16} />
                                        Mark Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceRequests;