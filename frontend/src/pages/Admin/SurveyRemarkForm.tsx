import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

interface SurveyRemarkFormProps {
  surveyId: string;
  onComplete: (updatedSurvey: any) => void;
}

const SurveyRemarkForm: React.FC<SurveyRemarkFormProps> = ({ 
  surveyId, 
  onComplete 
}) => {
  const [content, setContent] = useState<string>('');
  const [existingRemarks, setExistingRemarks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [surveyDetails, setSurveyDetails] = useState<any>(null);

  // Get current user info - in a real app, this would come from auth context
  const currentUser = {
    id: "user123", // Replace with actual user ID
    name: "Admin User", // Replace with actual user name
    type: "User" // or "Employee" depending on your system
  };

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        const response = await fetch(`/api/surveys/${surveyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch survey details');
        }
        const data = await response.json();
        setSurveyDetails(data);
        setExistingRemarks(data.remarks || []);
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

    if (!content.trim()) {
      setError('Please enter a remark.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/surveys/${surveyId}/remarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          userId: currentUser.id,
          userType: currentUser.type,
          userName: currentUser.name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add remark');
      }

      const updatedSurvey = await response.json();
      setSuccess(true);
      setContent('');
      setExistingRemarks(updatedSurvey.remarks || []);
      
      // Notify parent component
      onComplete(updatedSurvey);
    } catch (error) {
      setError('Failed to add remark. Please try again.');
      console.error('Error adding remark:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-4 text-center">Loading survey details...</div>;
  }

  return (
    <div className="space-y-4 py-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-500 text-green-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Remark added successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Survey Info */}
      {surveyDetails && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="font-semibold">Survey #{surveyDetails.surveyNumber}</p>
          <p>Type: {surveyDetails.surveyType}</p>
          <p>District: {surveyDetails.district}</p>
          <p>Status: {surveyDetails.status}</p>
        </div>
      )}

      {/* Existing Remarks */}
      {existingRemarks.length > 0 && (
        <div className="mb-4">
          <Label>Previous Remarks</Label>
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {existingRemarks.map((remark, index) => (
              <Card key={index} className="p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{remark.createdByName}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(remark.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{remark.content}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add New Remark Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Add New Remark</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your remark here..."
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? 'Adding...' : 'Add Remark'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SurveyRemarkForm;