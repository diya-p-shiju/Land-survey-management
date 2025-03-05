import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Eye } from 'lucide-react';
import axios from 'axios';

// Surveys Panel Component with Remarks support
const SurveysPanel = ({ 
  surveys, 
  onSurveyAction 
}) => {
  const [openViewRemarksDialog, setOpenViewRemarksDialog] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewRemarks = (survey) => {
    setSelectedSurvey(survey);
    setOpenViewRemarksDialog(true);
  };

  return (
    <div className="bg-white/5 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Survey Management</h2>
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
              <th className="p-3 text-left">Remarks</th>
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
                  {formatDate(survey.createdAt)}
                </td>
                <td className="p-3 text-blue-100">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{survey.remarks?.length || 0}</span>
                    {survey.remarks?.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewRemarks(survey)}
                        className="p-1 hover:bg-white/10"
                      >
                        <Eye className="h-4 w-4 text-blue-300" />
                      </Button>
                    )}
                  </div>
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

      {/* View Remarks Dialog */}
      <Dialog open={openViewRemarksDialog} onOpenChange={setOpenViewRemarksDialog}>
        <DialogContent className="bg-[#000428] border-white/10 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Survey Remarks
              {selectedSurvey && (
                <span className="block text-sm font-normal mt-1 text-blue-300">
                  Survey #{selectedSurvey.surveyNumber} - {selectedSurvey.district}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedSurvey && selectedSurvey.remarks && selectedSurvey.remarks.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {selectedSurvey.remarks
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((remark, index) => (
                  <div 
                    key={remark._id || index} 
                    className={`p-4 rounded-lg ${
                      remark.createdByModel === 'Employee' 
                        ? 'bg-blue-600/20 border-l-4 border-blue-500' 
                        : remark.createdByModel === 'User'
                        ? 'bg-purple-600/20 border-l-4 border-purple-500'
                        : 'bg-green-600/20 border-l-4 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-white">
                        {remark.createdByName} 
                        <span className="text-xs font-normal ml-2 text-blue-200">
                          ({remark.createdByModel})
                        </span>
                      </span>
                      <span className="text-xs text-blue-300">
                        {formatDate(remark.createdAt)}
                      </span>
                    </div>
                    <p className="text-blue-100">{remark.content}</p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-blue-300 mx-auto mb-4 opacity-50" />
              <p className="text-xl text-blue-100">No remarks found</p>
            </div>
          )}
          <div className="mt-4">
            <Button 
              onClick={() => {
                setOpenViewRemarksDialog(false);
                if (selectedSurvey) {
                  onSurveyAction(selectedSurvey._id, 'remark');
                }
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Add New Remark
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Updated SurveyAssignmentForm with functionality to assign employees
const SurveyAssignmentForm = ({ surveyId, onComplete }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/employees');
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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

      // Check if this is an actual API or just a mock
      if (response.data) {
        onComplete(response.data);
      } else {
        throw new Error('Assignment failed');
      }
    } catch (err) {
      setError('Failed to assign employee to survey');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading employees...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div className="space-y-2">
        <label htmlFor="employee" className="text-sm font-medium">
          Select Employee
        </label>
        <select
          id="employee"
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
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
          className="border-gray-300 text-gray-700"
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

export { SurveysPanel, SurveyAssignmentForm, getStatusColor };