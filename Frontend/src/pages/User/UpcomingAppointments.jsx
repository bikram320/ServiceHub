import React, { useState, useEffect } from 'react';
import {
    Calendar,
    CheckCircle,
    Star,
    Plus,
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
import FilterAndSearch from "../../Components/common/FilterAndSearch.jsx";
import styles from '../../styles/UserDashboard.module.css';

const UpcomingAppointments = ({ sidebarCollapsed = false }) => {
    // Mock data for upcoming appointments
    const mockUpcomingAppointments = [
        {
            id: 1,
            requestId: 'REQ001',
            service: 'House Cleaning',
            provider: 'CleanPro Services',
            technician: 'Sarah Johnson',
            date: 'Today',
            time: '2:00 PM - 4:00 PM',
            location: '123 Main St, Kathmandu',
            status: 'pending',
            price: '₨1,500',
            rating: 4.8,
            technicianEmail: 'sarah@cleanpro.com'
        },
        {
            id: 2,
            requestId: 'REQ002',
            service: 'Plumbing Repair',
            provider: 'FixIt Solutions',
            technician: 'Mike Chen',
            date: 'Tomorrow',
            time: '10:00 AM - 12:00 PM',
            location: '456 Oak Ave, Lalitpur',
            status: 'pending',
            price: '₨2,200',
            rating: 4.9,
            technicianEmail: 'mike@fixit.com'
        },
        {
            id: 3,
            requestId: 'REQ003',
            service: 'Electrical Work',
            provider: 'PowerTech',
            technician: 'David Kumar',
            date: 'Dec 28',
            time: '3:00 PM - 5:00 PM',
            location: '789 Pine Rd, Bhaktapur',
            status: 'in_progress',
            price: '₨1,800',
            rating: 4.7,
            technicianEmail: 'david@powertech.com'
        },
        {
            id: 4,
            requestId: 'REQ004',
            service: 'Car Wash',
            provider: 'AutoShine',
            technician: 'Ram Sharma',
            date: 'Dec 30',
            time: '11:00 AM - 1:00 PM',
            location: '321 Valley St, Kathmandu',
            status: 'pending',
            price: '₨800',
            rating: 4.6,
            technicianEmail: 'ram@autoshine.com'
        },
        {
            id: 5,
            requestId: 'REQ005',
            service: 'Hair Cut',
            provider: 'Style Studio',
            technician: 'Lisa Tamang',
            date: 'Jan 2',
            time: '4:00 PM - 5:00 PM',
            location: '654 Garden Lane, Patan',
            status: 'in_progress',
            price: '₨500',
            rating: 4.9,
            technicianEmail: 'lisa@stylestudio.com'
        }
    ];

    const [upcomingAppointments, setUpcomingAppointments] = useState(mockUpcomingAppointments);
    const [filteredAppointments, setFilteredAppointments] = useState(mockUpcomingAppointments);

    // Filter and Search states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');

    // Modal state
    const [modalState, setModalState] = useState({
        isOpen: false,
        appointment: null,
        type: 'details'
    });

    // Filter options for appointments
    const filterOptions = [
        {
            value: 'all',
            label: 'All',
            count: upcomingAppointments.length
        },
        {
            value: 'pending',
            label: 'Pending',
            count: upcomingAppointments.filter(apt => apt.status === 'pending').length
        },
        {
            value: 'in_progress',
            label: 'In Progress',
            count: upcomingAppointments.filter(apt => apt.status === 'in_progress').length
        }
        ];

    // Sort options for appointments
    const sortOptions = [
        { value: 'date', label: 'Date' },
        { value: 'service', label: 'Service' },
        { value: 'price', label: 'Price' },
        { value: 'status', label: 'Status' }
    ];

    // Filter and sort appointments
    useEffect(() => {
        let filtered = upcomingAppointments.filter(apt => {
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
                    // Simple date ordering - in real app would use proper date comparison
                    const dateOrder = ['Today', 'Tomorrow'];
                    aValue = dateOrder.indexOf(a.date) !== -1 ? dateOrder.indexOf(a.date) : 999;
                    bValue = dateOrder.indexOf(b.date) !== -1 ? dateOrder.indexOf(b.date) : 999;
                    break;
                case 'service':
                    aValue = a.service.toLowerCase();
                    bValue = b.service.toLowerCase();
                    break;
                case 'price':
                    aValue = parseInt(a.price.replace('₨', '').replace(',', ''));
                    bValue = parseInt(b.price.replace('₨', '').replace(',', ''));
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
    }, [upcomingAppointments, searchTerm, selectedFilter, sortBy, sortOrder]);

    // Helper functions
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'in_progress': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle size={16} />;
            case 'in_progress': return <Clock size={16} />;
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
        setSortOrder('asc');
        // In real app, this would refetch data from API
        console.log('Refreshing appointments...');
    };

    // Modal component
    const AppointmentModal = ({ isOpen, appointment, type, onClose, onConfirm }) => {
        if (!isOpen || !appointment) return null;

        return (
            <div className={`${styles['dashboard-wrapper']} ${sidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
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
                                <div className={styles['detail-row']}>
                                    <span className={styles['detail-label']}>Provider Rating:</span>
                                    <div className={styles['detail-value']}>
                                        {renderStars(appointment.rating)} ({appointment.rating})
                                    </div>
                                </div>
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
            </div>
        );
    };

    // Event handlers
    const handleViewDetails = (appointmentId) => {
        const appointment = upcomingAppointments.find(apt => apt.id === appointmentId);
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
        console.log('Appointment cancelled:', appointmentToCancel.id);
        setModalState({ isOpen: false, appointment: null, type: 'details' });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, appointment: null, type: 'details' });
    };

    return (
        <div className={`${styles['dashboard-wrapper']} ${sidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
            <div className={styles['profile-content']}>
                <div className={styles['profile-form']}>
                    <div className={styles['profile-header']}>
                        <h1 className={styles['profile-title']}>Upcoming Appointments</h1>
                        <p className={styles['profile-subtitle']}>Manage your scheduled service appointments.</p>
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
                                    <div className={styles['user-stat-label']}>Total Upcoming</div>
                                </div>
                            </div>

                            <div className={styles['user-stat-card']}>
                                <div className={styles['user-stat-icon']} style={{ backgroundColor: '#fef3c7' }}>
                                    <AlertCircle size={24} style={{ color: '#f59e0b' }} />
                                </div>
                                <div className={styles['user-stat-content']}>
                                    <div className={styles['user-stat-number']}>
                                        {upcomingAppointments.filter(apt => apt.status === 'pending').length}
                                    </div>
                                    <div className={styles['user-stat-label']}>Pending</div>
                                </div>
                            </div>


                            <div className={styles['user-stat-card']}>
                                <div className={styles['user-stat-icon']} style={{ backgroundColor: '#d1fae5' }}>
                                    <CheckCircle size={24} style={{ color: '#10b981' }} />
                                </div>
                                <div className={styles['user-stat-content']}>
                                    <div className={styles['user-stat-number']}>
                                        ₨{upcomingAppointments.reduce((total, apt) => {
                                        const price = parseInt(apt.price.replace('₨', '').replace(',', '')) || 0;
                                        return total + price;
                                    }, 0).toLocaleString()}
                                    </div>
                                    <div className={styles['user-stat-label']}>Total Value</div>
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

                    {/* Appointments List */}
                    <section className={styles['form-section']}>
                        <div className={styles['section-header']}>
                            <h3 className={styles['section-title']}>
                                <Calendar size={20} style={{marginRight: '0.5rem'}} />
                                Your Appointments ({filteredAppointments.length})
                            </h3>
                            <button className={styles['add-btn']}>
                                <Plus size={16} />
                                Book New Service
                            </button>
                        </div>

                        <div className={styles['appointments-content']}>
                            <div className={styles['appointments-list']}>
                                {filteredAppointments.length === 0 ? (
                                    <div className={styles['empty-state']}>
                                        <Calendar size={48} style={{ color: '#9ca3af' }} />
                                        <h4>No Appointments Found</h4>
                                        <p>No appointments match your current search and filter criteria.</p>
                                        <button
                                            className={styles['add-btn']}
                                            onClick={handleRefresh}
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    filteredAppointments.map((appointment) => (
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
                                                {appointment.status !== 'in_progress' && (
                                                    <button
                                                        className={`${styles['action-btn']} ${styles.danger}`}
                                                        onClick={() => handleCancelAppointment(appointment.id)}
                                                    >
                                                        Cancel
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
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
};

export default UpcomingAppointments;