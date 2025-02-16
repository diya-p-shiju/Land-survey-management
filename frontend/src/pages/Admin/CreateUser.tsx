import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { apiRequest } from '../../components/lib/apiRequest';
import axios from 'axios';

const CreateUser: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        try {
            const success = await axios.post('http://localhost:8080/api/auth', {
                name: username,
                email,
                password,
                phone,
                isAdmin,
            });
            console.log('User created:', success);  
        } catch (error) {
            console.error('Failed to create user:', error);
        }
        console.log({ username, email, password, phone, isAdmin });
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Create New User
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Is Admin"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Create User
                </Button>
            </form>
        </Container>
    );
};

export default CreateUser;