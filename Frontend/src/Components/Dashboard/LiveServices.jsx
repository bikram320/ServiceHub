import React, { useState, useEffect } from 'react';
import {
    MessageSquare
} from 'lucide-react';

const LiveServiceItem = ({ service, onMessage }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return '#8b5cf6';
            case 'Scheduled': return '#06b6d4';
            case 'Completed': return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <div className="service-item" style={{ borderLeftColor: getStatusColor(service.status) }}>
            <div className="service-top">
                <div className="service-type">{service.type}</div>
                <div className="service-amount">{service.amount}</div>
            </div>
            <div className="service-bottom">
                <div className="service-meta">{service.client} • {service.technician}</div>
                <div className="service-status">
                    <span style={{ color: getStatusColor(service.status) }}>{service.status}</span>
                    <button className="icon-btn" onClick={() => onMessage(service.id)}>
                        <MessageSquare size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveServiceItem;