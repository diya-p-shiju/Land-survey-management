import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import survey from "../../assets/survey.webp";
import BadgeIcon from '@mui/icons-material/Badge';

const Hero = () => {
  const navigate = useNavigate();
  const [isEmployee, setIsEmployee] = useState(false);
  
  // Check if user is an authenticated employee
  useEffect(() => {
    const checkEmployeeAuth = () => {
      const token = localStorage.getItem("token");
      const employeeData = localStorage.getItem("employeeData");
      if (token && employeeData) {
        setIsEmployee(true);
      } else {
        setIsEmployee(false);
      }
    };
    
    checkEmployeeAuth();
  }, []);

  // Handle employee login navigation
  const handleEmployeeLoginClick = () => {
    navigate("/employee/login");
  };

  // Handle dashboard navigation for logged in employees
  const handleDashboardClick = () => {
    navigate("/employee/dashboard");
  };

  return (
    <Box 
      id="hero" 
      sx={{ 
        pt: 8, 
        pb: 12,
        px: { xs: 2, md: 6 },
        background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Welcome Badge */}
        <Box 
          sx={{ 
            display: "inline-block", 
            px: 2, 
            py: 1, 
            borderRadius: 5, 
            mb: 4,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(5px)"
          }}
        >
          <Typography variant="body2" component="span">
            Welcome to Echoland
            <Box component="span" sx={{ ml: 1, verticalAlign: "middle" }}>→</Box>
          </Typography>
        </Box>

        {/* Two column layout for main content */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1, pr: { md: 6 } }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", md: "4.5rem" },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 4,
                background: "linear-gradient(to right, #00c6ff, #4facfe)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Transform Your Land Surveying Strategy
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "2.5rem" },
                fontWeight: 400,
                mb: 4,
                opacity: 0.9,
              }}
            >
              with the Power of Precision
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 6, 
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.8)",
                maxWidth: "600px"
              }}
            >
              Boost your surveying performance, increase ROI, and unlock data-driven
              insights with our advanced precision surveying solutions.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #00c6ff 0%, #4facfe 100%)",
                  boxShadow: "0 4px 15px rgba(0, 198, 255, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #4facfe 0%, #00c6ff 100%)",
                    boxShadow: "0 8px 20px rgba(0, 198, 255, 0.5)",
                  },
                }}
                onClick={handleEmployeeLoginClick}
              >
                Get Started 
                <Box component="span" sx={{ ml: 1, fontSize: "1.2rem" }}>+</Box>
              </Button>
              
           
            </Stack>
          </Box>

          <Box 
            sx={{ 
              flex: 1,
              position: "relative",
              display: { xs: "none", md: "block" } 
            }}
          >
            <Box 
              component="img"
              src={survey}
              alt="Advanced land surveying"
              sx={{ 
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
                transform: "perspective(1000px) rotateY(-5deg)",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "perspective(1000px) rotateY(0deg)",
                }
              }}
            />
            <Box 
              sx={{ 
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(79,172,254,0.2) 0%, rgba(0,198,255,0.2) 100%)",
                borderRadius: "12px",
                pointerEvents: "none"
              }}
            />
          </Box>
        </Box>

        {/* Brand section */}
        <Box 
          sx={{ 
            mt: 16, 
            pt: 5, 
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center"
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              mr: 6,
              mb: { xs: 3, md: 0 }
            }}
          >
            40,000+ Clients trust us for surveying excellence
          </Typography>
          
          <Box 
            sx={{ 
              display: "flex", 
              gap: 4,
              opacity: 0.7,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
    
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;