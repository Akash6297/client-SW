import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SeoManager from './pages/SeoManager';
import Finance from './pages/Finance';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Analytics from './pages/Analytics';
import Mail from './pages/Mail';
import Settings from './pages/Settings';

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="seo" element={<ProtectedRoute><SeoManager /></ProtectedRoute>} />
        <Route path="finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
        <Route path="clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
        <Route path="projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="mail" element={<ProtectedRoute><Mail /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </AdminAuthProvider>
  );
}
