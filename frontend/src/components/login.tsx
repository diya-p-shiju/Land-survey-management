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
import CreateUser from '../pages/Admin/CreateUser';

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
                    color="inherit"
                    onClick={handleLogout}
                >
                    Logout {userData?.name ? `(${userData.name})` : ''}
                </Button>
            ) : (
                <>
                    <Button 
                        color="inherit"
                        onClick={() => setIsOpen(true)}
                    >
                        Login
                    </Button>

                    <Dialog 
                        open={isOpen} 
                        onClose={() => setIsOpen(false)}
                        maxWidth="xs"
                        fullWidth
                    >
                        <DialogTitle>Login</DialogTitle>
                        <form onSubmit={handleLogin}>
                            <DialogContent>
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
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
                                    sx={{ mb: 2 }}
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
                                />
                            </DialogContent>
                            
                            <DialogActions sx={{ p: 2 }}>
                                <Button onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    variant="contained"
                                >
                                    Login
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