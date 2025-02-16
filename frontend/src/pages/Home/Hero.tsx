import { Box, Typography} from "@mui/material";
import survey from "../../assets/survey.webp";


const Hero = () => {
  return (
    <div id="hero">
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        sx={{
            padding: '20px',
            borderRadius: '8px',
            mb: 0,
            ml: '120px',
            mt: '50px',    
        }}
    >
        <Typography
            variant="h1"
            component="h1"
            sx={{
                fontFamily: 'Arial, sans-serif',
                background: 'linear-gradient(to right, #0000ff, #00ffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '4rem',
                fontWeight: 'bold',
            }}
        >
            Echoland
        </Typography>
        <Typography
            variant="h6"
            component="p"
            sx={{
                fontFamily: 'Arial, sans-serif',
                background: 'linear-gradient(to right, #0000ff, #00ffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.5rem',
            }}
        >
            Discover the beauty of the land
        </Typography>
    </Box>
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h1" component="h2" sx={{m:10, width: "800px", fontWeight: "bold", mb:20}}>
            Where innovation meets precision in modern land surveying
        </Typography>
        <img src={survey} alt="survey" style={{ width: "800px", height: "500px", marginRight:"100px" }} />
    </Box>
    </div>
  );
};

export default Hero;
