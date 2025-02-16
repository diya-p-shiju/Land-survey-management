import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    Box,
    Grid2 as Grid,
} from "@mui/material";
import { NavBar } from "../../components/navbar";

const surveyTypes = [
    "Land Survey",
    "Road Survey",
    "Building Survey",
    "Leveling Survey",
    "Topographical Survey",
    "Contour Survey",
    "Quantity Survey",
    "Real Estate Projects",
];

const User: React.FC = () => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString).user : {};

    const [surveys, setSurveys] = useState([]);
    const [isSurveyModalVisible, setIsSurveyModalVisible] = useState(false);
    const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);

    // Initialize form with user data
    const [formValues, setFormValues] = useState({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        district: "",
        thaluk: "",
        surveyNumber: "",
        surveyType: "",
    });

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/survey");
                setSurveys(response.data);
            } catch (error) {
                console.error("There was an error fetching the surveys!", error);
            }
        };

        fetchSurveys();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setFormValues({
            ...formValues,
            surveyType: e.target.value as string,
        });
    };

    const handleSurveyModalOpen = () => {
        // Reset form with user data for new surveys
        setFormValues({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            district: "",
            thaluk: "",
            surveyNumber: "",
            surveyType: "",
        });
        setIsSurveyModalVisible(true);
    };

    const handleSurveyModalClose = () => {
        setIsSurveyModalVisible(false);
    };

    const handleNotificationModalOpen = () => {
        setIsNotificationModalVisible(true);
    };

    const handleNotificationModalClose = () => {
        setIsNotificationModalVisible(false);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/survey", formValues);
            console.log("Survey submitted successfully", response.data);
            setSurveys([...surveys, response.data]);
            setIsSurveyModalVisible(false);
        } catch (error) {
            console.error("There was an error submitting the survey!", error);
        }
    };

    return (
        <div>
            <NavBar />
            <Box display="flex" justifyContent="center" mt={4} mb={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSurveyModalOpen}
                    style={{ marginRight: "20px", padding: "15px 30px", fontSize: "16px" }}
                >
                    Apply for New Survey
                </Button>
                {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNotificationModalOpen}
                    style={{ padding: "15px 30px", fontSize: "16px" }}
                >
                    Check Out Latest Notifications
                </Button> */}
            </Box>

            <Grid container spacing={3} style={{ marginTop: "20px" }}>
                {surveys.map((survey: any) => (
          <Grid item key={survey._id} xs={12} sm={6} md={4}>
          <Card 
            style={{ 
              padding: "40px",
              margin: "100px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f8f8f8",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>
              {survey.name}
            </h2>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>Email:</span> {survey.email}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>Phone:</span> {survey.phone}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>District:</span> {survey.district}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>Thaluk:</span> {survey.thaluk}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>Survey Number:</span> {survey.surveyNumber}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>Survey Type:</span> {survey.surveyType}
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>Approved:</span> {survey.approved ? "Yes" : "No"}
            </div>
          </Card>
        </Grid>
                ))}
            </Grid>

            <Dialog open={isSurveyModalVisible} onClose={handleSurveyModalClose}>
                <DialogTitle>Apply for New Survey</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={formValues.name}
                        disabled
                        sx={{ 
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={formValues.email}
                        disabled
                        sx={{ 
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        value={formValues.phone}
                        disabled
                        sx={{ 
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        name="district"
                        label="District"
                        type="text"
                        fullWidth
                        value={formValues.district}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="thaluk"
                        label="Thaluk"
                        type="text"
                        fullWidth
                        value={formValues.thaluk}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="surveyNumber"
                        label="Survey Number"
                        type="text"
                        fullWidth
                        value={formValues.surveyNumber}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="surveyType"
                        label="Survey Type"
                        select
                        fullWidth
                        value={formValues.surveyType}
                        onChange={handleSelectChange}
                        required
                    >
                        {surveyTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSurveyModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isNotificationModalVisible}
                onClose={handleNotificationModalClose}
            >
                <DialogTitle>Latest Notifications</DialogTitle>
                <DialogContent>
                    <p>Here you can display the latest notifications...</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNotificationModalClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default User;