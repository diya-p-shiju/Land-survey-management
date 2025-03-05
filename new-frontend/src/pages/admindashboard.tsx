// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Card, { CardHeader, CardContent } from '../components/card';
import Button from '../components/button';
import SurveyCard from '../components/surveycard';

const AdminDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    pendingApproval: 0,
    unassigned: 0,
    completed: 0,
    totalEmployees: 0
  });

  // Fetch data (mock data)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock surveys data
        const mockSurveys = [
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
              _id: 'emp2',
              name: 'Michael Brown'
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
            status: 'Pending',
            createdAt: '2023-08-10T11:45:00Z',
            remarks: [],
            assignedTo: null
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
            status: 'Completed',
            createdAt: '2023-07-20T08:30:00Z',
            remarks: [
              {
                _id: 'r4',
                content: 'Survey completed successfully. Report uploaded.',
                createdBy: 'emp3',
                createdByName: 'David Wilson',
                createdByModel: 'Employee',
                createdAt: '2023-07-25T16:40:00Z'
              }
            ],
            assignedTo: {
              _id: 'emp3',
              name: 'David Wilson'
            }
          },
          {
            _id: '5',
            name: 'Robert Johnson',
            email: 'robert@example.com',
            phone: '9876543214',
            district: 'Central District',
            thaluk: 'Main Thaluk',
            surveyNumber: 'LS-2023-007',
            surveyType: 'Leveling Survey',
            status: 'Pending',
            createdAt: '2023-08-15T14:20:00Z',
            remarks: [],
            assignedTo: null
          }
        ];
        
        // Mock employees data
        const mockEmployees = [
          {
            _id: 'emp1',
            name: 'Emma Thompson',
            email: 'emma@example.com',
            phone: '8765432101',
            department: 'Field Survey',
            designation: 'Senior Surveyor',
            activeAssignments: 2,
            completedSurveys: 15
          },
          {
            _id: 'emp2',
            name: 'Michael Brown',
            email: 'michael@example.com',
            phone: '8765432102',
            department: 'Land Records',
            designation: 'Junior Surveyor',
            activeAssignments: 1,
            completedSurveys: 8
          },
          {
            _id: 'emp3',
            name: 'David Wilson',
            email: 'david@example.com',
            phone: '8765432103',
            department: 'GIS Mapping',
            designation: 'Technical Surveyor',
            activeAssignments: 0,
            completedSurveys: 12
          }
        ];
        
        setSurveys(mockSurveys);
        setEmployees(mockEmployees);
        
        // Calculate stats
        const totalSurveys = mockSurveys.length;
        const pendingApproval = mockSurveys.filter(s => s.status === 'Pending').length;
        const unassigned = mockSurveys.filter(s => !s.assignedTo && s.status !== 'Pending').length;
        const completed = mockSurveys.filter(s => s.status === 'Completed').length;
        const totalEmployees = mockEmployees.length;
        
        setStats({
          totalSurveys,
          pendingApproval,
          unassigned,
          completed,
          totalEmployees
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Stats cards
  const statsCards = [
    {
      title: 'Total Surveys',
      value: stats.totalSurveys,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgClass: 'bg-primary/10'
    },
    {
      title: 'Pending Approval',
      value: stats.pendingApproval,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgClass: 'bg-warning/10'
    },
    {
      title: 'Unassigned',
      value: stats.unassigned,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgClass: 'bg-error/10'
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
      <Navbar userType="admin" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Survey Management Overview</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button to="/admin/employees/new" variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Add Employee
            </Button>
            <Button to="/admin/reports">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
              </svg>
              View Reports
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Surveys Needing Action */}
          <Card>
            <CardHeader 
              title="Surveys Needing Action" 
              action={
                <Link to="/admin/surveys" className="text-primary text-sm">
                  View All
                </Link>
              }
            />
            <CardContent className="divide-y divide-background-paper/50">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                surveys
                  .filter(s => s.status === 'Pending' || (!s.assignedTo && s.status !== 'Pending'))
                  .slice(0, 3)
                  .map((survey) => (
                    <div key={survey._id} className="py-3">
                      <Link to={`/admin/surveys/${survey._id}`} className="block hover:bg-background-paper/30 p-2 rounded-lg transition-colors">
                        <div className="flex justify-between">
                          <div>
                            <span className={`
                              text-xs px-2 py-1 rounded-full mr-2
                              ${survey.status === 'Pending' ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'}
                            `}>
                              {survey.status === 'Pending' ? 'Needs Approval' : 'Unassigned'}
                            </span>
                            <span className="text-primary">{survey.surveyType}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(survey.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white mt-2">
                          Survey #{survey.surveyNumber} - {survey.district}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Requested by: {survey.name}
                        </p>
                      </Link>
                    </div>
                  ))
              )}