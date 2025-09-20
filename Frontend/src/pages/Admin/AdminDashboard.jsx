import React, { useState } from 'react';
import Header2 from "../../Components/layout/Header2.jsx";
import {
    Users,
    UserCheck,
    Activity,
    DollarSign,
    TrendingUp,
    Star,
    AlertTriangle,
    Clock,
    MapPin,
    Eye,
    Check,
    X,
    RefreshCw,
    Home,
    Wrench,
    MessageSquare
} from 'lucide-react';
import '../../styles/AdminDashboard.css';
import "../../styles/UserDashboard.module.css";
import StatCard from '../../Components/Dashboard/StatCard';
import ActivityItem from '../../Components/Dashboard/ActivityItem';
import AppointmentCard from '../../Components/Dashboard/AppointmentCard';
import EmptyState from '../../Components/Dashboard/EmptyState.jsx';
import NotificationItem from '../../Components/Dashboard/NotificationItem';
import PendingApproval from '../../Components/Dashboard/PendingApproval';
import QuickActionButton from "../../Components/Dashboard/QuickActionButton.jsx";
import ServiceCard from "../../Components/Dashboard/ServiceCard.jsx";
import StarRating from '../../Components/Dashboard/StarRating';
import SectionHeader from "../../Components/Dashboard/SectionHeader.jsx";
import LiveServiceItem from "../../Components/Dashboard/LiveServices.jsx";
import ReportCard from "../../Components/Dashboard/ReportCard.jsx";

