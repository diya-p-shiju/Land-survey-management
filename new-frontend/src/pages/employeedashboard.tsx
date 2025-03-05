// src/pages/employee/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Card, { CardHeader, CardContent } from '../components/card';
import Button from '../components/button';
import SurveyCard from '../components/surveycard';

const EmployeeDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    pending: 0,
    completed: 0
  });

  // Fetch assignments (mock data)
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Mock API call
        // const response = await fetch('/api/employee/assignments');
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockAssignments = [
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            district: 'North District',
            thaluk: 'Central Thaluk',
            surveyNumber: 'LS-2023-001',
            surveyType: 'Land Survey',
            status: 'In Progress',
            createdAt: '2023-06-15T10:30:00Z',
            remarks: [
              {
                _id: 'r1',
                content: 'We will visit the site on Monday.',
                createdBy: 'emp1',
                createdByName: 'Emma Thompson',
                createdByModel: 'Employee',
                createdAt: '2023-06-16T14:20:00Z'
              }
            ],
            assignedTo: {
              _id: 'emp1',
              name: 'Emma Thompson'
            }
          },
          {
            _id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '9876543211',
            district: 'West District',
            thaluk: 'Western Thaluk',
            surveyNumber: 'LS-2023-002',
            surveyType: 'Building Survey',
            status: 'Assigned',
            createdAt: '2023-07-05T09:15:00Z',
            remarks: [],
            assignedTo: {
              _id: 'emp1',
              name: 'Emma Thompson'
            }
          },
          {
            _id: '3',
            name: 'Michael Roberts',
            email: 'michael@example.com',
            phone: '9876543212',
            district: 'East District',
            thaluk: 'Eastern Thaluk',
            surveyNumber: 'LS-2023-005',
            surveyType: 'Contour Survey',
            status: 'Completed',
            createdAt: '2023-05-10T11:45:00Z',
            remarks: [
              {
                _id: 'r3',
                content: 'Survey completed successfully. Report uploaded.',
                createdBy: 'emp1',
                createdByName: 'Emma Thompson',
                createdByModel: 'Employee',
                createdAt: '2023-05-15T16:30:00Z'
              }
            ],
            assignedTo: {
              _id: 'emp1',
              name: 'Emma Thompson'
            }
          },
          {
            _id: '4',
            name: 'Lisa Chen',
            email: 'lisa@example.com',
            phone: '9876543213',
            district: 'South District',
            thaluk: 'Southern Thaluk',
            surveyNumber: 'LS-2023-006',
            surveyType: 'Road Survey',
            status: 'In Progress',
            createdAt: '2023-07-20T08:30:00Z',
            remarks: [
              {
                _id: 'r4',
                content: 'Initial assessment completed. Will need additional equipment for the steep terrain.',
                createdBy: 'emp1',
                createdByName: 'Emma Thompson',
                createdByModel: 'Employee',
                createdAt: '2023-07-22T11:40:00Z'
              }
            ],
            assignedTo: {
              _id: 'emp1',
              name: 'Emma Thompson'
            }
          }
        ];
        
        setAssignments(mockAssignments);
        setRecentAssignments(mockAssignments.slice(0, 2));
        
        // Calculate stats
        const total = mockAssignments.length;
        const inProgress = mockAssignments.filter(s => s.status === 'In Progress').length;
        const pending = mockAssignments.filter(s => s.status === 'Assigned').length;
        const completed = mockAssignments.filter(s => s.status === 'Completed').length;
        
        setStats({
          total,
          inProgress,
          pending,
          completed
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, []);

  // Stats cards
  const statsCards = [
    {
      title: 'Total Assigned',
      value: stats.total,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgClass: 'bg-primary/10'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgClass: 'bg-warning/10'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      bgClass: 'bg-info/10'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgClass: 'bg-success/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, Emma Thompson</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button to="/employee/calendar">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              View Schedule
            </Button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className={`${stat.bgClass}`}>
              <CardContent className="flex items-center p-4">
                <div className="mr-4">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Current Assignments */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Current Assignments</h2>
            <Link to="/employee/assignments" className="text-primary hover:text-primary-light">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : assignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p className="text-gray-400 mb-4">You don't have any assignments yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments
                .filter(a => a.status !== 'Completed')
                .slice(0, 2)
                .map((assignment) => (
                  <SurveyCard key={assignment._id} survey={assignment} userType="employee" />
                ))}
            </div>
          )}
        </div>
        
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader title="Upcoming Deadlines" />
          <CardContent className="divide-y divide-background-paper/50">
            {assignments
              .filter(a => a.status !== 'Completed')
              .slice(0, 3)
              .map((assignment) => (
                <div key={assignment._id} className="py-3">
                  <Link to={`/employee/assignments/${assignment._id}`} className="flex items-start">
                    <div className="bg-background-paper p-2 rounded-lg mr-3">
                      <span className="text-primary font-semibold">
                        {new Date(assignment.createdAt).getDate()}
                      </span>
                      <span className="text-xs text-gray-400 block">
                        {new Date(assignment.createdAt).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{assignment.surveyType}</h4>
                      <p className="text-sm text-gray-400">
                        {assignment.district}, {assignment.thaluk} - Survey #{assignment.surveyNumber}
                      </p>
                      <span className={`
                        inline-block mt-2 text-xs px-2 py-1 rounded-full 
                        ${assignment.status === 'In Progress' ? 'bg-info/20 text-info' : 'bg-warning/20 text-warning'}
                      `}>
                        {assignment.status}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;