import React, { useState, useEffect } from 'react';
import {
    Clock,
    MapPin,
    User,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    Star,
    Filter,
    Search,
    ChevronDown,
    MessageSquare,
    CheckCircle,
    XCircle,
    Eye,
    AlertCircle,
    Wrench,
    Home,
    Zap,
    Car,
    Settings,
    RefreshCw,
    SortAsc,
    SortDesc
} from 'lucide-react';
import styles from '../../styles/ServiceRequests.module.css';

const ServiceRequests = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [processingRequests, setProcessingRequests] = useState(new Set());
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    // Mock data for service requests
    const [serviceRequests, setServiceRequests] = useState([
        {
            id: 'SR001',
            client: {
                name: 'John Doe',
                avatar: 'JD',
                phone: '+977-9841234567',
                email: 'john.doe@email.com',
                rating: 4.5,
                totalBookings: 12
            },
            service: {
                type: 'Plumbing Repair',
                category: 'plumbing',
                description: 'Kitchen sink is leaking and needs immediate repair. Water is dripping continuously.',
                urgency: 'high',
                estimatedDuration: '2-3 hours',
                preferredTime: 'Morning (9 AM - 12 PM)'
            },
            location: {
                address: 'Thamel, Ward 29, Kathmandu',
                distance: '2.5 km',
                coordinates: { lat: 27.7172, lng: 85.3240 }
            },
            pricing: {
                budget: '₨1,500 - ₨2,500',
                suggestedPrice: 2000,
                negotiable: true
            },
            timeline: {
                requestedDate: '2024-11-16',
                requestedTime: '10:00 AM',
                postedTime: '2 hours ago',
                responseDeadline: '6 hours'
            },
            status: 'pending',
            priority: 'high',
            attachments: ['kitchen-sink.jpg', 'water-damage.jpg']
        },
        {
            id: 'SR002',
            client: {
                name: 'Sarah Wilson',
                avatar: 'SW',
                phone: '+977-9851234567',
                email: 'sarah.wilson@email.com',
                rating: 4.8,
                totalBookings: 8
            },
            service: {
                type: 'House Cleaning',
                category: 'cleaning',
                description: 'Deep cleaning required for 2BHK apartment before moving in. All rooms, kitchen, and bathrooms.',
                urgency: 'medium',
                estimatedDuration: '4-5 hours',
                preferredTime: 'Afternoon (1 PM - 5 PM)'
            },
            location: {
                address: 'Patan Dhoka, Lalitpur',
                distance: '4.2 km',
                coordinates: { lat: 27.6588, lng: 85.3247 }
            },
            pricing: {
                budget: '₨3,000 - ₨4,000',
                suggestedPrice: 3500,
                negotiable: true
            },
            timeline: {
                requestedDate: '2024-11-17',
                requestedTime: '2:00 PM',
                postedTime: '4 hours ago',
                responseDeadline: '4 hours'
            },
            status: 'pending',
            priority: 'medium',
            attachments: ['apartment-layout.pdf']
        },
        {
            id: 'SR003',
            client: {
                name: 'Mike Johnson',
                avatar: 'MJ',
                phone: '+977-9861234567',
                email: 'mike.johnson@email.com',
                rating: 4.2,
                totalBookings: 15
            },
            service: {
                type: 'AC Installation',
                category: 'electrical',
                description: 'Need installation of new split AC unit in bedroom. Includes mounting and electrical connections.',
                urgency: 'low',
                estimatedDuration: '3-4 hours',
                preferredTime: 'Any time'
            },
            location: {
                address: 'Boudha, Kathmandu',
                distance: '8.1 km',
                coordinates: { lat: 27.7211, lng: 85.3621 }
            },
            pricing: {
                budget: '₨5,000 - ₨7,000',
                suggestedPrice: 6000,
                negotiable: false
            },
            timeline: {
                requestedDate: '2024-11-18',
                requestedTime: 'Flexible',
                postedTime: '1 day ago',
                responseDeadline: '2 hours'
            },
            status: 'urgent',
            priority: 'low',
            attachments: ['ac-model.jpg', 'room-dimensions.pdf']
        },
        {
            id: 'SR004',
            client: {
                name: 'Emma Brown',
                avatar: 'EB',
                phone: '+977-9871234567',
                email: 'emma.brown@email.com',
                rating: 4.9,
                totalBookings: 3
            },
            service: {
                type: 'Garden Maintenance',
                category: 'gardening',
                description: 'Monthly garden maintenance including pruning, weeding, and lawn mowing for small garden.',
                urgency: 'low',
                estimatedDuration: '2-3 hours',
                preferredTime: 'Morning (7 AM - 10 AM)'
            },
            location: {
                address: 'Bhaktapur Durbar Square Area',
                distance: '12.3 km',
                coordinates: { lat: 27.6710, lng: 85.4298 }
            },
            pricing: {
                budget: '₨1,200 - ₨1,800',
                suggestedPrice: 1500,
                negotiable: true
            },
            timeline: {
                requestedDate: '2024-11-19',
                requestedTime: '8:00 AM',
                postedTime: '6 hours ago',
                responseDeadline: '12 hours'
            },
            status: 'new',
            priority: 'low',
            attachments: ['garden-current.jpg']
        }
    ]);

    const getServiceIcon = (category) => {
        switch (category) {
            case 'plumbing': return <Wrench size={20} />;
            case 'electrical': return <Zap size={20} />;
            case 'cleaning': return <Home size={20} />;
            case 'gardening': return <Settings size={20} />;
            default: return <Settings size={20} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return '#3b82f6';
            case 'pending': return '#f59e0b';
            case 'urgent': return '#ef4444';
            case 'responded': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'new': return 'New Request';
            case 'pending': return 'Awaiting Response';
            case 'urgent': return 'Response Overdue';
            case 'responded': return 'Response Sent';
            default: return 'Unknown';
        }
    };

    const filteredRequests = serviceRequests.filter(request => {
        const matchesFilter = selectedFilter === 'all' || request.status === selectedFilter;
        const matchesSearch = request.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.location.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const sortedRequests = [...filteredRequests].sort((a, b) => {
        let aValue, bValue;
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        switch (sortBy) {
            case 'date':
                aValue = new Date(a.timeline.requestedDate);
                bValue = new Date(b.timeline.requestedDate);
                break;
            case 'price':
                aValue = a.pricing.suggestedPrice;
                bValue = b.pricing.suggestedPrice;
                break;
            case 'distance':
                aValue = parseFloat(a.location.distance);
                bValue = parseFloat(b.location.distance);
                break;
            case 'priority':
                aValue = priorityOrder[a.priority];
                bValue = priorityOrder[b.priority];
                break;
            default:
                return 0;
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const handleAcceptRequest = async (requestId) => {
        setProcessingRequests(prev => new Set(prev).add(requestId));

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setServiceRequests(prev =>
                prev.map(request =>
                    request.id === requestId
                        ? { ...request, status: 'responded' }
                        : request
                )
            );

            alert(`Request ${requestId} has been accepted! You can now send a quote to the client.`);
        } catch (error) {
            alert('Failed to accept request. Please try again.');
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    const handleDeclineRequest = async (requestId) => {
        setSelectedRequest(serviceRequests.find(r => r.id === requestId));
        setConfirmAction(() => () => performDeclineRequest(requestId));
        setShowConfirmModal(true);
    };

    const performDeclineRequest = async (requestId) => {
        setProcessingRequests(prev => new Set(prev).add(requestId));

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setServiceRequests(prev =>
                prev.filter(request => request.id !== requestId)
            );

        } catch (error) {
            alert('Failed to decline request. Please try again.');
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    const handleViewDetails = (requestId) => {
        const request = serviceRequests.find(r => r.id === requestId);
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const handleRefresh = () => {
        // Simulate data refresh
        setSearchTerm('');
        setSelectedFilter('all');
    };

    const handleConfirmAction = async () => {
        setShowConfirmModal(false);
        if (confirmAction) {
            await confirmAction();
        }
        setConfirmAction(null);
        setSelectedRequest(null);
    };

    const handleCancelAction = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setSelectedRequest(null);
    };

    const filterOptions = [
        { value: 'all', label: 'All Requests', count: serviceRequests.length },
        { value: 'new', label: 'New', count: serviceRequests.filter(r => r.status === 'new').length },
        { value: 'pending', label: 'Pending', count: serviceRequests.filter(r => r.status === 'pending').length },
        { value: 'urgent', label: 'Urgent', count: serviceRequests.filter(r => r.status === 'urgent').length }
    ];

    return (
        <div className={styles['profile-content']}>
            <div className={styles['profile-form']}>
                <div className={styles['profile-header']}>
                    <h1 className={styles['profile-title']}>Service Requests</h1>
                    <p className={styles['profile-subtitle']}>Manage and respond to incoming service requests from clients.</p>
                </div>

                {/* Summary Cards */}
                <section className={styles['form-section']}>
                    <div className={styles['stats-grid']}>
                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#dbeafe' }}>
                                <Clock size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{serviceRequests.length}</div>
                                <div className={styles['stat-label']}>Total Requests</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>+3 today</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#fef3c7' }}>
                                <AlertCircle size={24} style={{ color: '#f59e0b' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{serviceRequests.filter(r => r.status === 'urgent').length}</div>
                                <div className={styles['stat-label']}>Urgent Responses</div>
                                <div className={`${styles['stat-change']} ${styles['negative']}`}>Response overdue</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#d1fae5' }}>
                                <CheckCircle size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>85%</div>
                                <div className={styles['stat-label']}>Response Rate</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>+5% this week</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#e0e7ff' }}>
                                <DollarSign size={24} style={{ color: '#6366f1' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>₨12,500</div>
                                <div className={styles['stat-label']}>Potential Earnings</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>From pending requests</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters and Controls */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            <Filter size={20} style={{marginRight: '0.5rem'}} />
                            Filter & Search
                        </h3>
                        <div className={styles['filter-controls']}>
                            <button className={`${styles['action-btn']} ${styles['secondary']}`} onClick={handleRefresh}>
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className={styles['filter-section']}>
                        <div className={styles['search-container']}>
                            <div className={styles['search-input-wrapper']}>
                                <Search size={20} className={styles['search-icon']} />
                                <input
                                    type="text"
                                    placeholder="Search by client name, service type, or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles['search-input']}
                                />
                            </div>
                        </div>

                        <div className={styles['filter-tabs-and-sort']}>
                            <div className={styles['filter-tabs']}>
                                {filterOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`${styles['filter-tab']} ${selectedFilter === option.value ? styles['active'] : ''}`}
                                        onClick={() => setSelectedFilter(option.value)}
                                    >
                                        {option.label}
                                        <span className={styles['filter-count']}>{option.count}</span>
                                    </button>
                                ))}
                            </div>

                            <div className={styles['sort-controls']}>
                                <label>Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={styles['sort-select']}
                                >
                                    <option value="date">Date</option>
                                    <option value="price">Price</option>
                                    <option value="distance">Distance</option>
                                    <option value="priority">Priority</option>
                                </select>
                                <button
                                    className={styles['sort-order-btn']}
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Requests List */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            Requests ({sortedRequests.length})
                        </h3>
                    </div>

                    <div className={styles['requests-list']}>
                        {sortedRequests.map((request) => {
                            const isProcessing = processingRequests.has(request.id);
                            return (
                                <div key={request.id} className={styles['request-card']}>
                                    <div className={styles['request-header']}>
                                        <div className={styles['request-id-status']}>
                                            <span className={styles['request-id']}>#{request.id}</span>
                                            <div className={styles['status-badges']}>
                                                <span
                                                    className={styles['status-badge']}
                                                    style={{ backgroundColor: getStatusColor(request.status) }}
                                                >
                                                    {getStatusText(request.status)}
                                                </span>
                                                <span
                                                    className={styles['priority-badge']}
                                                    style={{ backgroundColor: getPriorityColor(request.priority) }}
                                                >
                                                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles['request-time']}>
                                            <Clock size={14} />
                                            <span>Posted {request.timeline.postedTime}</span>
                                            <span className={styles['deadline']}>Respond within {request.timeline.responseDeadline}</span>
                                        </div>
                                    </div>

                                    <div className={styles['request-body']}>
                                        <div className={styles['request-main']}>
                                            <div className={styles['service-info']}>
                                                <div className={styles['service-header']}>
                                                    <div className={styles['service-icon']}>
                                                        {getServiceIcon(request.service.category)}
                                                    </div>
                                                    <div className={styles['service-details']}>
                                                        <h4 className={styles['service-title']}>{request.service.type}</h4>
                                                        <p className={styles['service-description']}>{request.service.description}</p>
                                                    </div>
                                                </div>

                                                <div className={styles['service-meta']}>
                                                    <div className={styles['meta-item']}>
                                                        <Calendar size={14} />
                                                        <span>{request.timeline.requestedDate} at {request.timeline.requestedTime}</span>
                                                    </div>
                                                    <div className={styles['meta-item']}>
                                                        <Clock size={14} />
                                                        <span>Duration: {request.service.estimatedDuration}</span>
                                                    </div>
                                                    <div className={styles['meta-item']}>
                                                        <MapPin size={14} />
                                                        <span>{request.location.address} ({request.location.distance} away)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles['client-info']}>
                                                <div className={styles['client-header']}>
                                                    <div className={styles['client-avatar']}>
                                                        {request.client.avatar}
                                                    </div>
                                                    <div className={styles['client-details']}>
                                                        <h5 className={styles['client-name']}>{request.client.name}</h5>
                                                        <div className={styles['client-rating']}>
                                                            <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                                            <span>{request.client.rating}</span>
                                                            <span className={styles['client-bookings']}>({request.client.totalBookings} bookings)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles['client-contact']}>
                                                    <div className={styles['contact-item']}>
                                                        <Phone size={12} />
                                                        <span>{request.client.phone}</span>
                                                    </div>
                                                    <div className={styles['contact-item']}>
                                                        <Mail size={12} />
                                                        <span>{request.client.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles['request-pricing']}>
                                            <div className={styles['pricing-info']}>
                                                <div className={styles['budget-range']}>
                                                    <span className={styles['budget-label']}>Client Budget:</span>
                                                    <span className={styles['budget-amount']}>{request.pricing.budget}</span>
                                                </div>
                                                <div className={styles['suggested-price']}>
                                                    <span className={styles['suggested-label']}>Suggested:</span>
                                                    <span className={styles['suggested-amount']}>₨{request.pricing.suggestedPrice.toLocaleString()}</span>
                                                </div>
                                                {request.pricing.negotiable && (
                                                    <span className={styles['negotiable-badge']}>Negotiable</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles['request-actions']}>
                                        <div className={styles['action-buttons']}>
                                            <button
                                                className={`${styles['action-btn']} ${styles['secondary']}`}
                                                onClick={() => handleViewDetails(request.id)}
                                                disabled={isProcessing}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>
                                            <button
                                                className={`${styles['action-btn']} ${styles['secondary']} ${styles['decline']}`}
                                                onClick={() => handleDeclineRequest(request.id)}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? <RefreshCw size={16} className={styles['spin']} /> : <XCircle size={16} />}
                                                {isProcessing ? 'Processing...' : 'Decline'}
                                            </button>
                                            <button
                                                className={`${styles['action-btn']} ${styles['primary']}`}
                                                onClick={() => handleAcceptRequest(request.id)}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? <RefreshCw size={16} className={styles['spin']} /> : <CheckCircle size={16} />}
                                                {isProcessing ? 'Processing...' : 'Accept & Quote'}
                                            </button>
                                        </div>

                                        {request.attachments && request.attachments.length > 0 && (
                                            <div className={styles['attachments']}>
                                                <span className={styles['attachments-label']}>Attachments:</span>
                                                {request.attachments.map((file, index) => (
                                                    <span key={index} className={styles['attachment-file']}>{file}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {sortedRequests.length === 0 && (
                        <div className={styles['empty-state']}>
                            <div className={styles['empty-icon']}>
                                <Search size={48} style={{ color: '#9ca3af' }} />
                            </div>
                            <div className={styles['empty-message']}>
                                <h4>No requests found</h4>
                                <p>Try adjusting your filters or search terms to find relevant service requests.</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Confirmation Modal */}
                {showConfirmModal && selectedRequest && (
                    <div className={styles['modal-overlay']}>
                        <div className={styles['modal-content']}>
                            <div className={styles['modal-header']}>
                                <h3 className={styles['modal-title']}>Confirm Action</h3>
                                <button
                                    className={styles['modal-close']}
                                    onClick={handleCancelAction}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <div className={styles['modal-body']}>
                                <div className={styles['confirmation-message']}>
                                    <AlertCircle size={48} className={styles['warning-icon']} />
                                    <h4>Are you sure you want to decline this request?</h4>
                                    <p>This action cannot be undone and the request will be permanently removed from your list.</p>
                                </div>
                                <div className={styles['request-summary']}>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Request ID:</span>
                                        <span className={styles['summary-value']}>#{selectedRequest.id}</span>
                                    </div>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Client:</span>
                                        <span className={styles['summary-value']}>{selectedRequest.client.name}</span>
                                    </div>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Service:</span>
                                        <span className={styles['summary-value']}>{selectedRequest.service.type}</span>
                                    </div>
                                    <div className={styles['summary-row']}>
                                        <span className={styles['summary-label']}>Potential Earnings:</span>
                                        <span className={styles['summary-value']}>₨{selectedRequest.pricing.suggestedPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles['modal-actions']}>
                                <button
                                    className={`${styles['action-btn']} ${styles['secondary']}`}
                                    onClick={handleCancelAction}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`${styles['action-btn']} ${styles['decline']}`}
                                    onClick={handleConfirmAction}
                                >
                                    <XCircle size={16} />
                                    Yes, Decline Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Modal */}
                {showDetailsModal && selectedRequest && (
                    <div className={styles['modal-overlay']}>
                        <div className={styles['modal-content']} style={{ maxWidth: '800px' }}>
                            <div className={styles['modal-header']}>
                                <h3 className={styles['modal-title']}>Request Details - #{selectedRequest.id}</h3>
                                <button
                                    className={styles['modal-close']}
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <div className={styles['modal-body']}>
                                <div className={styles['details-grid']}>
                                    <div className={styles['details-section']}>
                                        <h4 className={styles['details-section-title']}>Service Information</h4>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Service Type:</span>
                                            <span className={styles['details-value']}>{selectedRequest.service.type}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Description:</span>
                                            <span className={styles['details-value']}>{selectedRequest.service.description}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Duration:</span>
                                            <span className={styles['details-value']}>{selectedRequest.service.estimatedDuration}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Priority:</span>
                                            <span className={`${styles['details-value']} ${styles['priority-badge']}`} style={{ backgroundColor: getPriorityColor(selectedRequest.priority) }}>
                                                {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles['details-section']}>
                                        <h4 className={styles['details-section-title']}>Client Information</h4>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Name:</span>
                                            <span className={styles['details-value']}>{selectedRequest.client.name}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Phone:</span>
                                            <span className={styles['details-value']}>{selectedRequest.client.phone}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Email:</span>
                                            <span className={styles['details-value']}>{selectedRequest.client.email}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Rating:</span>
                                            <div className={styles['details-value']}>
                                                <div className={styles['rating-display']}>
                                                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                    <span>{selectedRequest.client.rating}</span>
                                                    <span className={styles['booking-count']}>({selectedRequest.client.totalBookings} bookings)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles['details-section']}>
                                        <h4 className={styles['details-section-title']}>Schedule & Location</h4>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Requested Date:</span>
                                            <span className={styles['details-value']}>{selectedRequest.timeline.requestedDate}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Preferred Time:</span>
                                            <span className={styles['details-value']}>{selectedRequest.timeline.requestedTime}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Location:</span>
                                            <span className={styles['details-value']}>{selectedRequest.location.address}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Distance:</span>
                                            <span className={styles['details-value']}>{selectedRequest.location.distance} away</span>
                                        </div>
                                    </div>

                                    <div className={styles['details-section']}>
                                        <h4 className={styles['details-section-title']}>Pricing</h4>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Client Budget:</span>
                                            <span className={styles['details-value']}>{selectedRequest.pricing.budget}</span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Suggested Price:</span>
                                            <span className={styles['details-value']} style={{ color: '#059669', fontWeight: 'bold' }}>
                                                ₨{selectedRequest.pricing.suggestedPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Negotiable:</span>
                                            <span className={styles['details-value']}>
                                                {selectedRequest.pricing.negotiable ?
                                                    <span className={styles['negotiable-yes']}>Yes</span> :
                                                    <span className={styles['negotiable-no']}>No</span>
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                                        <div className={styles['details-section']}>
                                            <h4 className={styles['details-section-title']}>Attachments</h4>
                                            <div className={styles['attachments-list']}>
                                                {selectedRequest.attachments.map((file, index) => (
                                                    <span key={index} className={styles['attachment-file']}>
                                                        {file}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles['modal-actions']}>
                                <button
                                    className={`${styles['action-btn']} ${styles['secondary']}`}
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className={`${styles['action-btn']} ${styles['primary']}`}
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        handleAcceptRequest(selectedRequest.id);
                                    }}
                                    disabled={processingRequests.has(selectedRequest.id)}
                                >
                                    <CheckCircle size={16} />
                                    Accept & Quote
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceRequests;