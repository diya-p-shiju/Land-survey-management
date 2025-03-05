import React, { useState, useEffect } from 'react';
import { NavBar } from '../../components/navbar';
import CreateUser from './CreateUser';
import ViewUsers from './ViewUsers';
import SurveyApprovalTable from './SurveyApprovalTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon, UserIcon, ClipboardListIcon, XIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import axios from 'axios';

// New components for survey management
import SurveyAssignmentForm from './SurveyAssignmentForm';
import SurveyRemarkForm from './SurveyRemarkForm';
import SurveyStatusUpdate from './SurveyStatusUpdate';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('surveys');
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const surveysResponse = await axios.get('http://localhost:8080/api/survey'); 
        console.log("Surveys Data:", surveysResponse.data); // Debugging
  
        const usersResponse = await axios.get('http://localhost:8080/api/auth'); 
        console.log("Users Data:", usersResponse.data);
  
        setSurveys(surveysResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleSurveyAction = (surveyId: string, action: string) => {
    setSelectedSurveyId(surveyId);
    setOpenDialog(action);
  };

  const handleSurveyUpdate = async (updatedSurvey: any) => {
    // Update the survey list after an action
    setSurveys(surveys.map(survey => 
      survey._id === updatedSurvey._id ? updatedSurvey : survey
    ));
    setOpenDialog(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-300">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2"> Admin Dashboard</h1>
          <p className="text-xl text-blue-100">Manage your surveys and users with the power of AI</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl ">
          <CardHeader>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-blue-800/50">
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
              </TabsList>

              <TabsContent value="surveys" className="mt-0">
                {loading ? (
                  <div className="text-center text-white p-8">Loading surveys...</div>
                ) : (
                  <SurveysPanel 
                    surveys={surveys} 
                    onSurveyAction={handleSurveyAction} 
                  />
                )}
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                {loading ? (
                  <div className="text-center text-white p-8">Loading users...</div>
                ) : (
                  <UsersPanel users={users} setUsers={setUsers} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Survey Assignment */}
      <Dialog open={openDialog === 'assign'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Survey to Employee</DialogTitle>
          </DialogHeader>
          {selectedSurveyId && (
            <SurveyAssignmentForm 
              surveyId={selectedSurveyId} 
              onComplete={(updatedSurvey) => handleSurveyUpdate(updatedSurvey)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Adding Remarks */}
      <Dialog open={openDialog === 'remark'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Survey Remark</DialogTitle>
          </DialogHeader>
          {selectedSurveyId && (
            <SurveyRemarkForm 
              surveyId={selectedSurveyId} 
              onComplete={(updatedSurvey) => handleSurveyUpdate(updatedSurvey)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Status Update */}
      <Dialog open={openDialog === 'status'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Survey Status</DialogTitle>
          </DialogHeader>
          {selectedSurveyId && (
            <SurveyStatusUpdate 
              surveyId={selectedSurveyId} 
              onComplete={(updatedSurvey) => handleSurveyUpdate(updatedSurvey)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Surveys Panel Component
const SurveysPanel: React.FC<{ 
  surveys: any[]; 
  onSurveyAction: (id: string, action: string) => void;
}> = ({ surveys, onSurveyAction }) => {
  return (
    <div className="bg-white/5 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Survey Management</h2>
        <div className="flex gap-2">
 
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-800/50 text-blue-100">
              <th className="p-3 text-left">Survey #</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">District</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr key={survey._id} className="border-t border-blue-800/30 hover:bg-blue-800/20">
                <td className="p-3 text-blue-100">{survey.surveyNumber}</td>
                <td className="p-3 text-blue-100">{survey.surveyType}</td>
                <td className="p-3 text-blue-100">{survey.district}</td>
                <td className="p-3 text-blue-100">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(survey.status)}`}>
                    {survey.status}
                  </span>
                </td>
                <td className="p-3 text-blue-100">{survey.assignedToName || 'Unassigned'}</td>
                <td className="p-3 text-blue-100">
                {survey.createdAt ? new Date(survey.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white border-none"
                      onClick={() => onSurveyAction(survey._id, 'assign')}
                    >
                      Assign
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                      onClick={() => onSurveyAction(survey._id, 'status')}
                    >
                      Status
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white border-none"
                      onClick={() => onSurveyAction(survey._id, 'remark')}
                    >
                      Remark
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Users Panel Component
const UsersPanel: React.FC<{ 
  users: any[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ users, setUsers }) => {
  const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);
  
  const handleUserCreated = (newUser: any) => {
    setUsers([...users, newUser]);
    setOpenUserDialog(false);
  };

  return (
    <div className="bg-white/5 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create User
            </Button>
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

// Helper function to get status color
const getStatusColor = (status: string): string => {
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