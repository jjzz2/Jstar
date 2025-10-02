import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import GlobalSpinner from './components/GlobalSpinner';
import './App.css';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <GlobalSpinner />
    </>
  );
}

export default App;
