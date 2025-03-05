import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { UserIcon, LockKeyholeIcon, MailIcon, PhoneIcon, ShieldIcon, House } from 'lucide-react';
import axios from 'axios';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/api/auth', {
        name: username,
        email,
        password,
        phone,
        isAdmin,
      });
      
      console.log('User created:', response.data);
      
      // Navigate to login page after successful creation
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      console.error('Failed to create user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000428] to-[#004e92] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Echoland Portal</h1>
          <p className="text-xl text-blue-100 mt-2">Create a new account</p>
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
            <CardTitle className="text-2xl text-white text-center">Create New User</CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/20 border-red-500 text-white">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-100">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon className="h-5 w-5 text-blue-300" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-100">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <MailIcon className="h-5 w-5 text-blue-300" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@echoland.com"
                    required
                    className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-100">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockKeyholeIcon className="h-5 w-5 text-blue-300" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-blue-100">Phone</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <PhoneIcon className="h-5 w-5 text-blue-300" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/50"
                  />
                </div>
              </div>
              
              {/* <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is-admin" 
                  checked={isAdmin} 
                  onCheckedChange={(checked) => setIsAdmin(checked === true)}
                  className="data-[state=checked]:bg-blue-500 border-white/30"
                />
                <div className="flex items-center">
                  <Label 
                    htmlFor="is-admin" 
                    className="text-blue-100 cursor-pointer flex items-center"
                  >
                    <ShieldIcon className="h-4 w-4 text-blue-300 mr-2" />
                    Is Admin
                  </Label>
                </div>
              </div> */}
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#00c6ff] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00c6ff] font-medium"
              >
                {loading ? 'Creating...' : 'Create User'}
              </Button>
              
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => navigate('/login')}
                  className="text-blue-100 hover:text-white"
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUser;