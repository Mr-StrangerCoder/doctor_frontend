import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './protectedRoute/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointment';
import Doctors from './pages/Doctors';
import ApplyDoctor from './pages/ApplyDoctor';
import Profile from './pages/Profile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes — wrapped in Layout (Navbar + Sidebar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard"    element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/doctors"      element={<Doctors />} />
            <Route path="/apply-doctor" element={<ApplyDoctor />} />
            <Route path="/profile"      element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
