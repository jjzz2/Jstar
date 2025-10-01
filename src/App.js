import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import TrashPage from './pages/TrashPage';
import Layout from './components/Layout';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  return (
    <Router>
      <Layout onSearchChange={setSearch}>
        <Routes>
          <Route path="/" element={<DashboardPage searchTerm={search} />} />
          <Route path="/docs/:documentId" element={<EditorPage />} />
          <Route path="/trash" element={<TrashPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
