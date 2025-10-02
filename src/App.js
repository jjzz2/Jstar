import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage/index.jsx';
import EditorPage from './pages/EditorPage/index.jsx';
import TrashPage from './pages/TrashPage/index.jsx';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  return (
    <Router>
      <Layout onSearchChange={setSearch}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage searchTerm={search} /></ProtectedRoute>} />
          <Route path="/docs/:documentId" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
          <Route path="/trash" element={<ProtectedRoute><TrashPage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
