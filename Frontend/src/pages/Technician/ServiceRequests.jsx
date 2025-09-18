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
import "../../styles/ServiceRequests.css";

const ServiceRequests = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequests, setSelectedRequests] = useState([]);

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

    const handleAcceptRequest = (requestId) => {
        console.log('Accepting request:', requestId);
        // Handle accept logic
    };

    const handleDeclineRequest = (requestId) => {
        console.log('Declining request:', requestId);
        // Handle decline logic
    };

    const handleViewDetails = (requestId) => {
        console.log('Viewing details for:', requestId);
        // Handle view details logic
    };

    const handleSendMessage = (requestId) => {
        console.log('Sending message for:', requestId);
        // Handle message logic
    };

    const filterOptions = [
        { value: 'all', label: 'All Requests', count: serviceRequests.length },
        { value: 'new', label: 'New', count: serviceRequests.filter(r => r.status === 'new').length },
        { value: 'pending', label: 'Pending', count: serviceRequests.filter(r => r.status === 'pending').length },
        { value: 'urgent', label: 'Urgent', count: serviceRequests.filter(r => r.status === 'urgent').length }
    ];

    return (
        <div className="profile-content">
            <div className="profile-form">
                <div className="profile-header">
                    <h1 className="profile-title">Service Requests</h1>
                    <p className="profile-subtitle">Manage and respond to incoming service requests from clients.</p>
                </div>

                {/* Summary Cards */}
                <section className="form-section">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
                                <Clock size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">{serviceRequests.length}</div>
                                <div className="stat-label">Total Requests</div>
                                <div className="stat-change positive">+3 today</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
                                <AlertCircle size={24} style={{ color: '#f59e0b' }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">{serviceRequests.filter(r => r.status === 'urgent').length}</div>
                                <div className="stat-label">Urgent Responses</div>
                                <div className="stat-change negative">Response overdue</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
                                <CheckCircle size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">85%</div>
                                <div className="stat-label">Response Rate</div>
                                <div className="stat-change positive">+5% this week</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
                                <DollarSign size={24} style={{ color: '#6366f1' }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">₨12,500</div>
                                <div className="stat-label">Potential Earnings</div>
                                <div className="stat-change positive">From pending requests</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters and Controls */}
                <section className="form-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <Filter size={20} style={{marginRight: '0.5rem'}} />
                            Filter & Search
                        </h3>
                        <div className="filter-controls">
                            <button className="action-btn secondary" onClick={() => window.location.reload()}>
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="filter-section">
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <Search size={20} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by client name, service type, or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>

                        <div className="filter-tabs">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    className={`filter-tab ${selectedFilter === option.value ? 'active' : ''}`}
                                    onClick={() => setSelectedFilter(option.value)}
                                >
                                    {option.label}
                                    <span className="filter-count">{option.count}</span>
                                </button>
                            ))}
                        </div>

                        <div className="sort-controls">
                            <label>Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="date">Date</option>
                                <option value="price">Price</option>
                                <option value="distance">Distance</option>
                                <option value="priority">Priority</option>
                            </select>
                            <button
                                className="sort-order-btn"
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            >
                                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Service Requests List */}
                <section className="form-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            Requests ({sortedRequests.length})
                        </h3>
                    </div>

                    <div className="requests-list">
                        {sortedRequests.map((request) => (
                            <div key={request.id} className="request-card">
                                <div className="request-header">
                                    <div className="request-id-status">
                                        <span className="request-id">#{request.id}</span>
                                        <div className="status-badges">
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(request.status) }}
                                            >
                                                {getStatusText(request.status)}
                                            </span>
                                            <span
                                                className="priority-badge"
                                                style={{ backgroundColor: getPriorityColor(request.priority) }}
                                            >
                                                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                            </span>
                                        </div>
                                    </div>
                                    <div className="request-time">
                                        <Clock size={14} />
                                        <span>Posted {request.timeline.postedTime}</span>
                                        <span className="deadline">Respond within {request.timeline.responseDeadline}</span>
                                    </div>
                                </div>

                                <div className="request-body">
                                    <div className="request-main">
                                        <div className="service-info">
                                            <div className="service-header">
                                                <div className="service-icon">
                                                    {getServiceIcon(request.service.category)}
                                                </div>
                                                <div className="service-details">
                                                    <h4 className="service-title">{request.service.type}</h4>
                                                    <p className="service-description">{request.service.description}</p>
                                                </div>
                                            </div>

                                            <div className="service-meta">
                                                <div className="meta-item">
                                                    <Calendar size={14} />
                                                    <span>{request.timeline.requestedDate} at {request.timeline.requestedTime}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <Clock size={14} />
                                                    <span>Duration: {request.service.estimatedDuration}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <MapPin size={14} />
                                                    <span>{request.location.address} ({request.location.distance} away)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="client-info">
                                            <div className="client-header">
                                                <div className="client-avatar">
                                                    {request.client.avatar}
                                                </div>
                                                <div className="client-details">
                                                    <h5 className="client-name">{request.client.name}</h5>
                                                    <div className="client-rating">
                                                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                                        <span>{request.client.rating}</span>
                                                        <span className="client-bookings">({request.client.totalBookings} bookings)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="client-contact">
                                                <div className="contact-item">
                                                    <Phone size={12} />
                                                    <span>{request.client.phone}</span>
                                                </div>
                                                <div className="contact-item">
                                                    <Mail size={12} />
                                                    <span>{request.client.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="request-pricing">
                                        <div className="pricing-info">
                                            <div className="budget-range">
                                                <span className="budget-label">Client Budget:</span>
                                                <span className="budget-amount">{request.pricing.budget}</span>
                                            </div>
                                            <div className="suggested-price">
                                                <span className="suggested-label">Suggested:</span>
                                                <span className="suggested-amount">₨{request.pricing.suggestedPrice.toLocaleString()}</span>
                                            </div>
                                            {request.pricing.negotiable && (
                                                <span className="negotiable-badge">Negotiable</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="request-actions">
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => handleViewDetails(request.id)}
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => handleSendMessage(request.id)}
                                        >
                                            <MessageSquare size={16} />
                                            Message
                                        </button>
                                        <button
                                            className="action-btn secondary decline"
                                            onClick={() => handleDeclineRequest(request.id)}
                                        >
                                            <XCircle size={16} />
                                            Decline
                                        </button>
                                        <button
                                            className="action-btn primary"
                                            onClick={() => handleAcceptRequest(request.id)}
                                        >
                                            <CheckCircle size={16} />
                                            Accept & Quote
                                        </button>
                                    </div>

                                    {request.attachments && request.attachments.length > 0 && (
                                        <div className="attachments">
                                            <span className="attachments-label">Attachments:</span>
                                            {request.attachments.map((file, index) => (
                                                <span key={index} className="attachment-file">{file}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedRequests.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <Search size={48} style={{ color: '#9ca3af' }} />
                            </div>
                            <div className="empty-message">
                                <h4>No requests found</h4>
                                <p>Try adjusting your filters or search terms to find relevant service requests.</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ServiceRequests;