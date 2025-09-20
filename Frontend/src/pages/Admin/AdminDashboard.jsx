import React, { useState } from 'react';
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

const AdminDashboard = () => {
    const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());
    const [pendingApprovals, setPendingApprovals] = useState([
        { id: 1, name: 'Rajesh Kumar', type: 'User', location: 'Kathmandu', date: '2024-11-15' },
        { id: 2, name: 'Dipesh Thapa', type: 'Technician', location: 'Lalitpur', specialization: 'Plumbing' },
        { id: 3, name: 'Sita Sharma', type: 'User', location: 'Pokhara', date: '2024-11-14' }
    ]);
    const [liveServices, setLiveServices] = useState([
        { id: 1, type: 'Home Cleaning', client: 'John D.', technician: 'Sarah W.', location: 'Thamel', status: 'In Progress', amount: '₨2,500' },
        { id: 2, type: 'Plumbing', client: 'Alice C.', technician: 'Ram S.', location: 'Patan', status: 'Scheduled', amount: '₨1,800' }
    ]);
    const [notifications, setNotifications] = useState([]);

    // Compact KPI data
    const kpiData = [
        { label: 'Total Users', value: '1,247', change: '+12.5%', icon: Users, color: '#3b82f6', bgColor: '#dbeafe' },
        { label: 'Active Technicians', value: '156', change: '+15', icon: Wrench, color: '#8b5cf6', bgColor: '#f3e8ff' },
        { label: 'Pending Approvals', value: pendingApprovals.length.toString(), change: 'Action needed', icon: AlertTriangle, color: '#f59e0b', bgColor: '#fef3c7' },
        { label: 'Monthly Revenue', value: '₨125.4K', change: '+18%', icon: DollarSign, color: '#16a34a', bgColor: '#dcfce7' },
        { label: 'Platform Rating', value: '4.6', change: '+0.2', icon: Star, color: '#eab308', bgColor: '#fef7cd' },
        { label: 'Active Services', value: liveServices.length.toString(), change: 'Live', icon: Activity, color: '#10b981', bgColor: '#d1fae5' }
    ];

    // Reports snapshot
    const reportsData = [
        { title: 'Daily Revenue', value: '₨15,750', change: '+8.2%' },
        { title: 'Completion Rate', value: '94.2%', change: '+2.1%' },
        { title: 'User Satisfaction', value: '4.6/5', change: '+0.1' },
        { title: 'Platform Usage', value: '78.5%', change: '+5.3%' }
    ];

    // Recent activity
    const recentActivity = [
        { id: 1, message: 'New user registered: Rajesh Kumar', time: '2 min ago', type: 'user' },
        { id: 2, message: 'Service completed: Home Cleaning', time: '15 min ago', type: 'success' },
        { id: 3, message: 'New technician application: Dipesh Thapa', time: '1h ago', type: 'pending' },
        { id: 4, message: 'Payment processed: ₨2,500', time: '2h ago', type: 'revenue' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return '#8b5cf6';
            case 'Scheduled': return '#06b6d4';
            case 'Completed': return '#10b981';
            default: return '#6b7280';
        }
    };

    const handleRefresh = () => {
        setRefreshTime(new Date().toLocaleTimeString());
        addNotification('Dashboard refreshed successfully', 'success');
    };

    const handleApprove = (approvalId) => {
        const approval = pendingApprovals.find(a => a.id === approvalId);
        setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
        addNotification(`${approval.name} has been approved as ${approval.type}`, 'success');
    };

    const handleReject = (approvalId) => {
        const approval = pendingApprovals.find(a => a.id === approvalId);
        setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
        addNotification(`${approval.name}'s application has been rejected`, 'warning');
    };

    const handleViewAllApprovals = () => {
        addNotification('Opening detailed approvals view...', 'info');
    };

    const addNotification = (message, type) => {
        const newNotification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);

        // Auto-remove notification after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 3000);
    };

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
                            <button className={styles['icon-btn']} onClick={handleViewAllApprovals}>
                                <Eye size={16} />
                            </button>
                        </div>
                        <div className={styles['card-list']}>
                            {pendingApprovals.map((approval) => (
                                <div key={approval.id} className={styles['list-item']}>
                                    <div>
                                        <div className={styles['item-name']}>{approval.name}</div>
                                        <div className={styles['item-meta']}>
                                            {approval.type} • {approval.location}
                                            {approval.specialization && ` • ${approval.specialization}`}
                                        </div>
                                    </div>
                                    <div className={styles['item-actions']}>
                                        <button
                                            className={styles['btn-reject']}
                                            onClick={() => handleReject(approval.id)}
                                        >
                                            <X size={14} />
                                        </button>
                                        <button
                                            className={styles['btn-approve']}
                                            onClick={() => handleApprove(approval.id)}
                                        >
                                            <Check size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                            {liveServices.map((service) => (
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
                            ))}
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
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className={styles['activity-item']}>
                                    <div className={styles['activity-dot']}></div>
                                    <div>
                                        <div className={styles['activity-msg']}>{activity.message}</div>
                                        <div className={styles['activity-time']}>{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;