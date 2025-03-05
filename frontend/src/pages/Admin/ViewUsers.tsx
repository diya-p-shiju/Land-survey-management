import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Form states
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    isAdmin: false
  });
  const [showPassword, setShowPassword] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked) => {
    setFormData({ ...formData, isAdmin: checked });
  };

  // Open edit dialog and set form data
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Reset password field for editing
      phone: user.phone || '',
      isAdmin: user.isAdmin || false
    });
    setOpenEditDialog(true);
  };

  // Open delete dialog
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  // Update user
  const handleUpdateUser = async () => {
    setError('');
    setSuccess('');
    
    if (!selectedUser) return;
    
    // Validate form
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }
    
    try {
      // Create update payload
      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        isAdmin: formData.isAdmin
      };
      
      // Add password to payload only if it's provided
      if (formData.password) {
        updatePayload.password = formData.password;
      }
      
      const response = await fetch(`http://localhost:8080/api/auth/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : ''}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }
      
      setSuccess('User updated successfully');
      fetchUsers();
      setOpenEditDialog(false);
    } catch (err) {
      setError(err.message || 'An error occurred while updating user');
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    setError('');
    setSuccess('');
    
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/auth/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : ''}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete user');
      }
      
      setSuccess('User deleted successfully');
      fetchUsers();
      setOpenDeleteDialog(false);
    } catch (err) {
      setError(err.message || 'An error occurred while deleting user');
    }
  };

  // Display loading state
  if (loading && users.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-48">
          <p className="text-blue-100">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold text-white">Users List</CardTitle>
        <div className="flex space-x-2">
          <Button 
            onClick={fetchUsers}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/20 border-red-500 text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-500/20 border-green-500 text-white">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-3 text-left text-slate-50">Name</th>
                <th className="p-3 text-left text-slate-50">Email</th>
                <th className="p-3 text-left text-slate-50">Phone</th>
                <th className="p-3 text-left text-slate-50">Admin</th>
                <th className="p-3 text-left text-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-slate-50">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-3 text-slate-50">{user.name}</td>
                    <td className="p-3 text-slate-50">{user.email}</td>
                    <td className="p-3 text-slate-50">{user.phone || 'N/A'}</td>
                    <td className="p-3 text-slate-50">
                      <span className={`px-2 py-1 rounded text-xs ${user.isAdmin ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                        {user.isAdmin ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleEditClick(user)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleDeleteClick(user)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      
      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="bg-[#000428] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name*</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email*</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                  disabled
                />
                <p className="text-xs text-blue-300">Email cannot be changed</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 pr-10"
                  placeholder="Leave blank to keep current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-blue-300" />
                  ) : (
                    <Eye className="h-4 w-4 text-blue-300" />
                  )}
                </button>
              </div>
              <p className="text-xs text-blue-300">Leave blank to keep current password</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isAdmin" 
                checked={formData.isAdmin} 
                onCheckedChange={handleCheckboxChange} 
                className="data-[state=checked]:bg-blue-500"
              />
              <label
                htmlFor="isAdmin"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Administrator
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)} className="border-blue-500/20 text-blue-500 hover:bg-white">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="bg-[#000428] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the user <span className="font-semibold">{selectedUser?.name}</span>?</p>
            <p className="text-red-400 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteUser}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ViewUsers;