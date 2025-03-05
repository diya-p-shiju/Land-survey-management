import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import landsurvey1 from "../../assets/landsurvey2.avif";

const AboutUs = () => {
  return (
    <Box 
      id="about" 
      sx={{ 
        py: 12,
        background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, md: 4 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                height: { xs: "300px", md: "500px" },
                width: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #00c6ff 0%, #4facfe 100%)",
                  opacity: 0.2,
                }}
              />
              
              {/* This would normally be an image component */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `url(${landsurvey1}) center/cover no-repeat`,
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#4facfe",
                mb: 2,
                letterSpacing: 1,
              }}
            >
              About Echoland
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: "2rem", md: "3rem" },
                background: "linear-gradient(to right, white, rgba(255,255,255,0.7))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Leading The Way In Precision Surveying
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              As a leading land survey company, we provide accurate and reliable surveying services to meet all your needs. Our team of experienced professionals uses the latest technology to deliver precise measurements and detailed reports.
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                mb: 6,
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Whether you need boundary surveys, topographic surveys, or construction staking, we are here to help you with all your land surveying requirements.
            </Typography>
            
        
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AboutUs;