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
import FilterAndSearch from '../../Components/common/FilterAndSearch';
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
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalRequests: 0,
        urgentResponses: 0,
        responseRate: 85,
        potentialEarnings: 0
    });

    // API Configuration
    const API_BASE_URL = 'http://localhost:8080';
    const technicianEmail = 'debryune69@gmail.com'; // This should come from authenticated user context
    const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

    // Enhanced token retrieval with better error handling
    const getAuthToken = () => {
        try {
            // Check for JWT in cookies first (more secure)
            const cookies = document.cookie.split(';');
            const accessCookie = cookies.find(cookie => cookie.trim().startsWith('Access='));
            if (accessCookie) {
                const token = accessCookie.split('=')[1];
                if (token && token !== 'undefined' && token !== 'null') {
                    return token;
                }
            }

            // Check for Authorization cookie
            const authCookie = cookies.find(cookie => cookie.trim().startsWith('Authorization='));
            if (authCookie) {
                const token = authCookie.split('=')[1];
                if (token && token !== 'undefined' && token !== 'null') {
                    return token;
                }
            }

            // Fallback to localStorage
            const localToken = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
            if (localToken && localToken !== 'undefined' && localToken !== 'null') {
                return localToken;
            }

            // Check sessionStorage as well
            const sessionToken = sessionStorage.getItem('authToken') || sessionStorage.getItem('accessToken');
            if (sessionToken && sessionToken !== 'undefined' && sessionToken !== 'null') {
                return sessionToken;
            }

            return null;
        } catch (error) {
            console.error('Error retrieving auth token:', error);
            return null;
        }
    };

    // Enhanced API request helper with better error handling
    const apiRequest = async (endpoint, options = {}) => {
        const token = getAuthToken();

        if (!token) {
            throw new Error('No authentication token found. Please log in again.');
        }

        const config = {
            credentials:'true',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            // Handle different HTTP status codes
            if (response.status === 401) {
                // Token might be expired or invalid
                localStorage.removeItem('authToken');
                localStorage.removeItem('accessToken');
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('accessToken');
                throw new Error('Authentication failed. Please log in again.');
            }

            if (response.status === 403) {
                throw new Error('Access forbidden. You don\'t have permission to perform this action.');
            }

            if (response.status === 404) {
                throw new Error('Resource not found. The requested endpoint may not exist.');
            }

            if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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

    // Fetch current service requests with improved error handling
    const fetchCurrentRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await apiRequest(
                `api/technician/get-current-request?email=${encodeURIComponent(technicianEmail)}`
            );

            // Transform API data to match component structure
            const transformedData = transformApiDataToRequests(data);
            setServiceRequests(transformedData);

            // Update stats
            updateStats(transformedData);

        } catch (error) {
            console.error('Error fetching requests:', error);

            // Handle specific error types
            if (error.message.includes('Authentication failed') || error.message.includes('No authentication token')) {
                setError('Authentication required. Please log in to view service requests.');
                // Optionally redirect to login page
                // window.location.href = '/login';
                return;
            }

            // Check if it's a connection error (backend not running)
            if (error.message.includes('Failed to fetch') ||
                error.message.includes('ERR_CONNECTION_REFUSED') ||
                error.message.includes('NetworkError')) {
                setIsDevelopmentMode(true);
                // Use mock data for development
                const mockData = getMockServiceRequests();
                setServiceRequests(mockData);
                updateStats(mockData);
                setError('Backend server not available. Using mock data for development.');
            } else {
                setError(`Failed to fetch service requests: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Mock data for development when backend is not available
    const getMockServiceRequests = () => {
        return [
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
                status: 'pending',
                priority: 'low',
                attachments: ['ac-model.jpg', 'room-dimensions.pdf']
            }
        ];
    };

    // Transform API response to match component data structure
    const transformApiDataToRequests = (apiData) => {
        if (!Array.isArray(apiData)) {
            console.warn('API response is not an array:', apiData);
            return [];
        }

        return apiData.map(item => ({
            id: `SR${item.id || Math.random().toString().substr(2, 6)}`,
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
                urgency: item.urgency || 'medium',
                estimatedDuration: item.estimatedDuration || '2-3 hours',
                preferredTime: item.preferredTime || 'Flexible'
            },
            location: {
                address: item.serviceLocation || 'Location not specified',
                distance: calculateDistance(item.latitude, item.longitude) || 'N/A',
                coordinates: {
                    lat: item.latitude || 27.7172,
                    lng: item.longitude || 85.3240
                }
            },
            pricing: {
                budget: item.budgetRange || 'Budget not specified',
                suggestedPrice: item.suggestedPrice || 0,
                negotiable: item.negotiable !== false
            },
            timeline: {
                requestedDate: item.serviceDate || new Date().toISOString().split('T')[0],
                requestedTime: item.serviceTime || 'Flexible',
                postedTime: formatTimeAgo(item.createdAt),
                responseDeadline: calculateResponseDeadline(item.createdAt)
            },
            status: mapApiStatusToComponentStatus(item.status),
            priority: item.priority || 'medium',
            attachments: item.attachments || []
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
        // Simple distance calculation from Kathmandu center (27.7172, 85.3240)
        if (!lat || !lng) return null;
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

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Just now';
        const now = new Date();
        const date = new Date(dateString);
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    const calculateResponseDeadline = (createdAt) => {
        if (!createdAt) return '6 hours';
        const created = new Date(createdAt);
        const deadline = new Date(created.getTime() + 6 * 60 * 60 * 1000); // 6 hours later
        const now = new Date();
        const remaining = deadline - now;
        const hours = Math.floor(remaining / (1000 * 60 * 60));

        if (hours <= 0) return 'Overdue';
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    };

    const mapApiStatusToComponentStatus = (apiStatus) => {
        const status = (apiStatus || '').toLowerCase();
        switch (status) {
            case 'pending': return 'pending';
            case 'accepted': return 'responded';
            case 'rejected': return 'declined';
            case 'new': return 'new';
            default: return 'pending';
        }
    };

    const updateStats = (requests) => {
        const totalRequests = requests.length;
        const urgentRequests = requests.filter(r => r.timeline.responseDeadline === 'Overdue').length;
        const potentialEarnings = requests.reduce((sum, r) => sum + (r.pricing.suggestedPrice || 0), 0);

        setStats({
            totalRequests,
            urgentResponses: urgentRequests,
            responseRate: 85, // This could be calculated based on historical data
            potentialEarnings
        });
    };

    // Accept service request
    const handleAcceptRequest = async (requestId) => {
        setProcessingRequests(prev => new Set(prev).add(requestId));

        try {
            if (isDevelopmentMode) {
                // Simulate API delay for development
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Update local state for development
                setServiceRequests(prev =>
                    prev.map(request =>
                        request.id === requestId
                            ? { ...request, status: 'responded' }
                            : request
                    )
                );

                alert(`Request ${requestId} has been accepted! (Development Mode)`);
            } else {
                const numericId = requestId.replace('SR', '');
                await apiRequest(
                    `/technician/accept-service-request?requestId=${numericId}`,
                    { method: 'POST' }
                );

                // Update local state
                setServiceRequests(prev =>
                    prev.map(request =>
                        request.id === requestId
                            ? { ...request, status: 'responded' }
                            : request
                    )
                );

                alert(`Request ${requestId} has been accepted! You can now send a quote to the client.`);
            }
        } catch (error) {
            console.error('Error accepting request:', error);

            // Show specific error message
            if (error.message.includes('Authentication failed')) {
                alert('Your session has expired. Please log in again.');
            } else if (error.message.includes('Access forbidden')) {
                alert('You don\'t have permission to accept this request.');
            } else {
                alert(`Failed to accept request: ${error.message}`);
            }
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    // Decline service request - Enhanced with better confirmation
    const handleDeclineRequest = (requestId) => {
        const request = serviceRequests.find(r => r.id === requestId);
        setSelectedRequest(request);
        setConfirmAction(() => () => performDeclineRequest(requestId));
        setShowConfirmModal(true);
    };

    const performDeclineRequest = async (requestId) => {
        setProcessingRequests(prev => new Set(prev).add(requestId));

        try {
            if (isDevelopmentMode) {
                // Simulate API delay for development
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Remove from local state for development
                setServiceRequests(prev =>
                    prev.filter(request => request.id !== requestId)
                );

                alert('Request declined successfully. (Development Mode)');
            } else {
                const numericId = requestId.replace('SR', '');
                await apiRequest(
                    `/technician/reject-service-request?requestId=${numericId}`,
                    { method: 'POST' }
                );

                // Remove from local state
                setServiceRequests(prev =>
                    prev.filter(request => request.id !== requestId)
                );

                alert('Request declined successfully. The client has been notified.');
            }

            // Update stats after removal
            const updatedRequests = serviceRequests.filter(request => request.id !== requestId);
            updateStats(updatedRequests);

        } catch (error) {
            console.error('Error declining request:', error);

            // Show specific error message
            if (error.message.includes('Authentication failed')) {
                alert('Your session has expired. Please log in again.');
            } else if (error.message.includes('Access forbidden')) {
                alert('You don\'t have permission to decline this request.');
            } else if (error.message.includes('Resource not found')) {
                alert('This request may have already been processed or no longer exists.');
                // Remove from local state anyway since it doesn't exist on server
                setServiceRequests(prev => prev.filter(request => request.id !== requestId));
            } else {
                alert(`Failed to decline request: ${error.message}`);
            }
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    // Refresh data
    const handleRefresh = () => {
        setSearchTerm('');
        setSelectedFilter('all');
        setError(null);
        fetchCurrentRequests();
    };

    // Load data on component mount
    useEffect(() => {
        fetchCurrentRequests();
    }, []);

    // Rest of your existing helper functions remain the same
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
            case 'declined': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'new': return 'New Request';
            case 'pending': return 'Awaiting Response';
            case 'urgent': return 'Response Overdue';
            case 'responded': return 'Response Sent';
            case 'declined': return 'Declined';
            default: return 'Unknown';
        }
    };

    // Filtering and sorting logic
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

    const handleViewDetails = (requestId) => {
        const request = serviceRequests.find(r => r.id === requestId);
        setSelectedRequest(request);
        setShowDetailsModal(true);
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
        { value: 'urgent', label: 'Urgent', count: serviceRequests.filter(r => r.status === 'urgent').length },
        { value: 'responded', label: 'Responded', count: serviceRequests.filter(r => r.status === 'responded').length }
    ];

    // Loading state
    if (loading) {
        return (
            <div className={styles['profile-content']}>
                <div className={styles['profile-form']}>
                    <div className={styles['loading-state']}>
                        <RefreshCw size={48} className={styles['spin']} />
                        <p>Loading service requests...</p>
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
                            className={`${styles['action-btn']} ${styles['primary']}`}
                            onClick={() => window.location.href = '/LoginSignup'}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['profile-content']}>
            <div className={styles['profile-form']}>
                <div className={styles['profile-header']}>
                    <h1 className={styles['profile-title']}>Service Requests</h1>
                    <p className={styles['profile-subtitle']}>Manage and respond to incoming service requests from clients.</p>
                    {isDevelopmentMode && (
                        <div style={{
                            backgroundColor: '#fef3c7',
                            border: '1px solid #f59e0b',
                            borderRadius: '8px',
                            padding: '12px',
                            marginTop: '8px',
                            color: '#92400e'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} />
                                <strong>Development Mode:</strong> Backend server not available. Using mock data for demonstration.
                            </div>
                        </div>
                    )}
                    {error && !isDevelopmentMode && (
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
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#dbeafe' }}>
                                <Clock size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{stats.totalRequests}</div>
                                <div className={styles['stat-label']}>Total Requests</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>Updated now</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#fef3c7' }}>
                                <AlertCircle size={24} style={{ color: '#f59e0b' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{stats.urgentResponses}</div>
                                <div className={styles['stat-label']}>Urgent Responses</div>
                                <div className={`${styles['stat-change']} ${stats.urgentResponses > 0 ? styles['negative'] : styles['positive']}`}>
                                    {stats.urgentResponses > 0 ? 'Response overdue' : 'All current'}
                                </div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#d1fae5' }}>
                                <CheckCircle size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>{stats.responseRate}%</div>
                                <div className={styles['stat-label']}>Response Rate</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>Maintaining</div>
                            </div>
                        </div>

                        <div className={styles['stat-card']}>
                            <div className={styles['stat-icon']} style={{ backgroundColor: '#e0e7ff' }}>
                                <DollarSign size={24} style={{ color: '#6366f1' }} />
                            </div>
                            <div className={styles['stat-content']}>
                                <div className={styles['stat-number']}>₨{stats.potentialEarnings.toLocaleString()}</div>
                                <div className={styles['stat-label']}>Potential Earnings</div>
                                <div className={`${styles['stat-change']} ${styles['positive']}`}>From pending requests</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters and Controls */}
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
                                                disabled={isProcessing || request.status === 'declined' || request.status === 'responded'}
                                            >
                                                {isProcessing ? <RefreshCw size={16} className={styles['spin']} /> : <XCircle size={16} />}
                                                {isProcessing ? 'Processing...' : 'Decline'}
                                            </button>
                                            <button
                                                className={`${styles['action-btn']} ${styles['primary']}`}
                                                onClick={() => handleAcceptRequest(request.id)}
                                                disabled={isProcessing || request.status === 'declined' || request.status === 'responded'}
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
                                    <p>This action cannot be undone and the request will be permanently removed from your list. The client will be notified of your decision.</p>
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
                                    disabled={processingRequests.has(selectedRequest.id) || selectedRequest.status === 'declined' || selectedRequest.status === 'responded'}
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