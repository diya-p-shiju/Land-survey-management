import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import AuthButton from "./../components/login";
import { useNavigate } from "react-router-dom";


// Modified AuthButton.tsx (optional, to match the theme)

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import axios from 'axios';


export function NavBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleHomeClick = () => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData.user.isAdmin===true) {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } else {
      navigate("/");
    }
    handleCloseNavMenu();
  };

  const handleMainClick = () => {
    navigate("/");
    handleCloseNavMenu();
  };

  const handleScrollTo = (id: string) => {
    handleCloseNavMenu();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              background: "linear-gradient(to right, #00c6ff, #4facfe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.5rem",
            }}
          >
            Echoland
          </Typography>

          {/* Mobile menu icon and dropdown */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
              PaperProps={{
                sx: {
                  background: "rgba(0,30,60,0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }
              }}
            >
              <MenuItem onClick={handleHomeClick}>
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              <MenuItem onClick={handleMainClick}>
                <Typography textAlign="center">Main</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleScrollTo("about")}>
                <Typography textAlign="center">About</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleScrollTo("services")}>
                <Typography textAlign="center">Services</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              background: "linear-gradient(to right, #00c6ff, #4facfe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.5rem",
            }}
          >
            Echoland.ai
          </Typography>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            <Button
              onClick={handleHomeClick}
              sx={{ 
                my: 2, 
                mx: 1,
                color: "white", 
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "0%",
                  height: "2px",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(to right, #00c6ff, #4facfe)",
                  transition: "width 0.3s ease"
                },
                "&:hover::after": {
                  width: "80%"
                }
              }}
            >
              Home
            </Button>
            <Button
              onClick={handleMainClick}
              sx={{ 
                my: 2, 
                mx: 1,
                color: "white", 
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "0%",
                  height: "2px",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(to right, #00c6ff, #4facfe)",
                  transition: "width 0.3s ease"
                },
                "&:hover::after": {
                  width: "80%"
                }
              }}
            >
              Main
            </Button>
            <Button
              onClick={() => handleScrollTo("about")}
              sx={{ 
                my: 2, 
                mx: 1,
                color: "white", 
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "0%",
                  height: "2px",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(to right, #00c6ff, #4facfe)",
                  transition: "width 0.3s ease"
                },
                "&:hover::after": {
                  width: "80%"
                }
              }}
            >
              About
            </Button>
            <Button
              onClick={() => handleScrollTo("services")}
              sx={{ 
                my: 2, 
                mx: 1,
                color: "white", 
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "0%",
                  height: "2px",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(to right, #00c6ff, #4facfe)",
                  transition: "width 0.3s ease"
                },
                "&:hover::after": {
                  width: "80%"
                }
              }}
            >
              Services
            </Button>
          </Box>

          {/* Sign up/Login button */}
          <Box sx={{ flexGrow: 0 }}>
            <AuthButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const AuthButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userDataString = localStorage.getItem('userData');
  const isLoggedIn = !!userDataString;
  const userData = isLoggedIn ? JSON.parse(userDataString) : null;

  const handleLogout = () => {
      localStorage.removeItem('userData');
      navigate('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      try {
          const response = await axios.post('http://localhost:8080/auth/login', {
              email,
              password
          });

          if (response.data) {
              localStorage.setItem('userData', JSON.stringify(response.data));
              setIsOpen(false);
              setEmail('');
              setPassword('');

              if (response.data.user.isAdmin===true) {
                  navigate('/admin');
              } else {
                  navigate('/user');
              }
          }
      } catch (err) {
          setError('Invalid email or password');
      }
  };

  return (
      <>
          {isLoggedIn ? (
              <Button 
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "white",
                      borderRadius: "8px",
                      px: 2,
                      "&:hover": {
                          borderColor: "#4facfe",
                          backgroundColor: "rgba(79,172,254,0.1)",
                      }
                  }}
              >
                  Logout {userData?.name ? `(${userData.name})` : ''}
              </Button>
          ) : (
              <>
                  <Button 
                      variant="contained"
                      onClick={() => setIsOpen(true)}
                      sx={{
                          background: "linear-gradient(90deg, #00c6ff 0%, #4facfe 100%)",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          boxShadow: "0 4px 15px rgba(0, 198, 255, 0.3)",
                          "&:hover": {
                              background: "linear-gradient(90deg, #4facfe 0%, #00c6ff 100%)",
                              boxShadow: "0 6px 20px rgba(0, 198, 255, 0.4)",
                          }
                      }}
                  >
                      Sign in
                  </Button>

                  <Dialog 
                      open={isOpen} 
                      onClose={() => setIsOpen(false)}
                      maxWidth="xs"
                      fullWidth
                      PaperProps={{
                          sx: {
                              background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
                              borderRadius: "16px",
                              boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
                          }
                      }}
                  >
                      <DialogTitle sx={{ color: "white", fontWeight: 600, pb: 1 }}>Sign in to your account</DialogTitle>
                      <form onSubmit={handleLogin}>
                          <DialogContent>
                              {error && (
                                  <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
                                      {error}
                                  </Alert>
                              )}
                              
                              <TextField
                                  autoFocus
                                  margin="dense"
                                  id="email"
                                  label="Email Address"
                                  type="email"
                                  fullWidth
                                  variant="outlined"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                  sx={{ 
                                      mb: 3,
                                      '& .MuiOutlinedInput-root': {
                                          '& fieldset': {
                                              borderColor: 'rgba(255,255,255,0.2)',
                                          },
                                          '&:hover fieldset': {
                                              borderColor: 'rgba(255,255,255,0.4)',
                                          },
                                          '&.Mui-focused fieldset': {
                                              borderColor: '#4facfe',
                                          },
                                      },
                                      '& .MuiInputLabel-root': {
                                          color: 'rgba(255,255,255,0.7)',
                                      },
                                      '& .MuiInputBase-input': {
                                          color: 'white',
                                      },
                                  }}
                              />
                              
                              <TextField
                                  margin="dense"
                                  id="password"
                                  label="Password"
                                  type="password"
                                  fullWidth
                                  variant="outlined"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  sx={{ 
                                      mb: 2,
                                      '& .MuiOutlinedInput-root': {
                                          '& fieldset': {
                                              borderColor: 'rgba(255,255,255,0.2)',
                                          },
                                          '&:hover fieldset': {
                                              borderColor: 'rgba(255,255,255,0.4)',
                                          },
                                          '&.Mui-focused fieldset': {
                                              borderColor: '#4facfe',
                                          },
                                      },
                                      '& .MuiInputLabel-root': {
                                          color: 'rgba(255,255,255,0.7)',
                                      },
                                      '& .MuiInputBase-input': {
                                          color: 'white',
                                      },
                                  }}
                              />
                          </DialogContent>
                          
                          <DialogActions sx={{ p: 3, pt: 1 }}>
                              <Button 
                                  onClick={() => setIsOpen(false)}
                                  sx={{ 
                                      color: 'rgba(255,255,255,0.7)',
                                      '&:hover': {
                                          color: 'white',
                                      }
                                  }}
                              >
                                  Cancel
                              </Button>
                              <Button 
                                  type="submit"
                                  variant="contained"
                                  sx={{
                                      background: "linear-gradient(90deg, #00c6ff 0%, #4facfe 100%)",
                                      color: "white",
                                      borderRadius: "8px",
                                      fontWeight: 600,
                                      px: 3,
                                      boxShadow: "0 4px 15px rgba(0, 198, 255, 0.3)",
                                      "&:hover": {
                                          background: "linear-gradient(90deg, #4facfe 0%, #00c6ff 100%)",
                                          boxShadow: "0 6px 20px rgba(0, 198, 255, 0.4)",
                                      }
                                  }}
                              >
                                  Sign in
                              </Button>
                          </DialogActions>
                      </form>
                  </Dialog>
              </>
          )}
      </>
  );
};