import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LockKeyholeIcon, UserIcon, ShieldIcon, BriefcaseIcon, UserCircleIcon } from 'lucide-react';
import { House } from 'lucide-react';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  
  // User login state
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  
  // Admin login state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  
  // Employee login state
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeError, setEmployeeError] = useState('');
  
  const navigate = useNavigate();

  // Handle user login (from AuthButton.tsx)
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserLoading(true);
    setUserError('');
    
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userEmail, 
          password: userPassword 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data));
      
      // Navigate to user dashboard (non-admin route)
      navigate('/user');
    } catch (err) {
      setUserError('Invalid email or password');
    } finally {
      setUserLoading(false);
    }
  };

  // Handle admin login (from AuthButton.tsx)
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError('');
    
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: adminEmail, 
          password: adminPassword 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store user data in localStorage (admin)
      localStorage.setItem('userData', JSON.stringify(data));
      
      // Check admin status
      if (data.user.isAdmin === true) {
        navigate('/admin');
      } else {
        setAdminError('This account does not have admin privileges');
        return;
      }
    } catch (err) {
      setAdminError('Invalid email or password');
    } finally {
      setAdminLoading(false);
    }
  };

  // Handle employee login (from LoginPage.tsx)
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setEmployeeLoading(true);
    setEmployeeError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/employees/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: employeeEmail, 
          password: employeePassword 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and employee data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('employeeData', JSON.stringify(data.employee));
      
      // Redirect to employee dashboard
      navigate('/employee/dashboard');
    } catch (err) {
      setEmployeeError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setEmployeeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000428] to-[#004e92] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Echoland Portal</h1>
          <p className="text-xl text-blue-100 mt-2">Sign in to access your dashboard</p>
        </div>
        <Button
          onClick={() => navigate('/')}
          className="w-auto ml-80 mb-10 bg-[#4facfe] to-[#4facfe] hover:bg-blue-500 font-medium"
        > 
          <House className="w-6 h-6 mr-2" />
          Home
        </Button>
        
        <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Login</CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Select your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="user" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/5">
                <TabsTrigger 
                  value="user" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-100"
                >
                  <UserCircleIcon className="w-4 h-4 mr-2" />
                  User
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-100"
                >
                  <ShieldIcon className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
                <TabsTrigger 
                  value="employee" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-100"
                >
                  <BriefcaseIcon className="w-4 h-4 mr-2" />
                  Employee
                </TabsTrigger>
              </TabsList>
              
              {/* User Tab Content */}
              <TabsContent value="user">
                {userError && (
                  <Alert variant="destructive" className="mb-6 bg-red-500/20 border-red-500 text-white">
                    <AlertDescription>{userError}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleUserSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="user-email" className="text-blue-100">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-blue-300" />
                      </div>
                      <Input
                        id="user-email"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="user@echoland.com"
                        required
                        className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-password" className="text-blue-100">Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockKeyholeIcon className="h-5 w-5 text-blue-300" />
                      </div>
                      <Input
                        id="user-password"
                        type="password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={userLoading}
                    className="w-full bg-gradient-to-r from-[#00c6ff] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00c6ff] font-medium"
                  >
                    {userLoading ? 'Signing in...' : 'Sign In as User'}
                  </Button>
                           <div className="text-center">
                                  <Button 
                                    type="button" 
                                    variant="link" 
                                    onClick={() => navigate('/signup')}
                                    className="text-blue-100 hover:text-white"
                                  >
                                    Already have an account? Sign up
                                  </Button>
                                  </div>
                </form>
              </TabsContent>
              
              {/* Admin Tab Content */}
              <TabsContent value="admin">
                {adminError && (
                  <Alert variant="destructive" className="mb-6 bg-red-500/20 border-red-500 text-white">
                    <AlertDescription>{adminError}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleAdminSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-blue-100">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-blue-300" />
                      </div>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@echoland.com"
                        required
                        className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-blue-100">Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockKeyholeIcon className="h-5 w-5 text-blue-300" />
                      </div>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={adminLoading}
                    className="w-full bg-gradient-to-r from-[#00c6ff] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00c6ff] font-medium"
                  >
                    {adminLoading ? 'Signing in...' : 'Sign In as Admin'}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Employee Tab Content */}
              <TabsContent value="employee">
                {employeeError && (
                  <Alert variant="destructive" className="mb-6 bg-red-500/20 border-red-500 text-white">
                    <AlertDescription>{employeeError}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleEmployeeSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="employee-email" className="text-blue-100">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-blue-300" />
                      </div>
                      <Input
                        id="employee-email"
                        type="email"
                        value={employeeEmail}
                        onChange={(e) => setEmployeeEmail(e.target.value)}
                        placeholder="employee@echoland.com"
                        required
                        className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employee-password" className="text-blue-100">Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockKeyholeIcon className="h-5 w-5 text-blue-300" />
                      </div>
                      <Input
                        id="employee-password"
                        type="password"
                        value={employeePassword}
                        onChange={(e) => setEmployeePassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={employeeLoading}
                    className="w-full bg-gradient-to-r from-[#00c6ff] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00c6ff] font-medium"
                  >
                    {employeeLoading ? 'Signing in...' : 'Sign In as Employee'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;