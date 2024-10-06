// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Profiler } from 'react';
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';


import PDFReader from './PDFReader'

function onRenderCallback(id, phase, actualDuration) {
  console.log({ id, phase, actualDuration });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> {/* App component for the home route */}
        <Route path="/main" element={
          <PDFReader />
        } />

      </Routes>
    </Router>
  </React.StrictMode>
);
