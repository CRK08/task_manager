import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Toast from '../components/Toast';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewArchived, setViewArchived] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let res;
      if (searchQuery) {
        res = await api.get(`/tasks/search?query=${searchQuery}`);
      } else if (statusFilter) {
        res = await api.get(`/tasks/status/${statusFilter}`);
      } else if (priorityFilter) {
        res = await api.get(`/tasks/priority/${priorityFilter}`);
      } else {
        res = await api.get('/tasks');
      }

      // Filter tasks client-side based on archived flag
      const filtered = res.data.filter((task) => task.archived === viewArchived);
      setTasks(filtered);
    } catch (error) {
      console.error('Error fetching tasks', error);
      showToast('Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchQuery, statusFilter, priorityFilter, viewArchived]);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const handleArchive = async (id, isArchived) => {
    try {
      if (isArchived) {
        await api.put(`/tasks/${id}/restore`);
        showToast('Task restored successfully');
      } else {
        await api.put(`/tasks/${id}/archive`);
        showToast('Task archived successfully');
      }
      fetchTasks();
    } catch (error) {
      showToast('Action failed', 'error');
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedTaskId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDialogOpen(false);
    try {
      await api.delete(`/tasks/${selectedTaskId}`);
      showToast('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="tasklist-container">
      <Navbar title={viewArchived ? 'Archived Tasks' : 'All Active Tasks'} />

      {/* Control Bar */}
      <div className="control-bar glass-card animate-fade">
        <div className="search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-wrapper">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPriorityFilter(''); }}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setStatusFilter(''); }}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <button className={`btn btn-secondary ${viewArchived ? 'active-toggle' : ''}`} onClick={() => setViewArchived(!viewArchived)}>
            {viewArchived ? 'View Active' : 'View Archived'}
          </button>

          <Link to="/tasks/create" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Create Task
          </Link>
        </div>
      </div>

      {/* Task List Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '80px 0' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="no-tasks glass-card animate-fade">
          <p>No tasks found. Get started by creating your first task!</p>
        </div>
      ) : (
        <div className="tasks-grid animate-fade">
          {tasks.map((task) => (
            <div key={task.id} className="task-card glass-card">
              <div className="task-card-header">
                <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                <span className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </div>
              <h3 className="task-card-title">{task.title}</h3>
              <p className="task-card-desc">{task.description}</p>
              
              {task.category && (
                <div className="task-card-category">
                  <span>📁 {task.category.name}</span>
                </div>
              )}

              {task.labels && task.labels.length > 0 && (
                <div className="task-card-labels">
                  {Array.from(task.labels).map((lbl) => (
                    <span key={lbl.id} className="label-tag">#{lbl.name}</span>
                  ))}
                </div>
              )}

              <div className="task-card-footer">
                <span className="due-date">📅 {task.dueDate || 'No due date'}</span>
                <div className="task-actions">
                  <button className="icon-btn" onClick={() => navigate(`/tasks/${task.id}/edit`)} title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button className="icon-btn" onClick={() => handleArchive(task.id, task.archived)} title={task.archived ? 'Restore' : 'Archive'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.66-.9l.82-1.2A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.66 1l.82 1.2a2 2 0 0 0 1.66.9H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDeleteClick(task.id)} title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? It will be soft-deleted."
        onConfirm={confirmDelete}
        onCancel={() => setIsDialogOpen(false)}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      <style>{`
        .tasklist-container {
          flex-grow: 1;
          padding: 24px;
        }

        .control-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex-grow: 1;
          max-width: 400px;
        }

        .search-wrapper svg {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
        }

        .search-wrapper input {
          width: 100%;
          padding-left: 44px;
        }

        .filters-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .active-toggle {
          border-color: var(--primary) !important;
          color: var(--primary) !important;
          background: rgba(139, 92, 246, 0.05);
        }

        .no-tasks {
          padding: 60px;
          text-align: center;
          color: var(--text-muted);
          font-size: 15px;
        }

        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .task-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
        }

        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.15);
          color: #fde047;
        }

        .status-badge.in_progress {
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
        }

        .status-badge.completed {
          background: rgba(16, 185, 129, 0.15);
          color: #a7f3d0;
        }

        .priority-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .priority-badge.low {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
        }

        .priority-badge.medium {
          background: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
        }

        .priority-badge.high {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }

        .task-card-title {
          font-size: 18px;
          color: white;
          font-weight: 600;
        }

        .task-card-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          flex-grow: 1;
        }

        .task-card-category {
          font-size: 12px;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.03);
          padding: 4px 8px;
          border-radius: 6px;
          display: inline-block;
          align-self: flex-start;
        }

        .task-card-labels {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .label-tag {
          font-size: 11px;
          background: rgba(139, 92, 246, 0.1);
          color: #c084fc;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .task-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--glass-border);
          padding-top: 14px;
          margin-top: 8px;
        }

        .due-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .task-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: var(--transition-smooth);
        }

        .icon-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .icon-btn.delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TaskList;
