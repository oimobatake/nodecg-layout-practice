import React from "react";

interface InputFieldProps {
    value:string;
    onChange:(value:string) => void;
    placeholder?: string;
}

const InputField: React.FC<InputFieldProps > = ({value, onChange, placeholder}) => (
    <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
    />
);

export default InputField;