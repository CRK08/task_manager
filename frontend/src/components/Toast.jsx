import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`toast-notification ${type || 'info'} animate-fade`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>

      <style>{`
        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          z-index: 2000;
        }

        .toast-notification.success {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #a7f3d0;
        }

        .toast-notification.error {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .toast-notification.info {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.4);
          color: #bfdbfe;
        }

        .toast-message {
          font-size: 14px;
          font-weight: 500;
        }

        .toast-close {
          background: none;
          border: none;
          color: inherit;
          font-size: 20px;
          cursor: pointer;
          opacity: 0.7;
          transition: var(--transition-smooth);
        }

        .toast-close:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Toast;
