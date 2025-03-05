import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SurveyAssignmentFormProps {
  surveyId: string;
  onComplete: (updatedSurvey: any) => void;
}

const SurveyAssignmentForm: React.FC<SurveyAssignmentFormProps> = ({ 
  surveyId, 
  onComplete 
}) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/employees');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setError('Failed to fetch employees. Please try again.');
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!selectedEmployee) {
      setError('Please select an employee.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/surveys/${surveyId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId: selectedEmployee }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign survey');
      }

      const updatedSurvey = await response.json();
      setSuccess(true);
      
      // Notify parent component
      onComplete(updatedSurvey);
    } catch (error) {
      setError('Failed to assign survey. Please try again.');
      console.error('Error assigning survey:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-4 text-center">Loading employees...</div>;
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-500 text-green-700 my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Survey successfully assigned!
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

      <div className="space-y-2">
        <Label htmlFor="employee">Assign to Employee</Label>
        <Select
          value={selectedEmployee}
          onValueChange={setSelectedEmployee}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee._id} value={employee._id}>
                {employee.name} - {employee.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {submitting ? 'Assigning...' : 'Assign Survey'}
        </Button>
      </div>
    </form>
  );
};

export default SurveyAssignmentForm;