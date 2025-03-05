import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

const data = [
  {
    title: "Road Survey",
    description: "A survey conducted to assess road conditions, alignment, and infrastructure planning for new or existing roadways.",
  },
  {
    title: "Building Survey",
    description: "A detailed inspection of a building's structural integrity, materials, and condition to identify potential issues and maintenance needs.",
  },
  {
    title: "Levelling Survey",
    description: "A survey used to measure height differences across a site, ensuring proper drainage, foundation stability, and land grading.",
  },
  {
    title: "Topographical Survey",
    description: "A comprehensive mapping of natural and artificial features on a land surface, including elevations, trees, buildings, and roads.",
  },
  {
    title: "Contour Survey",
    description: "A survey that maps elevation changes across a property, helping with site planning, drainage design, and land development.",
  },
  {
    title: "Quantity Survey",
    description: "An assessment that estimates construction costs, material requirements, and budgeting for real estate projects.",
  },
  {
    title: "Real Estate Projects",
    description: "A broad category encompassing residential, commercial, and mixed-use developments, including planning, design, and execution.",
  },
  {
    title: "Land Survey",
    description: "A precise measurement of property boundaries, easements, and land features to support real estate transactions and development.",
  },
];

const Services = () => {
  return (
    <Box 
      id="services" 
      sx={{ 
        py: 12,
        background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, md: 4 } }}>
        <Typography 
          variant="h2" 
          align="center" 
          sx={{ 
            mb: 8,
            background: "linear-gradient(to right, #00c6ff, #4facfe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 600,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Our Services
        </Typography>

        <Grid container spacing={3}>
          {data.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: "100%",
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
                    background: "linear-gradient(135deg, rgba(0,198,255,0.1) 0%, rgba(79,172,254,0.1) 100%)",
                    border: "1px solid rgba(79,172,254,0.3)",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box 
                    sx={{ 
                      width: "50px",
                      height: "50px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #00c6ff 0%, #4facfe 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "white"
                    }}
                  >
                    {index + 1}
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: "white"
                    }}
                  >
                    {item.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.6
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Services;