import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminDesignApp from './AdminDesignApp';
import './index.css';
import './design.css'; // On importe le design global pour le modifier en temps réel

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <AdminDesignApp />
  </React.StrictMode>,
);
