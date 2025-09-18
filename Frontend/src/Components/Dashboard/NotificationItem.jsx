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

const NotificationItem = ({ notification, onClose }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} style={{ color: '#10b981' }} />;
            case 'warning': return <AlertCircle size={20} style={{ color: '#f59e0b' }} />;
            case 'info': return <Bell size={20} style={{ color: '#3b82f6' }} />;
            default: return <Bell size={20} />;
        }
    };

    return (
        <div className="notification-item">
            <div className="notification-icon">
                {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{notification.time}</div>
            </div>
            <button
                className="notification-close"
                onClick={() => onClose(notification.id)}
            >
                ×
            </button>
        </div>
    );
};

export default NotificationItem;