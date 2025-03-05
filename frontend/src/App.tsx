import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home/Home"
import User from './pages/User/User';
import Login from './components/login';
import Admin from './pages/Admin/Admin'
import { useEffect, useState } from 'react';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard ';
import EmployeeLogin from './pages/Employee/EmployeeLoginPage';
import CreateUser from './pages/Admin/CreateUser';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Check for valid JSON in localStorage when app loads
  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        // Check user auth
        const userData = localStorage.getItem('userData');
        if (userData) {
          JSON.parse(userData); // Validate JSON format
        }
        
        // Check employee auth
        const employeeData = localStorage.getItem('employeeData');
        if (employeeData) {
          JSON.parse(employeeData); // Validate JSON format
        }
      } catch (error) {
        // If invalid JSON, clear localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('employeeData');
        localStorage.removeItem('token');
      }
      setIsLoading(false);
    };

    checkLocalStorage();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Router>
        <Routes>
          {/* All routes are now direct, without protection wrappers */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/signup" element={<CreateUser />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Employee routes */}
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;