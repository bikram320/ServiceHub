import React, { useState, useEffect } from 'react';
import {
    Calendar,
    CheckCircle,
    Star,
    BookOpen,
    Plus,
    Search,
    Clock,
    AlertCircle,
    XCircle,
    MapPin,
    User,
    Eye,
    Home,
    Wrench,
    Zap,
    Car,
    Scissors,
    Heart
} from 'lucide-react';
import styles from '../../styles/UserDashboard.module.css';

const UserDashboard = ({ sidebarCollapsed = false }) => {
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

    // Get user email from localStorage
    const userEmail = localStorage.getItem('userEmail');

    // API base URL - adjust this based on your setup
    const API_BASE_URL = "http://localhost:8080"; // Adjust port if different

    // Popular services for quick booking
    const popularServices = [
        { icon: Home, name: 'House Cleaning', category: 'Cleaning', startingPrice: '₨1,500' },
        { icon: Wrench, name: 'Plumbing', category: 'Repair', startingPrice: '₨800' },
        { icon: Zap, name: 'Electrical Work', category: 'Repair', startingPrice: '₨1,200' },
        { icon: Car, name: 'Car Wash', category: 'Automotive', startingPrice: '₨500' },
        { icon: Scissors, name: 'Hair Cut', category: 'Beauty', startingPrice: '₨300' },
        { icon: Heart, name: 'Massage', category: 'Wellness', startingPrice: '₨2,000' }
    ];

    // Modal state
    const [modalState, setModalState] = useState({
        isOpen: false,
        appointment: null,
        type: 'details' // 'details' or 'cancel'
    });

    // API functions with proper error handling
    const fetchCurrentServiceBookings = async () => {
        try {
            const url = `${API_BASE_URL}/users/get-current-service-booking?userEmail=${encodeURIComponent(userEmail)}`;
            console.log('Fetching current bookings from:', url);

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
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
                // Handle "Service Not Found" - return empty array instead of error
                console.log('No current bookings found');
                return [];
            }

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to fetch current bookings: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            console.log('Current bookings data:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching current bookings:', error);
            // If it's a "Service Not Found" error, return empty array
            if (error.message.includes('Service Not Found') || error.message.includes('404')) {
                return [];
            }
            throw error;
        }
    };

    const fetchPreviousServiceBookings = async () => {
        try {
            const url = `${API_BASE_URL}/users/get-previous-service-booking?userEmail=${encodeURIComponent(userEmail)}`;
            console.log('Fetching previous bookings from:', url);

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
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
                // Handle "Service Not Found" - return empty array instead of error
                console.log('No previous bookings found');
                return [];
            }

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to fetch previous bookings: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            console.log('Previous bookings data:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching previous bookings:', error);
            // If it's a "Service Not Found" error, return empty array
            if (error.message.includes('Service Not Found') || error.message.includes('404')) {
                return [];
            }
            throw error;
        }
    };

    const fetchDashboardOverview = async () => {
        try {
            const url = `${API_BASE_URL}/users/dashboard-overview?email=${encodeURIComponent(userEmail)}`;
            console.log('Fetching dashboard overview from:', url);

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Dashboard overview response status:', response.status);

            if (response.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to fetch dashboard overview: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            console.log('Dashboard overview data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            throw error;
        }
    };

    const cancelServiceBooking = async (requestId) => {
        try {
            const url = `${API_BASE_URL}/users/cancel-pending-service-booking?userEmail=${encodeURIComponent(userEmail)}&requestId=${requestId}`;
            console.log('Cancelling booking:', url);

            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Cancel booking response status:', response.status);

            if (response.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to cancel booking: ${response.status} - ${errorData}`);
            }

            const result = await response.text();
            console.log('Cancel booking result:', result);
            return result;
        } catch (error) {
            console.error('Error cancelling booking:', error);
            throw error;
        }
    };

    // Transform backend data to match frontend structure
    const transformCurrentBookingData = (backendData) => {
        if (!Array.isArray(backendData)) return [];

        return backendData.map((item, index) => ({
            id: index + 1,
            requestId: item.requestId , // Add requestId for cancellation
            service: item.serviceName || 'Unknown Service',
            provider:item.technicianName || 'Unknown Technician',
            technician: item.technicianName || 'Unknown Technician',
            date: formatDate(item.appointmentTime),
            time: formatTime(item.appointmentTime),
            location: item.technicianAddress || 'Location not specified',
            status: item.status?.toLowerCase() || 'pending',
            price: `₨${item.feeCharge?.toLocaleString() || '0'}`,
            rating: 4.8, // Default since not in DTO
            technicianEmail: item.technicianEmail
        }));
    };

    const transformPreviousBookingData = (backendData) => {
        if (!Array.isArray(backendData)) return [];

        return backendData.map((item, index) => ({
            id: index + 100, // Different ID range for history
            requestId: item.id || index + 100,
            service: item.serviceName || 'Unknown Service',
            provider: item.technicianName || 'Unknown Technician',
            technician: item.technicianName || 'Unknown Technician',
            date: formatDateFull(item.appointmentTime),
            time: formatTime(item.appointmentTime),
            location: item.technicianAddress || 'Location not specified',
            status: item.status?.toLowerCase() || 'completed',
            price: `₨${item.feeCharge?.toLocaleString() || '0'}`,
            rating: 4.8,
            yourRating: 5, // Default since not in DTO
            review: 'Service completed successfully.',
            technicianEmail: item.technicianEmail
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

                // Check if user email is available
                if (!userEmail) {
                    setError('User email not found in localStorage. Please log in again.');
                    setLoading(false);
                    return;
                }

                // Load data with individual error handling
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

                // Handle BigDecimal totalSpent from backend
                const formattedOverview = {
                    ...overview,
                    totalSpent: overview.totalSpent ? parseFloat(overview.totalSpent) : 0
                };
                setDashboardOverview(formattedOverview);

            } catch (error) {
                setError(error.message);
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userEmail]);

    // Helper functions
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'in_progress': return '#3b82f6';
            case 'completed': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle size={16} />;
            case 'in_progress': return <Clock size={16} />;
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

    // Modal component
    const AppointmentModal = ({ isOpen, appointment, type, onClose, onConfirm }) => {
        if (!isOpen || !appointment) return null;

        return (
            <div className={styles['modal-overlay']} onClick={onClose}>
                <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                    <div className={styles['modal-header']}>
                        <h3 className={styles['modal-title']}>
                            {type === 'cancel' ? 'Cancel Appointment' : 'Appointment Details'}
                        </h3>
                        <button className={styles['modal-close']} onClick={onClose}>×</button>
                    </div>

                    <div className={styles['modal-body']}>
                        {type === 'cancel' ? (
                            <div>
                                <p>Are you sure you want to cancel this appointment?</p>
                                <div className={styles['appointment-summary']}>
                                    <h4>{appointment.service}</h4>
                                    <p><strong>Provider:</strong> {appointment.provider}</p>
                                    <p><strong>Date & Time:</strong> {appointment.date}, {appointment.time}</p>
                                    <p><strong>Location:</strong> {appointment.location}</p>
                                    <p><strong>Amount:</strong> {appointment.price}</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles['appointment-details-modal']}>
                                <div className={styles['detail-row']}>
                                    <span className={styles['detail-label']}>Service:</span>
                                    <span className={styles['detail-value']}>{appointment.service}</span>
                                </div>
                                <div className={styles['detail-row']}>
                                    <span className={styles['detail-label']}>Provider:</span>
                                    <span className={styles['detail-value']}>{appointment.provider}</span>
                                </div>
                                <div className={styles['detail-row']}>
                                    <span className={styles['detail-label']}>Technician:</span>
                                    <span className={styles['detail-value']}>{appointment.technician}</span>
                                </div>
                                <div className={styles['detail-row']}>
                                    <span className={styles['detail-label']}>Date & Time:</span>
                                    <span className={styles['detail-value']}>{appointment.date}, {appointment.time}</span>
                                </div>
                                <div className={styles['detail-row']}>
                                    <span className={styles['detail-label']}>Location:</span>
                                    <span className={styles['detail-value']}>{appointment.location}</span>
                                </div>
                                <div className={styles['detail-row']}>
                                    <span className={styles['detail-label']}>Amount:</span>
                                    <span className={styles['detail-value']}>{appointment.price}</span>
                                </div>
                                <div className={styles['detail-row']}>
                                    <span className={styles['detail-label']}>Status:</span>
                                    <span
                                        className={styles['status-badge']}
                                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                                    >
                                        {getStatusIcon(appointment.status)}
                                        {appointment.status}
                                    </span>
                                </div>
                                {appointment.rating && (
                                    <div className={styles['detail-row']}>
                                        <span className={styles['detail-label']}>Provider Rating:</span>
                                        <div className={styles['detail-value']}>
                                            {renderStars(appointment.rating)} ({appointment.rating})
                                        </div>
                                    </div>
                                )}
                                {appointment.yourRating && (
                                    <div className={styles['detail-row']}>
                                        <span className={styles['detail-label']}>Your Rating:</span>
                                        <div className={styles['detail-value']}>
                                            {renderStars(appointment.yourRating)} ({appointment.yourRating})
                                        </div>
                                    </div>
                                )}
                                {appointment.review && (
                                    <div className={styles['detail-row']}>
                                        <span className={styles['detail-label']}>Your Review:</span>
                                        <div className={styles['detail-value']}>"{appointment.review}"</div>
                                    </div>
                                )}
                                {appointment.cancellationReason && (
                                    <div className={styles['detail-row']}>
                                        <span className={styles['detail-label']}>Cancellation Reason:</span>
                                        <span className={styles['detail-value']}>{appointment.cancellationReason}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles['modal-footer']}>
                        {type === 'cancel' ? (
                            <>
                                <button
                                    className={`${styles['action-btn']} ${styles.secondary}`}
                                    onClick={onClose}
                                >
                                    Keep Appointment
                                </button>
                                <button
                                    className={`${styles['action-btn']} ${styles.danger}`}
                                    onClick={onConfirm}
                                >
                                    Cancel Appointment
                                </button>
                            </>
                        ) : (
                            <button
                                className={`${styles['action-btn']} ${styles.primary}`}
                                onClick={onClose}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Event handlers
    const handleViewDetails = (appointmentId) => {
        const appointment = [...upcomingAppointments, ...appointmentHistory].find(apt => apt.id === appointmentId);
        if (appointment) {
            setModalState({
                isOpen: true,
                appointment,
                type: 'details'
            });
        }
    };

    const handleCancelAppointment = (appointmentId) => {
        const appointment = upcomingAppointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            setModalState({
                isOpen: true,
                appointment,
                type: 'cancel'
            });
        }
    };

    const handleConfirmCancel = async () => {
        const appointmentToCancel = modalState.appointment;

        try {
            // Call the backend to cancel the appointment
            await cancelServiceBooking(appointmentToCancel.requestId);

            // Remove from upcoming appointments
            setUpcomingAppointments(prev => prev.filter(apt => apt.id !== appointmentToCancel.id));

            // Add to appointment history with cancelled status
            setAppointmentHistory(prev => [...prev, {
                ...appointmentToCancel,
                status: 'cancelled',
                cancellationReason: 'Cancelled by user'
            }]);

            // Update dashboard overview
            setDashboardOverview(prev => ({
                ...prev,
                upcomingBookings: Math.max(0, prev.upcomingBookings - 1)
            }));

            console.log('Appointment cancelled successfully:', appointmentToCancel.id);

            // Close modal
            setModalState({ isOpen: false, appointment: null, type: 'details' });
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
            alert('Failed to cancel appointment. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, appointment: null, type: 'details' });
    };

    const handleBookAgain = (appointmentId) => {
        const appointment = appointmentHistory.find(apt => apt.id === appointmentId);
        if (appointment) {
            console.log('Booking again:', appointment.service);
            // Navigate to booking page or open booking form
        }
    };

    const handleBookService = (service) => {
        console.log('Book service:', service);
        // TODO: Implement service booking navigation
    };

    // Loading state
    if (loading) {
        return (
            <div className={`${styles['dashboard-wrapper']} ${sidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
                <div className={styles['profile-content']}>
                    <div className={styles['profile-form']}>
                        <div className={styles['profile-header']}>
                            <h1 className={styles['profile-title']}>My Services</h1>
                            <p className={styles['profile-subtitle']}>Loading your service data...</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div>Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state with better UX
    if (error) {
        return (
            <div className={`${styles['dashboard-wrapper']} ${sidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
                <div className={styles['profile-content']}>
                    <div className={styles['profile-form']}>
                        <div className={styles['profile-header']}>
                            <h1 className={styles['profile-title']}>My Services</h1>
                            <p className={styles['profile-subtitle']}>Having trouble loading your data</p>
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
                                {error.includes('Authentication') || error.includes('log in') ? (
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
                                {(error.includes('Authentication') || error.includes('log in')) && (
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
            </div>
        );
    }

    return (
        <div className={`${styles['dashboard-wrapper']} ${sidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
            <div className={styles['profile-content']}>
                <div className={styles['profile-form']}>
                    <div className={styles['profile-header']}>
                        <h1 className={styles['profile-title']}>My Services</h1>
                        <p className={styles['profile-subtitle']}>Manage your service bookings and discover new services.</p>
                    </div>

                {/* Quick Stats */}
                    <section className={styles['form-section']}>
                        <h3 className={styles['section-title']}>Overview</h3>
                        <div className={styles['user-stats-grid']}>
                        <div className={styles['user-stat-card']}>
                            <div className={styles['user-stat-icon']} style={{ backgroundColor: '#dbeafe' }}>
                                <Calendar size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className={styles['user-stat-content']}>
                                <div className={styles['user-stat-number']}>{dashboardOverview.upcomingBookings || upcomingAppointments.length}</div>
                                <div className={styles['user-stat-label']}>Upcoming Bookings</div>
                            </div>
                        </div>

                        <div className={styles['user-stat-card']}>
                            <div className={styles['user-stat-icon']} style={{ backgroundColor: '#dcfce7' }}>
                                <CheckCircle size={24} style={{ color: '#16a34a' }} />
                            </div>
                            <div className={styles['user-stat-content']}>
                                <div className={styles['user-stat-number']}>
                                    {dashboardOverview.completedServices || appointmentHistory.filter(apt => apt.status === 'completed').length}
                                </div>
                                <div className={styles['user-stat-label']}>Completed Services</div>
                            </div>
                        </div>

                        <div className={styles['user-stat-card']}>
                            <div className={styles['user-stat-icon']} style={{ backgroundColor: '#fef3c7' }}>
                                <Star size={24} style={{ color: '#eab308' }} />
                            </div>
                            <div className={styles['user-stat-content']}>
                                <div className={styles['user-stat-number']}>
                                    {dashboardOverview.averageRatingGiven?.toFixed(1) || '0.0'}
                                </div>
                                <div className={styles['user-stat-label']}>Avg Rating Given</div>
                            </div>
                        </div>

                        <div className={styles['user-stat-card']}>
                            <div className={styles['user-stat-icon']} style={{ backgroundColor: '#d1fae5' }}>
                                <BookOpen size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className={styles['user-stat-content']}>
                                <div className={styles['user-stat-number']}>₨{dashboardOverview.totalSpent?.toLocaleString() || '0'}</div>                                <div className={styles['user-stat-label']}>Total Spent</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Book Services */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            <Plus size={20} style={{marginRight: '0.5rem'}} />
                            Book a Service
                        </h3>
                        <button className={styles['add-btn']}>
                            <Search size={16} />
                            Browse All
                        </button>
                    </div>
                    <div className={styles['services-grid']}>
                        {popularServices.map((service, index) => (
                            <div key={index} className={styles['service-card']}>
                                <div className={styles['service-icon']}>
                                    <service.icon size={24} />
                                </div>
                                <div className={styles['service-info']}>
                                    <div className={styles['service-name']}>{service.name}</div>
                                    <div className={styles['service-category']}>{service.category}</div>
                                    <div className={styles['service-price']}>Starting from {service.startingPrice}</div>
                                </div>
                                <button
                                    className={styles['book-btn']}
                                    onClick={() => handleBookService(service)}
                                >
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Appointments Tabs */}
                <section className={styles['form-section']}>
                    <div className={styles['tabs-header']}>
                        <div className={styles['tabs-nav']}>
                            <button
                                className={`${styles['tab-btn']} ${activeTab === 'upcoming' ? styles.active : ''}`}
                                onClick={() => setActiveTab('upcoming')}
                            >
                                <Calendar size={16} />
                                Upcoming ({upcomingAppointments.length})
                            </button>
                            <button
                                className={`${styles['tab-btn']} ${activeTab === 'history' ? styles.active : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                <Clock size={16} />
                                History ({appointmentHistory.length})
                            </button>
                        </div>

                        {activeTab === 'history' && (
                            <div className={styles['appointments-controls']}>
                                <div className={styles['search-box']}>
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className={styles['filter-select']}
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

                    <div className={styles['appointments-content']}>
                        {activeTab === 'upcoming' && (
                            <div className={styles['appointments-list']}>
                                {upcomingAppointments.length === 0 ? (
                                    <div className={styles['empty-state']}>
                                        <Calendar size={48} style={{ color: '#9ca3af' }} />
                                        <h4>No Upcoming Appointments</h4>
                                        <p>Book a service to see your upcoming appointments here.</p>
                                        <button className={styles['add-btn']}>
                                            <Plus size={16} />
                                            Book Service
                                        </button>
                                    </div>
                                ) : (
                                    upcomingAppointments.map((appointment) => (
                                        <div key={appointment.id} className={styles['appointment-card']}>
                                            <div className={styles['appointment-header']}>
                                                <div className={styles['appointment-service-info']}>
                                                    <h4 className={styles['appointment-title']}>{appointment.service}</h4>
                                                    <div className={styles['appointment-provider']}>{appointment.provider}</div>
                                                </div>
                                                <div className={styles['appointment-status']}>
                                                    <span
                                                        className={styles['status-badge']}
                                                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                                                    >
                                                        {getStatusIcon(appointment.status)}
                                                        {appointment.status}
                                                    </span>
                                                    <div className={styles['appointment-price']}>{appointment.price}</div>
                                                </div>
                                            </div>

                                            <div className={styles['appointment-details']}>
                                                <div className={styles['detail-item']}>
                                                    <Calendar size={16} />
                                                    <span>{appointment.date}, {appointment.time}</span>
                                                </div>
                                                <div className={styles['detail-item']}>
                                                    <MapPin size={16} />
                                                    <span>{appointment.location}</span>
                                                </div>
                                                <div className={styles['detail-item']}>
                                                    <User size={16} />
                                                    <span>{appointment.technician}</span>
                                                    <div className={styles['provider-rating']}>
                                                        {renderStars(appointment.rating)}
                                                        <span>({appointment.rating})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles['appointment-actions']}>
                                                <button
                                                    className={`${styles['action-btn']} ${styles.secondary}`}
                                                    onClick={() => handleViewDetails(appointment.id)}
                                                >
                                                    <Eye size={16} />
                                                    Details
                                                </button>
                                                <button
                                                    className={`${styles['action-btn']} ${styles.danger}`}
                                                    onClick={() => handleCancelAppointment(appointment.id)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className={styles['appointments-list']}>
                                {filteredAppointments.length === 0 ? (
                                    <div className={styles['empty-state']}>
                                        <Clock size={48} style={{ color: '#9ca3af' }} />
                                        <h4>No Service History</h4>
                                        <p>Your completed and cancelled services will appear here.</p>
                                    </div>
                                ) : (
                                    filteredAppointments.map((appointment) => (
                                        <div key={appointment.id} className={`${styles['appointment-card']} ${styles['history-card']}`}>
                                            <div className={styles['appointment-header']}>
                                                <div className={styles['appointment-service-info']}>
                                                    <h4 className={styles['appointment-title']}>{appointment.service}</h4>
                                                    <div className={styles['appointment-provider']}>{appointment.provider}</div>
                                                </div>
                                                <div className={styles['appointment-status']}>
                                                    <span
                                                        className={styles['status-badge']}
                                                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                                                    >
                                                        {getStatusIcon(appointment.status)}
                                                        {appointment.status}
                                                    </span>
                                                    <div className={styles['appointment-price']}>{appointment.price}</div>
                                                </div>
                                            </div>

                                            <div className={styles['appointment-details']}>
                                                <div className={styles['detail-item']}>
                                                    <Calendar size={16} />
                                                    <span>{appointment.date}, {appointment.time}</span>
                                                </div>
                                                <div className={styles['detail-item']}>
                                                    <MapPin size={16} />
                                                    <span>{appointment.location}</span>
                                                </div>
                                                <div className={styles['detail-item']}>
                                                    <User size={16} />
                                                    <span>{appointment.technician}</span>
                                                    {appointment.rating && (
                                                        <div className={styles['provider-rating']}>
                                                            {renderStars(appointment.rating)}
                                                            <span>({appointment.rating})</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles['appointment-actions']}>
                                                <button
                                                    className={`${styles['action-btn']} ${styles.secondary}`}
                                                    onClick={() => handleViewDetails(appointment.id)}
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </button>
                                                {appointment.status === 'completed' && (
                                                    <button
                                                        className={`${styles['action-btn']} ${styles.primary}`}
                                                        onClick={() => handleBookAgain(appointment.id)}
                                                    >
                                                        Book Again
                                                    </button>
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
            <AppointmentModal
                isOpen={modalState.isOpen}
                appointment={modalState.appointment}
                type={modalState.type}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
};

export default UserDashboard;