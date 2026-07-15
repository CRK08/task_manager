import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const TaskForm = () => {
  const { id } = useParams(); // present if editing
  const isEdit = !!id;
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);

  // Seeding Lookups
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories');
        const labRes = await api.get('/labels');
        setCategories(catRes.data);
        setLabels(labRes.data);

        if (isEdit) {
          const taskRes = await api.get(`/tasks/${id}`);
          const task = taskRes.data;
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
          setPriority(task.priority);
          setDueDate(task.dueDate || '');
          if (task.category) {
            setSelectedCategoryId(task.category.id.toString());
          }
          if (task.labels) {
            setSelectedLabelIds(task.labels.map((l) => l.id));
          }
        }
      } catch (error) {
        console.error('Error fetching lookups or task data', error);
        setToastMessage('Failed to load form details');
        setToastType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleLabelToggle = (labelId) => {
    if (selectedLabelIds.includes(labelId)) {
      setSelectedLabelIds(selectedLabelIds.filter((id) => id !== labelId));
    } else {
      setSelectedLabelIds([...selectedLabelIds, labelId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!title.trim() || !description.trim()) {
      setToastMessage('Title and Description are required');
      setToastType('error');
      return;
    }

    const payload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      category: selectedCategoryId ? { id: parseInt(selectedCategoryId) } : null,
      labels: selectedLabelIds.map((lid) => ({ id: lid })),
    };

    try {
      if (isEdit) {
        await api.put(`/tasks/${id}`, payload);
        setToastMessage('Task updated successfully');
      } else {
        await api.post('/tasks', payload);
        setToastMessage('Task created successfully');
      }
      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    } catch (error) {
      console.error(error);
      setToastMessage(error.response?.data?.message || 'Save operation failed');
      setToastType('error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', width: '100%' }}>
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
    <div className="taskform-container">
      <Navbar title={isEdit ? 'Modify Task' : 'Create New Task'} />

      <div className="form-card glass-card animate-fade">
        <form onSubmit={handleSubmit} className="task-form">
          
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              placeholder="E.g., Complete Internship Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              placeholder="What needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="status">Current Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="priority">Priority Level</label>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group half">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Labels List */}
          <div className="form-group">
            <label>Select Tags / Labels</label>
            <div className="labels-selector">
              {labels.map((lbl) => {
                const isSelected = selectedLabelIds.includes(lbl.id);
                return (
                  <button
                    type="button"
                    key={lbl.id}
                    className={`label-select-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleLabelToggle(lbl.id)}
                  >
                    #{lbl.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link to="/tasks" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      <style>{`
        .taskform-container {
          flex-grow: 1;
          padding: 24px;
        }

        .form-card {
          max-width: 680px;
          margin: 0 auto;
          padding: 36px;
        }

        .task-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-group.half {
          flex: 1;
        }

        .labels-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }

        .label-select-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: var(--transition-smooth);
        }

        .label-select-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .label-select-btn.active {
          color: white;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-color: var(--primary);
          box-shadow: 0 4px 10px rgba(139, 92, 246, 0.2);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid var(--glass-border);
          padding-top: 24px;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
};

export default TaskForm;
