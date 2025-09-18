import React from 'react';

const CheckboxField = ({ name, checked, onChange, label }) => (
    <div className="checkbox-row">
        <input
            type="checkbox"
            name={name}
            className="checkbox"
            checked={checked}
            onChange={onChange}
        />
        <label className="checkbox-label" htmlFor={name}>{label}</label>
    </div>
);

export default CheckboxField;
