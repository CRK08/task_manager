import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card glass-card animate-fade">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>

      <style>{`
        .not-found-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .not-found-card {
          max-width: 460px;
          width: 100%;
          padding: 48px;
          text-align: center;
        }

        .not-found-card h1 {
          font-size: 72px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
        }

        .not-found-card h2 {
          color: white;
          font-size: 22px;
          margin-bottom: 16px;
        }

        .not-found-card p {
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .not-found-card a {
          display: inline-flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
