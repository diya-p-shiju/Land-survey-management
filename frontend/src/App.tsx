import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home/Home"
import User from './pages/User/User';
import Login from './components/login';
import Admin from './pages/Admin/Admin'
import { useEffect, useState } from 'react';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard ';

// Protected Route wrapper components
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const userDataString = localStorage.getItem('userData');
  
  if (!userDataString) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const userDataString = localStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  if (!userDataString) {
    return <Navigate to="/login" replace />;
  }
  
  if (!userData.isAdmin) {
    return <Navigate to="/user" replace />;
  }
  
  return children;
};

const UserRoute = ({ children }: { children: JSX.Element }) => {
  const userDataString = localStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  
  if (userData.isAdmin===true) {
    return <Navigate to="/admin" replace />;
  }
  if (!userDataString) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route wrapper to prevent logged-in users from accessing login page
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const userDataString = localStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  if (userData) {
    return <Navigate to={userData.isAdmin ? "/admin" : "/user"} replace />;
  }
  
  return children;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status when app loads
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          JSON.parse(userData); // Validate JSON format
        }
      } catch (error) {
        // If invalid JSON, clear localStorage
        localStorage.removeItem('userData');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          {/* Protected routes */}
          <Route path="/user" element={
            <UserRoute>
              <User />
            </UserRoute>
          } />
          
          <Route path="/admin" element={
            // <AdminRoute>
              <Admin />
            // </AdminRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;