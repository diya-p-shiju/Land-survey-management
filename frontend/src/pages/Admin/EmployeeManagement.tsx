import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Pencil, Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Form states
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    designation: '',
    isActive: true
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Departments and designations - you can modify these or fetch from your backend
  const departments = ['HR', 'IT', 'Finance', 'Operations', 'Marketing', 'Sales'];
  const designations = ['Manager', 'Team Lead', 'Senior Employee', 'Junior Employee', 'Intern'];

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/employees', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching employees');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Reset form and messages
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      department: '',
      designation: '',
      isActive: true
    });
    setError('');
    setSuccess('');
  };

  // Open edit dialog and set form data
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: '', // Reset password field for editing
      phone: employee.phone || '',
      department: employee.department || '',
      designation: employee.designation || '',
      isActive: employee.isActive === undefined ? true : employee.isActive
    });
    setOpenEditDialog(true);
  };

  // Open delete dialog
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenDeleteDialog(true);
  };

  // Add new employee
  const handleAddEmployee = async () => {
    setError('');
    setSuccess('');
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/employees/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : ''}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add employee');
      }
      
      setSuccess('Employee added successfully');
      fetchEmployees();
      setOpenAddDialog(false);
      resetForm();
    } catch (err) {
      setError(err.message || 'An error occurred while adding employee');
    }
  };

  // Update employee
  const handleUpdateEmployee = async () => {
    setError('');
    setSuccess('');
    
    if (!selectedEmployee) return;
    
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
        department: formData.department,
        designation: formData.designation,
        isActive: formData.isActive
      };
      
      // Add password to payload only if it's provided
      if (formData.password) {
        updatePayload.password = formData.password;
      }
      
      const response = await fetch(`http://localhost:8080/api/employees/${selectedEmployee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : ''}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update employee');
      }
      
      setSuccess('Employee updated successfully');
      fetchEmployees();
      setOpenEditDialog(false);
    } catch (err) {
      setError(err.message || 'An error occurred while updating employee');
    }
  };

  // Delete employee
  const handleDeleteEmployee = async () => {
    setError('');
    setSuccess('');
    
    if (!selectedEmployee) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/employees/${selectedEmployee._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : ''}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete employee');
      }
      
      setSuccess('Employee deleted successfully');
      fetchEmployees();
      setOpenDeleteDialog(false);
    } catch (err) {
      setError(err.message || 'An error occurred while deleting employee');
    }
  };

  // Display loading state
  if (loading && employees.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-48">
          <p className="text-blue-100">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold text-white">Employee Management</CardTitle>
        <div className="flex space-x-2">
          <Button 
            onClick={() => {
              resetForm();
              setOpenAddDialog(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <PlusIcon className="h-4 w-4 mr-2" /> Add Employee
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
                <th className="p-3 text-left text-blue-100">Name</th>
                <th className="p-3 text-left text-blue-100">Email</th>
                <th className="p-3 text-left text-blue-100">Phone</th>
                <th className="p-3 text-left text-blue-100">Department</th>
                <th className="p-3 text-left text-blue-100">Designation</th>
                <th className="p-3 text-left text-blue-100">Status</th>
                <th className="p-3 text-left text-blue-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-blue-100">No employees found</td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-3 text-blue-100">{employee.name}</td>
                    <td className="p-3 text-blue-100">{employee.email}</td>
                    <td className="p-3 text-blue-100">{employee.phone || 'N/A'}</td>
                    <td className="p-3 text-blue-100">{employee.department || 'N/A'}</td>
                    <td className="p-3 text-blue-100">{employee.designation || 'N/A'}</td>
                    <td className="p-3 text-blue-100">
                      <span className={`px-2 py-1 rounded text-xs ${employee.isActive ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleEditClick(employee)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleDeleteClick(employee)}
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
      
      {/* Add Employee Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="bg-[#000428] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 pr-10"
                  required
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#000428] border-white/10 text-white">
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={formData.designation}
                  onValueChange={(value) => handleSelectChange('designation', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#000428] border-white/10 text-white">
                    {designations.map(desg => (
                      <SelectItem key={desg} value={desg}>{desg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => handleSelectChange('isActive', value === 'true')}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#000428] border-white/10 text-white">
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)} className="border-blue-500/20 text-blue-500 hover:bg-white">
              Cancel
            </Button>
            <Button 
              onClick={handleAddEmployee}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Employee Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="bg-[#000428] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
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
            
            {/* Added password field for edit dialog */}
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
            
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#000428] border-white/10 text-white">
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-designation">Designation</Label>
                <Select
                  value={formData.designation}
                  onValueChange={(value) => handleSelectChange('designation', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#000428] border-white/10 text-white">
                    {designations.map(desg => (
                      <SelectItem key={desg} value={desg}>{desg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-isActive">Status</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => handleSelectChange('isActive', value === 'true')}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#000428] border-white/10 text-white">
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)} className="border-blue-500/20 text-blue-500 hover:bg-white">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateEmployee}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Update Employee
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
            <p>Are you sure you want to delete the employee <span className="font-semibold">{selectedEmployee?.name}</span>?</p>
            <p className="text-red-400 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteEmployee}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Delete Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EmployeeManagement;