import React, { useState, useMemo } from 'react';
import {
    Star,
    Search,
    Filter,
    Eye,
    Check,
    X,
    AlertTriangle,
    Clock,
    Calendar,
    MapPin,
    Phone,
    Mail,
    User,
    Wrench,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Flag,
    CheckCircle,
    XCircle,
    Download,
    TrendingUp,
    BarChart3,
    Users,
    Award,
    Zap,
    Droplets,
    Hammer,
    Settings,
    Home
} from 'lucide-react';
//import "../../styles/RatingsAndReviews.css";

const RatingsAndReviews = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedReview, setSelectedReview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'details', 'moderate', 'analytics'
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Categories with icons
    const categories = {
        'Electrician': { icon: Zap, color: '#eab308' },
        'Plumber': { icon: Droplets, color: '#3b82f6' },
        'Carpenter': { icon: Hammer, color: '#8b5cf6' },
        'AC Technician': { icon: Settings, color: '#10b981' },
        'Home Appliance': { icon: Home, color: '#f59e0b' }
    };

    // Sample reviews and ratings data
    const [reviews, setReviews] = useState([
        {
            id: 1,
            customerId: 101,
            customerName: 'Sita Sharma',
            customerEmail: 'sita.sharma@email.com',
            customerPhone: '+977-9861234567',
            technicianId: 3,
            technicianName: 'Suresh Tamang',
            technicianCategory: 'Electrician',
            jobId: 'JOB-2024-001',
            jobTitle: 'House Wiring Installation',
            rating: 5,
            review: 'Excellent work! Suresh was very professional and completed the wiring installation perfectly. He explained everything clearly and cleaned up after the work. Highly recommended!',
            date: '2024-11-15',
            status: 'published', // published, pending, hidden, flagged
            isVerified: true,
            helpfulVotes: 12,
            reportCount: 0,
            adminNotes: '',
            jobCompletionDate: '2024-11-14',
            responseFromTechnician: 'Thank you for your kind words! It was a pleasure working on your project.'
        },
        {
            id: 2,
            customerId: 102,
            customerName: 'Ram Bahadur',
            customerEmail: 'ram.bahadur@email.com',
            customerPhone: '+977-9871234567',
            technicianId: 4,
            technicianName: 'Krishna Maharjan',
            technicianCategory: 'Plumber',
            jobId: 'JOB-2024-002',
            jobTitle: 'Bathroom Pipe Repair',
            rating: 4,
            review: 'Good service overall. Krishna fixed the leaking pipes quickly, but arrived 30 minutes late. Work quality was good though.',
            date: '2024-11-14',
            status: 'published',
            isVerified: true,
            helpfulVotes: 8,
            reportCount: 0,
            adminNotes: '',
            jobCompletionDate: '2024-11-13',
            responseFromTechnician: 'Sorry for the delay. Traffic was heavy that day. Thank you for understanding!'
        },
        {
            id: 3,
            customerId: 103,
            customerName: 'Maya Gurung',
            customerEmail: 'maya.gurung@email.com',
            customerPhone: '+977-9881234567',
            technicianId: 5,
            technicianName: 'Deepak Rai',
            technicianCategory: 'Carpenter',
            jobId: 'JOB-2024-003',
            jobTitle: 'Kitchen Cabinet Installation',
            rating: 2,
            review: 'Very disappointed with the service. The cabinet doors are not aligned properly and there are visible scratches on the wood. Had to call him back twice to fix issues.',
            date: '2024-11-13',
            status: 'flagged',
            isVerified: true,
            helpfulVotes: 3,
            reportCount: 2,
            adminNotes: 'Customer complaint received. Technician contacted for resolution.',
            jobCompletionDate: '2024-11-11',
            responseFromTechnician: 'I apologize for the inconvenience. I will come back to fix the alignment issues this week.'
        },
        {
            id: 4,
            customerId: 104,
            customerName: 'Prakash Shrestha',
            customerEmail: 'prakash.shrestha@email.com',
            customerPhone: '+977-9841234568',
            technicianId: 3,
            technicianName: 'Suresh Tamang',
            technicianCategory: 'Electrician',
            jobId: 'JOB-2024-004',
            jobTitle: 'Fan Installation',
            rating: 5,
            review: 'Perfect installation! Very clean work and reasonable pricing. Suresh is highly skilled and professional.',
            date: '2024-11-12',
            status: 'published',
            isVerified: true,
            helpfulVotes: 6,
            reportCount: 0,
            adminNotes: '',
            jobCompletionDate: '2024-11-11',
            responseFromTechnician: 'Thank you for the positive feedback!'
        },
        {
            id: 5,
            customerId: 105,
            customerName: 'Anita Pandey',
            customerEmail: 'anita.pandey@email.com',
            customerPhone: '+977-9851234568',
            technicianId: 4,
            technicianName: 'Krishna Maharjan',
            technicianCategory: 'Plumber',
            jobId: 'JOB-2024-005',
            jobTitle: 'Water Heater Repair',
            rating: 3,
            review: 'Average service. Fixed the immediate problem but didn\'t explain what caused the issue. Could have been more informative.',
            date: '2024-11-11',
            status: 'pending',
            isVerified: false,
            helpfulVotes: 0,
            reportCount: 0,
            adminNotes: 'Awaiting verification from job completion records.',
            jobCompletionDate: '2024-11-10',
            responseFromTechnician: ''
        }
    ]);

    // Search function
    const matchesSearchTerm = (review, term) => {
        if (!term || term.trim() === '') return true;

        const cleanTerm = term.toLowerCase().trim();
        const searchableText = [
            review.customerName || '',
            review.technicianName || '',
            review.jobTitle || '',
            review.review || '',
            review.technicianCategory || '',
            review.jobId || ''
        ].join(' ').toLowerCase();

        return searchableText.includes(cleanTerm);
    };

    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    // Filter and search reviews
    const filteredReviews = useMemo(() => {
        let filtered = reviews.filter(review => {
            const matchesSearch = matchesSearchTerm(review, searchTerm);

            const matchesRating = ratingFilter === 'all' || (() => {
                switch (ratingFilter) {
                    case '5': return review.rating === 5;
                    case '4': return review.rating === 4;
                    case '3': return review.rating === 3;
                    case '2': return review.rating === 2;
                    case '1': return review.rating === 1;
                    case 'high': return review.rating >= 4;
                    case 'low': return review.rating <= 2;
                    default: return true;
                }
            })();

            const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || review.technicianCategory === categoryFilter;

            const matchesDate = dateFilter === 'all' || (() => {
                const reviewDate = new Date(review.date);
                const now = new Date();
                const daysDiff = (now - reviewDate) / (1000 * 60 * 60 * 24);

                switch (dateFilter) {
                    case 'today': return daysDiff <= 1;
                    case 'week': return daysDiff <= 7;
                    case 'month': return daysDiff <= 30;
                    default: return true;
                }
            })();

            return matchesSearch && matchesRating && matchesStatus && matchesCategory && matchesDate;
        });

        // Enhanced sorting
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'date' || sortBy === 'jobCompletionDate') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (typeof aVal === 'string' && typeof bVal === 'string') {
                aVal = normalizeText(aVal);
                bVal = normalizeText(bVal);
            }

            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return sortOrder === 'asc' ? 1 : -1;
            if (bVal == null) return sortOrder === 'asc' ? -1 : 1;

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });

        return filtered;
    }, [reviews, searchTerm, ratingFilter, statusFilter, categoryFilter, dateFilter, sortBy, sortOrder]);

    // Analytics calculations
    const analytics = useMemo(() => {
        const totalReviews = reviews.length;
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        const ratingDistribution = {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length
        };

        const statusCounts = reviews.reduce((acc, review) => {
            acc[review.status] = (acc[review.status] || 0) + 1;
            return acc;
        }, {});

        return {
            totalReviews,
            avgRating,
            ratingDistribution,
            statusCounts,
            pendingReviews: statusCounts.pending || 0,
            flaggedReviews: statusCounts.flagged || 0
        };
    }, [reviews]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'hidden': return '#6b7280';
            case 'flagged': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'published': return CheckCircle;
            case 'pending': return Clock;
            case 'hidden': return XCircle;
            case 'flagged': return Flag;
            default: return AlertTriangle;
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

    const handleReviewAction = (review, action) => {
        setSelectedReview(review);
        setModalType(action);
        setShowModal(true);
    };

    const handleApproveReview = (reviewId) => {
        setReviews(reviews.map(review =>
            review.id === reviewId ? { ...review, status: 'published' } : review
        ));
        setShowModal(false);
    };

    const handleHideReview = (reviewId) => {
        setReviews(reviews.map(review =>
            review.id === reviewId ? { ...review, status: 'hidden' } : review
        ));
        setShowModal(false);
    };

    const handleFlagReview = (reviewId) => {
        setReviews(reviews.map(review =>
            review.id === reviewId ? { ...review, status: 'flagged' } : review
        ));
        setShowModal(false);
    };

    const Modal = ({ show, onClose, children }) => {
        if (!show) return null;

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="user-management">
            <div className="user-management-container">
                {/* Header */}
                <div className="page-header">
                    <div className="page-header-top">
                        <h1 className="page-title">
                            <Star size={28} />
                            Ratings & Reviews Management
                        </h1>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="export-btn"
                                onClick={() => handleReviewAction(null, 'analytics')}
                                style={{ background: '#8b5cf6' }}
                            >
                                <BarChart3 size={16} />
                                Analytics
                            </button>
                            <button className="export-btn">
                                <Download size={16} />
                                Export Reviews
                            </button>
                        </div>
                    </div>
                    <p className="page-subtitle">Monitor and moderate customer reviews and ratings for technicians</p>
                </div>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-icon total">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{analytics.totalReviews}</div>
                            <div className="summary-label">Total Reviews</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon active" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                            <Star size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{analytics.avgRating.toFixed(1)}</div>
                            <div className="summary-label">Average Rating</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon pending">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{analytics.pendingReviews}</div>
                            <div className="summary-label">Pending Reviews</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon blocked">
                            <Flag size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{analytics.flaggedReviews}</div>
                            <div className="summary-label">Flagged Reviews</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="filters-section">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by customer, technician, job, or review content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters">
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">⭐ 5 Stars</option>
                            <option value="4">⭐ 4 Stars</option>
                            <option value="3">⭐ 3 Stars</option>
                            <option value="2">⭐ 2 Stars</option>
                            <option value="1">⭐ 1 Star</option>
                            <option value="high">High (4-5 ⭐)</option>
                            <option value="low">Low (1-2 ⭐)</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="pending">Pending</option>
                            <option value="hidden">Hidden</option>
                            <option value="flagged">Flagged</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            <option value="Electrician">Electrician</option>
                            <option value="Plumber">Plumber</option>
                            <option value="Carpenter">Carpenter</option>
                            <option value="AC Technician">AC Technician</option>
                            <option value="Home Appliance">Home Appliance</option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>

                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="filter-select"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="rating-desc">Highest Rating</option>
                            <option value="rating-asc">Lowest Rating</option>
                            <option value="helpfulVotes-desc">Most Helpful</option>
                        </select>
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Customer & Job</th>
                            <th>Technician</th>
                            <th>Rating & Review</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Engagement</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredReviews.map(review => {
                            const StatusIcon = getStatusIcon(review.status);
                            const CategoryIcon = categories[review.technicianCategory]?.icon || Settings;
                            return (
                                <tr key={review.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="user-name">{review.customerName}</div>
                                                <div className="user-location">
                                                    <Wrench size={10} />
                                                    {review.jobId}
                                                </div>
                                                <div className="specialization">
                                                    {review.jobTitle.length > 25
                                                        ? review.jobTitle.substring(0, 25) + '...'
                                                        : review.jobTitle}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-type">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <CategoryIcon size={14} color={categories[review.technicianCategory]?.color} />
                                                {review.technicianName}
                                            </div>
                                            <div className="specialization">{review.technicianCategory}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-type">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                                                {renderStars(review.rating, 14)}
                                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                            <div className="specialization" style={{ lineHeight: '1.3' }}>
                                                {review.review.length > 80
                                                    ? review.review.substring(0, 80) + '...'
                                                    : review.review}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-info">
                                            <Calendar size={12} />
                                            {new Date(review.date).toLocaleDateString()}
                                        </div>
                                        {review.isVerified && (
                                            <div className="specialization" style={{ color: '#10b981', marginTop: '0.25rem' }}>
                                                <CheckCircle size={10} />
                                                Verified
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="status-badge" style={{ color: getStatusColor(review.status) }}>
                                            <StatusIcon size={14} />
                                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                        </div>
                                        {review.reportCount > 0 && (
                                            <div className="specialization" style={{ color: '#dc2626', marginTop: '0.25rem' }}>
                                                <Flag size={10} />
                                                {review.reportCount} reports
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="user-type">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                                                <ThumbsUp size={12} color="#10b981" />
                                                <span>{review.helpfulVotes} helpful</span>
                                            </div>
                                            {review.responseFromTechnician && (
                                                <div className="specialization" style={{ color: '#3b82f6' }}>
                                                    <MessageSquare size={10} />
                                                    Response given
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view"
                                                onClick={() => handleReviewAction(review, 'details')}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {review.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="action-btn approve"
                                                        onClick={() => handleApproveReview(review.id)}
                                                        title="Approve Review"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleHideReview(review.id)}
                                                        title="Hide Review"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}

                                            {review.status === 'published' && (
                                                <>
                                                    <button
                                                        className="action-btn block"
                                                        onClick={() => handleHideReview(review.id)}
                                                        title="Hide Review"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleFlagReview(review.id)}
                                                        title="Flag Review"
                                                    >
                                                        <Flag size={16} />
                                                    </button>
                                                </>
                                            )}

                                            {(review.status === 'hidden' || review.status === 'flagged') && (
                                                <button
                                                    className="action-btn approve"
                                                    onClick={() => handleApproveReview(review.id)}
                                                    title="Publish Review"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {filteredReviews.length === 0 && (
                        <div className="no-results">
                            <Star size={48} />
                            <h3>No reviews found</h3>
                            <p>Try adjusting your search criteria or filters</p>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    {modalType === 'details' && selectedReview && (
                        <div className="modal-body">
                            <div className="modal-header">
                                <h3>Review Details</h3>
                                <button onClick={() => setShowModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="profile-details">
                                <div className="profile-section">
                                    <h4>Review Information</h4>
                                    <div className="profile-grid">
                                        <div className="profile-item">
                                            <label>Job ID</label>
                                            <span>{selectedReview.jobId}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Job Title</label>
                                            <span>{selectedReview.jobTitle}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Job Completed</label>
                                            <span>{new Date(selectedReview.jobCompletionDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Review Date</label>
                                            <span>{new Date(selectedReview.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h4>Customer Details</h4>
                                    <div className="profile-grid">
                                        <div className="profile-item">
                                            <label>Name</label>
                                            <span>{selectedReview.customerName}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Email</label>
                                            <span>{selectedReview.customerEmail}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Phone</label>
                                            <span>{selectedReview.customerPhone}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Verified Customer</label>
                                            <span style={{ color: selectedReview.isVerified ? '#10b981' : '#dc2626' }}>
                                                {selectedReview.isVerified ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h4>Technician Details</h4>
                                    <div className="profile-grid">
                                        <div className="profile-item">
                                            <label>Name</label>
                                            <span>{selectedReview.technicianName}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Category</label>
                                            <span>{selectedReview.technicianCategory}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h4>Rating & Review</h4>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                            {renderStars(selectedReview.rating, 24)}
                                            <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                                {selectedReview.rating}/5
                                            </span>
                                        </div>
                                        <div style={{
                                            padding: '1rem',
                                            background: '#f8fafc',
                                            borderRadius: '8px',
                                            lineHeight: '1.5',
                                            color: '#1e293b'
                                        }}>
                                            "{selectedReview.review}"
                                        </div>
                                    </div>

                                    {selectedReview.responseFromTechnician && (
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Technician Response</label>
                                            <div style={{
                                                padding: '1rem',
                                                background: '#e0f2fe',
                                                borderRadius: '8px',
                                                lineHeight: '1.5',
                                                color: '#0f172a',
                                                fontStyle: 'italic'
                                            }}>
                                                "{selectedReview.responseFromTechnician}"
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="profile-section">
                                    <h4>Moderation Status</h4>
                                    <div className="profile-grid">
                                        <div className="profile-item">
                                            <label>Status</label>
                                            <span style={{ color: getStatusColor(selectedReview.status) }}>
                                                {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Helpful Votes</label>
                                            <span>{selectedReview.helpfulVotes}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Report Count</label>
                                            <span style={{ color: selectedReview.reportCount > 0 ? '#dc2626' : '#64748b' }}>
                                                {selectedReview.reportCount}
                                            </span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Verified</label>
                                            <span style={{ color: selectedReview.isVerified ? '#10b981' : '#dc2626' }}>
                                                {selectedReview.isVerified ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedReview.adminNotes && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Admin Notes</label>
                                            <div style={{
                                                padding: '1rem',
                                                background: '#fef7cd',
                                                borderRadius: '8px',
                                                color: '#92400e'
                                            }}>
                                                {selectedReview.adminNotes}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-actions">
                                    {selectedReview.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn-approve"
                                                onClick={() => {
                                                    handleApproveReview(selectedReview.id);
                                                }}
                                            >
                                                Approve Review
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => {
                                                    handleHideReview(selectedReview.id);
                                                }}
                                            >
                                                Hide Review
                                            </button>
                                        </>
                                    )}

                                    {selectedReview.status === 'published' && (
                                        <>
                                            <button
                                                className="btn-secondary"
                                                onClick={() => {
                                                    handleHideReview(selectedReview.id);
                                                }}
                                            >
                                                Hide Review
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => {
                                                    handleFlagReview(selectedReview.id);
                                                }}
                                            >
                                                Flag Review
                                            </button>
                                        </>
                                    )}

                                    {(selectedReview.status === 'hidden' || selectedReview.status === 'flagged') && (
                                        <button
                                            className="btn-approve"
                                            onClick={() => {
                                                handleApproveReview(selectedReview.id);
                                            }}
                                        >
                                            Publish Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {modalType === 'analytics' && (
                        <div className="modal-body">
                            <div className="modal-header">
                                <h3>Reviews Analytics</h3>
                                <button onClick={() => setShowModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="profile-details">
                                <div className="profile-section">
                                    <h4>Overall Statistics</h4>
                                    <div className="profile-grid">
                                        <div className="profile-item">
                                            <label>Total Reviews</label>
                                            <span>{analytics.totalReviews}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Average Rating</label>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {analytics.avgRating.toFixed(1)}
                                                {renderStars(Math.round(analytics.avgRating), 14)}
                                            </span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Pending Reviews</label>
                                            <span style={{ color: '#f59e0b' }}>{analytics.pendingReviews}</span>
                                        </div>
                                        <div className="profile-item">
                                            <label>Flagged Reviews</label>
                                            <span style={{ color: '#dc2626' }}>{analytics.flaggedReviews}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h4>Rating Distribution</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[5, 4, 3, 2, 1].map(rating => {
                                            const count = analytics.ratingDistribution[rating];
                                            const percentage = analytics.totalReviews > 0
                                                ? (count / analytics.totalReviews) * 100
                                                : 0;

                                            return (
                                                <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '60px' }}>
                                                        <span>{rating}</span>
                                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                    </div>
                                                    <div style={{
                                                        flex: 1,
                                                        height: '20px',
                                                        background: '#f1f5f9',
                                                        borderRadius: '10px',
                                                        overflow: 'hidden',
                                                        position: 'relative'
                                                    }}>
                                                        <div style={{
                                                            width: `${percentage}%`,
                                                            height: '100%',
                                                            background: rating >= 4 ? '#10b981' : rating >= 3 ? '#f59e0b' : '#dc2626',
                                                            transition: 'width 0.3s ease'
                                                        }}></div>
                                                    </div>
                                                    <div style={{ minWidth: '50px', fontSize: '0.875rem', color: '#64748b' }}>
                                                        {count} ({percentage.toFixed(1)}%)
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h4>Status Distribution</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {Object.entries(analytics.statusCounts).map(([status, count]) => {
                                            const percentage = (count / analytics.totalReviews) * 100;
                                            const color = getStatusColor(status);

                                            return (
                                                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        minWidth: '80px',
                                                        textTransform: 'capitalize',
                                                        color: color,
                                                        fontWeight: '500'
                                                    }}>
                                                        {status}
                                                    </div>
                                                    <div style={{
                                                        flex: 1,
                                                        height: '16px',
                                                        background: '#f1f5f9',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <div style={{
                                                            width: `${percentage}%`,
                                                            height: '100%',
                                                            background: color,
                                                            transition: 'width 0.3s ease'
                                                        }}></div>
                                                    </div>
                                                    <div style={{ minWidth: '50px', fontSize: '0.875rem', color: '#64748b' }}>
                                                        {count} ({percentage.toFixed(1)}%)
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h4>Key Insights</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{
                                            padding: '0.75rem',
                                            background: analytics.avgRating >= 4 ? '#d1fae5' : analytics.avgRating >= 3 ? '#fef3c7' : '#fee2e2',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}>
                                            <strong>Overall Satisfaction:</strong> {
                                            analytics.avgRating >= 4 ? 'Excellent' :
                                                analytics.avgRating >= 3 ? 'Good' :
                                                    'Needs Improvement'
                                        } - Average rating of {analytics.avgRating.toFixed(1)} stars
                                        </div>

                                        {analytics.flaggedReviews > 0 && (
                                            <div style={{
                                                padding: '0.75rem',
                                                background: '#fee2e2',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                color: '#7f1d1d'
                                            }}>
                                                <strong>Action Required:</strong> {analytics.flaggedReviews} flagged reviews need attention
                                            </div>
                                        )}

                                        {analytics.pendingReviews > 0 && (
                                            <div style={{
                                                padding: '0.75rem',
                                                background: '#fef3c7',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                color: '#92400e'
                                            }}>
                                                <strong>Pending Moderation:</strong> {analytics.pendingReviews} reviews awaiting approval
                                            </div>
                                        )}

                                        <div style={{
                                            padding: '0.75rem',
                                            background: '#dbeafe',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            color: '#1e40af'
                                        }}>
                                            <strong>Quality Score:</strong> {
                                            ((analytics.ratingDistribution[4] + analytics.ratingDistribution[5]) / analytics.totalReviews * 100).toFixed(1)
                                        }% of reviews are 4+ stars
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default RatingsAndReviews;