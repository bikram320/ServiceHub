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



// const UserDashboard = () => {
//     const [activeTab, setActiveTab] = useState('upcoming');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState('all');
//
//     // Mock data for user's appointments
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
//     // Popular services for quick booking
//     const popularServices = [
//         { icon: Home, name: 'House Cleaning', category: 'Cleaning', startingPrice: '₨1,500' },
//         { icon: Wrench, name: 'Plumbing', category: 'Repair', startingPrice: '₨800' },
//         { icon: Zap, name: 'Electrical Work', category: 'Repair', startingPrice: '₨1,200' },
//         { icon: Car, name: 'Car Wash', category: 'Automotive', startingPrice: '₨500' },
//         { icon: Scissors, name: 'Hair Cut', category: 'Beauty', startingPrice: '₨300' },
//         { icon: Heart, name: 'Massage', category: 'Wellness', startingPrice: '₨2,000' }
//     ];
//
//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'confirmed': return '#10b981';
//             case 'pending': return '#f59e0b';
//             case 'completed': return '#6366f1';
//             case 'cancelled': return '#ef4444';
//             default: return '#6b7280';
//         }
//     };
//
//     const getStatusIcon = (status) => {
//         switch (status) {
//             case 'confirmed': return <CheckCircle size={16} />;
//             case 'pending': return <AlertCircle size={16} />;
//             case 'completed': return <CheckCircle size={16} />;
//             case 'cancelled': return <XCircle size={16} />;
//             default: return <Clock size={16} />;
//         }
//     };
//
//     const renderStars = (rating, isClickable = false, size = 16) => {
//         return Array.from({ length: 5 }, (_, i) => (
//             <Star
//                 key={i}
//                 size={size}
//                 fill={i < rating ? '#fbbf24' : 'none'}
//                 color={i < rating ? '#fbbf24' : '#d1d5db'}
//                 style={{ cursor: isClickable ? 'pointer' : 'default' }}
//             />
//         ));
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
//     const totalSpent = [...upcomingAppointments, ...appointmentHistory]
//         .filter(apt => apt.status === 'completed')
//         .reduce((sum, apt) => sum + parseInt(apt.price.replace('₨', '').replace(',', '')), 0);
//
//     return (
//         <div className="profile-content">
//             <div className="profile-form">
//                 <div className="profile-header">
//                     <h1 className="profile-title">My Services</h1>
//                     <p className="profile-subtitle">Manage your service bookings and discover new services.</p>
//                 </div>
//
//                 {/* Quick Stats */}
//                 <section className="form-section">
//                     <h3 className="section-title">Overview</h3>
//                     <div className="user-stats-grid">
//                         <div className="user-stat-card">
//                             <div className="user-stat-icon" style={{ backgroundColor: '#dbeafe' }}>
//                                 <Calendar size={24} style={{ color: '#3b82f6' }} />
//                             </div>
//                             <div className="user-stat-content">
//                                 <div className="user-stat-number">{upcomingAppointments.length}</div>
//                                 <div className="user-stat-label">Upcoming Bookings</div>
//                             </div>
//                         </div>
//
//                         <div className="user-stat-card">
//                             <div className="user-stat-icon" style={{ backgroundColor: '#dcfce7' }}>
//                                 <CheckCircle size={24} style={{ color: '#16a34a' }} />
//                             </div>
//                             <div className="user-stat-content">
//                                 <div className="user-stat-number">
//                                     {appointmentHistory.filter(apt => apt.status === 'completed').length}
//                                 </div>
//                                 <div className="user-stat-label">Completed Services</div>
//                             </div>
//                         </div>
//
//                         <div className="user-stat-card">
//                             <div className="user-stat-icon" style={{ backgroundColor: '#fef3c7' }}>
//                                 <Star size={24} style={{ color: '#eab308' }} />
//                             </div>
//                             <div className="user-stat-content">
//                                 <div className="user-stat-number">
//                                     {(appointmentHistory
//                                             .filter(apt => apt.yourRating)
//                                             .reduce((sum, apt) => sum + apt.yourRating, 0) /
//                                         appointmentHistory.filter(apt => apt.yourRating).length || 0).toFixed(1)}
//                                 </div>
//                                 <div className="user-stat-label">Avg Rating Given</div>
//                             </div>
//                         </div>
//
//                         <div className="user-stat-card">
//                             <div className="user-stat-icon" style={{ backgroundColor: '#d1fae5' }}>
//                                 <BookOpen size={24} style={{ color: '#10b981' }} />
//                             </div>
//                             <div className="user-stat-content">
//                                 <div className="user-stat-number">₨{totalSpent.toLocaleString()}</div>
//                                 <div className="user-stat-label">Total Spent</div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//
//                 {/* Quick Book Services */}
//                 <section className="form-section">
//                     <div className="section-header">
//                         <h3 className="section-title">
//                             <Plus size={20} style={{marginRight: '0.5rem'}} />
//                             Book a Service
//                         </h3>
//                         <button className="add-btn">
//                             <Search size={16} />
//                             Browse All
//                         </button>
//                     </div>
//                     <div className="services-grid">
//                         {popularServices.map((service, index) => (
//                             <div key={index} className="service-card">
//                                 <div className="service-icon">
//                                     <service.icon size={24} />
//                                 </div>
//                                 <div className="service-info">
//                                     <div className="service-name">{service.name}</div>
//                                     <div className="service-category">{service.category}</div>
//                                     <div className="service-price">Starting from {service.startingPrice}</div>
//                                 </div>
//                                 <button className="book-btn">Book Now</button>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//
//                 {/* Appointments Tabs */}
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
//                                     <div className="empty-state">
//                                         <Calendar size={48} style={{ color: '#9ca3af' }} />
//                                         <h4>No Upcoming Appointments</h4>
//                                         <p>Book a service to see your upcoming appointments here.</p>
//                                         <button className="add-btn">
//                                             <Plus size={16} />
//                                             Book Service
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     upcomingAppointments.map((appointment) => (
//                                         <div key={appointment.id} className="appointment-card">
//                                             <div className="appointment-header">
//                                                 <div className="appointment-service-info">
//                                                     <h4 className="appointment-title">{appointment.service}</h4>
//                                                     <div className="appointment-provider">{appointment.provider}</div>
//                                                 </div>
//                                                 <div className="appointment-status">
//                                                     <span
//                                                         className="status-badge"
//                                                         style={{ backgroundColor: getStatusColor(appointment.status) }}
//                                                     >
//                                                         {getStatusIcon(appointment.status)}
//                                                         {appointment.status}
//                                                     </span>
//                                                     <div className="appointment-price">{appointment.price}</div>
//                                                 </div>
//                                             </div>
//
//                                             <div className="appointment-details">
//                                                 <div className="detail-item">
//                                                     <Calendar size={16} />
//                                                     <span>{appointment.date}, {appointment.time}</span>
//                                                 </div>
//                                                 <div className="detail-item">
//                                                     <MapPin size={16} />
//                                                     <span>{appointment.location}</span>
//                                                 </div>
//                                                 <div className="detail-item">
//                                                     <User size={16} />
//                                                     <span>{appointment.technician}</span>
//                                                     <div className="provider-rating">
//                                                         {renderStars(appointment.rating)}
//                                                         <span>({appointment.rating})</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//
//                                             <div className="appointment-actions">
//                                                 {/*<button className="action-btn secondary">*/}
//                                                 {/*    <MessageSquare size={16} />*/}
//                                                 {/*    Message*/}
//                                                 {/*</button>*/}
//                                                 {/*<button className="action-btn secondary">*/}
//                                                 {/*    <Phone size={16} />*/}
//                                                 {/*    Call*/}
//                                                 {/*</button>*/}
//                                                 <button className="action-btn secondary">
//                                                     <Eye size={16} />
//                                                     Details
//                                                 </button>
//                                                 <button className="action-btn danger">Cancel</button>
//                                             </div>
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         )}
//
//                         {activeTab === 'history' && (
//                             <div className="appointments-list">
//                                 {filteredAppointments.length === 0 ? (
//                                     <div className="empty-state">
//                                         <Clock size={48} style={{ color: '#9ca3af' }} />
//                                         <h4>No Service History</h4>
//                                         <p>Your completed and cancelled services will appear here.</p>
//                                     </div>
//                                 ) : (
//                                     filteredAppointments.map((appointment) => (
//                                         <div key={appointment.id} className="appointment-card history-card">
//                                             <div className="appointment-header">
//                                                 <div className="appointment-service-info">
//                                                     <h4 className="appointment-title">{appointment.service}</h4>
//                                                     <div className="appointment-provider">{appointment.provider}</div>
//                                                 </div>
//                                                 <div className="appointment-status">
//                                                     <span
//                                                         className="status-badge"
//                                                         style={{ backgroundColor: getStatusColor(appointment.status) }}
//                                                     >
//                                                         {getStatusIcon(appointment.status)}
//                                                         {appointment.status}
//                                                     </span>
//                                                     <div className="appointment-price">{appointment.price}</div>
//                                                 </div>
//                                             </div>
//
//                                             <div className="appointment-details">
//                                                 <div className="detail-item">
//                                                     <Calendar size={16} />
//                                                     <span>{appointment.date}, {appointment.time}</span>
//                                                 </div>
//                                                 <div className="detail-item">
//                                                     <MapPin size={16} />
//                                                     <span>{appointment.location}</span>
//                                                 </div>
//                                                 <div className="detail-item">
//                                                     <User size={16} />
//                                                     <span>{appointment.technician}</span>
//                                                     {appointment.rating && (
//                                                         <div className="provider-rating">
//                                                             {renderStars(appointment.rating)}
//                                                             <span>({appointment.rating})</span>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//
//                                             {/*{appointment.status === 'completed' && (*/}
//                                             {/*    <div className="review-section">*/}
//                                             {/*        <div className="your-rating">*/}
//                                             {/*            <span>Your Rating: </span>*/}
//                                             {/*            {appointment.yourRating ?*/}
//                                             {/*                renderStars(appointment.yourRating) :*/}
//                                             {/*                <button className="rate-btn">Rate Service</button>*/}
//                                             {/*            }*/}
//                                             {/*        </div>*/}
//                                             {/*        {appointment.review && (*/}
//                                             {/*            <div className="review-text">*/}
//                                             {/*                <span>Your Review: </span>*/}
//                                             {/*                <p>"{appointment.review}"</p>*/}
//                                             {/*            </div>*/}
//                                             {/*        )}*/}
//                                             {/*    </div>*/}
//                                             {/*)}*/}
//
//                                             {/*{appointment.status === 'cancelled' && (*/}
//                                             {/*    <div className="cancellation-info">*/}
//                                             {/*        <span>Reason: {appointment.cancellationReason}</span>*/}
//                                             {/*    </div>*/}
//                                             {/*)}*/}
//
//                                             <div className="appointment-actions">
//                                                 <button className="action-btn secondary">
//                                                     <Eye size={16} />
//                                                     View Details
//                                                 </button>
//                                                 {appointment.status === 'completed' && (
//                                                     <button className="action-btn primary">Book Again</button>
//                                                 )}
//                                             </div>
//                                         </div>
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

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // State for dynamic data
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [dashboardOverview, setDashboardOverview] = useState({
        upcomingBookings: 0,
        completedServices: 0,
        averageRatingGiven: 0,
        totalSpent: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // You can get this from user context/auth or props
    const userEmail = "bkbikram727@example.com"; // Replace with actual user email

    // API base URL - adjust this based on your setup
    const API_BASE_URL = "http://localhost:8080"; // Adjust port if different

    const popularServices = [
        { icon: Home, name: 'House Cleaning', category: 'Cleaning', startingPrice: '₨1,500' },
        { icon: Wrench, name: 'Plumbing', category: 'Repair', startingPrice: '₨800' },
        { icon: Zap, name: 'Electrical Work', category: 'Repair', startingPrice: '₨1,200' },
        { icon: Car, name: 'Car Wash', category: 'Automotive', startingPrice: '₨500' },
        { icon: Scissors, name: 'Hair Cut', category: 'Beauty', startingPrice: '₨300' },
        { icon: Heart, name: 'Massage', category: 'Wellness', startingPrice: '₨2,000' }
    ];

    // API functions with credentials and proper error handling
    const fetchCurrentServiceBookings = async () => {
        try {
            const url = `${API_BASE_URL}/users/get-current-service-booking?userEmail=${encodeURIComponent(userEmail)}`;
            console.log('Fetching current bookings from:', url);

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // Include cookies/session for authentication
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Current bookings response status:', response.status);

            if (response.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }

            if (response.status === 404) {
                throw new Error('Current bookings endpoint not found. Please check the API URL.');
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch current bookings: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Current bookings data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching current bookings:', error);
            throw error;
        }
    };

    const fetchPreviousServiceBookings = async () => {
        try {
            const url = `${API_BASE_URL}/users/get-previous-service-booking?userEmail=${encodeURIComponent(userEmail)}`;
            console.log('Fetching previous bookings from:', url);

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // Include cookies/session for authentication
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Previous bookings response status:', response.status);

            if (response.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }

            if (response.status === 404) {
                throw new Error('Previous bookings endpoint not found. Please check the API URL.');
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch previous bookings: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Previous bookings data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching previous bookings:', error);
            throw error;
        }
    };

    const fetchDashboardOverview = async () => {
        try {
            const url = `${API_BASE_URL}/users/dashboard-overview?email=${encodeURIComponent(userEmail)}`;
            console.log('Fetching dashboard overview from:', url);

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // Include cookies/session for authentication
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Dashboard overview response status:', response.status);

            if (response.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }

            if (response.status === 404) {
                throw new Error('Dashboard overview endpoint not found. Please check the API URL.');
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch dashboard overview: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Dashboard overview data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            throw error;
        }
    };

    // Transform backend data to match frontend structure
    const transformCurrentBookingData = (backendData) => {
        if (!Array.isArray(backendData)) return [];

        return backendData.map((item, index) => ({
            id: index + 1,
            service: item.serviceName,
            provider: 'Service Provider', // Default since not in DTO
            technician: item.technicianName,
            date: formatDate(item.appointmentTime),
            time: formatTime(item.appointmentTime),
            location: item.technicianAddress || 'Location not specified',
            status: item.status?.toLowerCase() || 'pending',
            price: `₨${item.feeCharge?.toLocaleString() || '0'}`,
            rating: 4.8 // Default since not in DTO
        }));
    };

    const transformPreviousBookingData = (backendData) => {
        if (!Array.isArray(backendData)) return [];

        return backendData.map((item, index) => ({
            id: index + 100, // Different ID range for history
            service: item.serviceName,
            provider: 'Service Provider',
            technician: item.technicianName,
            date: formatDateFull(item.appointmentTime),
            time: formatTime(item.appointmentTime),
            location: item.technicianAddress || 'Location not specified',
            status: item.status?.toLowerCase() || 'completed',
            price: `₨${item.feeCharge?.toLocaleString() || '0'}`,
            rating: 4.8,
            yourRating: 5, // Default since not in DTO
            review: 'Service completed successfully.'
        }));
    };

    // Date formatting helpers
    const formatDate = (dateTime) => {
        if (!dateTime) return 'TBD';
        const date = new Date(dateTime);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatDateFull = (dateTime) => {
        if (!dateTime) return 'Unknown Date';
        return new Date(dateTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateTime) => {
        if (!dateTime) return 'TBD';
        const date = new Date(dateTime);
        const startTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        // Add 2 hours for end time (assuming 2-hour service duration)
        const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
        const endTime = endDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `${startTime} - ${endTime}`;
    };

    // Load data on component mount with better error handling
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load data sequentially to handle individual failures better
                let currentBookings = [];
                let previousBookings = [];
                let overview = {
                    upcomingBookings: 0,
                    completedServices: 0,
                    averageRatingGiven: 0,
                    totalSpent: 0
                };

                try {
                    currentBookings = await fetchCurrentServiceBookings();
                } catch (error) {
                    console.warn('Failed to load current bookings:', error.message);
                }

                try {
                    previousBookings = await fetchPreviousServiceBookings();
                } catch (error) {
                    console.warn('Failed to load previous bookings:', error.message);
                }

                try {
                    overview = await fetchDashboardOverview();
                } catch (error) {
                    console.warn('Failed to load dashboard overview:', error.message);
                }

                setUpcomingAppointments(transformCurrentBookingData(currentBookings));
                setAppointmentHistory(transformPreviousBookingData(previousBookings));
                setDashboardOverview(overview);

            } catch (error) {
                setError(error.message);
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userEmail) {
            loadData();
        } else {
            setError('User email not available. Please log in again.');
            setLoading(false);
        }
    }, [userEmail]);

    // Calculate stats from dashboard overview
    const stats = [
        {
            icon: Calendar,
            value: dashboardOverview.upcomingBookings || 0,
            label: 'Upcoming Bookings',
            color: '#3b82f6',
            bgColor: '#dbeafe'
        },
        {
            icon: CheckCircle,
            value: dashboardOverview.completedServices || 0,
            label: 'Completed Services',
            color: '#16a34a',
            bgColor: '#dcfce7'
        },
        {
            icon: Star,
            value: (dashboardOverview.averageRatingGiven || 0).toFixed(1),
            label: 'Avg Rating Given',
            color: '#eab308',
            bgColor: '#fef7cd'
        },
        {
            icon: BookOpen,
            value: `₨${(dashboardOverview.totalSpent || 0).toLocaleString()}`,
            label: 'Total Spent',
            color: '#10b981',
            bgColor: '#d1fae5'
        }
    ];

    const handleAppointmentAction = (action, appointmentId) => {
        console.log(`${action} appointment ${appointmentId}`);
        // TODO: Implement API calls for appointment actions
    };

    const handleBookService = (service) => {
        console.log('Book service:', service);
        // TODO: Implement service booking
    };

    const filteredAppointments = appointmentHistory.filter(apt => {
        const matchesSearch = apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.technician.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Loading state
    if (loading) {
        return (
            <div className="profile-content">
                <div className="profile-form">
                    <div className="profile-header">
                        <h1 className="profile-title">My Services</h1>
                        <p className="profile-subtitle">Loading your service data...</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div>Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state with better UX
    if (error) {
        return (
            <div className="profile-content">
                <div className="profile-form">
                    <div className="profile-header">
                        <h1 className="profile-title">My Services</h1>
                        <p className="profile-subtitle">Having trouble loading your data</p>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        margin: '1rem 0'
                    }}>
                        <div style={{ color: '#dc2626', marginBottom: '1rem' }}>
                            {error.includes('Authentication') ? (
                                <>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                        Authentication Required
                                    </div>
                                    <div>Please log in to view your services</div>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                        Unable to Load Data
                                    </div>
                                    <div>{error}</div>
                                </>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
                            {error.includes('Authentication') && (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Go to Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-content">
            <div className="profile-form">
                <div className="profile-header">
                    <h1 className="profile-title">My Services</h1>
                    <p className="profile-subtitle">Manage your service bookings and discover new services.</p>
                </div>

                {/* Stats Overview */}
                <section className="form-section">
                    <h3 className="section-title">Overview</h3>
                    <div className="user-stats-grid">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>
                </section>

                {/* Quick Book Services */}
                <section className="form-section">
                    <SectionHeader
                        title="Book a Service"
                        icon={Plus}
                        actions={
                            <button className="add-btn">
                                <Search size={16} />
                                Browse All
                            </button>
                        }
                    />
                    <div className="services-grid">
                        {popularServices.map((service, index) => (
                            <ServiceCard key={index} service={service} onBook={handleBookService} />
                        ))}
                    </div>
                </section>

                {/* Appointments */}
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
                                    <EmptyState
                                        icon={Calendar}
                                        title="No Upcoming Appointments"
                                        description="Book a service to see your upcoming appointments here."
                                        action={
                                            <button className="add-btn">
                                                <Plus size={16} />
                                                Book Service
                                            </button>
                                        }
                                    />
                                ) : (
                                    upcomingAppointments.map((appointment) => (
                                        <AppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            type="upcoming"
                                            onAction={handleAppointmentAction}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="appointments-list">
                                {filteredAppointments.length === 0 ? (
                                    <EmptyState
                                        icon={Clock}
                                        title="No Service History"
                                        description="Your completed and cancelled services will appear here."
                                    />
                                ) : (
                                    filteredAppointments.map((appointment) => (
                                        <AppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            type="history"
                                            onAction={handleAppointmentAction}
                                        />
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