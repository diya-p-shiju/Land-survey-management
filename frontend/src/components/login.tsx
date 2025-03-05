// Modified AuthButton.tsx (optional, to match the theme)
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Paper } from '@mui/material';

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

export default AuthButton;