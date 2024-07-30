import React from 'react';

interface BurttonProps{
    onClick: ()=>void;
    disabled?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<BurttonProps> = ({ onClick, disabled = false, children}) =>(
    <button onClick={onClick} disabled = {disabled}>
        {children}
    </button>
);

export default Button;