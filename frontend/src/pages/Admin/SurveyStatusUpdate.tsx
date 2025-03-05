import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

interface SurveyStatusUpdateProps {
  surveyId: string;
  onComplete: (updatedSurvey: any) => void;
}

const SurveyStatusUpdate: React.FC<SurveyStatusUpdateProps> = ({ 
  surveyId, 
  onComplete 
}) => {
  const [status, setStatus] = useState<string>('');
  const [approved, setApproved] = useState<boolean | null>(null);
  const [statusNote, setStatusNote] = useState<string>('');
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const statuses = [
    'New',
    'Approved',
    'Rejected',
    'Assigned',
    'In Progress',
    'Completed'
  ];
 

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/employees');
        const data = response.data;
        // The rest of your logic remains unchanged, if you want to use the data further
        setSurvey(data);
        setStatus(data.status || '');
        setApproved(data.approved === true);
      } catch (error) {
        setError('Failed to fetch survey details. Please try again.');
        console.error('Error fetching survey details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSurveyDetails();
  }, [surveyId]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!status) {
      setError('Please select a status.');
      setSubmitting(false);
      return;
    }

    try {
      // Prepare the update object
      const updateData: any = {
        status
      };

      // Only include approved if it's set
      if (approved !== null) {
        updateData.approved = approved;
      }

      // If status note is provided, add it as a remark
      if (statusNote.trim()) {
        // For this example, we'll add the remark through the main update
        // In a real app, you might want to add it separately through the remarks endpoint
        const currentUser = {
          id: "admin123",
          name: "Admin User",
          type: "User"
        };

        updateData.remarks = [
          ...(survey.remarks || []),
          {
            content: `Status update to ${status}: ${statusNote}`,
            createdBy: currentUser.id,
            createdByModel: currentUser.type,
            createdByName: currentUser.name,
            createdAt: new Date()
          }
        ];
      }

      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update survey status');
      }

      const updatedSurvey = await response.json();
      setSuccess(true);
      
      // Notify parent component
      onComplete(updatedSurvey);
    } catch (error) {
      setError('Failed to update survey status. Please try again.');
      console.error('Error updating survey status:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-4 text-center">Loading survey details...</div>;
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-500 text-green-700 my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Survey status updated successfully!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Survey Info */}
      {survey && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="font-semibold">Survey #{survey.surveyNumber}</p>
          <p>Type: {survey.surveyType}</p>
          <p>District: {survey.district}</p>
          <p>Current Status: {survey.status}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Update Status</Label>
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {statusOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="approved" 
            checked={approved === true}
            onCheckedChange={(checked) => setApproved(checked === true)}
          />
          <Label htmlFor="approved" className="cursor-pointer">
            Mark as Approved
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="statusNote">Status Note (Optional)</Label>
        <Textarea
          id="statusNote"
          value={statusNote}
          onChange={(e) => setStatusNote(e.target.value)}
          placeholder="Add a note about this status change..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {submitting ? 'Updating...' : 'Update Status'}
        </Button>
      </div>
    </form>
  );
};

export default SurveyStatusUpdate;