import StarRating from '../../Components/Dashboard/StarRating';
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Plus,
    Search,
    Filter,
    Star,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    MessageSquare,
    Phone,
    User,
    Home,
    Wrench,
    Zap,
    Car,
    Scissors,
    Heart,
    BookOpen,
    BarChart3,
    TrendingUp,
    Bell,
    Settings,
    Activity,
    DollarSign,
    RefreshCw,
    UserCheck,
    Users,
    AlertTriangle,
    Check,
    X
} from 'lucide-react';

const AppointmentCard = ({ appointment, type = "upcoming", onAction }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'completed': return '#6366f1';
            case 'cancelled': return '#ef4444';
            case 'In Progress': return '#8b5cf6';
            case 'Scheduled': return '#06b6d4';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle size={16} />;
            case 'pending': return <AlertCircle size={16} />;
            case 'completed': return <CheckCircle size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className={`appointment-card ${type === 'history' ? 'history-card' : ''}`}>
            <div className="appointment-header">
                <div className="appointment-service-info">
                    <h4 className="appointment-title">{appointment.service || appointment.type}</h4>
                    <div className="appointment-provider">{appointment.provider || `Client: ${appointment.client}`}</div>
                </div>
                <div className="appointment-status">
                    <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                    </span>
                    <div className="appointment-price">{appointment.price || appointment.amount}</div>
                </div>
            </div>

            <div className="appointment-details">
                <div className="detail-item">
                    <Calendar size={16} />
                    <span>{appointment.date}, {appointment.time}</span>
                </div>
                <div className="detail-item">
                    <MapPin size={16} />
                    <span>{appointment.location}</span>
                </div>
                <div className="detail-item">
                    <User size={16} />
                    <span>{appointment.technician || appointment.client}</span>
                    {appointment.rating && (
                        <div className="provider-rating">
                            <StarRating rating={appointment.rating} />
                            <span>({appointment.rating})</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="appointment-actions">
                {type === 'upcoming' && (
                    <>
                        <button className="action-btn secondary" onClick={() => onAction('view', appointment.id)}>
                            <Eye size={16} />
                            Details
                        </button>
                        <button className="action-btn danger" onClick={() => onAction('cancel', appointment.id)}>Cancel</button>
                    </>
                )}
                {type === 'history' && (
                    <>
                        <button className="action-btn secondary" onClick={() => onAction('view', appointment.id)}>
                            <Eye size={16} />
                            View Details
                        </button>
                        {appointment.status === 'completed' && (
                            <button className="action-btn primary" onClick={() => onAction('book-again', appointment.id)}>Book Again</button>
                        )}
                    </>
                )}
                {type === 'technician' && (
                    <>
                        <button className="action-btn primary" onClick={() => onAction('accept', appointment.id)}>Accept</button>
                        <button className="action-btn secondary" onClick={() => onAction('reschedule', appointment.id)}>Reschedule</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;