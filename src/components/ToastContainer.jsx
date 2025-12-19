import React from 'react';
import { useToast } from '../context/ToastContext';
import Toast from './Toast';
import './Toast.css';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
