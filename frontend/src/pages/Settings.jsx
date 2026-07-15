import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const Settings = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const handleSave = () => {
    setToastMessage('Settings saved successfully');
    setToastType('success');
  };

  return (
    <div className="settings-container">
      <Navbar title="Application Settings" />

      <div className="settings-card glass-card animate-fade">
        <h3>General Preferences</h3>
        
        <div className="pref-row">
          <div className="pref-info">
            <h4>Email Notifications</h4>
            <p>Receive daily digest of due and overdue tasks via email</p>
          </div>
          <input
            type="checkbox"
            className="switch-checkbox"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
          />
        </div>

        <div className="pref-row">
          <div className="pref-info">
            <h4>Push Notifications</h4>
            <p>Get alerts directly in your browser when tasks are close to due dates</p>
          </div>
          <input
            type="checkbox"
            className="switch-checkbox"
            checked={pushNotif}
            onChange={(e) => setPushNotif(e.target.checked)}
          />
        </div>

        <button className="btn btn-primary save-settings-btn" onClick={handleSave}>
          Save Settings
        </button>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      <style>{`
        .settings-container {
          flex-grow: 1;
          padding: 24px;
        }

        .settings-card {
          max-width: 600px;
          margin: 0 auto;
          padding: 36px;
        }

        .settings-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 12px;
        }

        .pref-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .pref-info h4 {
          font-size: 15px;
          color: white;
          margin-bottom: 4px;
        }

        .pref-info p {
          font-size: 13px;
          color: var(--text-muted);
        }

        .switch-checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .save-settings-btn {
          margin-top: 32px;
          float: right;
        }
      `}</style>
    </div>
  );
};

export default Settings;
