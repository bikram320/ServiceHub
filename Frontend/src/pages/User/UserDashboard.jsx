import React, { useState } from 'react';
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

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock data for user's appointments
    const [upcomingAppointments, setUpcomingAppointments] = useState([
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
    ]);

    const [appointmentHistory, setAppointmentHistory] = useState([
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
    ]);

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


    const [modalState, setModalState] = useState({
        isOpen: false,
        appointment: null,
        type: 'details' // 'details' or 'cancel'
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

// Updated handlers
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

    const handleConfirmCancel = () => {
        const appointmentToCancel = modalState.appointment;

        // Remove from upcoming appointments
        setUpcomingAppointments(prev => prev.filter(apt => apt.id !== appointmentToCancel.id));

        // Add to appointment history with cancelled status
        setAppointmentHistory(prev => [...prev, {
            ...appointmentToCancel,
            status: 'cancelled',
            cancellationReason: 'Cancelled by user'
        }]);

        console.log('Appointment cancelled:', appointmentToCancel.id);

        // Close modal
        setModalState({ isOpen: false, appointment: null, type: 'details' });
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

    return (
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
                                <div className={styles['user-stat-number']}>{upcomingAppointments.length}</div>
                                <div className={styles['user-stat-label']}>Upcoming Bookings</div>
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
                                <div className={styles['user-stat-label']}>Completed Services</div>
                            </div>
                        </div>

                        {/*<div className={styles['user-stat-card']}>*/}
                        {/*    <div className={styles['user-stat-icon']} style={{ backgroundColor: '#fef3c7' }}>*/}
                        {/*        <Star size={24} style={{ color: '#eab308' }} />*/}
                        {/*    </div>*/}
                        {/*    <div className={styles['user-stat-content']}>*/}
                        {/*        <div className={styles['user-stat-number']}>*/}
                        {/*            {(appointmentHistory*/}
                        {/*                    .filter(apt => apt.yourRating)*/}
                        {/*                    .reduce((sum, apt) => sum + apt.yourRating, 0) /*/}
                        {/*                appointmentHistory.filter(apt => apt.yourRating).length || 0).toFixed(1)}*/}
                        {/*        </div>*/}
                        {/*        <div className={styles['user-stat-label']}>Avg Rating Given</div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className={styles['user-stat-card']}>
                            <div className={styles['user-stat-icon']} style={{ backgroundColor: '#d1fae5' }}>
                                <BookOpen size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className={styles['user-stat-content']}>
                                <div className={styles['user-stat-number']}>₨{totalSpent.toLocaleString()}</div>
                                <div className={styles['user-stat-label']}>Total Spent</div>
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
                                <button className={styles['book-btn']}>Book Now</button>
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