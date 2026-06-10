import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';

const AdminApp = React.lazy(() => import('./admin/AdminApp'));

function AdminFallback() {
  return <div className="min-h-screen bg-slate-950" />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <React.Suspense fallback={<AdminFallback />}>
            <AdminApp />
          </React.Suspense>
        }
      />
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
}

export default App;
