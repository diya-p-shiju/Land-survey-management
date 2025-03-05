import React from 'react';
import { Button } from "@/components/ui/button";

const EmployeeNavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeData');
    window.location.href = '/';
  };

  const employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');

  return (
    <div className="bg-transparent backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold bg-gradient-to-r from-[#00c6ff] to-[#4facfe] text-transparent bg-clip-text">
            Echoland
          </div>


          {/* Logout Button */}
          <Button 
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#00c6ff] to-[#4facfe] text-white hover:from-[#4facfe] hover:to-[#00c6ff] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
          >
            Logout {employeeData.name ? `(${employeeData.name})` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeNavBar;