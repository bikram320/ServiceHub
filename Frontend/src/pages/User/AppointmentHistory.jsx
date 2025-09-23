import React, { useState, useEffect } from 'react';
import {
    Calendar,
    CheckCircle,
    Star,
    Clock,
    XCircle,
    MapPin,
    User,
    Eye,
    History,
    RotateCcw
} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import FilterAndSearch from "../../Components/common/FilterAndSearch.jsx";
import styles from '../../styles/UserDashboard.module.css';

const AppointmentHistory = ({ sidebarCollapsed = false }) => {
    const navigate = useNavigate();

    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter and Search states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Modal state
    const [modalState, setModalState] = useState({
        isOpen: false,
        appointment: null,
        type: 'details'
    });

    // Fetch appointment history from backend
    const fetchAppointmentHistory = async () => {
        try {
            setLoading(true);
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                navigate('/LoginSignup');
                return;
            }

            const response = await fetch(`/api/users/get-previous-service-booking?userEmail=${userEmail}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                const transformedData = data.map(item => transformBackendData(item));
                setAppointmentHistory(transformedData);
                setError(null);
            } else if (response.status === 404) {
                // No previous bookings found
                setAppointmentHistory([]);
                setError(null);
            } else {
                throw new Error('Failed to fetch appointment history');
            }
        } catch (error) {
            console.error('Error fetching appointment history:', error);
            setError('Failed to load appointment history');
            setAppointmentHistory([]);
        } finally {
            setLoading(false);
        }
    };

    // Transform backend data to match frontend structure
    const transformBackendData = (backendItem) => {
        return {
            id: backendItem.requestId,
            requestId: `REQ${backendItem.requestId}`,
            service: backendItem.serviceName,
            provider: backendItem.technicianName, // Using technician name as provider
            technician: backendItem.technicianName,
            date: formatDate(backendItem.appointmentTime),
            time: formatTime(backendItem.appointmentTime),
            location: backendItem.userAddress || 'Address not provided',
            status: backendItem.status.toLowerCase(),
            price: `₨${backendItem.feeCharge}`,
            rating: backendItem.technicianRating || 0,
            yourRating: backendItem.serviceRating ? Number(backendItem.serviceRating) : null,
            review: backendItem.userReview || null,
            cancellationReason: backendItem.status === 'CANCELLED' ? 'Service was cancelled' : null,
            technicianEmail: backendItem.technicianEmail,
            hasFeedback: backendItem.serviceRating && backendItem.userReview
        };
    };

    // Format date helper
    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format time helper
    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const startTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        // Add 2 hours for end time (you can adjust this based on your business logic)
        const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
        const endTime = endDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `${startTime} - ${endTime}`;
    };

    // Load data on component mount
    useEffect(() => {
        fetchAppointmentHistory();
    }, []);

    // Filter options for appointment history
    const filterOptions = [
        {
            value: 'all',
            label: 'All',
            count: appointmentHistory.length
        },
        {
            value: 'completed',
            label: 'Completed',
            count: appointmentHistory.filter(apt => apt.status === 'completed').length
        },
        {
            value: 'cancelled',
            label: 'Cancelled',
            count: appointmentHistory.filter(apt => apt.status === 'cancelled').length
        }
    ];

    // Sort options for appointment history
    const sortOptions = [
        { value: 'date', label: 'Date' },
        { value: 'service', label: 'Service' },
        { value: 'price', label: 'Price' },
        { value: 'rating', label: 'Your Rating' },
        { value: 'status', label: 'Status' }
    ];

    // Filter and sort appointments
    useEffect(() => {
        let filtered = appointmentHistory.filter(apt => {
            const matchesSearch =
                apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = selectedFilter === 'all' || apt.status === selectedFilter;

            return matchesSearch && matchesFilter;
        });

        // Sort appointments
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'service':
                    aValue = a.service.toLowerCase();
                    bValue = b.service.toLowerCase();
                    break;
                case 'price':
                    aValue = parseInt(a.price.replace('₨', '').replace(',', ''));
                    bValue = parseInt(b.price.replace('₨', '').replace(',', ''));
                    break;
                case 'rating':
                    aValue = a.yourRating || 0;
                    bValue = b.yourRating || 0;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredAppointments(filtered);
    }, [appointmentHistory, searchTerm, selectedFilter, sortBy, sortOrder]);

    // Helper functions
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'confirmed': return '#3b82f6';
            case 'in_progress': return '#10b981';
            case 'completed': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} />;
            case 'confirmed': return <CheckCircle size={16} />;
            case 'in_progress': return <Clock size={16} />;
            case 'completed': return <CheckCircle size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const renderStars = (rating, size = 16) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={size}
                fill={i < rating ? '#fbbf24' : 'none'}
                color={i < rating ? '#fbbf24' : '#d1d5db'}
            />
        ));
    };

    // Filter and search handlers
    const handleRefresh = () => {
        setSearchTerm('');
        setSelectedFilter('all');
        setSortBy('date');
        setSortOrder('desc');
        fetchAppointmentHistory();
    };

    // Submit feedback to backend
    const submitFeedback = async (appointmentId, rating, comment) => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            const response = await fetch('/api/users/user-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
                body: new URLSearchParams({
                    rating: rating,
                    requestId: appointmentId,
                    userEmail: userEmail,
                    comment: comment
                })
            });

            if (response.ok) {
                // Refresh the appointment history to get updated data
                fetchAppointmentHistory();
                alert('Feedback submitted successfully!');
            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback: ' + error.message);
        }
    };

    // Modal component
    const AppointmentModal = ({ isOpen, appointment, type, onClose }) => {
        if (!isOpen || !appointment) return null;

        return (
            <div className={styles['modal-overlay']} onClick={onClose}>
                <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                    <div className={styles['modal-header']}>
                        <h3 className={styles['modal-title']}>Appointment Details</h3>
                        <button className={styles['modal-close']} onClick={onClose}>×</button>
                    </div>

                    <div className={styles['modal-body']}>
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
                    </div>

                    <div className={styles['modal-footer']}>
                        <button
                            className={`${styles['action-btn']} ${styles.primary}`}
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Event handlers
    const handleViewDetails = (appointmentId) => {
        const appointment = appointmentHistory.find(apt => apt.id === appointmentId);
        if (appointment) {
            setModalState({
                isOpen: true,
                appointment,
                type: 'details'
            });
        }
    };

    const handleBookAgain = (appointmentId) => {
        const appointment = appointmentHistory.find(apt => apt.id === appointmentId);
        if (appointment) {
            console.log('Booking again:', appointment.service);
            // Navigate to booking page or open booking form
        }
    };

    const handleGiveFeedback = async (appointmentId) => {
        const rating = prompt('Please rate the service (1-5 stars):');
        if (!rating || rating < 1 || rating > 5) {
            alert('Please provide a valid rating between 1 and 5.');
            return;
        }

        const comment = prompt('Please provide your review:');
        if (!comment) {
            alert('Please provide a comment.');
            return;
        }

        await submitFeedback(appointmentId, rating, comment);
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, appointment: null, type: 'details' });
    };

    if (loading) {
        return (
            <div className={`${styles['dashboard-wrapper']} ${sidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
                <div className={styles['profile-content']}>
                    <div className={styles['loading-spinner']}>Loading appointment history...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles['dashboard-wrapper']} ${sidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
            <div className={styles['profile-content']}>
                <div className={styles['profile-form']}>
                    <div className={styles['profile-header']}>
                        <h1 className={styles['profile-title']}>Appointment History</h1>
                        <p className={styles['profile-subtitle']}>View and manage your past service appointments.</p>
                    </div>

                    {error && (
                        <div className={styles['error-message']}>
                            {error}
                        </div>
                    )}

                    {/* Quick Stats */}
                    <section className={styles['form-section']}>
                        <h3 className={styles['section-title']}>Overview</h3>
                        <div className={styles['user-stats-grid']}>
                            <div className={styles['user-stat-card']}>
                                <div className={styles['user-stat-icon']} style={{ backgroundColor: '#dcfce7' }}>
                                    <History size={24} style={{ color: '#16a34a' }} />
                                </div>
                                <div className={styles['user-stat-content']}>
                                    <div className={styles['user-stat-number']}>{appointmentHistory.length}</div>
                                    <div className={styles['user-stat-label']}>Total Services</div>
                                </div>
                            </div>

                            <div className={styles['user-stat-card']}>
                                <div className={styles['user-stat-icon']} style={{ backgroundColor: '#dcfce7' }}>
                                    <CheckCircle size={24} style={{ color: '#16a34a' }} />
                                </div>
                                <div className={styles['user-stat-content']}>
                                    <div className={styles['user-stat-number']}>
                                        {appointmentHistory.filter(apt => apt.status === 'completed').length}
                                    </div>
                                    <div className={styles['user-stat-label']}>Completed</div>
                                </div>
                            </div>

                            <div className={styles['user-stat-card']}>
                                <div className={styles['user-stat-icon']} style={{ backgroundColor: '#fef2f2' }}>
                                    <XCircle size={24} style={{ color: '#ef4444' }} />
                                </div>
                                <div className={styles['user-stat-content']}>
                                    <div className={styles['user-stat-number']}>
                                        {appointmentHistory.filter(apt => apt.status === 'cancelled').length}
                                    </div>
                                    <div className={styles['user-stat-label']}>Cancelled</div>
                                </div>
                            </div>

                            <div className={styles['user-stat-card']}>
                                <div className={styles['user-stat-icon']} style={{ backgroundColor: '#d1fae5' }}>
                                    <Star size={24} style={{ color: '#10b981' }} />
                                </div>
                                <div className={styles['user-stat-content']}>
                                    <div className={styles['user-stat-number']}>
                                        {appointmentHistory.length > 0 ?
                                            (appointmentHistory
                                                    .filter(apt => apt.yourRating)
                                                    .reduce((acc, apt) => acc + apt.yourRating, 0) /
                                                appointmentHistory.filter(apt => apt.yourRating).length
                                            ).toFixed(1) :
                                            '0.0'
                                        }
                                    </div>
                                    <div className={styles['user-stat-label']}>Avg Rating Given</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Filter and Search */}
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
                        sortOptions={sortOptions}
                    />

                    {/* Appointments History List */}
                    <section className={styles['form-section']}>
                        <div className={styles['section-header']}>
                            <h3 className={styles['section-title']}>
                                <Clock size={20} style={{marginRight: '0.5rem'}} />
                                Service History ({filteredAppointments.length})
                            </h3>
                        </div>

                        <div className={styles['appointments-content']}>
                            <div className={styles['appointments-list']}>
                                {filteredAppointments.length === 0 ? (
                                    <div className={styles['empty-state']}>
                                        <Clock size={48} style={{ color: '#9ca3af' }} />
                                        <h4>No Service History Found</h4>
                                        <p>No appointments match your current search and filter criteria.</p>
                                        <button
                                            className={styles['add-btn']}
                                            onClick={handleRefresh}
                                        >
                                            <RotateCcw size={16} />
                                            Clear Filters
                                        </button>
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
                                                {appointment.yourRating && (
                                                    <div className={styles['detail-item']}>
                                                        <Star size={16} />
                                                        <span>Your Rating: </span>
                                                        <div className={styles['provider-rating']}>
                                                            {renderStars(appointment.yourRating)}
                                                            <span>({appointment.yourRating})</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles['appointment-actions']}>
                                                <button
                                                    className={`${styles['action-btn']} ${styles.secondary}`}
                                                    onClick={() => handleViewDetails(appointment.id)}
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </button>

                                                {/* Only show Give Feedback button for completed services without existing feedback */}
                                                {appointment.status === 'completed' && !appointment.hasFeedback && (
                                                    <button
                                                        className={`${styles['action-btn']} ${styles.feedback}`}
                                                        onClick={() => handleGiveFeedback(appointment.id)}
                                                    >
                                                        <Star size={16} />
                                                        Give Feedback
                                                    </button>
                                                )}

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
                        </div>
                    </section>
                </div>
            </div>

            <AppointmentModal
                isOpen={modalState.isOpen}
                appointment={modalState.appointment}
                type={modalState.type}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default AppointmentHistory;