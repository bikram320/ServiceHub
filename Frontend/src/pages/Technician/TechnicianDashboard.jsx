
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Calendar,
    MessageSquare,
    Settings,
    BarChart3,
    Clock,
    CheckCircle,
    DollarSign,
    Star,
    Activity,
    Eye,
    MapPin,
    User,
    Bell,
    AlertCircle,
    TrendingUp,
    RefreshCw
} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import styles from '../../styles/TechnicianDashboard.module.css';

const TechnicianDashboard = () => {
    const navigate = useNavigate();
    const [selectedTimeRange, setSelectedTimeRange] = useState('week');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // State for dynamic data
    const [currentRequests, setCurrentRequests] = useState([]);
    const [previousRequests, setPreviousRequests] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [receivedPayments, setReceivedPayments] = useState([]);
    const [dashboardOverview, setDashboardOverview] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Get technician email from localStorage or context
    const getTechnicianEmail = () => {
        return localStorage.getItem('technicianEmail') || 'tech@example.com';
    };

    // API configuration
    const API_BASE_URL = 'http://localhost:8080';

    const apiCall = async (endpoint, options = {}) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                    ...options.headers
                },
                credentials: 'include',
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    };

    // API functions matching your backend endpoints
    const fetchDashboardOverview = async () => {
        try {
            const email = getTechnicianEmail();
            return await apiCall(`/technician/dashboard-overview?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error('Failed to fetch dashboard overview:', error);
            return null;
        }
    };

    const fetchCurrentRequests = async () => {
        try {
            const email = getTechnicianEmail();
            return await apiCall(`/technician/get-current-request?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error('Failed to fetch current requests:', error);
            return [];
        }
    };

    const fetchPreviousRequests = async () => {
        try {
            const email = getTechnicianEmail();
            return await apiCall(`/technician/get-previous-request?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error('Failed to fetch previous requests:', error);
            return [];
        }
    };

    const fetchPendingPayments = async () => {
        try {
            const email = getTechnicianEmail();
            return await apiCall(`/technician/pending-payments?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error('Failed to fetch pending payments:', error);
            return [];
        }
    };

    const fetchReceivedPayments = async () => {
        try {
            const email = getTechnicianEmail();
            return await apiCall(`/technician/received-payments?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error('Failed to fetch received payments:', error);
            return [];
        }
    };

    const acceptServiceRequest = async (requestId) => {
        try {
            await apiCall(`/technician/accept-service-request?requestId=${requestId}`, {
                method: 'POST'
            });

            addNotification('success', 'Service request accepted successfully');
            await refreshData();
        } catch (error) {
            console.error('Failed to accept service request:', error);
            addNotification('error', 'Failed to accept service request');
        }
    };

    const rejectServiceRequest = async (requestId) => {
        try {
            await apiCall(`/technician/reject-service-request?requestId=${requestId}`, {
                method: 'POST'
            });

            addNotification('success', 'Service request rejected');
            await refreshData();
        } catch (error) {
            console.error('Failed to reject service request:', error);
            addNotification('error', 'Failed to reject service request');
        }
    };

    // Helper function to add notifications
    const addNotification = (type, message) => {
        const newNotification = {
            id: Date.now(),
            type,
            message,
            time: 'Just now'
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    };

    // Format duration for display
    const formatDuration = (duration) => {
        if (!duration) return '0 mins';

        // Handle ISO 8601 duration format (PT0S, PT1H30M, etc.)
        if (typeof duration === 'string' && duration.startsWith('PT')) {
            if (duration === 'PT0S') return '0 mins';

            // Parse ISO 8601 duration format
            const hours = duration.match(/(\d+)H/);
            const minutes = duration.match(/(\d+)M/);
            const seconds = duration.match(/(\d+(?:\.\d+)?)S/);

            const h = hours ? parseInt(hours[1]) : 0;
            const m = minutes ? parseInt(minutes[1]) : 0;
            const s = seconds ? Math.floor(parseFloat(seconds[1])) : 0;

            // Convert everything to minutes for display
            const totalMinutes = h * 60 + m + Math.floor(s / 60);

            if (totalMinutes === 0) return '0 mins';
            if (totalMinutes >= 60) {
                const displayHours = Math.floor(totalMinutes / 60);
                const displayMins = totalMinutes % 60;
                return displayMins > 0 ? `${displayHours}h ${displayMins}m` : `${displayHours}h`;
            }
            return `${totalMinutes} mins`;
        }

        // Handle numeric duration (assuming seconds)
        if (typeof duration === 'number') {
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);

            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            }
            return `${minutes} mins`;
        }

        return duration.toString();
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return '₨0';
        return `₨${parseFloat(amount).toLocaleString()}`;
    };

    // Transform current requests to upcoming appointments
    const transformRequestsToAppointments = (requests) => {
        return requests
            .filter(req => req.status === 'PENDING' || req.status === 'IN_PROGRESS')
            .slice(0, 3)
            .map(req => ({
                id: req.requestId,
                client: req.username || 'Unknown Client',
                service: req.serviceName || 'Service Request',
                time: req.appointmentTime ? new Date(req.appointmentTime).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                }) : 'Time TBD',
                location: req.userAddress || 'Address not specified',
                status: req.status,
                phone: req.userPhone,
                email: req.userEmail
            }));
    };

    const transformRequestsToActivities = (requests) => {
        const allRequests = [...currentRequests, ...previousRequests];
        return allRequests
            .sort((a, b) => new Date(b.appointmentTime || 0) - new Date(a.appointmentTime || 0))
            .slice(0, 4)
            .map(req => ({
                id: req.requestId,
                action: getActivityAction(req.status),
                client: req.username || 'Unknown Client',
                time: getRelativeTime(req.appointmentTime),
                status: req.status?.toLowerCase()
            }));
    };

    const getActivityAction = (status) => {
        switch (status) {
            case 'COMPLETED': return 'Service completed';
            case 'IN_PROGRESS': return 'Service in progress';
            case 'PENDING': return 'New booking received';
            case 'REJECTED': return 'Service declined';
            case 'CANCELLED': return 'Service cancelled';
            default: return 'Service request';
        }
    };

    const getRelativeTime = (dateString) => {
        if (!dateString) return 'Unknown time';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return 'Less than an hour ago';
        }
    };

    // Load all dashboard data
    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [overview, current, previous, pending, received] = await Promise.all([
                fetchDashboardOverview(),
                fetchCurrentRequests(),
                fetchPreviousRequests(),
                fetchPendingPayments(),
                fetchReceivedPayments()
            ]);

            setDashboardOverview(overview);
            setCurrentRequests(current);
            setPreviousRequests(previous);
            setPendingPayments(pending);
            setReceivedPayments(received);

            // Set initial notifications based on data
            const newNotifications = [];
            if (current.length > 0) {
                newNotifications.push({
                    id: 1,
                    type: 'info',
                    message: `${current.length} active service requests`,
                    time: 'Now'
                });
            }
            if (pending.length > 0) {
                newNotifications.push({
                    id: 2,
                    type: 'success',
                    message: `${pending.length} pending payments`,
                    time: 'Now'
                });
            }
            setNotifications(newNotifications);

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Refresh data
    const refreshData = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    };

    // Load data on component mount
    useEffect(() => {
        loadDashboardData();
    }, []);

    // Get metrics from dashboard overview or calculate from data
    const getMetrics = () => {
        if (dashboardOverview) {
            return {
                totalBookings: dashboardOverview.totalBookings || 0,
                activeRequests: dashboardOverview.activeBookings || 0,
                completedServices: dashboardOverview.completedBookings || 0,
                earnings: dashboardOverview.totalEarnings || 0,
                rating: dashboardOverview.averageRatingReceived || 0,
                responseTime: formatDuration(dashboardOverview.averageResponseTime)
            };
        }

        // Fallback calculation if overview is not available
        const totalBookings = previousRequests.length + currentRequests.length;
        const activeRequests = currentRequests.filter(req =>
            req.status === 'PENDING' || req.status === 'IN_PROGRESS'
        ).length;
        const completedServices = previousRequests.filter(req =>
            req.status === 'COMPLETED'
        ).length;
        const totalEarnings = receivedPayments.reduce((sum, payment) =>
            sum + (parseFloat(payment.amount) || 0), 0
        );

        return {
            totalBookings,
            activeRequests,
            completedServices,
            earnings: totalEarnings,
            rating: 0.0,
            responseTime: '0 mins'
        };
    };

    const metrics = getMetrics();
    const upcomingAppointments = transformRequestsToAppointments(currentRequests);
    const recentActivities = transformRequestsToActivities([...currentRequests, ...previousRequests]);

    const quickActions = [
        { icon: Plus, label: 'Add Service', action: () => console.log('Add service') },
        { icon: Calendar, label: 'Schedule', action: () => console.log('View schedule') },
        { icon: MessageSquare, label: 'Messages', action: () => console.log('View messages') },
        { icon: Settings, label: 'Settings', action: () => console.log('Open settings') }
    ];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'in_progress':
            case 'in-progress': return '#3b82f6';
            case 'rejected':
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} style={{ color: '#10b981' }} />;
            case 'warning': return <AlertCircle size={20} style={{ color: '#f59e0b' }} />;
            case 'error': return <AlertCircle size={20} style={{ color: '#ef4444' }} />;
            case 'info': return <Bell size={20} style={{ color: '#3b82f6' }} />;
            default: return <Bell size={20} />;
        }
    };

    if (loading) {
        return (
            <div className={styles['profile-content']}>
                <div className={styles['loading-container']}>
                    <RefreshCw className="animate-spin" size={32} />
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles['profile-content']}>
                <div className={styles['error-container']}>
                    <AlertCircle size={32} color="#ef4444" />
                    <p>{error}</p>
                    <button onClick={refreshData} className={styles['retry-btn']}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['profile-content']}>
            <div className={styles['profile-form']}>
                <div className={styles['profile-header']}>
                    <div className={styles['header-content']}>
                        <h1 className={styles['profile-title']}>Dashboard</h1>
                        <p className={styles['profile-subtitle']}>Welcome back! Here's what's happening with your services.</p>
                    </div>
                    <button
                        onClick={refreshData}
                        className={styles['refresh-btn']}
                        disabled={refreshing}
                    >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Quick Stats Section */}
                <section className={styles['form-section']}>
                    <h3 className={styles['section-title']}>
                        <BarChart3 size={20} style={{marginRight: '0.5rem'}} />
                        Overview
                    </h3>
                    <div className={styles['stats-grid']}>
                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#dbeafe' }}>
                                <Calendar size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{metrics.totalBookings}</div>
                                <div className={styles['stat-label']}>Total Bookings</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>All time</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#fef3c7' }}>
                                <Clock size={24} style={{ color: '#f59e0b' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{metrics.activeRequests}</div>
                                <div className={styles['stat-label']}>Active Requests</div>
                                <div className={`${styles['stat-change']} ${styles.neutral}`}>Current</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#d1fae5' }}>
                                <CheckCircle size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{metrics.completedServices}</div>
                                <div className={styles['stat-label']}>Completed Services</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>All time</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#dcfce7' }}>
                                <DollarSign size={24} style={{ color: '#16a34a' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{formatCurrency(metrics.earnings)}</div>
                                <div className={styles['stat-label']}>Total Earnings</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>Received</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#fef7cd' }}>
                                <Star size={24} style={{ color: '#eab308' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{parseFloat(metrics.rating).toFixed(1)}</div>
                                <div className={styles['stat-label']}>Average Rating</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>From reviews</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#e0e7ff' }}>
                                <Activity size={24} style={{ color: '#6366f1' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{metrics.responseTime}</div>
                                <div className={styles['stat-label']}>Avg Response Time</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>Average</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/*/!* Quick Actions *!/*/}
                {/*<section className={styles['form-section']}>*/}
                {/*    <h3 className={styles['section-title']}>Quick Actions</h3>*/}
                {/*    <div className={styles['quick-actions-grid']}>*/}
                {/*        {quickActions.map((action, index) => (*/}
                {/*            <button key={index} className={styles['quick-action-btn']} onClick={action.action}>*/}
                {/*                <action.icon size={24} />*/}
                {/*                <span>{action.label}</span>*/}
                {/*            </button>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</section>*/}

                {/* Upcoming Appointments */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            <Calendar size={20} style={{marginRight: '0.5rem'}} />
                            Upcoming Appointments ({upcomingAppointments.length})
                        </h3>
                        <button className={styles['add-btn']} onClick={() => navigate("/ServiceRequests")}>
                            <Eye size={16} />
                            View All
                        </button>
                    </div>
                    <div className={styles['appointments-list']}>
                        {upcomingAppointments.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <Calendar size={32} style={{ color: '#9ca3af' }} />
                                <p>No upcoming appointments</p>
                            </div>
                        ) : (
                            upcomingAppointments.map((appointment) => (
                                <div key={appointment.id} className={styles['appointment-card']}>
                                    <div className={styles['appointment-time']}>
                                        <Clock size={16} />
                                        <span>{appointment.time}</span>
                                    </div>
                                    <div className={styles['appointment-content']}>
                                        <div className={styles['appointment-service']}>{appointment.service}</div>
                                        <div className={styles['appointment-client']}>Client: {appointment.client}</div>
                                        <div className={styles['appointment-location']}>
                                            <MapPin size={14} />
                                            {appointment.location}
                                        </div>
                                        {appointment.phone && (
                                            <div className={styles['appointment-contact']}>
                                                <span> {appointment.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles['appointment-actions']}>
                                        {appointment.status === 'PENDING' && (
                                            <>
                                                <button
                                                    className={`${styles['action-btn']} ${styles.primary}`}
                                                    onClick={() => acceptServiceRequest(appointment.id)}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className={`${styles['action-btn']} ${styles.secondary}`}
                                                    onClick={() => rejectServiceRequest(appointment.id)}
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}
                                        {appointment.status === 'IN_PROGRESS' && (
                                            <span className={styles['status-badge']} style={{ backgroundColor: '#3b82f6' }}>
                                                In Progress
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Recent Activity */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            <Activity size={20} style={{marginRight: '0.5rem'}} />
                            Recent Activity
                        </h3>
                        <div className={styles['filter-controls']}>
                            <select
                                className={styles['time-filter']}
                                value={selectedTimeRange}
                                onChange={(e) => setSelectedTimeRange(e.target.value)}
                            >
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles['activity-list']}>
                        {recentActivities.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <Activity size={32} style={{ color: '#9ca3af' }} />
                                <p>No recent activity</p>
                            </div>
                        ) : (
                            recentActivities.map((activity) => (
                                <div key={activity.id} className={styles['activity-item']}>
                                    <div
                                        className={styles['activity-status']}
                                        style={{ backgroundColor: getStatusColor(activity.status) }}
                                    ></div>
                                    <div className={styles['activity-content']}>
                                        <div className={styles['activity-action']}>{activity.action}</div>
                                        <div className={styles['activity-details']}>
                                            <User size={14} />
                                            <span>{activity.client}</span>
                                            <span className={styles['activity-time']}>{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Notifications */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            <Bell size={20} style={{marginRight: '0.5rem'}} />
                            Notifications ({notifications.length})
                        </h3>
                        <button
                            className={styles['clear-all-btn']}
                            onClick={() => setNotifications([])}
                        >
                            Clear All
                        </button>
                    </div>
                    <div className={styles['notifications-list']}>
                        {notifications.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <Bell size={32} style={{ color: '#9ca3af' }} />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id} className={styles['notification-item']}>
                                    <div className={styles['notification-icon']}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className={styles['notification-content']}>
                                        <div className={styles['notification-message']}>{notification.message}</div>
                                        <div className={styles['notification-time']}>{notification.time}</div>
                                    </div>
                                    <button
                                        className={styles['notification-close']}
                                        onClick={() => setNotifications(prev =>
                                            prev.filter(n => n.id !== notification.id)
                                        )}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Performance Chart Placeholder */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            <TrendingUp size={20} style={{marginRight: '0.5rem'}} />
                            Performance Trends
                        </h3>
                        <div className={styles['chart-controls']}>
                            <button className={`${styles['chart-btn']} ${styles.active}`}>Bookings</button>
                            <button className={styles['chart-btn']}>Revenue</button>
                            <button className={styles['chart-btn']}>Rating</button>
                        </div>
                    </div>
                    <div className={styles['chart-placeholder']}>
                        <div className={styles['chart-icon']}>
                            <BarChart3 size={48} style={{ color: '#9ca3af' }} />
                        </div>
                        <div className={styles['chart-message']}>
                            <h4>Performance Chart</h4>
                            <p>Your booking trends and performance metrics will be displayed here.</p>
                            <p>Total Services: {metrics.totalBookings} | Completion Rate: {metrics.totalBookings > 0 ? Math.round((metrics.completedServices / metrics.totalBookings) * 100) : 0}%</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TechnicianDashboard;
