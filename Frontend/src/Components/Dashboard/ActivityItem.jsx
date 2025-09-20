import React, { useState, useEffect } from 'react';
import {User} from 'lucide-react';
import styles from '../../styles/UserDashboard.module.css';

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
        <div className={styles["activity-item"]}>
            {showDot && <div className={styles["activity-dot"]}></div>}
            {!showDot && (
                <div
                    className={styles["activity-status"]}
                    style={{ backgroundColor: getStatusColor(activity.status) }}
                ></div>
            )}
            <div className={styles["activity-content"]}>
                <div className={styles["activity-action"]}>{activity.action || activity.message}</div>
                <div className="activity-details">
                    {activity.client && (
                        <>
                            <User size={14} />
                            <span>{activity.client}</span>
                        </>
                    )}
                    <span className={styles["activity-time"]}>{activity.time}</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityItem;