import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="profile-container">
      <Navbar title="My Profile" />

      <div className="profile-card glass-card animate-fade">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U'}
          </div>
          <h2>{user?.name || 'User'}</h2>
          <p>{user?.email || 'user@example.com'}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-box">
            <span className="stat-val">{stats.totalTasks}</span>
            <span className="stat-label">Total Assigned</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{stats.completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <style>{`
        .profile-container {
          flex-grow: 1;
          padding: 24px;
        }

        .profile-card {
          max-width: 500px;
          margin: 40px auto 0;
          padding: 40px;
          text-align: center;
        }

        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .profile-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: white;
          border: 4px solid var(--glass-border);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }

        .profile-header h2 {
          color: white;
          font-size: 22px;
        }

        .profile-header p {
          color: var(--text-muted);
          font-size: 14px;
        }

        .profile-stats {
          display: flex;
          justify-content: space-around;
          border-top: 1px solid var(--glass-border);
          padding-top: 28px;
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-val {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default Profile;
