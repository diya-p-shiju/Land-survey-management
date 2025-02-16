import { Typography } from "@mui/material"
import {NavBar} from "../../components/navbar"
import AboutUs from "./AboutUs"
import Hero from "./Hero"
import Services from "./Services"


const Home: React.FC = () => {
  return (
    <>
    <NavBar />
    <Hero />
    <AboutUs />
    <Services />
    </>
  )
}

export default Home
