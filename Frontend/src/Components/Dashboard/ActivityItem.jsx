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

const ActivityItem = ({ activity, showDot = false }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'in-progress': return '#3b82f6';
            case 'success': return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <div className="activity-item">
            {showDot && <div className="activity-dot"></div>}
            {!showDot && (
                <div
                    className="activity-status"
                    style={{ backgroundColor: getStatusColor(activity.status) }}
                ></div>
            )}
            <div className="activity-content">
                <div className="activity-action">{activity.action || activity.message}</div>
                <div className="activity-details">
                    {activity.client && (
                        <>
                            <User size={14} />
                            <span>{activity.client}</span>
                        </>
                    )}
                    <span className="activity-time">{activity.time}</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityItem;