// src/pages/user/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/molecules/Navbar';
import Card, { CardHeader, CardContent } from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import SurveyCard from '../../components/molecules/SurveyCard';

const UserDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [recentSurveys, setRecentSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0
  });

  // Fetch surveys (mock data)
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        // Mock API call
        // const response = await fetch('/api/surveys');
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
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
            status: 'Approved',
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
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            district: 'West District',
            thaluk: 'Western Thaluk',
            surveyNumber: 'LS-2023-002',
            surveyType: 'Building Survey',
            status: 'In Progress',
            createdAt: '2023-07-05T09:15:00Z',
            remarks: [],
            assignedTo: {
              _id: 'emp2',
              name: 'Michael Brown'
            }
          },
          {
            _id: '3',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            district: 'East District',
            thaluk: 'Eastern Thaluk',
            surveyNumber: 'LS-2023-003',
            surveyType: 'Topographical Survey',
            status: 'Pending',
            createdAt: '2023-08-10T11:45:00Z',
            remarks: [],
            assignedTo: null
          },
          {
            _id: '4',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            district: 'South District',
            thaluk: 'Southern Thaluk',
            surveyNumber: 'LS-2023-004',
            surveyType: 'Road Survey',
            status: 'Completed',
            createdAt: '2023-05-20T08:30:00Z',
            remarks: [
              {
                _id: 'r2',
                content: 'Survey completed. Please check the uploaded report.',
                createdBy: 'emp3',
                createdByName: 'David Wilson',
                createdByModel: 'Employee',
                createdAt: '2023-05-25T16:40:00Z'
              }
            ],
            assignedTo: {
              _id: 'emp3',
              name: 'David Wilson'
            }
          }
        ];
        
        setSurveys(mockSurveys);
        setRecentSurveys(mockSurveys.slice(0, 2));
        
        // Calculate stats
        const total = mockSurveys.length;
        const pending = mockSurveys.filter(s => s.status === 'Pending').length;
        const approved = mockSurveys.filter(s => ['Approved', 'Assigned', 'In Progress'].includes(s.status)).length;
        const completed = mockSurveys.filter(s => s.status === 'Completed').length;
        
        setStats({
          total,
          pending,
          approved,
          completed
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        setLoading(false);
      }
    };
    
    fetchSurveys();
  }, []);

  // Stats cards
  const statsCards = [
    {
      title: 'Total Surveys',
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
      title: 'In Process',
      value: stats.approved,
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
      <Navbar userType="user" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, John Doe</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button to="/surveys/new">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Request New Survey
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
        
        {/* Recent Surveys */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Surveys</h2>
            <Link to="/surveys" className="text-primary hover:text-primary-light">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : recentSurveys.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-400 mb-4">You don't have any surveys yet</p>
                <Button to="/surveys/new">Request a Survey</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentSurveys.map((survey) => (
                <SurveyCard key={survey._id} survey={survey} userType="user" />
              ))}
            </div>
          )}
        </div>
        
        {/* Notification Summary */}
        <Card>
          <CardHeader title="Recent Notifications" />
          <CardContent className="divide-y divide-background-paper/50">
            <div className="py-3">
              <div className="flex items-start">
                <div className="bg-primary/20 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white">Your survey request LS-2023-002 has been assigned to Michael Brown.</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="py-3">
              <div className="flex items-start">
                <div className="bg-info/20 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white">New remark from Emma Thompson on survey LS-2023-001</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;