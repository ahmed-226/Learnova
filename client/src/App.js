import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage.jsx';
import AuthPage from './pages/auth/AuthPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;