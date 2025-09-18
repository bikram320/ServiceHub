import React from 'react';
import ServiceButton from '../common/ServiceButton';

const ServiceList = ({ services, onServiceClick }) => (
    <div className="services-grid">
        {services.map((service, index) => (
            <ServiceButton
                key={index}
                label={service}
                onClick={() => onServiceClick(service)}
            />
        ))}
    </div>
);

export default ServiceList;