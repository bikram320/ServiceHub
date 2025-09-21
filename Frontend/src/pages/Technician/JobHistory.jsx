import React, { useState, useEffect } from 'react';
import {
    Clock,
    MapPin,
    Calendar,
    DollarSign,
    Star,
    Filter,
    Search,
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
    Award,
    X,
    Phone,
    Mail,
    ExternalLink
} from 'lucide-react';
import styles from '../../styles/JobHistory.module.css';

const JobHistory = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('all');
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [selectedJobDetails, setSelectedJobDetails] = useState(null);
    const [showRepeatJobModal, setShowRepeatJobModal] = useState(false);
    const [repeatJobData, setRepeatJobData] = useState(null);
    const [exportFormat, setExportFormat] = useState('pdf');

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

    // Filter and sort logic
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

    // Button functionality implementations
    const handleViewDetails = (jobId) => {
        const job = jobHistory.find(j => j.id === jobId);
        setSelectedJobDetails(job);
        setShowJobDetails(true);
    };

    const handleExport = (format = 'pdf') => {
        const data = {
            totalJobs: totalJobs,
            completedJobs: completedJobs,
            totalEarnings: totalEarnings,
            avgRating: avgRating,
            jobs: sortedJobs,
            exportDate: new Date().toISOString(),
            filters: {
                status: selectedFilter,
                dateRange: dateRange,
                searchTerm: searchTerm
            }
        };

        // Create downloadable content
        let content = '';
        let filename = '';
        let mimeType = '';

        if (format === 'csv') {
            // CSV format
            const headers = 'Job ID,Client Name,Service Type,Status,Date,Final Price,Rating,Location\n';
            const rows = sortedJobs.map(job =>
                `${job.id},"${job.client.name}","${job.service.type}",${job.status},${job.timeline.completedDate || job.timeline.scheduledDate},${job.pricing.finalPrice || job.pricing.quotedPrice},${job.rating.clientRating || 'N/A'},"${job.location.address}"`
            ).join('\n');
            content = headers + rows;
            filename = `job-history-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
        } else {
            // JSON format (default)
            content = JSON.stringify(data, null, 2);
            filename = `job-history-${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
        }

        // Create and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`Job history exported successfully as ${format.toUpperCase()}!`);
    };

    const handleRefresh = () => {
        // Reset all filters
        setSelectedFilter('all');
        setSortBy('date');
        setSortOrder('desc');
        setSearchTerm('');
        setDateRange('all');
        setSelectedJobs([]);

        alert('Job history refreshed successfully!');
    };

    const handleRepeatJob = (jobId) => {
        const job = jobHistory.find(j => j.id === jobId);
        if (job && job.status === 'completed') {
            setRepeatJobData({
                ...job,
                id: `JOB${String(jobHistory.length + 1).padStart(3, '0')}`,
                timeline: {
                    ...job.timeline,
                    requestDate: new Date().toISOString().split('T')[0],
                    scheduledDate: null,
                    completedDate: null
                },
                status: 'pending',
                rating: {
                    clientRating: null,
                    clientReview: null,
                    technicianNotes: `Repeat job based on ${job.id}`
                }
            });
            setShowRepeatJobModal(true);
        }
    };

    const confirmRepeatJob = () => {
        if (repeatJobData) {
            setJobHistory(prev => [repeatJobData, ...prev]);
            setShowRepeatJobModal(false);
            setRepeatJobData(null);
            alert(`New job request created: ${repeatJobData.id}`);
        }
    };

    const handleContactClient = (jobId) => {
        // This functionality is excluded as requested
        console.log('Contact functionality not implemented as requested');
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
        { value: 'all', label: 'All Requests', count: jobHistory.length },
        { value: 'new', label: 'New', count: jobHistory.filter(j => j.status === 'new').length || 1 },
        { value: 'pending', label: 'Pending', count: jobHistory.filter(j => j.status === 'pending').length || 2 },
        { value: 'urgent', label: 'Urgent', count: jobHistory.filter(j => j.status === 'urgent').length || 1 }
    ];

    return (
        <div className={styles.profileContent}>
            <div className={styles.profileForm}>
                <div className={styles.profileHeader}>
                    <h1 className={styles.profileTitle}>Job History</h1>
                    <p className={styles.profileSubtitle}>Track your completed jobs, earnings, and client feedback.</p>
                </div>

                {/* Summary Cards */}
                <section className={styles.formSection}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: '#dbeafe' }}>
                                <Activity size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{totalJobs}</div>
                                <div className={styles.statLabel}>Total Jobs</div>
                                <div className={`${styles.statChange} ${styles.positive}`}>+{completedJobs} completed</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: '#d1fae5' }}>
                                <CheckCircle size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{completedJobs}</div>
                                <div className={styles.statLabel}>Completed Jobs</div>
                                <div className={`${styles.statChange} ${styles.positive}`}>{Math.round((completedJobs/totalJobs)*100)}% success rate</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
                                <DollarSign size={24} style={{ color: '#16a34a' }} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>₨{totalEarnings.toLocaleString()}</div>
                                <div className={styles.statLabel}>Total Earnings</div>
                                <div className={`${styles.statChange} ${styles.positive}`}>From completed jobs</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: '#fef7cd' }}>
                                <Star size={24} style={{ color: '#eab308' }} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{avgRating.toFixed(1)}</div>
                                <div className={styles.statLabel}>Average Rating</div>
                                <div className={`${styles.statChange} ${styles.positive}`}>From client reviews</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modern Filter Section */}
                <section className={styles.formSection}>
                    <div className={styles.filterSection}>
                        <div className={styles.filterHeader}>
                            <h3 className={styles.filterHeaderTitle}>
                                <Filter size={20} />
                                Filter & Search
                            </h3>
                            <div className={styles.filterHeaderActions}>
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className={styles.sortSelect}
                                >
                                    <option value="json">JSON</option>
                                    <option value="csv">CSV</option>
                                </select>
                                <button
                                    onClick={() => handleExport(exportFormat)}
                                    className={`${styles.actionBtn} ${styles.secondary}`}
                                >
                                    <Download size={16} />
                                    Export
                                </button>
                                <button
                                    onClick={handleRefresh}
                                    className={`${styles.actionBtn} ${styles.secondary}`}
                                >
                                    <RefreshCw size={16} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <div className={styles.searchContainer}>
                            <div className={styles.searchInputWrapper}>
                                <Search size={20} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Search by client name, service type, or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>

                        <div className={styles.filterTabsAndSort}>
                            <div className={styles.filterTabs}>
                                {filterOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`${styles.filterTab} ${selectedFilter === option.value ? styles.active : ''}`}
                                        onClick={() => setSelectedFilter(option.value)}
                                    >
                                        {option.label}
                                        <span className={styles.filterCount}>{option.count}</span>
                                    </button>
                                ))}
                            </div>

                            <div className={styles.sortControls}>
                                <div>
                                    <label>Sort by:</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className={styles.sortSelect}
                                    >
                                        <option value="date">Date</option>
                                        <option value="price">Price</option>
                                        <option value="rating">Rating</option>
                                        <option value="duration">Duration</option>
                                    </select>
                                    <button
                                        className={styles.sortOrderBtn}
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    >
                                        {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Job History List */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>
                            Job Records ({sortedJobs.length})
                        </h3>
                    </div>

                    <div className={styles.jobsList}>
                        {sortedJobs.map((job) => (
                            <div key={job.id} className={`${styles.jobCard} ${styles[job.status]}`}>
                                <div className={styles.jobHeader}>
                                    <div className={styles.jobIdStatus}>
                                        <span className={styles.jobId}>#{job.id}</span>
                                        <div className={styles.statusBadges}>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(job.status) }}
                                            >
                                                {getStatusText(job.status)}
                                            </span>
                                            <span
                                                className={styles.difficultyBadge}
                                                style={{ backgroundColor: getDifficultyColor(job.service.difficulty) }}
                                            >
                                                {job.service.difficulty.charAt(0).toUpperCase() + job.service.difficulty.slice(1)}
                                            </span>
                                            <span
                                                className={styles.paymentBadge}
                                                style={{ backgroundColor: getPaymentStatusColor(job.payments.status) }}
                                            >
                                                {job.payments.status.charAt(0).toUpperCase() + job.payments.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.jobDate}>
                                        <Calendar size={14} />
                                        <span>{job.timeline.completedDate || job.timeline.scheduledDate}</span>
                                    </div>
                                </div>

                                <div className={styles.jobBody}>
                                    <div className={styles.jobMain}>
                                        <div className={styles.serviceInfo}>
                                            <div className={styles.serviceHeader}>
                                                <div className={styles.serviceIcon}>
                                                    {getServiceIcon(job.service.category)}
                                                </div>
                                                <div className={styles.serviceDetails}>
                                                    <h4 className={styles.serviceTitle}>{job.service.type}</h4>
                                                    <p className={styles.serviceDescription}>{job.service.description}</p>
                                                </div>
                                            </div>

                                            <div className={styles.jobMeta}>
                                                <div className={styles.metaItem}>
                                                    <Clock size={14} />
                                                    <span>Duration: {job.service.duration}</span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <MapPin size={14} />
                                                    <span>{job.location.address}</span>
                                                </div>
                                                {job.timeline.startTime && job.timeline.endTime && (
                                                    <div className={styles.metaItem}>
                                                        <Calendar size={14} />
                                                        <span>{job.timeline.startTime} - {job.timeline.endTime}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.clientInfo}>
                                            <div className={styles.clientHeader}>
                                                <div className={styles.clientAvatar}>
                                                    {job.client.avatar}
                                                </div>
                                                <div className={styles.clientDetails}>
                                                    <h5 className={styles.clientName}>{job.client.name}</h5>
                                                    <div className={styles.clientRating}>
                                                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                                        <span>{job.client.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.jobPricing}>
                                        <div className={styles.pricingDetails}>
                                            <div className={styles.priceItem}>
                                                <span className={styles.priceLabel}>Quoted:</span>
                                                <span className={styles.priceAmount}>₨{job.pricing.quotedPrice.toLocaleString()}</span>
                                            </div>
                                            {job.pricing.finalPrice && (
                                                <div className={`${styles.priceItem} ${styles.final}`}>
                                                    <span className={styles.priceLabel}>Final:</span>
                                                    <span className={styles.priceAmount}>₨{job.pricing.finalPrice.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {job.pricing.additionalCharges !== 0 && (
                                                <div className={`${styles.priceItem} ${styles.additional}`}>
                                                    <span className={styles.priceLabel}>Additional:</span>
                                                    <span className={`${styles.priceAmount} ${job.pricing.additionalCharges > 0 ? styles.positive : styles.negative}`}>
                                                        {job.pricing.additionalCharges > 0 ? '+' : ''}₨{Math.abs(job.pricing.additionalCharges).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {job.rating.clientRating && (
                                        <div className={styles.jobReview}>
                                            <div className={styles.reviewRating}>
                                                <div className={styles.ratingStars}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            fill={i < job.rating.clientRating ? "#fbbf24" : "none"}
                                                            color="#fbbf24"
                                                        />
                                                    ))}
                                                </div>
                                                <span className={styles.ratingNumber}>{job.rating.clientRating}</span>
                                            </div>
                                            <p className={styles.reviewText}>"{job.rating.clientReview}"</p>
                                        </div>
                                    )}

                                    {job.rating.technicianNotes && (
                                        <div className={styles.technicianNotes}>
                                            <div className={styles.notesHeader}>
                                                <FileText size={16} />
                                                <span>Notes:</span>
                                            </div>
                                            <p className={styles.notesText}>{job.rating.technicianNotes}</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.jobActions}>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={`${styles.actionBtn} ${styles.secondary}`}
                                            onClick={() => handleViewDetails(job.id)}
                                        >
                                            <Eye size={16} />
                                            Details
                                        </button>
                                        {job.status === 'completed' && (
                                            <button
                                                className={`${styles.actionBtn} ${styles.success}`}
                                                onClick={() => handleRepeatJob(job.id)}
                                            >
                                                <RotateCcw size={16} />
                                                Repeat
                                            </button>
                                        )}
                                        <button
                                            className={`${styles.actionBtn} ${styles.primary}`}
                                            onClick={() => handleContactClient(job.id)}
                                            disabled
                                        >
                                            <MessageSquare size={16} />
                                            Contact
                                        </button>
                                    </div>

                                    {job.images && job.images.length > 0 && (
                                        <div className={styles.jobAttachments}>
                                            <span className={styles.attachmentsLabel}>Files:</span>
                                            {job.images.map((file, index) => (
                                                <span key={index} className={styles.attachmentFile}>{file}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedJobs.length === 0 && (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Activity size={48} style={{ color: '#9ca3af' }} />
                            </div>
                            <div className={styles.emptyMessage}>
                                <h4>No jobs found</h4>
                                <p>Try adjusting your filters or search terms to find relevant job history.</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Job Details Modal */}
            {showJobDetails && selectedJobDetails && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                Job Details - {selectedJobDetails.id}
                            </h2>
                            <button
                                onClick={() => setShowJobDetails(false)}
                                className={styles.modalCloseBtn}
                            >
                                <X size={24} color="#6b7280" />
                            </button>
                        </div>

                        <div className={styles.modalSection}>
                            <h3 className={styles.modalSectionTitle}>Client Information</h3>
                            <div className={styles.modalSectionContent}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div className={styles.clientAvatar}>
                                        {selectedJobDetails.client.avatar}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
                                            {selectedJobDetails.client.name}
                                        </h4>
                                        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                                            <span>{selectedJobDetails.client.phone}</span>
                                            <span>{selectedJobDetails.client.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowJobDetails(false)}
                                className={`${styles.actionBtn} ${styles.primary}`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Repeat Job Modal */}
            {showRepeatJobModal && repeatJobData && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Create Repeat Job</h2>
                            <button
                                onClick={() => setShowRepeatJobModal(false)}
                                className={styles.modalCloseBtn}
                            >
                                <X size={24} color="#6b7280" />
                            </button>
                        </div>

                        <div className={styles.modalSection}>
                            <div className={styles.modalSectionContent}>
                                <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>
                                    Create a new job request based on the previous job details.
                                </p>
                                <div style={{ marginBottom: '12px' }}>
                                    <strong>Service:</strong> {repeatJobData.service.type}
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <strong>Client:</strong> {repeatJobData.client.name}
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <strong>Price:</strong> ₨{repeatJobData.pricing.quotedPrice.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button
                                onClick={() => setShowRepeatJobModal(false)}
                                className={`${styles.actionBtn} ${styles.secondary}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRepeatJob}
                                className={`${styles.actionBtn} ${styles.success}`}
                            >
                                <RotateCcw size={16} />
                                Create Repeat Job
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobHistory;