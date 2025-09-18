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

const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="empty-state">
            <Icon size={48} style={{ color: '#9ca3af' }} />
            <h4>{title}</h4>
            <p>{description}</p>
            {action && action}
        </div>
    );
};

export default EmptyState;