import React, { useState } from 'react';
import { NavBar } from '../../components/navbar';
import CreateUser from './CreateUser';
import ViewUsers from './ViewUsers';
import SurveyApprovalTable from './SurveyApprovalTable';

const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('surveys');

    const renderContent = () => {
        switch (activeTab) {
            case 'surveys':
                return <SurveysComponent />;
            case 'users':
                return <UsersComponent />;
            default:
                return null;
        }
    };

    const buttonStyle = {
        fontSize: '20px',
        padding: '20px',
        margin: '0 10px',
        cursor: 'pointer',
        background: 'linear-gradient(to bottom right, #2196F3, #21CBF3)',
        border: 'none',
        color: 'white',
        borderRadius: '5px'
    };

    return (
        <div style={{ background: 'white', minHeight: '100vh' }}>
            <NavBar />
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <button 
                    style={buttonStyle} 
                    onClick={() => setActiveTab('surveys')}
                >
                    Surveys Listed
                </button>
                <button 
                    style={buttonStyle} 
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

const SurveysComponent: React.FC = () => {
    return (
        <SurveyApprovalTable />
    )
};

const UsersComponent: React.FC = () => {
    const [showCreateUser, setShowCreateUser] = useState(false);

    const buttonStyle = {
        fontSize: '20px',
        padding: '20px',
        margin: '0 10px',
        marginLeft: '1500px',
        cursor: 'pointer',
        background: 'black',
        border: 'none',
        color: 'white',
        borderRadius: '5px'
    };
    return (
        <div>
            <button 
            style={buttonStyle} 
            onClick={() => setShowCreateUser(true)}
            >
            Create User
            </button>
            {showCreateUser && (
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '20px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                zIndex: 1000
            }}>
                <CreateUser />
                <button 
                style={{ ...buttonStyle, background: 'red' }} 
                onClick={() => setShowCreateUser(false)}
                >
                Close
                </button>
            </div>
            )}
            <ViewUsers />
        </div>
    )
};

export default Admin;