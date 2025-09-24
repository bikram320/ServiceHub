import React, { useState, useMemo } from 'react';
import {
    Wrench,
    Search,
    Filter,
    Eye,
    Check,
    X,
    Shield,
    ShieldOff,
    KeyRound,
    Calendar,
    MapPin,
    Phone,
    Mail,
    User,
    AlertTriangle,
    CheckCircle,
    Clock,
    Ban,
    Star,
    Award,
    FileText,
    TrendingUp,
    Download,
    Zap,
    Droplets,
    Settings,
    Home,
    Hammer,
    Plus,
    Minus,
    DollarSign
} from 'lucide-react';
import '../../styles/TechnicianManagement.css';
import styles from "../../styles/UserDashboard.module.css";

const TechnicianManagement = ({ sidebarCollapsed = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'profile', 'approve', 'reject', 'reset', 'block', 'unblock', 'performance'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Sample technician data
    const [technicians, setTechnicians] = useState([
        {
            id: 1,
            name: 'Ramesh Karki',
            email: 'ramesh.karki@email.com',
            phone: '+977-9841234567',
            location: 'Kathmandu, Nepal',
            category: 'Electrician',
            experience: '5 years',
            registrationDate: '2024-11-15',
            lastActive: '2024-11-16',
            status: 'pending',
            profilePicture: null,
            address: 'Balaju, Kathmandu',
            completedJobs: 0,
            rating: 0,
            totalEarnings: 0,
            paymentReceived: 0,
            paymentDeclined: 0,
            documents: ['citizenship_front.jpg', 'citizenship_back.jpg', 'license.jpg', 'experience_cert.pdf'],
            licenseNumber: 'EL-2024-001',
            licenseExpiry: '2025-11-15',
            skills: ['House Wiring', 'Motor Repair', 'Panel Installation'],
            certifications: ['Basic Electrical Safety', 'Motor Winding Certificate']
        },
        {
            id: 2,
            name: 'Binod Shrestha',
            email: 'binod.shrestha@email.com',
            phone: '+977-9851234567',
            location: 'Lalitpur, Nepal',
            category: 'Plumber',
            experience: '3 years',
            registrationDate: '2024-11-14',
            lastActive: '2024-11-16',
            status: 'pending',
            profilePicture: null,
            address: 'Jawalakhel, Lalitpur',
            completedJobs: 0,
            rating: 0,
            totalEarnings: 0,
            paymentReceived: 0,
            paymentDeclined: 0,
            documents: ['citizenship_front.jpg', 'license.jpg', 'training_cert.pdf'],
            licenseNumber: 'PL-2024-002',
            licenseExpiry: '2025-10-20',
            skills: ['Pipe Installation', 'Leak Repair', 'Bathroom Fitting'],
            certifications: ['Plumbing Basics', 'Water System Installation']
        },
        {
            id: 3,
            name: 'Suresh Tamang',
            email: 'suresh.tamang@email.com',
            phone: '+977-9861234567',
            location: 'Bhaktapur, Nepal',
            category: 'Electrician',
            experience: '8 years',
            registrationDate: '2024-11-10',
            lastActive: '2024-11-16',
            status: 'active',
            profilePicture: null,
            address: 'Thimi, Bhaktapur',
            completedJobs: 45,
            rating: 4.8,
            totalEarnings: 125000,
            paymentReceived: 118000,
            paymentDeclined: 7000,
            documents: ['citizenship_front.jpg', 'license.jpg', 'experience_cert.pdf'],
            licenseNumber: 'EL-2023-045',
            licenseExpiry: '2025-03-15',
            skills: ['Industrial Wiring', 'Solar Installation', 'Inverter Setup'],
            certifications: ['Advanced Electrical Systems', 'Solar Panel Installation', 'Safety Training'],
            monthlyEarnings: [15000, 18000, 22000, 19000, 25000, 21000],
            customerSatisfaction: 96,
            responseTime: '15 min avg'
        },
        {
            id: 4,
            name: 'Krishna Maharjan',
            email: 'krishna.maharjan@email.com',
            phone: '+977-9871234567',
            location: 'Kathmandu, Nepal',
            category: 'Plumber',
            experience: '6 years',
            registrationDate: '2024-11-08',
            lastActive: '2024-11-15',
            status: 'active',
            profilePicture: null,
            address: 'Kirtipur, Kathmandu',
            completedJobs: 32,
            rating: 4.6,
            totalEarnings: 89000,
            paymentReceived: 84500,
            paymentDeclined: 4500,
            documents: ['citizenship_front.jpg', 'license.jpg', 'training_cert.pdf'],
            licenseNumber: 'PL-2023-028',
            licenseExpiry: '2025-05-10',
            skills: ['Drainage System', 'Water Heater Installation', 'Pipe Welding'],
            certifications: ['Advanced Plumbing', 'Gas Line Installation'],
            monthlyEarnings: [12000, 14000, 16000, 15000, 18000, 14000],
            customerSatisfaction: 92,
            responseTime: '20 min avg'
        },
        {
            id: 5,
            name: 'Deepak Rai',
            email: 'deepak.rai@email.com',
            phone: '+977-9881234567',
            location: 'Pokhara, Nepal',
            category: 'Carpenter',
            experience: '4 years',
            registrationDate: '2024-11-05',
            lastActive: '2024-11-12',
            status: 'blocked',
            profilePicture: null,
            address: 'Lakeside, Pokhara',
            completedJobs: 28,
            rating: 4.2,
            totalEarnings: 65000,
            paymentReceived: 58500,
            paymentDeclined: 6500,
            documents: ['citizenship_front.jpg', 'license.jpg'],
            licenseNumber: 'CR-2023-015',
            licenseExpiry: '2025-08-22',
            skills: ['Furniture Making', 'Door Installation', 'Kitchen Cabinets'],
            certifications: ['Woodworking Certificate'],
            monthlyEarnings: [8000, 10000, 12000, 11000, 14000, 10000],
            customerSatisfaction: 88,
            responseTime: '35 min avg'
        }
    ]);

    // Categories with icons
    const categories = {
        'Electrician': { icon: Zap, color: '#eab308' },
        'Plumber': { icon: Droplets, color: '#3b82f6' },
        'Carpenter': { icon: Hammer, color: '#8b5cf6' },
        'AC Technician': { icon: Settings, color: '#10b981' },
        'Home Appliance': { icon: Home, color: '#f59e0b' }
    };

    // Search function
    const matchesSearchTerm = (technician, term) => {
        if (!term || term.trim() === '') return true;

        const cleanTerm = term.toLowerCase().trim();
        const searchableText = [
            technician.name || '',
            technician.email || '',
            technician.phone || '',
            technician.location || '',
            technician.address || '',
            technician.category || '',
            technician.licenseNumber || '',
            ...(technician.skills || []),
            ...(technician.certifications || [])
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

    // Filter and search technicians
    const filteredTechnicians = useMemo(() => {
        let filtered = technicians.filter(tech => {
            const matchesSearch = matchesSearchTerm(tech, searchTerm);
            const matchesStatus = statusFilter === 'all' || tech.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || tech.category === categoryFilter;

            const matchesDate = dateFilter === 'all' || (() => {
                const regDate = new Date(tech.registrationDate);
                const now = new Date();
                const daysDiff = (now - regDate) / (1000 * 60 * 60 * 24);

                switch (dateFilter) {
                    case 'today': return daysDiff <= 1;
                    case 'week': return daysDiff <= 7;
                    case 'month': return daysDiff <= 30;
                    default: return true;
                }
            })();

            return matchesSearch && matchesStatus && matchesCategory && matchesDate;
        });

        // Enhanced sorting
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'registrationDate' || sortBy === 'lastActive') {
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
    }, [technicians, searchTerm, statusFilter, categoryFilter, dateFilter, sortBy, sortOrder]);

    // Status counts
    const statusCounts = useMemo(() => {
        return technicians.reduce((acc, tech) => {
            acc[tech.status] = (acc[tech.status] || 0) + 1;
            acc.total = (acc.total || 0) + 1;
            return acc;
        }, {});
    }, [technicians]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'blocked': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return CheckCircle;
            case 'pending': return Clock;
            case 'blocked': return Ban;
            default: return AlertTriangle;
        }
    };

    const handleTechnicianAction = (technician, action) => {
        setSelectedTechnician(technician);
        setModalType(action);
        setShowModal(true);
    };

    const handleApproveTechnician = (techId) => {
        setTechnicians(technicians.map(tech =>
            tech.id === techId ? { ...tech, status: 'active' } : tech
        ));
        setShowModal(false);
    };

    const handleRejectTechnician = (techId) => {
        setTechnicians(technicians.filter(tech => tech.id !== techId));
        setShowModal(false);
    };

    const handleBlockTechnician = (techId) => {
        setTechnicians(technicians.map(tech =>
            tech.id === techId ? { ...tech, status: 'blocked' } : tech
        ));
        setShowModal(false);
    };

    const handleUnblockTechnician = (techId) => {
        setTechnicians(technicians.map(tech =>
            tech.id === techId ? { ...tech, status: 'active' } : tech
        ));
        setShowModal(false);
    };

    const handleResetPassword = (techId) => {
        alert(`Password reset email sent to ${selectedTechnician.email}`);
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
        <div className={`${styles['admin-wrapper']} ${sidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
        <div className="user-management">
            <div className="user-management-container">
                {/* Header */}
                <div className="page-header">
                    <div className="page-header-top">
                        <h1 className="page-title">
                            <Wrench size={28} />
                            Technician Management
                        </h1>
                        <button className="export-btn">
                            <Download size={16} />
                            Export Data
                        </button>
                    </div>
                    <p className="page-subtitle">Manage technician accounts, approvals, and performance tracking</p>
                </div>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-icon total">
                            <Wrench size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{statusCounts.total || 0}</div>
                            <div className="summary-label">Total Technicians</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon active">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{statusCounts.active || 0}</div>
                            <div className="summary-label">Active Technicians</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon pending">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{statusCounts.pending || 0}</div>
                            <div className="summary-label">Pending Approval</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon blocked">
                            <Ban size={24} />
                        </div>
                        <div>
                            <div className="summary-value">{statusCounts.blocked || 0}</div>
                            <div className="summary-label">Blocked Technicians</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="filters-section">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, category, license, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="blocked">Blocked</option>
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
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="rating-desc">Highest Rated</option>
                            <option value="completedJobs-desc">Most Jobs</option>
                            <option value="registrationDate-desc">Newest First</option>
                            <option value="registrationDate-asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Technicians Table */}
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Technician</th>
                            <th>Category & License</th>
                            <th>Performance</th>
                            <th>Payment Status</th>
                            <th>Registration</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTechnicians.map(tech => {
                            const StatusIcon = getStatusIcon(tech.status);
                            const CategoryIcon = categories[tech.category]?.icon || Settings;
                            return (
                                <tr key={tech.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="user-name">{tech.name}</div>
                                                <div className="user-location">
                                                    <MapPin size={12} />
                                                    {tech.location}
                                                </div>
                                                <div className="user-location">
                                                    <Award size={12} />
                                                    {tech.experience}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-type">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <CategoryIcon size={14} color={categories[tech.category]?.color} />
                                                {tech.category}
                                            </div>
                                            <div className="specialization">
                                                <FileText size={10} />
                                                {tech.licenseNumber}
                                            </div>
                                            <div className="specialization">
                                                Exp: {new Date(tech.licenseExpiry).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-type">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                                                <Star size={12} color="#fbbf24" />
                                                <span>{tech.rating || 'N/A'}</span>
                                            </div>
                                            <div className="specialization">
                                                Jobs: {tech.completedJobs || 0}
                                            </div>
                                            <div className="specialization">
                                                ₨{tech.totalEarnings?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-type">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem', color: '#10b981' }}>
                                                <Plus size={12} />
                                                <span>₨{tech.paymentReceived?.toLocaleString() || 0}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626' }}>
                                                <Minus size={12} />
                                                <span>₨{tech.paymentDeclined?.toLocaleString() || 0}</span>
                                            </div>
                                            <div className="specialization">
                                                Net: ₨{((tech.paymentReceived || 0) - (tech.paymentDeclined || 0)).toLocaleString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-info">
                                            <Calendar size={12} />
                                            {new Date(tech.registrationDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="status-badge" style={{ color: getStatusColor(tech.status) }}>
                                            <StatusIcon size={14} />
                                            {tech.status.charAt(0).toUpperCase() + tech.status.slice(1)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view"
                                                onClick={() => handleTechnicianAction(tech, 'profile')}
                                                title="View Profile"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {tech.status === 'active' && (
                                                <button
                                                    className="action-btn view"
                                                    onClick={() => handleTechnicianAction(tech, 'performance')}
                                                    title="View Performance"
                                                    style={{ color: '#8b5cf6' }}
                                                >
                                                    <TrendingUp size={16} />
                                                </button>
                                            )}

                                            {tech.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="action-btn approve"
                                                        onClick={() => handleTechnicianAction(tech, 'approve')}
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleTechnicianAction(tech, 'reject')}
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}

                                            {tech.status === 'active' && (
                                                <button
                                                    className="action-btn block"
                                                    onClick={() => handleTechnicianAction(tech, 'block')}
                                                    title="Block Technician"
                                                >
                                                    <ShieldOff size={16} />
                                                </button>
                                            )}

                                            {tech.status === 'blocked' && (
                                                <button
                                                    className="action-btn unblock"
                                                    onClick={() => handleTechnicianAction(tech, 'unblock')}
                                                    title="Unblock Technician"
                                                >
                                                    <Shield size={16} />
                                                </button>
                                            )}

                                            <button
                                                className="action-btn reset"
                                                onClick={() => handleTechnicianAction(tech, 'reset')}
                                                title="Reset Password"
                                            >
                                                <KeyRound size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {filteredTechnicians.length === 0 && (
                        <div className="no-results">
                            <Wrench size={48} />
                            <h3>No technicians found</h3>
                            <p>Try adjusting your search criteria or filters</p>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    {selectedTechnician && (
                        <>
                            {modalType === 'profile' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Technician Profile</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="profile-details">
                                        {/* Personal Information Section */}
                                        <div className="profile-section">
                                            <h4>Personal Information</h4>
                                            <div className="profile-grid">
                                                <div className="profile-item">
                                                    <label>Full Name</label>
                                                    <span>{selectedTechnician.name}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Email</label>
                                                    <span>{selectedTechnician.email}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Phone</label>
                                                    <span>{selectedTechnician.phone}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Address</label>
                                                    <span>{selectedTechnician.address}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Location</label>
                                                    <span>{selectedTechnician.location}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Experience</label>
                                                    <span>{selectedTechnician.experience}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional Information Section */}
                                        <div className="profile-section">
                                            <h4>Professional Information</h4>
                                            <div className="profile-grid">
                                                <div className="profile-item">
                                                    <label>Category</label>
                                                    <span>{selectedTechnician.category}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>License Number</label>
                                                    <span>{selectedTechnician.licenseNumber}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>License Expiry</label>
                                                    <span>{new Date(selectedTechnician.licenseExpiry).toLocaleDateString()}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Registration Date</label>
                                                    <span>{new Date(selectedTechnician.registrationDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills and Certifications */}
                                        <div className="profile-section">
                                            <h4>Skills & Certifications</h4>
                                            <div className="profile-grid">
                                                <div className="profile-item" style={{ gridColumn: '1 / -1' }}>
                                                    <label>Skills</label>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        {selectedTechnician.skills?.map((skill, index) => (
                                                            <span key={index} style={{
                                                                background: '#e0f2fe',
                                                                color: '#0369a1',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="profile-item" style={{ gridColumn: '1 / -1' }}>
                                                    <label>Certifications</label>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        {selectedTechnician.certifications?.map((cert, index) => (
                                                            <span key={index} style={{
                                                                background: '#f0fdf4',
                                                                color: '#166534',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }}>
                                                                {cert}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Information */}
                                        <div className="profile-section">
                                            <h4>Payment Information</h4>
                                            <div className="profile-grid">
                                                <div className="profile-item">
                                                    <label>Total Earnings</label>
                                                    <span>₨{selectedTechnician.totalEarnings?.toLocaleString() || 0}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Payment Received</label>
                                                    <span style={{ color: '#10b981' }}>+₨{selectedTechnician.paymentReceived?.toLocaleString() || 0}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Payment Declined</label>
                                                    <span style={{ color: '#dc2626' }}>-₨{selectedTechnician.paymentDeclined?.toLocaleString() || 0}</span>
                                                </div>
                                                <div className="profile-item">
                                                    <label>Net Payment</label>
                                                    <span style={{ fontWeight: 'bold' }}>₨{((selectedTechnician.paymentReceived || 0) - (selectedTechnician.paymentDeclined || 0)).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Performance Metrics */}
                                        {selectedTechnician.status === 'active' && (
                                            <>
                                                <div className="profile-section">
                                                    <h4>Performance Metrics</h4>
                                                    <div className="profile-grid">
                                                        <div className="profile-item">
                                                            <label>Customer Satisfaction</label>
                                                            <span>{selectedTechnician.customerSatisfaction}%</span>
                                                        </div>
                                                        <div className="profile-item">
                                                            <label>Response Time</label>
                                                            <span>{selectedTechnician.responseTime}</span>
                                                        </div>
                                                        <div className="profile-item">
                                                            <label>Completion Rate</label>
                                                            <span>{Math.round((selectedTechnician.completedJobs / (selectedTechnician.completedJobs + 2)) * 100)}%</span>
                                                        </div>
                                                        <div className="profile-item">
                                                            <label>Last 30 Days Jobs</label>
                                                            <span>{Math.floor(selectedTechnician.completedJobs / 6) || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="profile-section">
                                                    <h4>Monthly Earnings Trend</h4>
                                                    <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '120px', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                                                        {selectedTechnician.monthlyEarnings?.map((earning, index) => {
                                                            const maxEarning = Math.max(...selectedTechnician.monthlyEarnings);
                                                            const height = (earning / maxEarning) * 80;
                                                            return (
                                                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                                                    <div style={{
                                                                        width: '100%',
                                                                        height: `${height}px`,
                                                                        backgroundColor: '#0ea5e9',
                                                                        borderRadius: '4px 4px 0 0',
                                                                        marginBottom: '4px'
                                                                    }}></div>
                                                                    <span style={{ fontSize: '10px', color: '#64748b' }}>
                                                                        ₨{(earning/1000).toFixed(0)}k
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="profile-section">
                                                    <h4>Performance Indicators</h4>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span>Job Completion Rate</span>
                                                            <div style={{ width: '60%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${Math.round((selectedTechnician.completedJobs / (selectedTechnician.completedJobs + 2)) * 100)}%`, height: '100%', background: '#10b981' }}></div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span>Customer Satisfaction</span>
                                                            <div style={{ width: '60%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${selectedTechnician.customerSatisfaction}%`, height: '100%', background: '#0ea5e9' }}></div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span>Rating Score</span>
                                                            <div style={{ width: '60%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${(selectedTechnician.rating / 5) * 100}%`, height: '100%', background: '#f59e0b' }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Documents */}
                                        <div className="profile-section">
                                            <h4>Documents</h4>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {selectedTechnician.documents?.map((doc, index) => (
                                                    <span key={index} style={{
                                                        background: '#fef3c7',
                                                        color: '#92400e',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <FileText size={12} />
                                                        {doc}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'approve' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Approve Technician</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <CheckCircle size={48} color="#10b981" />
                                        <p>Are you sure you want to approve <strong>{selectedTechnician.name}</strong>?</p>
                                        <p>This will grant them access to receive job requests on the platform.</p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleApproveTechnician(selectedTechnician.id)}
                                            >
                                                Approve Technician
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'reject' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Reject Technician</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <X size={48} color="#dc2626" />
                                        <p>Are you sure you want to reject <strong>{selectedTechnician.name}</strong>?</p>
                                        <p>This will permanently remove their registration from the system.</p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleRejectTechnician(selectedTechnician.id)}
                                            >
                                                Reject Technician
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'block' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Block Technician</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <Ban size={48} color="#dc2626" />
                                        <p>Are you sure you want to block <strong>{selectedTechnician.name}</strong>?</p>
                                        <p>This will prevent them from receiving new job requests and accessing the platform.</p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-block"
                                                onClick={() => handleBlockTechnician(selectedTechnician.id)}
                                            >
                                                Block Technician
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'unblock' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Unblock Technician</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <Shield size={48} color="#10b981" />
                                        <p>Are you sure you want to unblock <strong>{selectedTechnician.name}</strong>?</p>
                                        <p>This will restore their access to receive job requests on the platform.</p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleUnblockTechnician(selectedTechnician.id)}
                                            >
                                                Unblock Technician
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'reset' && (
                                <div className="modal-body">
                                    <div className="modal-header">
                                        <h3>Reset Password</h3>
                                        <button onClick={() => setShowModal(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="confirmation-content">
                                        <KeyRound size={48} color="#0ea5e9" />
                                        <p>Reset password for <strong>{selectedTechnician.name}</strong>?</p>
                                        <p>A password reset email will be sent to <strong>{selectedTechnician.email}</strong></p>
                                        <div className="modal-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleResetPassword(selectedTechnician.id)}
                                            >
                                                Send Reset Email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Modal>
            </div>
        </div>
        </div>
    );
};

export default TechnicianManagement;