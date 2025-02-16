import { Box } from '@mui/material'
import React from 'react';

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

const AboutUs = () => {
  return (
    <div id="services">
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)" // Change to 4 columns
        gap={4} // Adjust the gap between the cards
        sx={{
          mx: 6, // Increase the left and right margin
          my: 10,
          height: '100vh', // Make the Box take the full height of the screen
        }}
      >
        {data.map((item, index) => (
          <Box
            key={index}
            component="div"
            sx={{
              p: 2,
              background: 'linear-gradient(to bottom right, #2196F3, #21CBF3)', // Gradient background
              boxShadow: 3,
              borderRadius: 2,
              width: '300px', // Increase the width of the card
              height: '300px', // Increase the height of the card
              margin: '10px', // Adjust the margin as needed
              color: 'white', // Text color
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              marginLeft: '100px',
            }}
          >
            <Box
              component="h2"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              {item.title}
            </Box>
            <Box
              component="p"
              sx={{
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  )
}

export default AboutUs
