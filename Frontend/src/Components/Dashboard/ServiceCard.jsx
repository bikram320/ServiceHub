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

const ServiceCard = ({ service, onBook }) => {
    const Icon = service.icon;

    return (
        <div className="service-card">
            <div className="service-icon">
                <Icon size={24} />
            </div>
            <div className="service-info">
                <div className="service-name">{service.name}</div>
                <div className="service-category">{service.category}</div>
                <div className="service-price">Starting from {service.startingPrice}</div>
            </div>
            <button className="book-btn" onClick={() => onBook(service)}>Book Now</button>
        </div>
    );
};

export default ServiceCard;