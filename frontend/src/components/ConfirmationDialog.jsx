import React from 'react';

const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay animate-fade">
      <div className="dialog-box glass-card">
        <h3>{title || 'Confirm Action'}</h3>
        <p>{message || 'Are you sure you want to perform this action?'}</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary btn-danger-action" onClick={onConfirm}>Confirm</button>
        </div>
      </div>

      <style>{`
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .dialog-box {
          width: 400px;
          padding: 28px;
          border-radius: var(--border-radius);
          text-align: center;
          border-color: rgba(239, 68, 68, 0.2);
        }

        .dialog-box h3 {
          font-size: 20px;
          margin-bottom: 12px;
          color: white;
        }

        .dialog-box p {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .dialog-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .btn-danger-action {
          background: linear-gradient(135deg, #ef4444, #f97316);
          box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.2);
        }

        .btn-danger-action:hover {
          box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.4);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default ConfirmationDialog;
