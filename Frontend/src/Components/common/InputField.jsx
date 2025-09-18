import React from 'react';

const InputField = ({type, name, value, onChange, placeholder}) => (
    <div className="field-group">
        <input
            type={type}
            name={name}
            className="input"
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required
            />
    </div>
);

export default InputField;