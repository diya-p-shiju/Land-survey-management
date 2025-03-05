import React, { useState, useEffect } from 'react';
import { NavBar } from '../../components/navbar';
import CreateUser from './CreateUser';
import ViewUsers from './ViewUsers';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon, UserIcon, ClipboardListIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';
import EmployeeManagement from './EmployeeManagement';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('surveys');
  const [openDialog, setOpenDialog] = useState(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const surveysResponse = await axios.get('http://localhost:8080/api/survey');
        const usersResponse = await axios.get('http://localhost:8080/api/auth');
        const employeesResponse = await axios.get('http://localhost:8080/api/employees');
        
        setSurveys(surveysResponse.data);
        setUsers(usersResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleAssignEmployee = (surveyId) => {
    setSelectedSurveyId(surveyId);
    setOpenDialog('assign');
  };

  const handleSurveyUpdate = async (updatedSurvey) => {
    if (updatedSurvey) {
      setSurveys(surveys.map(survey => 
        survey._id === updatedSurvey._id ? updatedSurvey : survey
      ));
    }
    setOpenDialog(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-300">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-xl text-blue-100">Manage your surveys and users</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl">
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-blue-800/50">
                <TabsTrigger 
                  value="surveys" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-100"
                >
                  <ClipboardListIcon className="mr-2 h-5 w-5" />
                  Surveys
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-100"
                >
                  <UserIcon className="mr-2 h-5 w-5" />
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="employees" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-100"
                >
                  <UserIcon className="mr-2 h-5 w-5" />
                  Employees
                </TabsTrigger>
              </TabsList>

              <TabsContent value="surveys" className="mt-0">
                {loading ? (
                  <div className="text-center text-white p-8">Loading surveys...</div>
                ) : (
                  <div className="bg-white/5 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Survey Management</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-blue-800/50 text-blue-100">
                            <th className="p-3 text-left">Survey #</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">District</th>
                            <th className="p-3 text-left">Thaluk</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Assigned To</th>
                            <th className="p-3 text-left">Approved</th>
                            <th className="p-3 text-left">Remarks</th>
                            <th className="p-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {surveys.map((survey) => (
                            <tr key={survey._id} className="border-t border-blue-800/30 hover:bg-blue-800/20">
                              <td className="p-3 text-blue-100">{survey.surveyNumber}</td>
                              <td className="p-3 text-blue-100">{survey.name}</td>
                              <td className="p-3 text-blue-100">{survey.surveyType}</td>
                              <td className="p-3 text-blue-100">{survey.district}</td>
                              <td className="p-3 text-blue-100">{survey.thaluk}</td>
                              <td className="p-3 text-blue-100">
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(survey.status)}`}>
                                  {survey.status}
                                </span>
                              </td>
                              <td className="p-3 text-blue-100">
                                {survey.assignedTo ? 
                                  employees.find(e => e._id === survey.assignedTo)?.name || 'Assigned' 
                                  : 'Unassigned'}
                              </td>
                              <td className="p-3 text-blue-100">
                                <span className={`px-2 py-1 rounded text-xs ${survey.approved ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                                  {survey.approved ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="p-3 text-blue-100">
                                {survey.remarks?.length || 0}
                              </td>
                              <td className="p-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white border-none"
                                  onClick={() => handleAssignEmployee(survey._id)}
                                >
                                  Assign
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                {loading ? (
                  <div className="text-center text-white p-8">Loading users...</div>
                ) : (
                  <UsersPanel users={users} setUsers={setUsers} />
                )}
              </TabsContent>

              <TabsContent value="employees" className="mt-0">
                {loading ? (
                  <div className="text-center text-white p-8">Loading employees...</div>
                ) : (
                  <EmployeeManagement />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Survey Assignment */}
      <Dialog open={openDialog === 'assign'} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="bg-[#000428] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Assign Survey to Employee</DialogTitle>
          </DialogHeader>
          {selectedSurveyId && (
            <SurveyAssignmentForm 
              surveyId={selectedSurveyId} 
              employees={employees}
              onComplete={handleSurveyUpdate} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Users Panel Component
const UsersPanel = ({ users, setUsers }) => {
  const [openUserDialog, setOpenUserDialog] = useState(false);
  
  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
    setOpenUserDialog(false);
  };

  return (
    <div className=" rounded-lg ">
      <div className="flex justify-between items-center mb-6">
       
        <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
          <DialogTrigger asChild>
            {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create User
            </Button> */}
          </DialogTrigger>
          <DialogContent className="bg-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <CreateUser onUserCreated={handleUserCreated} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-x-auto">
        <ViewUsers users={users} />
      </div>
    </div>
  );
};

// Simple Survey Assignment Form
const SurveyAssignmentForm = ({ surveyId, employees, onComplete }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setError('Please select an employee');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/survey/${surveyId}/assign`, {
        employeeId: selectedEmployeeId
      });

      if (response.data) {
        onComplete(response.data);
      } else {
        throw new Error('Assignment failed');
      }
    } catch (err) {
      setError('Failed to assign employee to survey');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div className="space-y-2">
        <label htmlFor="employee" className="text-sm font-medium text-white">
          Select Employee
        </label>
        <select
          id="employee"
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-blue-500"
          required
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id} className='text-black'>
              {employee.name} - {employee.department || 'No Department'}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onComplete(null)}
          className="border-white/20 text-blue-500 hover:bg-white/10 hover:text-blue-500"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Assign Employee
        </Button>
      </div>
    </form>
  );
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-600 text-white';
    case 'Approved': return 'bg-green-600 text-white';
    case 'Rejected': return 'bg-red-600 text-white';
    case 'Assigned': return 'bg-purple-600 text-white';
    case 'In Progress': return 'bg-blue-600 text-white';
    case 'Completed': return 'bg-green-800 text-white';
    default: return 'bg-gray-600 text-white';
  }
};

export default Admin;