// const AdminDashboard = () => {
//     const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());
//
//     // Compact KPI data
//     const kpiData = [
//         { label: 'Total Users', value: '1,247', change: '+12.5%', icon: Users, color: '#3b82f6', bgColor: '#dbeafe' },
//         { label: 'Active Technicians', value: '156', change: '+15', icon: Wrench, color: '#8b5cf6', bgColor: '#f3e8ff' },
//         { label: 'Pending Approvals', value: '31', change: 'Action needed', icon: AlertTriangle, color: '#f59e0b', bgColor: '#fef3c7' },
//         { label: 'Monthly Revenue', value: '₨125.4K', change: '+18%', icon: DollarSign, color: '#16a34a', bgColor: '#dcfce7' },
//         { label: 'Platform Rating', value: '4.6', change: '+0.2', icon: Star, color: '#eab308', bgColor: '#fef7cd' },
//         { label: 'Active Services', value: '89', change: 'Live', icon: Activity, color: '#10b981', bgColor: '#d1fae5' }
//     ];
//
//     // Compact pending approvals
//     const pendingApprovals = [
//         { id: 1, name: 'Rajesh Kumar', type: 'User', location: 'Kathmandu', date: '2024-11-15' },
//         { id: 2, name: 'Dipesh Thapa', type: 'Technician', location: 'Lalitpur', specialization: 'Plumbing' },
//         { id: 3, name: 'Sita Sharma', type: 'User', location: 'Pokhara', date: '2024-11-14' }
//     ];
//
//     // Live services summary
//     const liveServices = [
//         { id: 1, type: 'Home Cleaning', client: 'John D.', technician: 'Sarah W.', location: 'Thamel', status: 'In Progress', amount: '₨2,500' },
//         { id: 2, type: 'Plumbing', client: 'Alice C.', technician: 'Ram S.', location: 'Patan', status: 'Scheduled', amount: '₨1,800' }
//     ];
//
//     // Reports snapshot
//     const reportsData = [
//         { title: 'Daily Revenue', value: '₨15,750', change: '+8.2%' },
//         { title: 'Completion Rate', value: '94.2%', change: '+2.1%' },
//         { title: 'User Satisfaction', value: '4.6/5', change: '+0.1' },
//         { title: 'Platform Usage', value: '78.5%', change: '+5.3%' }
//     ];
//
//     // Recent activity
//     const recentActivity = [
//         { id: 1, message: 'New user registered: Rajesh Kumar', time: '2 min ago', type: 'user' },
//         { id: 2, message: 'Service completed: Home Cleaning', time: '15 min ago', type: 'success' },
//         { id: 3, message: 'New technician application: Dipesh Thapa', time: '1h ago', type: 'pending' },
//         { id: 4, message: 'Payment processed: ₨2,500', time: '2h ago', type: 'revenue' }
//     ];
//
//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'In Progress': return '#8b5cf6';
//             case 'Scheduled': return '#06b6d4';
//             case 'Completed': return '#10b981';
//             default: return '#6b7280';
//         }
//     };
//
//     const handleRefresh = () => {
//         setRefreshTime(new Date().toLocaleTimeString());
//     };
//
//     return (
//         <div className="admin-dashboard">
//             <div className="dashboard-container">
//                 {/* Header */}
//                 <div className="dashboard-header">
//                     <div className="dashboard-header-top">
//                         <h1 className="dashboard-title">Admin Dashboard</h1>
//                         <button onClick={handleRefresh} className="refresh-btn">
//                             <RefreshCw size={16} />
//                             Refresh
//                         </button>
//                     </div>
//                     <p className="last-updated">Monitor platform operations • Last updated: {refreshTime}</p>
//                 </div>
//
//                 {/* KPIs / Summary Cards */}
//                 <section className="kpi-section">
//                     {kpiData.map((kpi, index) => {
//                         const IconComponent = kpi.icon;
//                         return (
//                             <div key={index} className="kpi-card">
//                                 <div className="kpi-icon" style={{ backgroundColor: kpi.bgColor }}>
//                                     <IconComponent size={24} style={{ color: kpi.color }} />
//                                 </div>
//                                 <div>
//                                     <div className="kpi-value">{kpi.value}</div>
//                                     <div className="kpi-label">{kpi.label}</div>
//                                     <div className="kpi-change">{kpi.change}</div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </section>
//
//                 <div className="grid-two">
//                     {/* Pending Approvals Widget */}
//                     <section className="card">
//                         <div className="card-header">
//                             <h3 className="card-title">Pending Approvals ({pendingApprovals.length})</h3>
//                             <button className="icon-btn">
//                                 <Eye size={16} />
//                             </button>
//                         </div>
//                         <div className="card-list">
//                             {pendingApprovals.map((approval) => (
//                                 <div key={approval.id} className="list-item">
//                                     <div>
//                                         <div className="item-name">{approval.name}</div>
//                                         <div className="item-meta">
//                                             {approval.type} • {approval.location}
//                                             {approval.specialization && ` • ${approval.specialization}`}
//                                         </div>
//                                     </div>
//                                     <div className="item-actions">
//                                         <button className="btn-reject">
//                                             <X size={14} />
//                                         </button>
//                                         <button className="btn-approve">
//                                             <Check size={14} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//
//                     {/* Live Services Overview */}
//                     <section className="card">
//                         <div className="card-header">
//                             <h3 className="card-title">Live Services ({liveServices.length})</h3>
//                             <div className="live-indicator">
//                                 <span className="pulse-dot"></span>
//                                 <span className="live-text">LIVE</span>
//                             </div>
//                         </div>
//                         <div className="card-list">
//                             {liveServices.map((service) => (
//                                 <div key={service.id} className="service-item" style={{ borderLeftColor: getStatusColor(service.status) }}>
//                                     <div className="service-top">
//                                         <div className="service-type">{service.type}</div>
//                                         <div className="service-amount">{service.amount}</div>
//                                     </div>
//                                     <div className="service-bottom">
//                                         <div className="service-meta">{service.client} • {service.technician}</div>
//                                         <div className="service-status">
//                                             <span style={{ color: getStatusColor(service.status) }}>{service.status}</span>
//                                             <button className="icon-btn">
//                                                 <MessageSquare size={14} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//
//                 <div className="grid-two">
//                     {/* Reports Snapshot */}
//                     <section className="card">
//                         <h3 className="card-title">Today's Performance</h3>
//                         <div className="reports-grid">
//                             {reportsData.map((report, index) => (
//                                 <div key={index} className="report-card">
//                                     <div className="report-value">{report.value}</div>
//                                     <div className="report-title">{report.title}</div>
//                                     <div className="report-change">{report.change}</div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//
//                     {/* Recent Activity Feed */}
//                     <section className="card">
//                         <h3 className="card-title">Recent Activity</h3>
//                         <div className="activity-list">
//                             {recentActivity.map((activity) => (
//                                 <div key={activity.id} className="activity-item">
//                                     <div className="activity-dot"></div>
//                                     <div>
//                                         <div className="activity-msg">{activity.message}</div>
//                                         <div className="activity-time">{activity.time}</div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default AdminDashboard;

