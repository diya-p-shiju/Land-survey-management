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
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    TablePagination
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface ISurvey {
    _id: string;
    name: string;
    email: string;
    phone: string;
    district: string;
    thaluk: string;
    surveyNumber: string;
    surveyType: string;
    approved: boolean;
}

const SurveyApproval: React.FC = () => {
    const [surveys, setSurveys] = useState<ISurvey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSurvey, setSelectedSurvey] = useState<ISurvey | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchSurveys = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/survey');
            setSurveys(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch surveys');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleApproveReject = async (survey: ISurvey, isApproved: boolean) => {
        setSelectedSurvey(survey);
        setOpenDialog(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedSurvey) return;

        try {
            await axios.put(`http://localhost:8080/api/survey/${selectedSurvey._id}`, {
                ...selectedSurvey,
                approved: !selectedSurvey.approved
            });
            
            await fetchSurveys();
            setSnackbar({
                open: true,
                message: `Survey ${!selectedSurvey.approved ? 'approved' : 'rejected'} successfully`,
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to update survey status',
                severity: 'error'
            });
        } finally {
            setOpenDialog(false);
            setSelectedSurvey(null);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Survey Approval Dashboard
            </Typography>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>District</TableCell>
                            <TableCell>Thaluk</TableCell>
                            <TableCell>Survey Number</TableCell>
                            <TableCell>Survey Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {surveys
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((survey) => (
                            <TableRow key={survey._id}>
                                <TableCell>{survey.name}</TableCell>
                                <TableCell>{survey.email}</TableCell>
                                <TableCell>{survey.phone}</TableCell>
                                <TableCell>{survey.district}</TableCell>
                                <TableCell>{survey.thaluk}</TableCell>
                                <TableCell>{survey.surveyNumber}</TableCell>
                                <TableCell>{survey.surveyType}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={survey.approved ? 'Approved' : 'Pending'}
                                        color={survey.approved ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {!survey.approved ? (
                                            <Button
                                                startIcon={<CheckCircleIcon />}
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => handleApproveReject(survey, true)}
                                                style={{ marginLeft: '8px' }}
                                            >
                                                Approve
                                            </Button>
                                        ) : (
                                            <Button
                                                startIcon={<CancelIcon />}
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleApproveReject(survey, false)}
                                                style={{ marginLeft: '8px' }}
                                            >
                                                Reject
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={surveys.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {selectedSurvey?.approved ? 'Reject Survey' : 'Approve Survey'}
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to {selectedSurvey?.approved ? 'reject' : 'approve'} this survey?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={handleConfirmAction}
                        color={selectedSurvey?.approved ? 'error' : 'success'}
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SurveyApproval;