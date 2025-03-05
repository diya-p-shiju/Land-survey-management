import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import  EmployeeNavBar  from './EmployeeNavBar';

const EmployeeDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('assigned');
  const [openDialog, setOpenDialog] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      // const employeeData = JSON.parse(localStorage.getItem('employeeData'));
      const response = await fetch('http://localhost:8080/api/survey');
      const data = await response.json();
      // Filter surveys assigned to this employee
      // const assignedSurveys = data.filter(survey => survey.assignedTo === employeeData._id);
      setSurveys(data);
      console.log(data)
      setLoading(false);
    } catch (err) {
      setError('Failed to load surveys');
      setLoading(false);
    }
  };

  const updateSurveyStatus = async (surveyId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/survey/${surveyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        loadSurveys();
        setOpenDialog(null);
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const addRemark = async (surveyId) => {
    if (!remark.trim()) return;
    
    try {
      const employeeData = JSON.parse(localStorage.getItem('employeeData'));
      const response = await fetch(`http://localhost:8080/api/survey/${surveyId}/remarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: remark,
          userId: employeeData._id,
          userType: 'Employee',
          userName: employeeData.name
        })
      });

      if (response.ok) {
        loadSurveys();
        setRemark('');
        setOpenDialog(null);
      }
    } catch (err) {
      setError('Failed to add remark');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-600 text-white';
      case 'In Progress': return 'bg-blue-600 text-white';
      case 'Completed': return 'bg-green-800 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000428] to-[#004e92] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000428] to-[#004e92]">
      <EmployeeNavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Employee Dashboard</h1>
          <p className="text-xl text-blue-100">Manage your assigned surveys</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl">
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5">
                <TabsTrigger 
                  value="assigned" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-100"
                >
                  Assigned Surveys
                </TabsTrigger>
        
              </TabsList>

              <TabsContent value="assigned" className="mt-0">
                <div className="bg-white/5 rounded-lg p-6">
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-white/5">
                          <th className="p-3 text-left text-blue-100">Survey #</th>
                          <th className="p-3 text-left text-blue-100">Name</th>
                          <th className="p-3 text-left text-blue-100">Type</th>
                          <th className="p-3 text-left text-blue-100">District</th>
                          <th className="p-3 text-left text-blue-100">Status</th>
                          <th className="p-3 text-left text-blue-100">Approved</th>
                          <th className="p-3 text-left text-blue-100">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {surveys.map((survey) => (
                          <tr key={survey._id} className="border-t border-white/5 hover:bg-white/5">
                            <td className="p-3 text-blue-100">{survey.surveyNumber}</td>
                            <td className="p-3 text-blue-100">{survey.name}</td>
                            <td className="p-3 text-blue-100">{survey.surveyType}</td>
                            <td className="p-3 text-blue-100">{survey.district}</td>
                            <td className="p-3 text-blue-100">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(survey.status)}`}>
                                {survey.status}
                              </span>
                            </td>
                            <td className="p-3 text-blue-100">
                              <span className={`px-2 py-1 rounded text-xs ${survey.approved ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                                {survey.approved ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedSurvey(survey);
                                    setOpenDialog('status');
                                  }}
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                  Status
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedSurvey(survey);
                                    setOpenDialog('remark');
                                  }}
                                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
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
              </TabsContent>

              <TabsContent value="profile" className="mt-0">
                <div className="bg-white/5 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Employee Profile</h2>
                  {/* Add profile content here */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={openDialog === 'status'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="bg-[#000428] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Update Survey Status</DialogTitle>
          </DialogHeader>
          {selectedSurvey && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => updateSurveyStatus(selectedSurvey._id, 'In Progress')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  In Progress
                </Button>
                <Button 
                  onClick={() => updateSurveyStatus(selectedSurvey._id, 'Completed')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  Completed
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remark Dialog */}
      <Dialog open={openDialog === 'remark'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="bg-[#000428] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Add Remark</DialogTitle>
          </DialogHeader>
          {selectedSurvey && (
            <div className="space-y-4">
              <Input
                placeholder="Enter your remark..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
              <Button 
                onClick={() => addRemark(selectedSurvey._id)}
                className="w-full bg-gradient-to-r from-[#00c6ff] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00c6ff]"
              >
                Submit Remark
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDashboard;