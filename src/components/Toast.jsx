import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import './Toast.css';

const Toast = ({ id, message, type, duration, onClose }) => {
    const [progress, setProgress] = useState(100);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev - (100 / (duration / 100));
                return newProgress <= 0 ? 0 : newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle />;
            case 'error':
                return <FaExclamationCircle />;
            case 'warning':
                return <FaExclamationTriangle />;
            default:
                return <FaInfoCircle />;
        }
    };

    return (
        <div className={`toast toast-${type} ${isLeaving ? 'toast-leaving' : ''}`}>
            <div className="toast-icon">{getIcon()}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={handleClose}>
                <FaTimes />
            </button>
            <div className="toast-progress" style={{ width: `${progress}%` }} />
        </div>
    );
};

export default Toast;
