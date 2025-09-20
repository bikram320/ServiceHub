import React, { useState, useEffect } from 'react';
import styles from '../../styles/UserDashboard.module.css';

const ServiceCard = ({ service, onBook }) => {
    const Icon = service.icon;

    return (
        <div className={styles["service-card"]}>
            <div className="service-icon">
                <Icon size={24} />
            </div>
            <div className={styles["service-info"]}>
                <div className={styles["service-name"]}>{service.name}</div>
                <div className={styles["service-category"]}>{service.category}</div>
                <div className={styles["service-price"]}>Starting from {service.startingPrice}</div>
            </div>
            <button className={styles["book-btn"]} onClick={() => onBook(service)}>Book Now</button>
        </div>
    );
};

export default ServiceCard;