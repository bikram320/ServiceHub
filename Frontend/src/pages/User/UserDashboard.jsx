import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Plus,
    Search,
    Filter,
    Star,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    MessageSquare,
    Phone,
    User,
    Home,
    Wrench,
    Zap,
    Car,
    Scissors,
    Heart,
    BookOpen
} from 'lucide-react';
import "../../styles/UserDashboard.css";
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



const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock data for user's appointments
    const upcomingAppointments = [
        {
            id: 1,
            service: 'Home Cleaning',
            provider: 'Clean Pro Services',
            technician: 'Sarah Wilson',
            date: 'Today',
            time: '2:00 PM - 4:00 PM',
            location: 'Your Home - Thamel, Kathmandu',
            status: 'confirmed',
            price: '₨2,500',
            rating: 4.8
        },
        {
            id: 2,
            service: 'Plumbing Repair',
            provider: 'Fix It Fast',
            technician: 'Ram Sharma',
            date: 'Tomorrow',
            time: '10:00 AM - 12:00 PM',
            location: 'Your Home - Thamel, Kathmandu',
            status: 'pending',
            price: '₨1,800',
            rating: 4.6
        },
        {
            id: 3,
            service: 'AC Maintenance',
            provider: 'Cool Air Service',
            technician: 'Bikash Thapa',
            date: 'Nov 18',
            time: '9:00 AM - 11:00 AM',
            location: 'Your Office - Patan, Lalitpur',
            status: 'confirmed',
            price: '₨3,200',
            rating: 4.9
        }
    ];

    const appointmentHistory = [
        {
            id: 4,
            service: 'House Painting',
            provider: 'Color Masters',
            technician: 'Dipak Rai',
            date: 'Nov 10, 2024',
            time: '8:00 AM - 6:00 PM',
            location: 'Your Home - Thamel, Kathmandu',
            status: 'completed',
            price: '₨12,500',
            rating: 5.0,
            yourRating: 5,
            review: 'Excellent work! Very professional and clean.'
        },
        {
            id: 5,
            service: 'Garden Maintenance',
            provider: 'Green Thumb',
            technician: 'Maya Gurung',
            date: 'Nov 5, 2024',
            time: '7:00 AM - 10:00 AM',
            location: 'Your Home - Thamel, Kathmandu',
            status: 'completed',
            price: '₨1,500',
            rating: 4.7,
            yourRating: 4,
            review: 'Good service, on time and thorough.'
        },
        {
            id: 6,
            service: 'Laptop Repair',
            provider: 'Tech Solutions',
            technician: 'Arjun Khadka',
            date: 'Oct 28, 2024',
            time: '11:00 AM - 1:00 PM',
            location: 'Shop Visit - New Road, Kathmandu',
            status: 'cancelled',
            price: '₨2,200',
            rating: null,
            cancellationReason: 'Service provider unavailable'
        }
    ];

    // Popular services for quick booking
    const popularServices = [
        { icon: Home, name: 'House Cleaning', category: 'Cleaning', startingPrice: '₨1,500' },
        { icon: Wrench, name: 'Plumbing', category: 'Repair', startingPrice: '₨800' },
        { icon: Zap, name: 'Electrical Work', category: 'Repair', startingPrice: '₨1,200' },
        { icon: Car, name: 'Car Wash', category: 'Automotive', startingPrice: '₨500' },
        { icon: Scissors, name: 'Hair Cut', category: 'Beauty', startingPrice: '₨300' },
        { icon: Heart, name: 'Massage', category: 'Wellness', startingPrice: '₨2,000' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'completed': return '#6366f1';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle size={16} />;
            case 'pending': return <AlertCircle size={16} />;
            case 'completed': return <CheckCircle size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const renderStars = (rating, isClickable = false, size = 16) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={size}
                fill={i < rating ? '#fbbf24' : 'none'}
                color={i < rating ? '#fbbf24' : '#d1d5db'}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
            />
        ));
    };

    const filteredAppointments = appointmentHistory.filter(apt => {
        const matchesSearch = apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.technician.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalSpent = [...upcomingAppointments, ...appointmentHistory]
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => sum + parseInt(apt.price.replace('₨', '').replace(',', '')), 0);

    return (
        <div className="profile-content">
            <div className="profile-form">
                <div className="profile-header">
                    <h1 className="profile-title">My Services</h1>
                    <p className="profile-subtitle">Manage your service bookings and discover new services.</p>
                </div>

                {/* Quick Stats */}
                <section className="form-section">
                    <h3 className="section-title">Overview</h3>
                    <div className="user-stats-grid">
                        <div className="user-stat-card">
                            <div className="user-stat-icon" style={{ backgroundColor: '#dbeafe' }}>
                                <Calendar size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className="user-stat-content">
                                <div className="user-stat-number">{upcomingAppointments.length}</div>
                                <div className="user-stat-label">Upcoming Bookings</div>
                            </div>
                        </div>

                        <div className="user-stat-card">
                            <div className="user-stat-icon" style={{ backgroundColor: '#dcfce7' }}>
                                <CheckCircle size={24} style={{ color: '#16a34a' }} />
                            </div>
                            <div className="user-stat-content">
                                <div className="user-stat-number">
                                    {appointmentHistory.filter(apt => apt.status === 'completed').length}
                                </div>
                                <div className="user-stat-label">Completed Services</div>
                            </div>
                        </div>

                        <div className="user-stat-card">
                            <div className="user-stat-icon" style={{ backgroundColor: '#fef3c7' }}>
                                <Star size={24} style={{ color: '#eab308' }} />
                            </div>
                            <div className="user-stat-content">
                                <div className="user-stat-number">
                                    {(appointmentHistory
                                            .filter(apt => apt.yourRating)
                                            .reduce((sum, apt) => sum + apt.yourRating, 0) /
                                        appointmentHistory.filter(apt => apt.yourRating).length || 0).toFixed(1)}
                                </div>
                                <div className="user-stat-label">Avg Rating Given</div>
                            </div>
                        </div>

                        <div className="user-stat-card">
                            <div className="user-stat-icon" style={{ backgroundColor: '#d1fae5' }}>
                                <BookOpen size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className="user-stat-content">
                                <div className="user-stat-number">₨{totalSpent.toLocaleString()}</div>
                                <div className="user-stat-label">Total Spent</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Book Services */}
                <section className="form-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <Plus size={20} style={{marginRight: '0.5rem'}} />
                            Book a Service
                        </h3>
                        <button className="add-btn">
                            <Search size={16} />
                            Browse All
                        </button>
                    </div>
                    <div className="services-grid">
                        {popularServices.map((service, index) => (
                            <div key={index} className="service-card">
                                <div className="service-icon">
                                    <service.icon size={24} />
                                </div>
                                <div className="service-info">
                                    <div className="service-name">{service.name}</div>
                                    <div className="service-category">{service.category}</div>
                                    <div className="service-price">Starting from {service.startingPrice}</div>
                                </div>
                                <button className="book-btn">Book Now</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Appointments Tabs */}
                <section className="form-section">
                    <div className="tabs-header">
                        <div className="tabs-nav">
                            <button
                                className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                                onClick={() => setActiveTab('upcoming')}
                            >
                                <Calendar size={16} />
                                Upcoming ({upcomingAppointments.length})
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                <Clock size={16} />
                                History ({appointmentHistory.length})
                            </button>
                        </div>

                        {activeTab === 'history' && (
                            <div className="appointments-controls">
                                <div className="search-box">
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="filter-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="appointments-content">
                        {activeTab === 'upcoming' && (
                            <div className="appointments-list">
                                {upcomingAppointments.length === 0 ? (
                                    <div className="empty-state">
                                        <Calendar size={48} style={{ color: '#9ca3af' }} />
                                        <h4>No Upcoming Appointments</h4>
                                        <p>Book a service to see your upcoming appointments here.</p>
                                        <button className="add-btn">
                                            <Plus size={16} />
                                            Book Service
                                        </button>
                                    </div>
                                ) : (
                                    upcomingAppointments.map((appointment) => (
                                        <div key={appointment.id} className="appointment-card">
                                            <div className="appointment-header">
                                                <div className="appointment-service-info">
                                                    <h4 className="appointment-title">{appointment.service}</h4>
                                                    <div className="appointment-provider">{appointment.provider}</div>
                                                </div>
                                                <div className="appointment-status">
                                                    <span
                                                        className="status-badge"
                                                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                                                    >
                                                        {getStatusIcon(appointment.status)}
                                                        {appointment.status}
                                                    </span>
                                                    <div className="appointment-price">{appointment.price}</div>
                                                </div>
                                            </div>

                                            <div className="appointment-details">
                                                <div className="detail-item">
                                                    <Calendar size={16} />
                                                    <span>{appointment.date}, {appointment.time}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <MapPin size={16} />
                                                    <span>{appointment.location}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <User size={16} />
                                                    <span>{appointment.technician}</span>
                                                    <div className="provider-rating">
                                                        {renderStars(appointment.rating)}
                                                        <span>({appointment.rating})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="appointment-actions">
                                                {/*<button className="action-btn secondary">*/}
                                                {/*    <MessageSquare size={16} />*/}
                                                {/*    Message*/}
                                                {/*</button>*/}
                                                {/*<button className="action-btn secondary">*/}
                                                {/*    <Phone size={16} />*/}
                                                {/*    Call*/}
                                                {/*</button>*/}
                                                <button className="action-btn secondary">
                                                    <Eye size={16} />
                                                    Details
                                                </button>
                                                <button className="action-btn danger">Cancel</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="appointments-list">
                                {filteredAppointments.length === 0 ? (
                                    <div className="empty-state">
                                        <Clock size={48} style={{ color: '#9ca3af' }} />
                                        <h4>No Service History</h4>
                                        <p>Your completed and cancelled services will appear here.</p>
                                    </div>
                                ) : (
                                    filteredAppointments.map((appointment) => (
                                        <div key={appointment.id} className="appointment-card history-card">
                                            <div className="appointment-header">
                                                <div className="appointment-service-info">
                                                    <h4 className="appointment-title">{appointment.service}</h4>
                                                    <div className="appointment-provider">{appointment.provider}</div>
                                                </div>
                                                <div className="appointment-status">
                                                    <span
                                                        className="status-badge"
                                                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                                                    >
                                                        {getStatusIcon(appointment.status)}
                                                        {appointment.status}
                                                    </span>
                                                    <div className="appointment-price">{appointment.price}</div>
                                                </div>
                                            </div>

                                            <div className="appointment-details">
                                                <div className="detail-item">
                                                    <Calendar size={16} />
                                                    <span>{appointment.date}, {appointment.time}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <MapPin size={16} />
                                                    <span>{appointment.location}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <User size={16} />
                                                    <span>{appointment.technician}</span>
                                                    {appointment.rating && (
                                                        <div className="provider-rating">
                                                            {renderStars(appointment.rating)}
                                                            <span>({appointment.rating})</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/*{appointment.status === 'completed' && (*/}
                                            {/*    <div className="review-section">*/}
                                            {/*        <div className="your-rating">*/}
                                            {/*            <span>Your Rating: </span>*/}
                                            {/*            {appointment.yourRating ?*/}
                                            {/*                renderStars(appointment.yourRating) :*/}
                                            {/*                <button className="rate-btn">Rate Service</button>*/}
                                            {/*            }*/}
                                            {/*        </div>*/}
                                            {/*        {appointment.review && (*/}
                                            {/*            <div className="review-text">*/}
                                            {/*                <span>Your Review: </span>*/}
                                            {/*                <p>"{appointment.review}"</p>*/}
                                            {/*            </div>*/}
                                            {/*        )}*/}
                                            {/*    </div>*/}
                                            {/*)}*/}

                                            {/*{appointment.status === 'cancelled' && (*/}
                                            {/*    <div className="cancellation-info">*/}
                                            {/*        <span>Reason: {appointment.cancellationReason}</span>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}

                                            <div className="appointment-actions">
                                                <button className="action-btn secondary">
                                                    <Eye size={16} />
                                                    View Details
                                                </button>
                                                {appointment.status === 'completed' && (
                                                    <button className="action-btn primary">Book Again</button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;

// const UserDashboard = () => {
//     const [activeTab, setActiveTab] = useState('upcoming');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState('all');
//
//     const upcomingAppointments = [
//         {
//             id: 1,
//             service: 'Home Cleaning',
//             provider: 'Clean Pro Services',
//             technician: 'Sarah Wilson',
//             date: 'Today',
//             time: '2:00 PM - 4:00 PM',
//             location: 'Your Home - Thamel, Kathmandu',
//             status: 'confirmed',
//             price: '₨2,500',
//             rating: 4.8
//         },
//         {
//             id: 2,
//             service: 'Plumbing Repair',
//             provider: 'Fix It Fast',
//             technician: 'Ram Sharma',
//             date: 'Tomorrow',
//             time: '10:00 AM - 12:00 PM',
//             location: 'Your Home - Thamel, Kathmandu',
//             status: 'pending',
//             price: '₨1,800',
//             rating: 4.6
//         },
//         {
//             id: 3,
//             service: 'AC Maintenance',
//             provider: 'Cool Air Service',
//             technician: 'Bikash Thapa',
//             date: 'Nov 18',
//             time: '9:00 AM - 11:00 AM',
//             location: 'Your Office - Patan, Lalitpur',
//             status: 'confirmed',
//             price: '₨3,200',
//             rating: 4.9
//         }
//     ];
//
//     const appointmentHistory = [
//         {
//             id: 4,
//             service: 'House Painting',
//             provider: 'Color Masters',
//             technician: 'Dipak Rai',
//             date: 'Nov 10, 2024',
//             time: '8:00 AM - 6:00 PM',
//             location: 'Your Home - Thamel, Kathmandu',
//             status: 'completed',
//             price: '₨12,500',
//             rating: 5.0,
//             yourRating: 5,
//             review: 'Excellent work! Very professional and clean.'
//         },
//         {
//             id: 5,
//             service: 'Garden Maintenance',
//             provider: 'Green Thumb',
//             technician: 'Maya Gurung',
//             date: 'Nov 5, 2024',
//             time: '7:00 AM - 10:00 AM',
//             location: 'Your Home - Thamel, Kathmandu',
//             status: 'completed',
//             price: '₨1,500',
//             rating: 4.7,
//             yourRating: 4,
//             review: 'Good service, on time and thorough.'
//         },
//         {
//             id: 6,
//             service: 'Laptop Repair',
//             provider: 'Tech Solutions',
//             technician: 'Arjun Khadka',
//             date: 'Oct 28, 2024',
//             time: '11:00 AM - 1:00 PM',
//             location: 'Shop Visit - New Road, Kathmandu',
//             status: 'cancelled',
//             price: '₨2,200',
//             rating: null,
//             cancellationReason: 'Service provider unavailable'
//         }
//     ];
//
//     const popularServices = [
//         { icon: Home, name: 'House Cleaning', category: 'Cleaning', startingPrice: '₨1,500' },
//         { icon: Wrench, name: 'Plumbing', category: 'Repair', startingPrice: '₨800' },
//         { icon: Zap, name: 'Electrical Work', category: 'Repair', startingPrice: '₨1,200' },
//         { icon: Car, name: 'Car Wash', category: 'Automotive', startingPrice: '₨500' },
//         { icon: Scissors, name: 'Hair Cut', category: 'Beauty', startingPrice: '₨300' },
//         { icon: Heart, name: 'Massage', category: 'Wellness', startingPrice: '₨2,000' }
//     ];
//
//     const totalSpent = [...upcomingAppointments, ...appointmentHistory]
//         .filter(apt => apt.status === 'completed')
//         .reduce((sum, apt) => sum + parseInt(apt.price.replace('₨', '').replace(',', '')), 0);
//
//     const avgRatingGiven = appointmentHistory
//         .filter(apt => apt.yourRating)
//         .reduce((sum, apt) => sum + apt.yourRating, 0) / appointmentHistory.filter(apt => apt.yourRating).length || 0;
//
//     const stats = [
//         { icon: Calendar, value: upcomingAppointments.length, label: 'Upcoming Bookings', color: '#3b82f6', bgColor: '#dbeafe' },
//         { icon: CheckCircle, value: appointmentHistory.filter(apt => apt.status === 'completed').length, label: 'Completed Services', color: '#16a34a', bgColor: '#dcfce7' },
//         { icon: Star, value: avgRatingGiven.toFixed(1), label: 'Avg Rating Given', color: '#eab308', bgColor: '#fef7cd' },
//         { icon: BookOpen, value: `₨${totalSpent.toLocaleString()}`, label: 'Total Spent', color: '#10b981', bgColor: '#d1fae5' }
//     ];
//
//     const handleAppointmentAction = (action, appointmentId) => {
//         console.log(`${action} appointment ${appointmentId}`);
//     };
//
//     const handleBookService = (service) => {
//         console.log('Book service:', service);
//     };
//
//     const filteredAppointments = appointmentHistory.filter(apt => {
//         const matchesSearch = apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             apt.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             apt.technician.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
//         return matchesSearch && matchesFilter;
//     });
//
//     return (
//         <div className="profile-content">
//             <div className="profile-form">
//                 <div className="profile-header">
//                     <h1 className="profile-title">My Services</h1>
//                     <p className="profile-subtitle">Manage your service bookings and discover new services.</p>
//                 </div>
//
//                 {/* Stats Overview */}
//                 <section className="form-section">
//                     <h3 className="section-title">Overview</h3>
//                     <div className="user-stats-grid">
//                         {stats.map((stat, index) => (
//                             <StatCard key={index} {...stat} />
//                         ))}
//                     </div>
//                 </section>
//
//                 {/* Quick Book Services */}
//                 <section className="form-section">
//                     <SectionHeader
//                         title="Book a Service"
//                         icon={Plus}
//                         actions={
//                             <button className="add-btn">
//                                 <Search size={16} />
//                                 Browse All
//                             </button>
//                         }
//                     />
//                     <div className="services-grid">
//                         {popularServices.map((service, index) => (
//                             <ServiceCard key={index} service={service} onBook={handleBookService} />
//                         ))}
//                     </div>
//                 </section>
//
//                 {/* Appointments */}
//                 <section className="form-section">
//                     <div className="tabs-header">
//                         <div className="tabs-nav">
//                             <button
//                                 className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
//                                 onClick={() => setActiveTab('upcoming')}
//                             >
//                                 <Calendar size={16} />
//                                 Upcoming ({upcomingAppointments.length})
//                             </button>
//                             <button
//                                 className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
//                                 onClick={() => setActiveTab('history')}
//                             >
//                                 <Clock size={16} />
//                                 History ({appointmentHistory.length})
//                             </button>
//                         </div>
//
//                         {activeTab === 'history' && (
//                             <div className="appointments-controls">
//                                 <div className="search-box">
//                                     <Search size={16} />
//                                     <input
//                                         type="text"
//                                         placeholder="Search services..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                 </div>
//                                 <select
//                                     className="filter-select"
//                                     value={filterStatus}
//                                     onChange={(e) => setFilterStatus(e.target.value)}
//                                 >
//                                     <option value="all">All Status</option>
//                                     <option value="completed">Completed</option>
//                                     <option value="cancelled">Cancelled</option>
//                                 </select>
//                             </div>
//                         )}
//                     </div>
//
//                     <div className="appointments-content">
//                         {activeTab === 'upcoming' && (
//                             <div className="appointments-list">
//                                 {upcomingAppointments.length === 0 ? (
//                                     <EmptyState
//                                         icon={Calendar}
//                                         title="No Upcoming Appointments"
//                                         description="Book a service to see your upcoming appointments here."
//                                         action={
//                                             <button className="add-btn">
//                                                 <Plus size={16} />
//                                                 Book Service
//                                             </button>
//                                         }
//                                     />
//                                 ) : (
//                                     upcomingAppointments.map((appointment) => (
//                                         <AppointmentCard
//                                             key={appointment.id}
//                                             appointment={appointment}
//                                             type="upcoming"
//                                             onAction={handleAppointmentAction}
//                                         />
//                                     ))
//                                 )}
//                             </div>
//                         )}
//
//                         {activeTab === 'history' && (
//                             <div className="appointments-list">
//                                 {filteredAppointments.length === 0 ? (
//                                     <EmptyState
//                                         icon={Clock}
//                                         title="No Service History"
//                                         description="Your completed and cancelled services will appear here."
//                                     />
//                                 ) : (
//                                     filteredAppointments.map((appointment) => (
//                                         <AppointmentCard
//                                             key={appointment.id}
//                                             appointment={appointment}
//                                             type="history"
//                                             onAction={handleAppointmentAction}
//                                         />
//                                     ))
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// };
//
// export default UserDashboard;