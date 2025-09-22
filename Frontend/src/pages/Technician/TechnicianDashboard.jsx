// import React, { useState, useEffect } from 'react';
// import {
//     BarChart3,
//     TrendingUp,
//     Calendar,
//     Clock,
//     User,
//     MapPin,
//     Bell,
//     Settings,
//     Activity,
//     DollarSign,
//     CheckCircle,
//     AlertCircle,
//     Plus,
//     Filter,
//     Download,
//     Eye,
//     Star,
//     MessageSquare
// } from 'lucide-react';
// import "../../styles/TechnicianDashboard.module.css";
// // import "../../styles/UserDashboard.module.css";
// import Header2 from "../../Components/layout/Header2.jsx";
// import StatCard from '../../Components/Dashboard/StatCard';
// import ActivityItem from '../../Components/Dashboard/ActivityItem';
// import AppointmentCard from '../../Components/Dashboard/AppointmentCard';
// import EmptyState from '../../Components/Dashboard/EmptyState.jsx';
// import NotificationItem from '../../Components/Dashboard/NotificationItem';
// import PendingApproval from '../../Components/Dashboard/PendingApproval';
// import QuickActionButton from "../../Components/Dashboard/QuickActionButton.jsx";
// import ServiceCard from "../../Components/Dashboard/ServiceCard.jsx";
// import StarRating from '../../Components/Dashboard/StarRating';
// import SectionHeader from "../../Components/Dashboard/SectionHeader.jsx";
// import LiveServiceItem from "../../Components/Dashboard/LiveServices.jsx";
// import ReportCard from "../../Components/Dashboard/ReportCard.jsx";


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
import styles from '../../styles/TechnicianDashboard.module.css';

const TechnicianDashboard = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('week');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // State for dynamic data
    const [currentRequests, setCurrentRequests] = useState([]);
    const [previousRequests, setPreviousRequests] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [receivedPayments, setReceivedPayments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [technicianProfile, setTechnicianProfile] = useState(null);

    // Get technician email from localStorage or context
    const getTechnicianEmail = () => {
        // This should come from your auth context or localStorage
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
                credentials: 'include', // Include cookies
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

    // API functions
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
            await apiCall('/technician/accept-service-request', {
                method: 'POST',
                body: JSON.stringify({ requestId })
            });

            // Show success notification
            addNotification('success', 'Service request accepted successfully');

            // Refresh data
            await refreshData();
        } catch (error) {
            console.error('Failed to accept service request:', error);
            addNotification('error', 'Failed to accept service request');
        }
    };

    const rejectServiceRequest = async (requestId) => {
        try {
            await apiCall('/technician/reject-service-request', {
                method: 'POST',
                body: JSON.stringify({ requestId })
            });

            // Show success notification
            addNotification('success', 'Service request rejected');

            // Refresh data
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
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    };

    // Calculate metrics from real data
    const calculateMetrics = () => {
        const totalBookings = previousRequests.length + currentRequests.length;
        const activeRequests = currentRequests.filter(req => req.status === 'PENDING' || req.status === 'ACCEPTED').length;
        const completedServices = previousRequests.filter(req => req.status === 'COMPLETED').length;

        // Calculate total earnings from received payments
        const totalEarnings = receivedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

        // Calculate average rating from completed services with feedback
        const ratedServices = previousRequests.filter(req => req.rating && req.rating > 0);
        const averageRating = ratedServices.length > 0
            ? (ratedServices.reduce((sum, req) => sum + req.rating, 0) / ratedServices.length).toFixed(1)
            : '0.0';

        // Calculate average response time (mock for now)
        const responseTime = '12 mins'; // This would need to be calculated from actual response times

        return {
            totalBookings,
            activeRequests,
            completedServices,
            earnings: totalEarnings,
            rating: parseFloat(averageRating),
            responseTime
        };
    };

    // Transform API data for display
    const transformRequestsToAppointments = (requests) => {
        return requests
            .filter(req => req.status === 'PENDING' || req.status === 'ACCEPTED')
            .slice(0, 3) // Show only first 3
            .map(req => ({
                id: req.id,
                client: req.user?.name || 'Unknown Client',
                service: req.serviceType || 'Service Request',
                time: new Date(req.requestedDateTime).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                }),
                location: req.location || 'Location not specified',
                status: req.status
            }));
    };

    const transformRequestsToActivities = (requests) => {
        const allRequests = [...currentRequests, ...previousRequests];
        return allRequests
            .sort((a, b) => new Date(b.createdAt || b.requestedDateTime) - new Date(a.createdAt || a.requestedDateTime))
            .slice(0, 4)
            .map(req => ({
                id: req.id,
                action: getActivityAction(req.status),
                client: req.user?.name || 'Unknown Client',
                time: getRelativeTime(req.createdAt || req.requestedDateTime),
                status: req.status?.toLowerCase()
            }));
    };

    const getActivityAction = (status) => {
        switch (status) {
            case 'COMPLETED': return 'Service completed';
            case 'ACCEPTED': return 'Service accepted';
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
            const [current, previous, pending, received] = await Promise.all([
                fetchCurrentRequests(),
                fetchPreviousRequests(),
                fetchPendingPayments(),
                fetchReceivedPayments()
            ]);

            setCurrentRequests(current);
            setPreviousRequests(previous);
            setPendingPayments(pending);
            setReceivedPayments(received);

            // Set initial notifications
            if (notifications.length === 0) {
                setNotifications([
                    { id: 1, type: 'info', message: `${current.length} active service requests`, time: 'Now' },
                    { id: 2, type: 'success', message: `${pending.length} pending payments`, time: 'Now' }
                ]);
            }

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

    // Calculate current metrics
    const metrics = calculateMetrics();
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
            case 'accepted':
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
                                <div className={styles['stat-number']}>₨{metrics.earnings.toLocaleString()}</div>
                                <div className={styles['stat-label']}>Total Earnings</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>Received</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#fef7cd' }}>
                                <Star size={24} style={{ color: '#eab308' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{metrics.rating || '0.0'}</div>
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
                                <div className={`${styles['stat-change']} ${styles.positive}`}>Estimated</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className={styles['form-section']}>
                    <h3 className={styles['section-title']}>Quick Actions</h3>
                    <div className={styles['quick-actions-grid']}>
                        {quickActions.map((action, index) => (
                            <button key={index} className={styles['quick-action-btn']} onClick={action.action}>
                                <action.icon size={24} />
                                <span>{action.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Upcoming Appointments */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            <Calendar size={20} style={{marginRight: '0.5rem'}} />
                            Upcoming Appointments ({upcomingAppointments.length})
                        </h3>
                        <button className={styles['add-btn']}>
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
                                        {appointment.status === 'ACCEPTED' && (
                                            <span className={styles['status-badge']}>Accepted</span>
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

// const TechnicianDashboard = () => {
//     const [selectedTimeRange, setSelectedTimeRange] = useState('week');
//     const [notifications, setNotifications] = useState([
//         { id: 1, type: 'success', message: 'Profile verification completed', time: '2 hours ago' },
//         { id: 2, type: 'info', message: 'New service request received', time: '4 hours ago' },
//         { id: 3, type: 'warning', message: 'Update your availability', time: '1 day ago' }
//     ]);
//
//     const metrics = [
//         { icon: Calendar, value: '24', label: 'Total Bookings', change: '+12% this month', color: '#3b82f6', bgColor: '#dbeafe' },
//         { icon: Clock, value: '3', label: 'Active Requests', change: 'No change', color: '#f59e0b', bgColor: '#fef3c7' },
//         { icon: CheckCircle, value: '21', label: 'Completed Services', change: '+8% this week', color: '#10b981', bgColor: '#d1fae5' },
//         { icon: DollarSign, value: '₨2,850', label: 'Total Earnings', change: '+15% this month', color: '#16a34a', bgColor: '#dcfce7' },
//         { icon: Star, value: '4.8', label: 'Average Rating', change: '+0.2 this month', color: '#eab308', bgColor: '#fef7cd' },
//         { icon: Activity, value: '12 mins', label: 'Avg Response Time', change: '-3 mins this week', color: '#6366f1', bgColor: '#e0e7ff' }
//     ];
//
//     const quickActions = [
//         { icon: Plus, label: 'Add Service', action: () => console.log('Add service') },
//         { icon: Calendar, label: 'Schedule', action: () => console.log('View schedule') },
//         { icon: MessageSquare, label: 'Messages', action: () => console.log('View messages') },
//         { icon: Settings, label: 'Settings', action: () => console.log('Open settings') }
//     ];
//
//     const upcomingAppointments = [
//         { id: 1, client: 'Alice Cooper', service: 'Home Cleaning', time: 'Today, 2:00 PM', location: 'Thamel, Kathmandu', date: 'Today', price: '₨2,500', status: 'confirmed' },
//         { id: 2, client: 'Bob Smith', service: 'Plumbing Repair', time: 'Tomorrow, 10:00 AM', location: 'Patan, Lalitpur', date: 'Tomorrow', price: '₨1,800', status: 'pending' },
//         { id: 3, client: 'Carol Davis', service: 'Garden Maintenance', time: 'Nov 18, 9:00 AM', location: 'Bhaktapur', date: 'Nov 18', price: '₨1,200', status: 'confirmed' }
//     ];
//
//     const recentActivities = [
//         { id: 1, action: 'Service completed', client: 'John Doe', time: '2 hours ago', status: 'completed' },
//         { id: 2, action: 'New booking received', client: 'Sarah Wilson', time: '4 hours ago', status: 'pending' },
//         { id: 3, action: 'Payment received', client: 'Mike Johnson', time: '1 day ago', status: 'completed' },
//         { id: 4, action: 'Service request', client: 'Emma Brown', time: '2 days ago', status: 'in-progress' }
//     ];
//
//     const handleNotificationClose = (notificationId) => {
//         setNotifications(prev => prev.filter(n => n.id !== notificationId));
//     };
//
//     const handleAppointmentAction = (action, appointmentId) => {
//         console.log(`${action} appointment ${appointmentId}`);
//     };
//
//     return (
//         <div>
//             <Header2 />
//         <div className="profile-content">
//             <div className="profile-form">
//                 <div className="profile-header">
//                     <h1 className="profile-title">Dashboard</h1>
//                     <p className="profile-subtitle">Welcome back! Here's what's happening with your services.</p>
//                 </div>
//
//                 {/* Metrics */}
//                 <section className="form-section">
//                     <SectionHeader title="Overview" icon={BarChart3} />
//                     <div className="stats-grid">
//                         {metrics.map((metric, index) => (
//                             <StatCard key={index} {...metric} />
//                         ))}
//                     </div>
//                 </section>
//
//                 {/* Quick Actions */}
//                 <section className="form-section">
//                     <h3 className="section-title">Quick Actions</h3>
//                     <div className="quick-actions-grid">
//                         {quickActions.map((action, index) => (
//                             <QuickActionButton key={index} {...action} onClick={action.action} />
//                         ))}
//                     </div>
//                 </section>
//
//                 {/* Upcoming Appointments */}
//                 <section className="form-section">
//                     <SectionHeader
//                         title="Upcoming Appointments"
//                         icon={Calendar}
//                         actions={
//                             <button className="add-btn">
//                                 <Eye size={16} />
//                                 View All
//                             </button>
//                         }
//                     />
//                     <div className="appointments-list">
//                         {upcomingAppointments.map((appointment) => (
//                             <AppointmentCard
//                                 key={appointment.id}
//                                 appointment={appointment}
//                                 type="technician"
//                                 onAction={handleAppointmentAction}
//                             />
//                         ))}
//                     </div>
//                 </section>
//
//                 {/* Recent Activity */}
//                 <section className="form-section">
//                     <SectionHeader
//                         title="Recent Activity"
//                         icon={Activity}
//                         actions={
//                             <select
//                                 className="time-filter"
//                                 value={selectedTimeRange}
//                                 onChange={(e) => setSelectedTimeRange(e.target.value)}
//                             >
//                                 <option value="day">Today</option>
//                                 <option value="week">This Week</option>
//                                 <option value="month">This Month</option>
//                             </select>
//                         }
//                     />
//                     <div className="activity-list">
//                         {recentActivities.map((activity) => (
//                             <ActivityItem key={activity.id} activity={activity} />
//                         ))}
//                     </div>
//                 </section>
//
//                 {/* Notifications */}
//                 <section className="form-section">
//                     <SectionHeader
//                         title="Notifications"
//                         icon={Bell}
//                         actions={<button className="clear-all-btn">Clear All</button>}
//                     />
//                     <div className="notifications-list">
//                         {notifications.map((notification) => (
//                             <NotificationItem
//                                 key={notification.id}
//                                 notification={notification}
//                                 onClose={handleNotificationClose}
//                             />
//                         ))}
//                     </div>
//                 </section>
//
//                 {/* Performance Chart Placeholder */}
//                 <section className="form-section">
//                     <SectionHeader
//                         title="Performance Trends"
//                         icon={TrendingUp}
//                         actions={
//                             <div className="chart-controls">
//                                 <button className="chart-btn active">Bookings</button>
//                                 <button className="chart-btn">Revenue</button>
//                                 <button className="chart-btn">Rating</button>
//                             </div>
//                         }
//                     />
//                     <div className="chart-placeholder">
//                         <div className="chart-icon">
//                             <BarChart3 size={48} style={{ color: '#9ca3af' }} />
//                         </div>
//                         <div className="chart-message">
//                             <h4>Performance Chart</h4>
//                             <p>Your booking trends and performance metrics will be displayed here.</p>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </div>
//         </div>
//     );
// };
//
// export default TechnicianDashboard;