import React from 'react';
import ServiceButton from '../common/ServiceButton';
import { useNavigate } from 'react-router-dom';

const ServiceList = ({ services }) => {
    const navigate = useNavigate();

    const handleServiceClick = (service) => {
        // Navigate to TechnicianList page, optionally passing the selected service
        navigate('/TechnicianList', { state: { selectedService: service } });
        // Or if you want to pass it as a URL parameter:
        // navigate(`/technician-list/${encodeURIComponent(service)}`);
    };

    return (
        <div className="services-grid">
            {services.map((service, index) => (
                <ServiceButton
                    key={index}
                    label={service}
                    onClick={() => handleServiceClick(service)}
                />
            ))}
        </div>
    );
};

export default ServiceList;