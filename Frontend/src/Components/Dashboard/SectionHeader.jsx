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

const SectionHeader = ({ title, icon: Icon, actions, subtitle }) => {
    return (
        <div className="section-header">
            <h3 className="section-title">
                {Icon && <Icon size={20} style={{marginRight: '0.5rem'}} />}
                {title}
                {subtitle && <span className="section-subtitle"> • {subtitle}</span>}
            </h3>
            <div className="section-actions">
                {actions}
            </div>
        </div>
    );
};

export default SectionHeader;