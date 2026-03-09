import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadPipeline from './pages/LeadPipeLine';
import Login from './pages/Login';
import Team from './pages/Team'; // NEW: Import the Team component

function App() {
  // Check if we have user info saved in the browser
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={!userInfo ? <Login /> : <Navigate to="/" />} />

        {/* Protected Routes (Wrapped in Layout) */}
        <Route path="/" element={userInfo ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/pipeline" element={userInfo ? <Layout><LeadPipeline /></Layout> : <Navigate to="/login" />} />
        
        {/* NEW: Team Directory Route */}
        <Route path="/team" element={userInfo ? <Layout><Team /></Layout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;