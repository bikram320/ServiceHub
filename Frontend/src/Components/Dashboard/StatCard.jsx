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

const StatCard = ({ icon: Icon, value, label, change, color, bgColor, size = "default" }) => {
    const cardClass = size === "small" ? "stat-card-small" : "stat-card";

    return (
        <div className={cardClass}>
            <div className="stat-icon" style={{backgroundColor: bgColor}}>
                <Icon size={24} style={{color: color}}/>
            </div>
            <div className="stat-content">
                <div className="stat-number">{value}</div>
                <div className="stat-label">{label}</div>
                {change && <div
                    className={`stat-change ${change.startsWith('+') ? 'positive' : change === 'No change' ? 'neutral' : 'negative'}`}>{change}</div>}
            </div>
        </div>
    );
};

export default StatCard;