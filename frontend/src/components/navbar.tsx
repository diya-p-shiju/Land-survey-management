import React, { useState, useEffect } from "react";
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
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user or employee is logged in
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    const employeeToken = localStorage.getItem("token");
    const employeeData = localStorage.getItem("employeeData");
    
    if (userDataString || (employeeToken && employeeData)) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleHomeClick = () => {
    const userDataString = localStorage.getItem("userData");
    const employeeData = localStorage.getItem("employeeData");
    
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } else if (employeeData) {
      navigate("/employee/dashboard");
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
    
    // Check if we're already on the home page
    if (location.pathname !== "/") {
      // If not on home page, navigate to home first, then scroll after navigation completes
      navigate("/", { state: { scrollTo: id } });
    } else {
      // If already on home page, scroll directly
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Effect to handle scrolling after navigation completes
  useEffect(() => {
    if (location.pathname === "/" && location.state && location.state.scrollTo) {
      // Small timeout to ensure the page has loaded
      const timer = setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        // Clear the state after scrolling
        window.history.replaceState({}, document.title);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSignInClick = () => {
    navigate("/login");
    handleCloseNavMenu();
  };

  const handleSignUpClick = () => {
    navigate("/signup");
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("employeeData");
    setIsLoggedIn(false);
    navigate("/");
    handleCloseNavMenu();
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
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
                },
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
              <Divider
                sx={{ my: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
              />
              {!isLoggedIn && (
                <>
                  <MenuItem onClick={handleSignInClick}>
                    <Typography textAlign="center">Sign In</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleSignUpClick}>
                    <Typography textAlign="center">Sign Up</Typography>
                  </MenuItem>
                </>
              )}
              {isLoggedIn && (
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              )}
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
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
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
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "80%",
                },
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
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "80%",
                },
              }}
            >
              Main Page
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
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "80%",
                },
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
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "80%",
                },
              }}
            >
              Services
            </Button>
          </Box>

          {/* Auth buttons */}
          <Box
            sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
          >
            {!isLoggedIn ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleSignUpClick}
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "8px",
                    px: 2,
                    "&:hover": {
                      borderColor: "#4facfe",
                      backgroundColor: "rgba(79,172,254,0.1)",
                    },
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSignInClick}
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
                  Sign In
                </Button>
              </>
            ) : (
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
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;