import React, { useState, useEffect } from 'react';


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