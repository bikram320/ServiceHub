import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    Users,
    Wrench,
    AlertTriangle,
    DollarSign,
    Star,
    Activity,
    Eye,
    X,
    Check
} from 'lucide-react';
import styles from '../../styles/AdminDashboard.module.css';

const AdminDashboard = ({ sidebarCollapsed = false }) => {
    const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [liveServices, setLiveServices] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Dashboard overview state
    const [dashboardOverview, setDashboardOverview] = useState({
        totalUsers: 0,
        activeTechnicians: 0,
        pendingApprovals: 0,
        monthlyRevenue: 0,
        platformRating: 0,
        activeServices: 0
    });

    // Reports data state
    const [reportsData, setReportsData] = useState([]);

    // Recent activity state
    const [recentActivity, setRecentActivity] = useState([]);

    // API base URL
    const API_BASE_URL = "http://localhost:8080";

    // Get authorization headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    // KPI data - now dynamic
    const kpiData = [
        {
            label: 'Total Users',
            value: dashboardOverview.totalUsers.toLocaleString(),
            change: '+12.5%',
            icon: Users,
            color: '#3b82f6',
            bgColor: '#dbeafe'
        },
        {
            label: 'Active Technicians',
            value: dashboardOverview.activeTechnicians.toString(),
            change: '+15',
            icon: Wrench,
            color: '#8b5cf6',
            bgColor: '#f3e8ff'
        },
        {
            label: 'Pending Approvals',
            value: pendingApprovals.length.toString(),
            change: 'Action needed',
            icon: AlertTriangle,
            color: '#f59e0b',
            bgColor: '#fef3c7'
        },
        {
            label: 'Monthly Revenue',
            value: `₨${(dashboardOverview.monthlyRevenue / 1000).toFixed(1)}K`,
            change: '+18%',
            icon: DollarSign,
            color: '#16a34a',
            bgColor: '#dcfce7'
        },
        {
            label: 'Platform Rating',
            value: dashboardOverview.platformRating.toFixed(1),
            change: '+0.2',
            icon: Star,
            color: '#eab308',
            bgColor: '#fef7cd'
        },
        {
            label: 'Active Services',
            value: liveServices.length.toString(),
            change: 'Live',
            icon: Activity,
            color: '#10b981',
            bgColor: '#d1fae5'
        }
    ];

    // API functions
    const fetchDashboardOverview = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/dashboard-overview`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error('Failed to fetch dashboard overview');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            throw error;
        }
    };

    const fetchPendingApprovals = async () => {
        try {
            console.log('Fetching pending approvals with headers:', getAuthHeaders());

            const [usersResponse, techniciansResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/users-request`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                }),
                fetch(`${API_BASE_URL}/admin/technicians-request`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                })
            ]);

            console.log('Users response status:', usersResponse.status);
            console.log('Technicians response status:', techniciansResponse.status);

            // Handle users response
            let users = [];
            if (usersResponse.ok) {
                users = await usersResponse.json();
            } else if (usersResponse.status === 401) {
                throw new Error('Unauthorized - Please login again');
            } else {
                console.warn('Failed to fetch users, continuing with empty list');
            }

            // Handle technicians response
            let technicians = [];
            if (techniciansResponse.ok) {
                technicians = await techniciansResponse.json();
            } else if (techniciansResponse.status === 401) {
                throw new Error('Unauthorized - Please login again');
            } else {
                console.warn('Failed to fetch technicians (possibly none pending), continuing with empty list');
            }

            console.log('Fetched users:', users);
            console.log('Fetched technicians:', technicians);

            return [...transformUserApprovals(users), ...transformTechnicianApprovals(technicians)];
        } catch (error) {
            console.error('Error fetching pending approvals:', error);
            // Return empty array instead of throwing - allows dashboard to load
            return [];
        }
    };

    const fetchLiveServices = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/track-service-request`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized - Please login again');
                }
                throw new Error('Failed to fetch live services');
            }
            const data = await response.json();

            // Filter only active services (IN_PROGRESS or ACCEPTED)
            return data
                .filter(service => service.status === 'IN_PROGRESS' || service.status === 'ACCEPTED')
                .map(service => transformServiceData(service));
        } catch (error) {
            console.error('Error fetching live services:', error);
            return [];
        }
    };

    const fetchReportsSnapshot = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/reports-snapshot`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized - Please login again');
                }
                throw new Error('Failed to fetch reports');
            }
            const data = await response.json();

            return [
                { title: 'Daily Revenue', value: `₨${data.dailyRevenue?.toLocaleString() || '0'}`, change: data.revenueChange || '+0%' },
                { title: 'Completion Rate', value: data.completionRate || '0%', change: data.completionRateChange || '+0%' },
                { title: 'User Satisfaction', value: data.userSatisfaction || '0/5', change: data.satisfactionChange || '+0' },
                { title: 'Platform Usage', value: data.platformUsage || '0%', change: data.platformUsageChange || '+0%' }
            ];
        } catch (error) {
            console.error('Error fetching reports:', error);
            return [];
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/recent-activity`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized - Please login again');
                }
                throw new Error('Failed to fetch recent activity');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching recent activity:', error);
            return [];
        }
    };

    // Transform functions
    const transformUserApprovals = (users) => {
        return users.map((user, index) => {
            // Log the user object to see what properties are available
            console.log('User object:', user);

            // Try different possible property name combinations
            const name = user.username|| 'Unknown';
            const email = user.email || 'N/A';
            const address = user.address || user.location || user.city || 'N/A';

            return {
                id: user.id || user.userId || `user-${index}`,
                name: `${name}`,
                email: email,
                type: 'User',
                location: address,
                date: new Date().toISOString().split('T')[0]
            };
        });
    };

    const transformTechnicianApprovals = (technicians) => {
        return technicians.map((tech, index) => {
            // Log the technician object to see what properties are available
            console.log('Technician object:', tech);

            // Try different possible property name combinations
            const name = tech.name || 'Unknown';
            const email = tech.email || 'N/A';
            const address = tech.address || tech.location || tech.city || 'N/A';
            const service = tech.serviceName || tech.specialization || 'General';

            return {
                id: tech.id || tech.technicianId || `tech-${index}`,
                name: `${name}`,
                email: email,
                type: 'Technician',
                location: address,
                specialization: service
            };
        });
    };

    const transformServiceData = (service) => {
        const statusMap = {
            'IN_PROGRESS': 'In Progress',
            'ACCEPTED': 'Scheduled',
            'COMPLETED': 'Completed'
        };

        return {
            id: service.requestId,
            type: service.serviceName,
            client: service.userName,
            technician: service.technicianName,
            location: service.address || 'N/A',
            status: statusMap[service.status] || service.status,
            amount: `₨${service.feeCharge?.toLocaleString() || '0'}`
        };
    };

    // Load all data
    useEffect(() => {
        const loadAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if token exists
                const token = localStorage.getItem('adminToken');
                console.log('Admin token present:', !!token);

                if (!token) {
                    throw new Error('No authentication token found. Please login.');
                }

                const [overview, approvals, services, reports, activity] = await Promise.all([
                    fetchDashboardOverview(),
                    fetchPendingApprovals(),
                    fetchLiveServices(),
                    fetchReportsSnapshot(),
                    fetchRecentActivity()
                ]);

                setDashboardOverview(overview);
                setPendingApprovals(approvals);
                setLiveServices(services);
                setReportsData(reports);
                setRecentActivity(activity);

            } catch (error) {
                setError(error.message);
                console.error('Error loading dashboard data:', error);

                // If unauthorized, clear token and redirect
                if (error.message.includes('Unauthorized') || error.message.includes('401')) {
                    localStorage.removeItem('adminToken');
                    addNotification('Session expired. Please login again.', 'error');
                }
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    // Helper functions
    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return '#8b5cf6';
            case 'Scheduled': return '#06b6d4';
            case 'Completed': return '#10b981';
            default: return '#6b7280';
        }
    };

    const handleRefresh = async () => {
        setRefreshTime(new Date().toLocaleTimeString());
        addNotification('Refreshing dashboard...', 'info');

        try {
            const [overview, approvals, services, reports, activity] = await Promise.all([
                fetchDashboardOverview(),
                fetchPendingApprovals(),
                fetchLiveServices(),
                fetchReportsSnapshot(),
                fetchRecentActivity()
            ]);

            setDashboardOverview(overview);
            setPendingApprovals(approvals);
            setLiveServices(services);
            setReportsData(reports);
            setRecentActivity(activity);

            addNotification('Dashboard refreshed successfully', 'success');
        } catch (error) {
            addNotification('Failed to refresh dashboard', 'error');
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

    // Loading state
    if (loading) {
        return (
            <div className={styles['admin-dashboard']}>
                <div className={styles['dashboard-container']}>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div>Loading dashboard...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles['admin-dashboard']}>
                <div className={styles['dashboard-container']}>
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        margin: '2rem'
                    }}>
                        <div style={{ color: '#dc2626', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Error Loading Dashboard</div>
                            <div>{error}</div>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
            <div className={styles['admin-dashboard']}>
            {/* Notifications */}
            <div className={styles.notifications}>
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`${styles.notification} ${styles[`notification-${notification.type}`]}`}
                    >
                        <p className={styles['notification-message']}>{notification.message}</p>
                    </div>
                ))}
            </div>

            <div className={styles['dashboard-container']}>
                {/* Header */}
                <div className={styles['dashboard-header']}>
                    <div className={styles['dashboard-header-top']}>
                        <h1 className={styles['dashboard-title']}>Admin Dashboard</h1>
                        <button onClick={handleRefresh} className={styles['refresh-btn']}>
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                    <p className={styles['last-updated']}>Monitor platform operations • Last updated: {refreshTime}</p>
                </div>

                {/* KPIs / Summary Cards */}
                <section className={styles['kpi-section']}>
                    {kpiData.map((kpi, index) => {
                        const IconComponent = kpi.icon;
                        return (
                            <div key={index} className={styles['kpi-card']}>
                                <div className={styles['kpi-icon']} style={{ backgroundColor: kpi.bgColor }}>
                                    <IconComponent size={24} style={{ color: kpi.color }} />
                                </div>
                                <div>
                                    <div className={styles['kpi-value']}>{kpi.value}</div>
                                    <div className={styles['kpi-label']}>{kpi.label}</div>
                                    <div className={styles['kpi-change']}>{kpi.change}</div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <div className={styles['grid-two']}>
                    {/* Pending Approvals Widget */}
                    <section className={styles.card}>
                        <div className={styles['card-header']}>
                            <h3 className={styles['card-title']}>Pending Approvals ({pendingApprovals.length})</h3>
                        </div>
                        <div className={styles['card-list']}>
                            {pendingApprovals.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                    No pending approvals
                                </div>
                            ) : (
                                pendingApprovals.map((approval) => (
                                    <div key={approval.id} className={styles['list-item']}>
                                        <div style={{ flex: 1 }}>
                                            <div className={styles['item-name']}>{approval.name}</div>
                                            <div className={styles['item-meta']}>
                                                {approval.type} • {approval.location}
                                                {approval.specialization && ` • ${approval.specialization}`}
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: '#fef3c7',
                                            color: '#92400e',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            Pending
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {pendingApprovals.length > 0}
                    </section>

                    {/* Live Services Overview */}
                    <section className={styles.card}>
                        <div className={styles['card-header']}>
                            <h3 className={styles['card-title']}>Live Services ({liveServices.length})</h3>
                            <div className={styles['live-indicator']}>
                                <span className={styles['pulse-dot']}></span>
                                <span className={styles['live-text']}>LIVE</span>
                            </div>
                        </div>
                        <div className={styles['card-list']}>
                            {liveServices.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                    No active services
                                </div>
                            ) : (
                                liveServices.map((service) => (
                                    <div key={service.id} className={styles['service-item']} style={{ borderLeftColor: getStatusColor(service.status) }}>
                                        <div className={styles['service-top']}>
                                            <div className={styles['service-type']}>{service.type}</div>
                                            <div className={styles['service-amount']}>{service.amount}</div>
                                        </div>
                                        <div className={styles['service-bottom']}>
                                            <div className={styles['service-meta']}>{service.client} • {service.technician}</div>
                                            <div className={styles['service-status']}>
                                                <span style={{ color: getStatusColor(service.status) }}>{service.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className={styles['grid-two']}>
                    {/* Reports Snapshot */}
                    <section className={styles.card}>
                        <h3 className={styles['card-title']}>Today's Performance</h3>
                        <div className={styles['reports-grid']}>
                            {reportsData.map((report, index) => (
                                <div key={index} className={styles['report-card']}>
                                    <div className={styles['report-value']}>{report.value}</div>
                                    <div className={styles['report-title']}>{report.title}</div>
                                    <div className={styles['report-change']}>{report.change}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity Feed */}
                    <section className={styles.card}>
                        <h3 className={styles['card-title']}>Recent Activity</h3>
                        <div className={styles['activity-list']}>
                            {recentActivity.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                    No recent activity
                                </div>
                            ) : (
                                recentActivity.map((activity, index) => (
                                    <div key={index} className={styles['activity-item']}>
                                        <div className={styles['activity-dot']}></div>
                                        <div>
                                            <div className={styles['activity-msg']}>{activity.message}</div>
                                            <div className={styles['activity-time']}>{activity.time}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;