const AdminDashboard = () => {
    const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());

    const kpiData = [
        { label: 'Total Users', value: '1,247', change: '+12.5%', icon: Users, color: '#3b82f6', bgColor: '#dbeafe' },
        { label: 'Active Technicians', value: '156', change: '+15', icon: Wrench, color: '#8b5cf6', bgColor: '#f3e8ff' },
        { label: 'Pending Approvals', value: '31', change: 'Action needed', icon: AlertTriangle, color: '#f59e0b', bgColor: '#fef3c7' },
        { label: 'Monthly Revenue', value: '₨125.4K', change: '+18%', icon: DollarSign, color: '#16a34a', bgColor: '#dcfce7' },
        { label: 'Platform Rating', value: '4.6', change: '+0.2', icon: Star, color: '#eab308', bgColor: '#fef7cd' },
        { label: 'Active Services', value: '89', change: 'Live', icon: Activity, color: '#10b981', bgColor: '#d1fae5' }
    ];

    const pendingApprovals = [
        { id: 1, name: 'Rajesh Kumar', type: 'User', location: 'Kathmandu', date: '2024-11-15' },
        { id: 2, name: 'Dipesh Thapa', type: 'Technician', location: 'Lalitpur', specialization: 'Plumbing' },
        { id: 3, name: 'Sita Sharma', type: 'User', location: 'Pokhara', date: '2024-11-14' }
    ];

    const liveServices = [
        { id: 1, type: 'Home Cleaning', client: 'John D.', technician: 'Sarah W.', location: 'Thamel', status: 'In Progress', amount: '₨2,500' },
        { id: 2, type: 'Plumbing', client: 'Alice C.', technician: 'Ram S.', location: 'Patan', status: 'Scheduled', amount: '₨1,800' }
    ];

    const reportsData = [
        { title: 'Daily Revenue', value: '₨15,750', change: '+8.2%' },
        { title: 'Completion Rate', value: '94.2%', change: '+2.1%' },
        { title: 'User Satisfaction', value: '4.6/5', change: '+0.1' },
        { title: 'Platform Usage', value: '78.5%', change: '+5.3%' }
    ];

    const recentActivity = [
        { id: 1, message: 'New user registered: Rajesh Kumar', time: '2 min ago', type: 'user' },
        { id: 2, message: 'Service completed: Home Cleaning', time: '15 min ago', type: 'success' },
        { id: 3, message: 'New technician application: Dipesh Thapa', time: '1h ago', type: 'pending' },
        { id: 4, message: 'Payment processed: ₨2,500', time: '2h ago', type: 'revenue' }
    ];

    const handleRefresh = () => {
        setRefreshTime(new Date().toLocaleTimeString());
    };

    const handleApproval = (action, approvalId) => {
        console.log(`${action} approval ${approvalId}`);
    };

    const handleServiceMessage = (serviceId) => {
        console.log(`Message service ${serviceId}`);
    };

    return (
        <div>
            <Header2 />
        <div className="admin-dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="dashboard-header-top">
                        <h1 className="dashboard-title">Admin Dashboard</h1>
                        <button onClick={handleRefresh} className="refresh-btn">
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                    <p className="last-updated">Monitor platform operations • Last updated: {refreshTime}</p>
                </div>

                {/* KPIs */}
                <section className="kpi-section">
                    {kpiData.map((kpi, index) => (
                        <StatCard key={index} {...kpi} size="kpi" />
                    ))}
                </section>

                <div className="grid-two">
                    {/* Pending Approvals */}
                    <section className="card">
                        <SectionHeader
                            title={`Pending Approvals (${pendingApprovals.length})`}
                            actions={
                                <button className="icon-btn">
                                    <Eye size={16} />
                                </button>
                            }
                        />
                        <div className="card-list">
                            {pendingApprovals.map((approval) => (
                                <PendingApproval
                                    key={approval.id}
                                    approval={approval}
                                    onApprove={(id) => handleApproval('approve', id)}
                                    onReject={(id) => handleApproval('reject', id)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Live Services Overview */}
                    <section className="card">
                        <SectionHeader
                            title={`Live Services (${liveServices.length})`}
                            actions={
                                <div className="live-indicator">
                                    <span className="pulse-dot"></span>
                                    <span className="live-text">LIVE</span>
                                </div>
                            }
                        />
                        <div className="card-list">
                            {liveServices.map((service) => (
                                <LiveServiceItem
                                    key={service.id}
                                    service={service}
                                    onMessage={handleServiceMessage}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                <div className="grid-two">
                    {/* Reports Snapshot */}
                    <section className="card">
                        <h3 className="card-title">Today's Performance</h3>
                        <div className="reports-grid">
                            {reportsData.map((report, index) => (
                                <ReportCard
                                    key={index}
                                    title={report.title}
                                    value={report.value}
                                    change={report.change}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity Feed */}
                    <section className="card">
                        <h3 className="card-title">Recent Activity</h3>
                        <div className="activity-list">
                            {recentActivity.map((activity) => (
                                <ActivityItem key={activity.id} activity={activity} showDot={true} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;
