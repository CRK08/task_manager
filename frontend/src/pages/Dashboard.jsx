import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    highPriorityTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [urgentTasks, setUrgentTasks] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const metricsRes = await api.get('/dashboard');
        setMetrics(metricsRes.data);

        // Fetch overdue tasks for warning widget
        const overdueRes = await api.get('/tasks/overdue');
        setUrgentTasks(overdueRes.data.slice(0, 3)); // show top 3 urgent tasks
      } catch (error) {
        console.error('Error fetching dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: 'Total Tasks',
      value: metrics.totalTasks,
      color: 'var(--primary)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Pending',
      value: metrics.pendingTasks,
      color: 'var(--status-pending)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: 'In Progress',
      value: metrics.inProgressTasks,
      color: 'var(--status-inprogress)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      ),
    },
    {
      title: 'Completed',
      value: metrics.completedTasks,
      color: 'var(--status-completed)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ),
    },
    {
      title: 'High Priority',
      value: metrics.highPriorityTasks,
      color: 'var(--priority-high)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: 'Overdue',
      value: metrics.overdueTasks,
      color: '#ef4444',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', width: '100%' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid var(--glass-border)', 
          borderTopColor: 'var(--primary)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar title="Dashboard Overview" />

      <div className="dashboard-grid animate-fade">
        {cards.map((card, i) => (
          <div key={i} className="metric-card glass-card animate-fade" style={{ '--card-accent': card.color, animationDelay: `${i * 0.05}s` }}>
            <div className="metric-header">
              <span className="metric-title">{card.title}</span>
              <div className="metric-icon" style={{ color: card.color }}>{card.icon}</div>
            </div>
            <div className="metric-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections animate-fade">
        <div className="urgent-tasks-widget glass-card">
          <h3>Urgent & Overdue Tasks</h3>
          {urgentTasks.length === 0 ? (
            <p className="no-urgent">🎉 No overdue tasks! Keep up the good work.</p>
          ) : (
            <div className="urgent-list">
              {urgentTasks.map((task) => (
                <div key={task.id} className="urgent-item">
                  <div className="urgent-details">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                  </div>
                  <div className="urgent-meta">
                    <span className="due-tag">Due: {task.dueDate}</span>
                    <span className="prio-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dashboard-container {
          flex-grow: 1;
          padding: 24px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .metric-card {
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--card-accent);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .metric-title {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: white;
        }

        .dashboard-sections {
          margin-top: 24px;
        }

        .urgent-tasks-widget {
          padding: 28px;
        }

        .urgent-tasks-widget h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: white;
        }

        .no-urgent {
          color: var(--text-muted);
          font-size: 14px;
        }

        .urgent-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .urgent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: var(--border-radius);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
        }

        .urgent-details h4 {
          font-size: 15px;
          color: white;
          margin-bottom: 4px;
        }

        .urgent-details p {
          font-size: 13px;
          color: var(--text-muted);
        }

        .urgent-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .due-tag {
          font-size: 12px;
          color: #ef4444;
          font-weight: 500;
        }

        .prio-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
