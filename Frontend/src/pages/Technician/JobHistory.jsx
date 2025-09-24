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
import FilterAndSearch from "../../Components/common/FilterAndSearch.jsx";
import styles from '../../styles/ServiceRequests.module.css';

const JobHistory = ({ isSidebarCollapsed = false }) => {
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
    const [jobHistory, setJobHistory] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get technician email from localStorage (same pattern as ServiceRequests)
    const getTechnicianEmail = () => {
        return localStorage.getItem('userEmail'); // Assuming technician email is stored as userEmail
    };

    // Fetch feedbacks from backend
    const fetchFeedbacks = async () => {
        try {
            const technicianEmail = getTechnicianEmail();
            if (!technicianEmail) return;

            const response = await fetch(`/api/technician/get-feedbacks?email=${encodeURIComponent(technicianEmail)}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Raw Feedbacks Data:', data);
                setFeedbacks(data);
            } else if (response.status === 404) {
                // No feedbacks found
                setFeedbacks([]);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            // Don't throw error for feedbacks as it's not critical
            setFeedbacks([]);
        }
    };

    // Fetch previous service requests (job history) using correct endpoint
    const fetchJobHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const technicianEmail = getTechnicianEmail();
            if (!technicianEmail) {
                setError('Authentication required. Please log in to view job history.');
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/technician/get-previous-request?email=${encodeURIComponent(technicianEmail)}`, {
                method: 'GET',
                credentials: 'include', // Use cookies for authentication
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Raw API Data for Job History:', data); // Debug log
                const transformedData = await transformApiDataToJobs(data); // Make async to handle feedbacks
                setJobHistory(transformedData);
                setError(null);
            } else if (response.status === 404) {
                // No previous requests found
                setJobHistory([]);
                setError(null);
            } else if (response.status === 401) {
                setError('Authentication required. Please log in to view job history.');
            } else {
                throw new Error(`Failed to fetch job history: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching job history:', error);
            if (error.message.includes('Failed to fetch')) {
                setError('Unable to connect to server. Please check your connection.');
            } else {
                setError(`Failed to load job history: ${error.message}`);
            }
            setJobHistory([]);
        } finally {
            setLoading(false);
        }
    };

    // Transform API response to match component data structure
    const transformApiDataToJobs = async (apiData) => {
        if (!Array.isArray(apiData)) {
            console.warn('API returned non-array data:', apiData);
            return [];
        }

        // Wait for feedbacks to be available
        await fetchFeedbacks();

        return apiData.map((item, index) => {
            console.log(`Processing job item ${index}:`, item); // Debug each item

            const requestId = item.requestId || item.id || null;

            if (!requestId) {
                console.error('No requestId found in job item:', item);
            }

            // Find feedback for this job
            const jobFeedback = feedbacks.find(feedback =>
                feedback.requestId === requestId || feedback.serviceRequestId === requestId
            );

            return {
                id: `JOB${requestId || index}`, // For display
                serviceRequestId: `SR${requestId || index}`, // For display
                actualId: requestId, // Actual DB ID for operations
                client: {
                    name: item.username || 'Unknown Client',
                    avatar: (item.username || 'UC').split(' ').map(n => n[0]).join('').substr(0, 2).toUpperCase(),
                    phone: item.userPhone || '+977-XXXXXXXXXX',
                    email: item.userEmail || 'N/A',
                    rating: 4.0, // Default rating as it's not in the DTO
                    totalBookings: 0 // Default as it's not in the DTO
                },
                service: {
                    type: item.serviceName || 'General Service',
                    category: getCategoryFromServiceType(item.serviceName),
                    description: `${item.serviceName} service completed`,
                    duration: '2-3 hours', // Default duration
                    difficulty: 'medium' // Default difficulty
                },
                location: {
                    address: item.userAddress || 'Location not specified',
                    distance: 'N/A' // Distance calculation would need coordinates
                },
                pricing: {
                    quotedPrice: item.feeCharge || 0,
                    finalPrice: item.feeCharge || 0, // Use same as quoted for now
                    additionalCharges: 0, // Default
                    paymentMethod: 'Cash' // Default
                },
                timeline: {
                    requestDate: formatDate(item.appointmentTime),
                    scheduledDate: formatDate(item.appointmentTime),
                    startTime: formatTime(item.appointmentTime),
                    endTime: formatEndTime(item.appointmentTime), // Calculate end time
                    completedDate: formatDate(item.appointmentTime),
                    appointmentDateTime: new Date(item.appointmentTime)
                },
                status: mapApiStatusToComponentStatus(item.status),
                rating: {
                    clientRating: jobFeedback?.rating || null,
                    clientReview: jobFeedback?.feedback || jobFeedback?.comment || null,
                    technicianNotes: null // Not in DTO
                },
                images: [],
                payments: {
                    status: 'paid', // Assume completed jobs are paid
                    paidDate: formatDate(item.appointmentTime),
                    method: 'Cash'
                },
                hasFeedback: !!jobFeedback // Flag to show if feedback exists
            };
        });
    };

    // Helper functions
    const getCategoryFromServiceType = (serviceType) => {
        const type = (serviceType || '').toLowerCase();
        if (type.includes('plumb')) return 'plumbing';
        if (type.includes('electric') || type.includes('ac')) return 'electrical';
        if (type.includes('clean')) return 'cleaning';
        if (type.includes('garden')) return 'gardening';
        return 'general';
    };

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return 'Date not set';
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return 'Time not set';
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatEndTime = (dateTimeString) => {
        if (!dateTimeString) return 'Time not set';
        const date = new Date(dateTimeString);
        // Add 2 hours for end time (default service duration)
        date.setHours(date.getHours() + 2);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const mapApiStatusToComponentStatus = (apiStatus) => {
        // Previous requests should be completed, but handle other statuses
        const status = (apiStatus || '').toLowerCase();
        switch (status) {
            case 'completed': return 'completed';
            case 'in_progress': case 'in-progress': return 'in-progress';
            case 'cancelled': return 'cancelled';
            case 'rejected': return 'cancelled';
            default: return 'completed'; // Default for previous requests
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchJobHistory();
    }, []);

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
            const headers = 'Job ID,Client Name,Service Type,Status,Date,Final Price,Location\n';
            const rows = sortedJobs.map(job =>
                `${job.id},"${job.client.name}","${job.service.type}",${job.status},${job.timeline.completedDate || job.timeline.scheduledDate},${job.pricing.finalPrice || job.pricing.quotedPrice},"${job.location.address}"`
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

        // Reload data
        fetchJobHistory();
    };

    const handleRepeatJob = async (jobId) => {
        const job = jobHistory.find(j => j.id === jobId);
        if (job && job.status === 'completed') {
            try {
                // Create repeat job request via API
                const repeatJobRequest = {
                    originalJobId: jobId,
                    clientEmail: job.client.email,
                    serviceType: job.service.type,
                    serviceDescription: job.service.description,
                    suggestedPrice: job.pricing.quotedPrice,
                    serviceLocation: job.location.address,
                    notes: `Repeat job based on ${jobId}`
                };

                // Since there's no specific repeat job endpoint in the API docs,
                // this would likely be implemented as a new service request creation
                console.log('Would create repeat job with data:', repeatJobRequest);
                alert(`Repeat job feature would create a new request based on ${jobId}`);

            } catch (error) {
                console.error('Error creating repeat job:', error);
                alert(`Failed to create repeat job: ${error.message}`);
            }
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
        .reduce((sum, job, _, array) => sum + job.rating.clientRating / array.length, 0) || 4.0; // Default if no ratings

    const filterOptions = [
        { value: 'all', label: 'All Jobs', count: jobHistory.length },
        { value: 'completed', label: 'Completed', count: jobHistory.filter(j => j.status === 'completed').length },
        { value: 'cancelled', label: 'Cancelled', count: jobHistory.filter(j => j.status === 'cancelled').length }
    ];

    // Loading state
    if (loading) {
        return (
            <div className={styles['profile-content']}>
                <div className={styles['profile-form']}>
                    <div className={styles['loading-state']}>
                        <RefreshCw size={48} className={styles.spin} />
                        <p>Loading job history...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state for authentication issues
    if (error && error.includes('Authentication required')) {
        return (
            <div className={styles['profile-content']}>
                <div className={styles['profile-form']}>
                    <div className={styles['error-state']}>
                        <AlertCircle size={48} style={{ color: '#ef4444' }} />
                        <h3>Authentication Required</h3>
                        <p>{error}</p>
                        <button
                            className={`${styles['action-btn']} ${styles.primary}`}
                            onClick={() => window.location.href = '/LoginSignup'}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Error state for other errors
    if (error) {
        return (
            <div className={`${styles['profile-content']} ${isSidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
                <div className={styles['profile-form']}>
                    <div className={styles['error-state']}>
                        <AlertCircle size={48} style={{ color: '#ef4444' }} />
                        <h3>Error Loading Job History</h3>
                        <p>{error}</p>
                        <button
                            className={`${styles['action-btn']} ${styles.primary}`}
                            onClick={handleRefresh}
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className={`${styles['profile-content']} ${isSidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
            <div className={styles['profile-form']}>
                <div className={styles['profile-header']}>
                    <h1 className={styles['profile-title']}>Job History</h1>
                    <p className={styles['profile-subtitle']}>Track your completed jobs, earnings, and client feedback.</p>
                    {error && !error.includes('Authentication required') && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            padding: '12px',
                            marginTop: '8px',
                            color: '#dc2626'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} />
                                <strong>Error:</strong> {error}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <section className={styles['form-section']}>
                    <div className={styles['stats-grid']}>
                        <div className={styles['stat-card']}>
                            <div className={`${styles['stat-icon']} ${styles.blue}`}>
                                <Activity size={24} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{totalJobs}</div>
                                <div className={styles['stat-label']}>Total Jobs</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>+{completedJobs} completed</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={`${styles['stat-icon']} ${styles.green}`}>
                                <CheckCircle size={24} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{completedJobs}</div>
                                <div className={styles['stat-label']}>Completed Jobs</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>{Math.round((completedJobs/totalJobs)*100) || 0}% success rate</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={`${styles['stat-icon']} ${styles.emerald}`}>
                                <DollarSign size={24} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>₨{totalEarnings.toLocaleString()}</div>
                                <div className={styles['stat-label']}>Total Earnings</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>From completed jobs</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={`${styles['stat-icon']} ${styles.yellow}`}>
                                <Star size={24} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{avgRating.toFixed(1) || 'N/A'}</div>
                                <div className={styles['stat-label']}>Average Rating</div>
                                <div className={`${styles['stat-change']} ${styles.positive}`}>From client reviews</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modern Filter Section */}
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
                />

                {/* Job History List */}
                <section className={styles['form-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>
                            Job Records ({sortedJobs.length})
                        </h3>
                        <div className={styles['section-actions']}>
                            <button
                                className={`${styles['action-btn']} ${styles.secondary}`}
                                onClick={() => handleExport('csv')}
                            >
                                <Download size={16} />
                                Export CSV
                            </button>
                            <button
                                className={`${styles['action-btn']} ${styles.secondary}`}
                                onClick={() => handleExport('json')}
                            >
                                <Download size={16} />
                                Export JSON
                            </button>
                        </div>
                    </div>
                    <div className={styles['requests-list']}>
                        {sortedJobs.map((job) => (
                            <div key={`job-${job.id}`} className={`${styles['request-card']} ${styles[job.status]}`}>
                                <div className={styles['request-header']}>
                                    <div className={styles['request-id-status']}>
                                        <span className={styles['request-id']}>#{job.id}</span>
                                        <div className={styles['status-badges']}>
                                            <span
                                                className={styles['status-badge']}
                                                style={{ backgroundColor: getStatusColor(job.status) }}
                                            >
                                                {getStatusText(job.status)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles['request-time']}>
                                        <Calendar size={14} />
                                        <span>{job.timeline.completedDate || job.timeline.scheduledDate}</span>
                                    </div>
                                </div>

                                <div className={styles['request-body']}>
                                    <div className={styles['request-main']}>
                                        <div className={styles['service-info']}>
                                            <div className={styles['service-header']}>
                                                <div className={styles['service-icon']}>
                                                    {getServiceIcon(job.service.category)}
                                                </div>
                                                <div className={styles['service-details']}>
                                                    <h4 className={styles['service-title']}>{job.service.type}</h4>
                                                    <p className={styles['service-description']}>{job.service.description}</p>
                                                </div>
                                            </div>

                                            <div className={styles['service-meta']}>
                                                <div className={styles['meta-item']}>
                                                    <Clock size={14} />
                                                    <span>Duration: {job.service.duration}</span>
                                                </div>
                                                <div className={styles['meta-item']}>
                                                    <MapPin size={14} />
                                                    <span>{job.location.address}</span>
                                                </div>
                                                {job.timeline.startTime && job.timeline.endTime && (
                                                    <div className={styles['meta-item']}>
                                                        <Calendar size={14} />
                                                        <span>{job.timeline.startTime} - {job.timeline.endTime}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles['client-info']}>
                                            <div className={styles['client-header']}>
                                                <div className={styles['client-avatar']}>
                                                    {job.client.avatar}
                                                </div>
                                                <div className={styles['client-details']}>
                                                    <h5 className={styles['client-name']}>{job.client.name}</h5>
                                                    <div className={styles['client-rating']}>
                                                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                                        <span>{job.client.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles['request-pricing']}>
                                        <div className={styles['pricing-info']}>
                                            <div className={styles['budget-range']}>
                                                <span className={styles['budget-label']}>Quoted:</span>
                                                <span className={styles['budget-amount']}>₨{job.pricing.quotedPrice.toLocaleString()}</span>
                                            </div>
                                            {job.pricing.finalPrice && (
                                                <div className={styles['suggested-price']}>
                                                    <span className={styles['suggested-label']}>Final:</span>
                                                    <span className={styles['suggested-amount']}>₨{job.pricing.finalPrice.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {job.rating.clientRating && (
                                        <div className={styles['request-pricing']}>
                                            <div className={styles['rating-display']}>
                                                <div>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            fill={i < job.rating.clientRating ? "#fbbf24" : "none"}
                                                            color="#fbbf24"
                                                        />
                                                    ))}
                                                </div>
                                                <span>{job.rating.clientRating}</span>
                                            </div>
                                            {job.rating.clientReview && (
                                                <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', color: '#6b7280' }}>"{job.rating.clientReview}"</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Show feedback indicator if feedback exists but no rating displayed yet */}
                                    {!job.rating.clientRating && job.hasFeedback && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                                            <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                            <span>Client feedback available - View details</span>
                                        </div>
                                    )}

                                    {job.rating.technicianNotes && (
                                        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <FileText size={16} />
                                                <span>Notes:</span>
                                            </div>
                                            <p style={{ margin: 0, color: '#6b7280' }}>{job.rating.technicianNotes}</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles['request-actions']}>
                                    <div className={styles['action-buttons']}>
                                        <button
                                            className={`${styles['action-btn']} ${styles.secondary}`}
                                            onClick={() => handleViewDetails(job.id)}
                                        >
                                            <Eye size={16} />
                                            Details
                                        </button>
                                        {job.status === 'completed' && (
                                            <button
                                                className={`${styles['action-btn']} ${styles.complete}`}
                                                onClick={() => handleRepeatJob(job.id)}
                                            >
                                                <RotateCcw size={16} />
                                                Repeat
                                            </button>
                                        )}
                                    </div>

                                    {job.images && job.images.length > 0 && (
                                        <div className={styles.attachments}>
                                            <span className={styles['attachments-label']}>Files:</span>
                                            {job.images.map((file, index) => (
                                                <span key={index} className={styles['attachment-file']}>{file}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedJobs.length === 0 && (
                        <div className={styles['empty-state']}>
                            <div className={styles['empty-icon']}>
                                <Activity size={48} />
                            </div>
                            <div className={styles['empty-message']}>
                                <h4>No jobs found</h4>
                                <p>Try adjusting your filters or search terms to find relevant job history.</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Job Details Modal */}
            {showJobDetails && selectedJobDetails && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <div className={styles['modal-header']}>
                            <h2 className={styles['modal-title']}>
                                Job Details - {selectedJobDetails.id}
                            </h2>
                            <button
                                onClick={() => setShowJobDetails(false)}
                                className={styles['modal-close']}
                            >
                                <X size={24} color="#6b7280" />
                            </button>
                        </div>

                        <div className={styles['modal-body']}>
                            <div className={styles['details-section']}>
                                <h3 className={styles['details-section-title']}>Service Information</h3>
                                <div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Service Type:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.service.type}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Description:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.service.description}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Duration:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.service.duration}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Difficulty:</span>
                                        <span
                                            className={styles['details-value']}
                                            style={{
                                                backgroundColor: getDifficultyColor(selectedJobDetails.service.difficulty),
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {selectedJobDetails.service.difficulty.charAt(0).toUpperCase() + selectedJobDetails.service.difficulty.slice(1)}
                                        </span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Status:</span>
                                        <span
                                            className={styles['details-value']}
                                            style={{
                                                backgroundColor: getStatusColor(selectedJobDetails.status),
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {getStatusText(selectedJobDetails.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles['details-section']}>
                                <h3 className={styles['details-section-title']}>Client Information</h3>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div className={styles['client-avatar']}>
                                            {selectedJobDetails.client.avatar}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                                                {selectedJobDetails.client.name}
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                <span>{selectedJobDetails.client.phone}</span>
                                                <span>{selectedJobDetails.client.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles['details-section']}>
                                <h3 className={styles['details-section-title']}>Timeline & Location</h3>
                                <div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Request Date:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.timeline.requestDate}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Scheduled Date:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.timeline.scheduledDate}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Completed Date:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.timeline.completedDate}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Time:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.timeline.startTime} - {selectedJobDetails.timeline.endTime}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Location:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.location.address}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Distance:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.location.distance}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles['details-section']}>
                                <h3 className={styles['details-section-title']}>Pricing & Payment</h3>
                                <div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Quoted Price:</span>
                                        <span className={styles['details-value']}>₨{selectedJobDetails.pricing.quotedPrice.toLocaleString()}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Final Price:</span>
                                        <span className={styles['details-value']}>₨{selectedJobDetails.pricing.finalPrice.toLocaleString()}</span>
                                    </div>
                                    {selectedJobDetails.pricing.additionalCharges !== 0 && (
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Additional Charges:</span>
                                            <span className={`${styles['details-value']} ${selectedJobDetails.pricing.additionalCharges > 0 ? styles.positive : styles.negative}`}>
                                                {selectedJobDetails.pricing.additionalCharges > 0 ? '+' : ''}₨{Math.abs(selectedJobDetails.pricing.additionalCharges).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Payment Method:</span>
                                        <span className={styles['details-value']}>{selectedJobDetails.pricing.paymentMethod}</span>
                                    </div>
                                    <div className={styles['details-row']}>
                                        <span className={styles['details-label']}>Payment Status:</span>
                                        <span
                                            className={styles['details-value']}
                                            style={{
                                                backgroundColor: getPaymentStatusColor(selectedJobDetails.payments.status),
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {selectedJobDetails.payments.status.charAt(0).toUpperCase() + selectedJobDetails.payments.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {selectedJobDetails.rating.clientRating && (
                                <div className={styles['details-section']}>
                                    <h3 className={styles['details-section-title']}>Client Feedback</h3>
                                    <div>
                                        <div className={styles['details-row']}>
                                            <span className={styles['details-label']}>Rating:</span>
                                            <div className={styles['rating-display']}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        fill={i < selectedJobDetails.rating.clientRating ? "#fbbf24" : "none"}
                                                        color="#fbbf24"
                                                    />
                                                ))}
                                                <span style={{ marginLeft: '0.5rem' }}>{selectedJobDetails.rating.clientRating}</span>
                                            </div>
                                        </div>
                                        {selectedJobDetails.rating.clientReview && (
                                            <div className={styles['details-row']}>
                                                <span className={styles['details-label']}>Review:</span>
                                                <p style={{ margin: 0, fontStyle: 'italic', color: '#6b7280' }}>
                                                    "{selectedJobDetails.rating.clientReview}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedJobDetails.rating.technicianNotes && (
                                <div className={styles['details-section']}>
                                    <h3 className={styles['details-section-title']}>Technician Notes</h3>
                                    <div>
                                        <p style={{ margin: 0, color: '#6b7280' }}>
                                            {selectedJobDetails.rating.technicianNotes}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles['modal-actions']}>
                            <button
                                onClick={() => setShowJobDetails(false)}
                                className={`${styles['action-btn']} ${styles.primary}`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Repeat Job Modal */}
            {showRepeatJobModal && repeatJobData && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <div className={styles['modal-header']}>
                            <h2 className={styles['modal-title']}>Create Repeat Job</h2>
                            <button
                                onClick={() => setShowRepeatJobModal(false)}
                                className={styles['modal-close']}
                            >
                                <X size={24} color="#6b7280" />
                            </button>
                        </div>

                        <div className={styles['modal-body']}>
                            <div>
                                <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
                                    Create a new job request based on the previous job details.
                                </p>
                                <div className={styles['details-row']}>
                                    <span className={styles['details-label']}>Service:</span>
                                    <span className={styles['details-value']}>{repeatJobData.service.type}</span>
                                </div>
                                <div className={styles['details-row']}>
                                    <span className={styles['details-label']}>Client:</span>
                                    <span className={styles['details-value']}>{repeatJobData.client.name}</span>
                                </div>
                                <div className={styles['details-row']}>
                                    <span className={styles['details-label']}>Location:</span>
                                    <span className={styles['details-value']}>{repeatJobData.location.address}</span>
                                </div>
                                <div className={styles['details-row']}>
                                    <span className={styles['details-label']}>Price:</span>
                                    <span className={styles['details-value']}>₨{repeatJobData.pricing.quotedPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles['modal-actions']}>
                            <button
                                onClick={() => setShowRepeatJobModal(false)}
                                className={`${styles['action-btn']} ${styles.secondary}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleRepeatJob(repeatJobData.id);
                                    setShowRepeatJobModal(false);
                                }}
                                className={`${styles['action-btn']} ${styles.complete}`}
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