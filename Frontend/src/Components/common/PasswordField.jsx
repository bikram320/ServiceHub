import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({ name, value, onChange, placeholder, show, toggleShow }) => (
    <div className="field-group">
        <div className="password-container">
            <input
                type={show ? "text" : "password"}
                name={name}
                className="password-input"
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required
            />
            <button className="eye-button" type="button" onClick={toggleShow}>
                {show ? <EyeOff className="eye-icon"/> : <Eye className="eye-icon"/>}
            </button>
        </div>
    </div>
);

export default PasswordField;
