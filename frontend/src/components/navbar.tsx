import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AuthButton from './../components/login';
import { useNavigate } from 'react-router-dom';

export function NavBar() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Echoland
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleHomeClick}  // Changed from href to onClick
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}  // New Main button
          >
            Main
          </Button>
          <Button color="inherit" href="/#about">About</Button>
          <Button color="inherit" href="/#services">Services</Button>
          <AuthButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}