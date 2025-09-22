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
    const [jobHistory, setJobHistory] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API Configuration
    const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080';
    const technicianEmail = 'tech@example.com'; // This should come from authenticated user context

    // Get authorization token from cookies or localStorage
    const getAuthToken = () => {
        // Check for JWT in cookies first
        const cookies = document.cookie.split(';');
        const accessCookie = cookies.find(cookie => cookie.trim().startsWith('Access='));
        if (accessCookie) {
            return accessCookie.split('=')[1];
        }

        // Fallback to localStorage if needed
        return localStorage.getItem('authToken');
    };

    // API request helper
    const apiRequest = async (endpoint, options = {}) => {
        const token = getAuthToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.');
                } else if (response.status === 403) {
                    throw new Error('Access denied. You do not have permission to access this resource.');
                } else if (response.status === 404) {
                    throw new Error('Requested resource not found.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    };

    // Fetch previous service requests (job history)
    const fetchJobHistory = async () => {
        try {
            const data = await apiRequest(
                `/technician/get-previous-request?email=${encodeURIComponent(technicianEmail)}`
            );

            // Transform API data to match component structure
            const transformedData = transformApiDataToJobs(data);
            setJobHistory(transformedData);

        } catch (error) {
            console.error('Error fetching job history:', error);
            throw error;
        }
    };

    // Fetch payment history
    const fetchPaymentHistory = async () => {
        try {
            // Fetch both received and pending payments
            const [receivedPayments, pendingPayments] = await Promise.all([
                apiRequest(`/technician/received-payments?email=${encodeURIComponent(technicianEmail)}`),
                apiRequest(`/technician/pending-payments?email=${encodeURIComponent(technicianEmail)}`)
            ]);

            const allPayments = [
                ...receivedPayments.map(p => ({ ...p, status: 'paid' })),
                ...pendingPayments.map(p => ({ ...p, status: 'pending' }))
            ];

            setPaymentHistory(allPayments);

        } catch (error) {
            console.error('Error fetching payment history:', error);
            throw error;
        }
    };

    // Load all data
    const loadAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            await Promise.all([
                fetchJobHistory(),
                fetchPaymentHistory()
            ]);

        } catch (error) {
            console.error('Error loading data:', error);
            setError(error.message || 'Failed to load job history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Transform API response to match component data structure
    const transformApiDataToJobs = (apiData) => {
        if (!Array.isArray(apiData)) {
            console.warn('API returned non-array data:', apiData);
            return [];
        }

        return apiData.map(item => ({
            id: `JOB${item.id || Math.random().toString().substr(2, 6)}`,
            serviceRequestId: `SR${item.serviceRequestId || item.id}`,
            client: {
                name: item.userName || 'Unknown Client',
                avatar: (item.userName || 'UC').split(' ').map(n => n[0]).join('').substr(0, 2).toUpperCase(),
                phone: item.userPhone || '+977-XXXXXXXXXX',
                email: item.userEmail || 'N/A',
                rating: item.userRating || 4.0,
                totalBookings: item.userTotalBookings || 0
            },
            service: {
                type: item.serviceType || 'General Service',
                category: getCategoryFromServiceType(item.serviceType),
                description: item.serviceDescription || 'No description provided',
                duration: calculateDuration(item.startTime, item.endTime) || '2-3 hours',
                difficulty: item.difficulty || 'medium'
            },
            location: {
                address: item.serviceLocation || 'Location not specified',
                distance: calculateDistance(item.latitude, item.longitude) || 'N/A'
            },
            pricing: {
                quotedPrice: item.quotedPrice || 0,
                finalPrice: item.finalPrice || item.quotedPrice || 0,
                additionalCharges: (item.finalPrice || 0) - (item.quotedPrice || 0),
                paymentMethod: item.paymentMethod || 'Cash'
            },
            timeline: {
                requestDate: item.requestDate || item.createdAt?.split('T')[0],
                scheduledDate: item.serviceDate || item.scheduledDate,
                startTime: item.startTime || 'N/A',
                endTime: item.endTime || 'N/A',
                completedDate: item.completedDate || item.serviceDate
            },
            status: mapApiStatusToComponentStatus(item.status),
            rating: {
                clientRating: item.clientRating || null,
                clientReview: item.clientReview || null,
                technicianNotes: item.technicianNotes || null
            },
            images: item.attachments || [],
            payments: {
                status: getPaymentStatus(item.id, paymentHistory),
                paidDate: item.paidDate,
                method: item.paymentMethod || 'Cash'
            }
        }));
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

    const calculateDistance = (lat, lng) => {
        if (!lat || !lng) return 'N/A';
        const kathmandu = { lat: 27.7172, lng: 85.3240 };
        const R = 6371; // Earth's radius in km
        const dLat = (lat - kathmandu.lat) * Math.PI / 180;
        const dLng = (lng - kathmandu.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(kathmandu.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return `${distance.toFixed(1)} km`;
    };

    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return null;
        try {
            const start = new Date(`2000-01-01 ${startTime}`);
            const end = new Date(`2000-01-01 ${endTime}`);
            const diffMs = end - start;
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `${hours} hours ${minutes} minutes`;
        } catch (error) {
            return null;
        }
    };

    const mapApiStatusToComponentStatus = (apiStatus) => {
        const status = (apiStatus || '').toLowerCase();
        switch (status) {
            case 'completed': return 'completed';
            case 'in_progress': case 'in-progress': return 'in-progress';
            case 'cancelled': return 'cancelled';
            case 'on_hold': case 'on-hold': return 'on-hold';
            default: return 'completed';
        }
    };

    const getPaymentStatus = (jobId, payments) => {
        const payment = payments.find(p => p.requestId === jobId || p.jobId === jobId);
        return payment?.status || 'pending';
    };

    // Load data on component mount
    useEffect(() => {
        loadAllData();
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

        // Reload data
        loadAllData();
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
                const response = await apiRequest('/service-request/create', {
                    method: 'POST',
                    body: JSON.stringify(repeatJobRequest)
                });

                alert(`New repeat job request created successfully! Request ID: ${response.id || 'N/A'}`);

                // Refresh the job history to show the new request if it appears in the list
                setTimeout(() => {
                    loadAllData();
                }, 1000);

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
        .reduce((sum, job, _, array) => sum + job.rating.clientRating / array.length, 0);

    const filterOptions = [
        { value: 'all', label: 'All Jobs', count: jobHistory.length },
        { value: 'completed', label: 'Completed', count: jobHistory.filter(j => j.status === 'completed').length },
        { value: 'in-progress', label: 'In Progress', count: jobHistory.filter(j => j.status === 'in-progress').length },
        { value: 'cancelled', label: 'Cancelled', count: jobHistory.filter(j => j.status === 'cancelled').length }
    ];

    // Loading state
    if (loading) {
        return (
            <div className={styles.profileContent}>
                <div className={styles.profileForm}>
                    <div className={styles.loadingState}>
                        <RefreshCw size={48} className={styles.spin} />
                        <p>Loading job history...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles.profileContent}>
                <div className={styles.profileForm}>
                    <div className={styles.errorState}>
                        <AlertCircle size={48} style={{ color: '#ef4444' }} />
                        <h3>Error Loading Job History</h3>
                        <p>{error}</p>
                        <button
                            className={`${styles.actionBtn} ${styles.primary}`}
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
                            <div className={`${styles.statIcon} ${styles.blue}`}>
                                <Activity size={24} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{totalJobs}</div>
                                <div className={styles.statLabel}>Total Jobs</div>
                                <div className={`${styles.statChange} ${styles.positive}`}>+{completedJobs} completed</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.green}`}>
                                <CheckCircle size={24} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{completedJobs}</div>
                                <div className={styles.statLabel}>Completed Jobs</div>
                                <div className={`${styles.statChange} ${styles.positive}`}>{Math.round((completedJobs/totalJobs)*100) || 0}% success rate</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.emerald}`}>
                                <DollarSign size={24} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>₨{totalEarnings.toLocaleString()}</div>
                                <div className={styles.statLabel}>Total Earnings</div>
                                <div className={`${styles.statChange} ${styles.positive}`}>From completed jobs</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.yellow}`}>
                                <Star size={24} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statNumber}>{avgRating.toFixed(1) || 'N/A'}</div>
                                <div className={styles.statLabel}>Average Rating</div>
                                <div className={`${styles.statChange} ${styles.positive}`}>From client reviews</div>
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
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>
                            Job Records ({sortedJobs.length})
                        </h3>
                        <div className={styles.sectionActions}>
                            <button
                                className={`${styles.actionBtn} ${styles.secondary}`}
                                onClick={() => handleExport('csv')}
                            >
                                <Download size={16} />
                                Export CSV
                            </button>
                            <button
                                className={`${styles.actionBtn} ${styles.secondary}`}
                                onClick={() => handleExport('json')}
                            >
                                <Download size={16} />
                                Export JSON
                            </button>
                        </div>
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
                                <Activity size={48} />
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
                            <h3 className={styles.modalSectionTitle}>Service Information</h3>
                            <div className={styles.modalSectionContent}>
                                <div className={styles.modalDetail}>
                                    <strong>Service Type:</strong> {selectedJobDetails.service.type}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Description:</strong> {selectedJobDetails.service.description}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Duration:</strong> {selectedJobDetails.service.duration}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Difficulty:</strong>
                                    <span
                                        className={styles.difficultyTag}
                                        style={{ backgroundColor: getDifficultyColor(selectedJobDetails.service.difficulty) }}
                                    >
                                        {selectedJobDetails.service.difficulty.charAt(0).toUpperCase() + selectedJobDetails.service.difficulty.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalSection}>
                            <h3 className={styles.modalSectionTitle}>Client Information</h3>
                            <div className={styles.modalSectionContent}>
                                <div className={styles.modalClientInfo}>
                                    <div className={styles.clientAvatar}>
                                        {selectedJobDetails.client.avatar}
                                    </div>
                                    <div>
                                        <h4 className={styles.clientNameModal}>
                                            {selectedJobDetails.client.name}
                                        </h4>
                                        <div className={styles.clientContact}>
                                            <span>{selectedJobDetails.client.phone}</span>
                                            <span>{selectedJobDetails.client.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalSection}>
                            <h3 className={styles.modalSectionTitle}>Timeline & Location</h3>
                            <div className={styles.modalSectionContent}>
                                <div className={styles.modalDetail}>
                                    <strong>Request Date:</strong> {selectedJobDetails.timeline.requestDate}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Scheduled Date:</strong> {selectedJobDetails.timeline.scheduledDate}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Completed Date:</strong> {selectedJobDetails.timeline.completedDate}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Location:</strong> {selectedJobDetails.location.address}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Distance:</strong> {selectedJobDetails.location.distance}
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalSection}>
                            <h3 className={styles.modalSectionTitle}>Pricing & Payment</h3>
                            <div className={styles.modalSectionContent}>
                                <div className={styles.modalDetail}>
                                    <strong>Quoted Price:</strong> ₨{selectedJobDetails.pricing.quotedPrice.toLocaleString()}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Final Price:</strong> ₨{selectedJobDetails.pricing.finalPrice.toLocaleString()}
                                </div>
                                {selectedJobDetails.pricing.additionalCharges !== 0 && (
                                    <div className={styles.modalDetail}>
                                        <strong>Additional Charges:</strong>
                                        <span className={selectedJobDetails.pricing.additionalCharges > 0 ? styles.positive : styles.negative}>
                                            {selectedJobDetails.pricing.additionalCharges > 0 ? '+' : ''}₨{Math.abs(selectedJobDetails.pricing.additionalCharges).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                <div className={styles.modalDetail}>
                                    <strong>Payment Method:</strong> {selectedJobDetails.pricing.paymentMethod}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Payment Status:</strong>
                                    <span
                                        className={styles.paymentTag}
                                        style={{ backgroundColor: getPaymentStatusColor(selectedJobDetails.payments.status) }}
                                    >
                                        {selectedJobDetails.payments.status.charAt(0).toUpperCase() + selectedJobDetails.payments.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {selectedJobDetails.rating.clientRating && (
                            <div className={styles.modalSection}>
                                <h3 className={styles.modalSectionTitle}>Client Feedback</h3>
                                <div className={styles.modalSectionContent}>
                                    <div className={styles.modalDetail}>
                                        <strong>Rating:</strong>
                                        <div className={styles.ratingDisplay}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < selectedJobDetails.rating.clientRating ? "#fbbf24" : "none"}
                                                    color="#fbbf24"
                                                />
                                            ))}
                                            <span className={styles.ratingValue}>{selectedJobDetails.rating.clientRating}</span>
                                        </div>
                                    </div>
                                    {selectedJobDetails.rating.clientReview && (
                                        <div className={styles.modalDetail}>
                                            <strong>Review:</strong>
                                            <p className={styles.reviewQuote}>
                                                "{selectedJobDetails.rating.clientReview}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedJobDetails.rating.technicianNotes && (
                            <div className={styles.modalSection}>
                                <h3 className={styles.modalSectionTitle}>Technician Notes</h3>
                                <div className={styles.modalSectionContent}>
                                    <p className={styles.technicianNotesModal}>
                                        {selectedJobDetails.rating.technicianNotes}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className={styles.modalFooter}>
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
                                <p className={styles.repeatJobDescription}>
                                    Create a new job request based on the previous job details.
                                </p>
                                <div className={styles.modalDetail}>
                                    <strong>Service:</strong> {repeatJobData.service.type}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Client:</strong> {repeatJobData.client.name}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Location:</strong> {repeatJobData.location.address}
                                </div>
                                <div className={styles.modalDetail}>
                                    <strong>Price:</strong> ₨{repeatJobData.pricing.quotedPrice.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                onClick={() => setShowRepeatJobModal(false)}
                                className={`${styles.actionBtn} ${styles.secondary}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRepeatJob(repeatJobData.id)}
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