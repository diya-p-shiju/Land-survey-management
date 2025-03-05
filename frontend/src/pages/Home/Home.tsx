import React from "react";
import { Box } from "@mui/material";
import { NavBar } from "../../components/navbar";
import AboutUs from "./AboutUs";
import Hero from "./Hero";
import Services from "./Services";

const Home: React.FC = () => {
  return (
    <Box sx={{ 
      background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
      color: "white",
      minHeight: "100vh"
    }}>
      <NavBar />
      <Hero />
      <AboutUs />
      <Services />
    </Box>
  );
};

export default Home;