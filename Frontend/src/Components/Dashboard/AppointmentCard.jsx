import StarRating from '../../Components/Dashboard/StarRating';
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    User
} from 'lucide-react';
import styles from '../../styles/UserDashboard.module.css';

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
        <div className={`${styles['appointment-card']} ${type === 'history' ? styles['history-card'] : ''}`}>
            <div className={styles['appointment-header']}>
                <div className={styles['appointment-service-info']}>
                    <h4 className={styles['appointment-title']}>{appointment.service || appointment.type}</h4>
                    <div className={styles['appointment-provider']}>{appointment.provider || `Client: ${appointment.client}`}</div>
                </div>
                <div className={styles['appointment-status']}>
                    <span
                        className={styles['status-badge']}
                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                    </span>
                    <div className={styles['appointment-price']}>{appointment.price || appointment.amount}</div>
                </div>
            </div>

            <div className={styles['appointment-details']}>
                <div className={styles['detail-item']}>
                    <Calendar size={16} />
                    <span>{appointment.date}, {appointment.time}</span>
                </div>
                <div className={styles['detail-item']}>
                    <MapPin size={16} />
                    <span>{appointment.location}</span>
                </div>
                <div className={styles['detail-item']}>
                    <User size={16} />
                    <span>{appointment.technician || appointment.client}</span>
                    {appointment.rating && (
                        <div className={styles['provider-rating']}>
                            <StarRating rating={appointment.rating} />
                            <span>({appointment.rating})</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles['appointment-actions']}>
                {type === 'upcoming' && (
                    <>
                        <button className={`${styles['action-btn']} ${styles.secondary}`} onClick={() => onAction('view', appointment.id)}>
                            <Eye size={16} />
                            Details
                        </button>
                        <button className={`${styles['action-btn']} ${styles.danger}`} onClick={() => onAction('cancel', appointment.id)}>Cancel</button>
                    </>
                )}
                {type === 'history' && (
                    <>
                        <button className={`${styles['action-btn']} ${styles.secondary}`} onClick={() => onAction('view', appointment.id)}>
                            <Eye size={16} />
                            View Details
                        </button>
                        {appointment.status === 'completed' && (
                            <button className={`${styles['action-btn']} ${styles.primary}`} onClick={() => onAction('book-again', appointment.id)}>Book Again</button>
                        )}
                    </>
                )}
                {type === 'technician' && (
                    <>
                        <button className={`${styles['action-btn']} ${styles.primary}`} onClick={() => onAction('accept', appointment.id)}>Accept</button>
                        <button className={`${styles['action-btn']} ${styles.secondary}`} onClick={() => onAction('reschedule', appointment.id)}>Reschedule</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;