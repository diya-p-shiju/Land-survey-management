import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';

interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    isAdmin: boolean;
}

const ViewUsers: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [updatedUser, setUpdatedUser] = useState<Partial<IUser>>({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/auth');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (userId: string) => {
        const user = users.find(u => u._id === userId);
        if (user) {
            setSelectedUser(user);
            setUpdatedUser({
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin
            });
            setOpenDialog(true);
        }
    };

    const handleSaveUpdate = async () => {
        if (!selectedUser) return;

        try {
            await axios.put(`http://localhost:8080/api/auth/${selectedUser._id}`, updatedUser);
            setOpenDialog(false);
            fetchUsers(); // Refresh the users list
            setError(null);
        } catch (err) {
            setError('Failed to update user');
        }
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:8080/api/auth/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
                setError(null);
            } catch (err) {
                setError('Failed to delete user');
            }
        }
    };

    const handleInputChange = (field: keyof IUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedUser({
            ...updatedUser,
            [field]: field === 'isAdmin' ? event.target.checked : event.target.value
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Users List</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Password</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.password}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleUpdate(user._id)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        Update
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Update User</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={updatedUser.name || ''}
                        onChange={handleInputChange('name')}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={updatedUser.email || ''}
                        onChange={handleInputChange('email')}
                    />
                    <TextField
                        margin="dense"
                        label="Phone"
                        fullWidth
                        value={updatedUser.phone || ''}
                        onChange={handleInputChange('phone')}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        onChange={handleInputChange('password')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveUpdate} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewUsers;