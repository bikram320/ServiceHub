import React from 'react';

const FormCard = ({ title, subtitle, children  }) => (
    <div className="form-card">
        <h1 className="title">{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>} {/*only renders if subtitle exists*/}
        <div className="form-container">{children}</div>
    </div>
);

export default FormCard;