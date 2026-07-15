import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ title }) => {
  const { user } = useContext(AuthContext);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="navbar glass-card animate-fade">
      <div className="nav-title">
        <h1>{title || 'Dashboard'}</h1>
      </div>

      {user && (
        <div className="user-profile-widget">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <div className="user-avatar">{getInitials(user.name)}</div>
        </div>
      )}

      <style>{`
        .navbar {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          margin-bottom: 24px;
          border-radius: var(--border-radius);
          background: var(--bg-glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
        }

        .nav-title h1 {
          font-size: 20px;
          font-weight: 600;
          color: white;
        }

        .user-profile-widget {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .user-name {
          font-weight: 500;
          font-size: 14px;
          color: var(--text-main);
        }

        .user-email {
          font-size: 11px;
          color: var(--text-muted);
        }

        .user-avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </header>
  );
};

export default Navbar;
