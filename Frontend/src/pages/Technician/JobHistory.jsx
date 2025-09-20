import React, { useState, useEffect } from 'react';
import Header2 from "../../Components/layout/Header2.jsx";
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
    Settings,
    RefreshCw,
    SortAsc,
    SortDesc,
    Download,
    FileText,
    ThumbsUp,
    ThumbsDown,
    RotateCcw,
    TrendingUp,
    Activity,
    Users,
    Award
} from 'lucide-react';
import "../../styles/JobHistory.css";

const JobHistory = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('all');
    const [selectedJobs, setSelectedJobs] = useState([]);

    // Mock data for job history
    const [jobHistory, setJobHistory] = useState([
        {
            id: 'JOB001',
            serviceRequestId: 'SR001',
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
                description: 'Kitchen sink leakage repair and pipe replacement',
                duration: '3 hours 15 minutes',
                difficulty: 'medium'
            },
            location: {
                address: 'Thamel, Ward 29, Kathmandu',
                distance: '2.5 km'
            },
            pricing: {
                quotedPrice: 2000,
                finalPrice: 2200,
                additionalCharges: 200,
                paymentMethod: 'Cash'
            },
            timeline: {
                requestDate: '2024-11-10',
                scheduledDate: '2024-11-12',
                startTime: '10:00 AM',
                endTime: '1:15 PM',
                completedDate: '2024-11-12'
            },
            status: 'completed',
            rating: {
                clientRating: 4.8,
                clientReview: 'Excellent work! Very professional and punctual. Fixed the issue quickly.',
                technicianNotes: 'Replaced faulty valve and tightened connections. Recommended annual maintenance.'
            },
            images: ['before.jpg', 'after.jpg', 'receipt.pdf'],
            payments: {
                status: 'paid',
                paidDate: '2024-11-12',
                method: 'Cash'
            }
        },
        {
            id: 'JOB002',
            serviceRequestId: 'SR015',
            client: {
                name: 'Sarah Wilson',
                avatar: 'SW',
                phone: '+977-9851234567',
                email: 'sarah.wilson@email.com',
                rating: 4.8,
                totalBookings: 8
            },
            service: {
                type: 'Deep House Cleaning',
                category: 'cleaning',
                description: '2BHK apartment deep cleaning with kitchen and bathroom sanitization',
                duration: '5 hours 30 minutes',
                difficulty: 'easy'
            },
            location: {
                address: 'Patan Dhoka, Lalitpur',
                distance: '4.2 km'
            },
            pricing: {
                quotedPrice: 3500,
                finalPrice: 3500,
                additionalCharges: 0,
                paymentMethod: 'Digital Payment'
            },
            timeline: {
                requestDate: '2024-11-08',
                scheduledDate: '2024-11-09',
                startTime: '9:00 AM',
                endTime: '2:30 PM',
                completedDate: '2024-11-09'
            },
            status: 'completed',
            rating: {
                clientRating: 5.0,
                clientReview: 'Amazing service! House looks brand new. Will definitely book again.',
                technicianNotes: 'Deep cleaned all areas, organized closets, sanitized surfaces. Client very satisfied.'
            },
            images: ['living-room-before.jpg', 'living-room-after.jpg', 'kitchen-after.jpg'],
            payments: {
                status: 'paid',
                paidDate: '2024-11-09',
                method: 'eSewa'
            }
        },
        {
            id: 'JOB003',
            serviceRequestId: 'SR008',
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
                description: 'Split AC installation in bedroom with electrical wiring',
                duration: '4 hours 45 minutes',
                difficulty: 'hard'
            },
            location: {
                address: 'Boudha, Kathmandu',
                distance: '8.1 km'
            },
            pricing: {
                quotedPrice: 6000,
                finalPrice: 6500,
                additionalCharges: 500,
                paymentMethod: 'Bank Transfer'
            },
            timeline: {
                requestDate: '2024-11-05',
                scheduledDate: '2024-11-07',
                startTime: '2:00 PM',
                endTime: '6:45 PM',
                completedDate: '2024-11-07'
            },
            status: 'completed',
            rating: {
                clientRating: 4.2,
                clientReview: 'Good work but took longer than expected. AC works perfectly now.',
                technicianNotes: 'Installation completed. Required additional wiring work due to old electrical setup.'
            },
            images: ['ac-installation.jpg', 'wiring-work.jpg'],
            payments: {
                status: 'paid',
                paidDate: '2024-11-08',
                method: 'Bank Transfer'
            }
        },
        {
            id: 'JOB004',
            serviceRequestId: 'SR022',
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
                description: 'Monthly garden cleanup, pruning, and lawn maintenance',
                duration: '2 hours 30 minutes',
                difficulty: 'easy'
            },
            location: {
                address: 'Bhaktapur Durbar Square Area',
                distance: '12.3 km'
            },
            pricing: {
                quotedPrice: 1500,
                finalPrice: 1500,
                additionalCharges: 0,
                paymentMethod: 'Cash'
            },
            timeline: {
                requestDate: '2024-11-01',
                scheduledDate: '2024-11-03',
                startTime: '7:00 AM',
                endTime: '9:30 AM',
                completedDate: '2024-11-03'
            },
            status: 'completed',
            rating: {
                clientRating: 4.7,
                clientReview: 'Garden looks beautiful! Very knowledgeable about plants.',
                technicianNotes: 'Pruned rose bushes, trimmed hedges, lawn mowing completed. Recommended seasonal fertilizer.'
            },
            images: ['garden-before.jpg', 'garden-after.jpg'],
            payments: {
                status: 'paid',
                paidDate: '2024-11-03',
                method: 'Cash'
            }
        },
        {
            id: 'JOB005',
            serviceRequestId: 'SR019',
            client: {
                name: 'David Kumar',
                avatar: 'DK',
                phone: '+977-9801234567',
                email: 'david.kumar@email.com',
                rating: 3.8,
                totalBookings: 7
            },
            service: {
                type: 'Electrical Repair',
                category: 'electrical',
                description: 'Circuit breaker replacement and wiring inspection',
                duration: '1 hour 45 minutes',
                difficulty: 'medium'
            },
            location: {
                address: 'Baneshwor, Kathmandu',
                distance: '5.7 km'
            },
            pricing: {
                quotedPrice: 1800,
                finalPrice: 1500,
                additionalCharges: -300,
                paymentMethod: 'Digital Payment'
            },
            timeline: {
                requestDate: '2024-10-28',
                scheduledDate: '2024-10-30',
                startTime: '3:00 PM',
                endTime: '4:45 PM',
                completedDate: '2024-10-30'
            },
            status: 'cancelled',
            rating: {
                clientRating: null,
                clientReview: null,
                technicianNotes: 'Client cancelled due to budget constraints. Partial work completed - basic inspection done.'
            },
            images: ['electrical-panel.jpg'],
            payments: {
                status: 'refunded',
                paidDate: null,
                method: null
            }
        },
        {
            id: 'JOB006',
            serviceRequestId: 'SR025',
            client: {
                name: 'Lisa Sharma',
                avatar: 'LS',
                phone: '+977-9811234567',
                email: 'lisa.sharma@email.com',
                rating: 4.6,
                totalBookings: 9
            },
            service: {
                type: 'Bathroom Renovation',
                category: 'plumbing',
                description: 'Complete bathroom renovation with new fixtures and tiling',
                duration: 'In Progress',
                difficulty: 'hard'
            },
            location: {
                address: 'Lazimpat, Kathmandu',
                distance: '3.1 km'
            },
            pricing: {
                quotedPrice: 15000,
                finalPrice: null,
                additionalCharges: 0,
                paymentMethod: 'Bank Transfer'
            },
            timeline: {
                requestDate: '2024-11-13',
                scheduledDate: '2024-11-15',
                startTime: '9:00 AM',
                endTime: 'Ongoing',
                completedDate: null
            },
            status: 'in-progress',
            rating: {
                clientRating: null,
                clientReview: null,
                technicianNotes: 'Day 1: Removed old fixtures. Day 2: Started tiling work. Expected completion: 2 more days.'
            },
            images: ['bathroom-demolition.jpg', 'tiles-progress.jpg'],
            payments: {
                status: 'partial',
                paidDate: '2024-11-15',
                method: 'Bank Transfer'
            }
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'in-progress': return '#3b82f6';
            case 'cancelled': return '#ef4444';
            case 'on-hold': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in-progress': return 'In Progress';
            case 'cancelled': return 'Cancelled';
            case 'on-hold': return 'On Hold';
            default: return 'Unknown';
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'hard': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'partial': return '#3b82f6';
            case 'refunded': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const filteredJobs = jobHistory.filter(job => {
        const matchesFilter = selectedFilter === 'all' || job.status === selectedFilter;
        const matchesSearch = job.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.id.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (dateRange !== 'all') {
            const jobDate = new Date(job.timeline.completedDate || job.timeline.scheduledDate);
            const now = new Date();
            const diffTime = now - jobDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            switch (dateRange) {
                case 'week':
                    matchesDate = diffDays <= 7;
                    break;
                case 'month':
                    matchesDate = diffDays <= 30;
                    break;
                case '3months':
                    matchesDate = diffDays <= 90;
                    break;
                case '6months':
                    matchesDate = diffDays <= 180;
                    break;
                default:
                    matchesDate = true;
            }
        }

        return matchesFilter && matchesSearch && matchesDate;
    });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case 'date':
                aValue = new Date(a.timeline.completedDate || a.timeline.scheduledDate);
                bValue = new Date(b.timeline.completedDate || b.timeline.scheduledDate);
                break;
            case 'price':
                aValue = a.pricing.finalPrice || a.pricing.quotedPrice;
                bValue = b.pricing.finalPrice || b.pricing.quotedPrice;
                break;
            case 'rating':
                aValue = a.rating.clientRating || 0;
                bValue = b.rating.clientRating || 0;
                break;
            case 'duration':
                aValue = a.service.duration;
                bValue = b.service.duration;
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

    const handleViewDetails = (jobId) => {
        console.log('Viewing details for:', jobId);
    };

    const handleDownloadInvoice = (jobId) => {
        console.log('Downloading invoice for:', jobId);
    };

    const handleContactClient = (jobId) => {
        console.log('Contacting client for:', jobId);
    };

    const handleRepeatJob = (jobId) => {
        console.log('Creating repeat job for:', jobId);
    };

    // Calculate summary statistics
    const totalJobs = jobHistory.length;
    const completedJobs = jobHistory.filter(job => job.status === 'completed').length;
    const totalEarnings = jobHistory
        .filter(job => job.status === 'completed' && job.payments.status === 'paid')
        .reduce((sum, job) => sum + (job.pricing.finalPrice || 0), 0);
    const avgRating = jobHistory
        .filter(job => job.rating.clientRating)
        .reduce((sum, job, _, array) => sum + job.rating.clientRating / array.length, 0);

    const filterOptions = [
        { value: 'all', label: 'All Jobs', count: jobHistory.length },
        { value: 'completed', label: 'Completed', count: jobHistory.filter(j => j.status === 'completed').length },
        { value: 'in-progress', label: 'In Progress', count: jobHistory.filter(j => j.status === 'in-progress').length },
        { value: 'cancelled', label: 'Cancelled', count: jobHistory.filter(j => j.status === 'cancelled').length }
    ];

    return (
        <div>
            <Header2 />
        <div className="profile-content">
            <div className="profile-form">
                <div className="profile-header">
                    <h1 className="profile-title">Job History</h1>
                    <p className="profile-subtitle">Track your completed jobs, earnings, and client feedback.</p>
                </div>

                {/* Summary Cards */}
                <section className="form-section">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
                                <Activity size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">{totalJobs}</div>
                                <div className="stat-label">Total Jobs</div>
                                <div className="stat-change positive">+{completedJobs} completed</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
                                <CheckCircle size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">{completedJobs}</div>
                                <div className="stat-label">Completed Jobs</div>
                                <div className="stat-change positive">{Math.round((completedJobs/totalJobs)*100)}% success rate</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
                                <DollarSign size={24} style={{ color: '#16a34a' }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">₨{totalEarnings.toLocaleString()}</div>
                                <div className="stat-label">Total Earnings</div>
                                <div className="stat-change positive">From completed jobs</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: '#fef7cd' }}>
                                <Star size={24} style={{ color: '#eab308' }} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">{avgRating.toFixed(1)}</div>
                                <div className="stat-label">Average Rating</div>
                                <div className="stat-change positive">From client reviews</div>
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
                            <button className="action-btn secondary" onClick={() => handleDownloadInvoice('all')}>
                                <Download size={16} />
                                Export
                            </button>
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
                                    placeholder="Search by client, job type, location, or job ID..."
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
                            <div className="date-range-filter">
                                <label>Time Period:</label>
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="all">All Time</option>
                                    <option value="week">Last Week</option>
                                    <option value="month">Last Month</option>
                                    <option value="3months">Last 3 Months</option>
                                    <option value="6months">Last 6 Months</option>
                                </select>
                            </div>

                            <label>Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="date">Date</option>
                                <option value="price">Price</option>
                                <option value="rating">Rating</option>
                                <option value="duration">Duration</option>
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

                {/* Job History List */}
                <section className="form-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            Job Records ({sortedJobs.length})
                        </h3>
                    </div>

                    <div className="jobs-list">
                        {sortedJobs.map((job) => (
                            <div key={job.id} className="job-card">
                                <div className="job-header">
                                    <div className="job-id-status">
                                        <span className="job-id">#{job.id}</span>
                                        <div className="status-badges">
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(job.status) }}
                                            >
                                                {getStatusText(job.status)}
                                            </span>
                                            <span
                                                className="difficulty-badge"
                                                style={{ backgroundColor: getDifficultyColor(job.service.difficulty) }}
                                            >
                                                {job.service.difficulty.charAt(0).toUpperCase() + job.service.difficulty.slice(1)}
                                            </span>
                                            <span
                                                className="payment-badge"
                                                style={{ backgroundColor: getPaymentStatusColor(job.payments.status) }}
                                            >
                                                {job.payments.status.charAt(0).toUpperCase() + job.payments.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="job-date">
                                        <Calendar size={14} />
                                        <span>{job.timeline.completedDate || job.timeline.scheduledDate}</span>
                                    </div>
                                </div>

                                <div className="job-body">
                                    <div className="job-main">
                                        <div className="service-info">
                                            <div className="service-header">
                                                <div className="service-icon">
                                                    {getServiceIcon(job.service.category)}
                                                </div>
                                                <div className="service-details">
                                                    <h4 className="service-title">{job.service.type}</h4>
                                                    <p className="service-description">{job.service.description}</p>
                                                </div>
                                            </div>

                                            <div className="job-meta">
                                                <div className="meta-item">
                                                    <Clock size={14} />
                                                    <span>Duration: {job.service.duration}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <MapPin size={14} />
                                                    <span>{job.location.address}</span>
                                                </div>
                                                {job.timeline.startTime && job.timeline.endTime && (
                                                    <div className="meta-item">
                                                        <Calendar size={14} />
                                                        <span>{job.timeline.startTime} - {job.timeline.endTime}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="client-info">
                                            <div className="client-header">
                                                <div className="client-avatar">
                                                    {job.client.avatar}
                                                </div>
                                                <div className="client-details">
                                                    <h5 className="client-name">{job.client.name}</h5>
                                                    <div className="client-rating">
                                                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                                        <span>{job.client.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="job-pricing">
                                        <div className="pricing-details">
                                            <div className="price-item">
                                                <span className="price-label">Quoted:</span>
                                                <span className="price-amount">₨{job.pricing.quotedPrice.toLocaleString()}</span>
                                            </div>
                                            {job.pricing.finalPrice && (
                                                <div className="price-item final">
                                                    <span className="price-label">Final:</span>
                                                    <span className="price-amount">₨{job.pricing.finalPrice.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {job.pricing.additionalCharges !== 0 && (
                                                <div className="price-item additional">
                                                    <span className="price-label">Additional:</span>
                                                    <span className={`price-amount ${job.pricing.additionalCharges > 0 ? 'positive' : 'negative'}`}>
                                                        {job.pricing.additionalCharges > 0 ? '+' : ''}₨{Math.abs(job.pricing.additionalCharges).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {job.rating.clientRating && (
                                        <div className="job-review">
                                            <div className="review-rating">
                                                <div className="rating-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            fill={i < job.rating.clientRating ? "#fbbf24" : "none"}
                                                            color="#fbbf24"
                                                        />
                                                    ))}
                                                </div>
                                                <span className="rating-number">{job.rating.clientRating}</span>
                                            </div>
                                            <p className="review-text">"{job.rating.clientReview}"</p>
                                        </div>
                                    )}

                                    {job.rating.technicianNotes && (
                                        <div className="technician-notes">
                                            <div className="notes-header">
                                                <FileText size={16} />
                                                <span>Notes:</span>
                                            </div>
                                            <p className="notes-text">{job.rating.technicianNotes}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="job-actions">
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => handleViewDetails(job.id)}
                                        >
                                            <Eye size={16} />
                                            Details
                                        </button>
                                        {job.status === 'completed' && (
                                            <>
                                                <button
                                                    className="action-btn secondary"
                                                    onClick={() => handleRepeatJob(job.id)}
                                                >
                                                    <RotateCcw size={16} />
                                                    Repeat
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => handleContactClient(job.id)}
                                        >
                                            <MessageSquare size={16} />
                                            Contact
                                        </button>
                                    </div>

                                    {job.images && job.images.length > 0 && (
                                        <div className="job-attachments">
                                            <span className="attachments-label">Files:</span>
                                            {job.images.map((file, index) => (
                                                <span key={index} className="attachment-file">{file}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedJobs.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <Activity size={48} style={{ color: '#9ca3af' }} />
                            </div>
                            <div className="empty-message">
                                <h4>No jobs found</h4>
                                <p>Try adjusting your filters or search terms to find relevant job history.</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
        </div>
    );
};

export default JobHistory;