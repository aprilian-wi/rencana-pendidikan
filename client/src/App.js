import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyForm from './pages/SurveyForm';
import Dashboard from './pages/Dashboard';
import RespondentDetail from './pages/RespondentDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/respondent/:id" element={<RespondentDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
