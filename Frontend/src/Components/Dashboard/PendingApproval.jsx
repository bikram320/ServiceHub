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

const PendingApprovalItem = ({ approval, onApprove, onReject }) => {
    return (
        <div className="list-item">
            <div>
                <div className="item-name">{approval.name}</div>
                <div className="item-meta">
                    {approval.type} • {approval.location}
                    {approval.specialization && ` • ${approval.specialization}`}
                </div>
            </div>
            <div className="item-actions">
                <button className="btn-reject" onClick={() => onReject(approval.id)}>
                    <X size={14} />
                </button>
                <button className="btn-approve" onClick={() => onApprove(approval.id)}>
                    <Check size={14} />
                </button>
            </div>
        </div>
    );
};

export default PendingApprovalItem ;