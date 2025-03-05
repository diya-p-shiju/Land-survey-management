import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavBar } from "@/components/navbar";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Eye } from "lucide-react";

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

const User = () => {
  // Get user data from localStorage
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString).user : {};
  const token = userDataString ? JSON.parse(userDataString).token : null;

  const [surveys, setSurveys] = useState([]);
  const [isSurveyModalVisible, setIsSurveyModalVisible] = useState(false);
  const [isRemarksModalVisible, setIsRemarksModalVisible] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [newRemark, setNewRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize form with user data
  const [formValues, setFormValues] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    district: "",
    thaluk: "",
    surveyNumber: "",
    surveyType: "",
    userId: userData._id || "", // Add user ID to associate survey with user
  });

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/survey", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Filter surveys to only show the current user's surveys
        // This filtering ensures we get all surveys associated with the user
        const allSurveys = response.data;
        const filteredSurveys = allSurveys.filter(survey => 
          survey.userId === userData._id || 
          survey.email === userData.email ||
          survey.phone === userData.phone
        );
        
        // Sort surveys by most recent first
        const sortedSurveys = filteredSurveys.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setSurveys(sortedSurveys);
        setLoading(false);
        
        // Log for debugging purposes
        console.log(`Found ${sortedSurveys.length} surveys for user ${userData.name} (ID: ${userData._id})`);
      } catch (error) {
        console.error("There was an error fetching the surveys!", error);
        setError("Failed to load surveys. Please try again later.");
        setLoading(false);
      }
    };
  
    // Only fetch if we have user data
    if (userData._id || userData.email) {
      fetchSurveys();
    } else {
      setLoading(false);
      console.warn("Cannot fetch surveys: User data is missing");
    }
  }, [userData._id, userData.email, userData.phone, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (value) => {
    setFormValues({
      ...formValues,
      surveyType: value,
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
      userId: userData._id || "",
    });
    setIsSurveyModalVisible(true);
  };

  const handleSurveyModalClose = () => {
    setIsSurveyModalVisible(false);
  };

  const handleViewRemarks = (survey) => {
    setSelectedSurvey(survey);
    setIsRemarksModalVisible(true);
  };

  const handleRemarksModalClose = () => {
    setIsRemarksModalVisible(false);
    setSelectedSurvey(null);
  };



  const handleSubmit = async () => {
    // Validate form
    if (!formValues.district || !formValues.thaluk || !formValues.surveyNumber || !formValues.surveyType) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/survey", 
        formValues,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Survey submitted successfully", response.data);
      
      // Update the user's surveys
      setSurveys([...surveys, response.data]);
      
      setIsSurveyModalVisible(false);
      setError("");
    } catch (error) {
      console.error("There was an error submitting the survey!", error);
      setError("Failed to submit survey. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status display text and color
  const getStatusInfo = (survey) => {
    let statusText = survey.status || "Pending";
    let statusColor = "text-yellow-400";
    
    switch (survey.status) {
      case "Assigned":
        statusColor = "text-blue-400";
        break;
      case "In Progress":
        statusColor = "text-cyan-400";
        break;
      case "Completed":
        statusColor = "text-green-400";
        break;
      case "Cancelled":
        statusColor = "text-red-400";
        break;
      default:
        statusColor = "text-yellow-400";
    }
    
    return { text: statusText, color: statusColor };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-slate-900 text-white">
      <NavBar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to <span className="text-cyan-400">ECHOLAND</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mb-10">
            Track your survey requests and stay updated on their progress.
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-16">
          <Button 
            size="lg" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
            onClick={handleSurveyModalOpen}
          >
            Apply for New Survey
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading Message */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-slate-300 mt-4">Loading your surveys...</p>
          </div>
        )}

        {/* No Surveys Message */}
        {!loading && surveys.length === 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-8 text-center">
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">No Surveys Yet</h3>
            <p className="text-slate-300 mb-4">You haven't applied for any surveys yet.</p>
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={handleSurveyModalOpen}
            >
              Apply Now
            </Button>
          </div>
        )}

        {/* Survey Cards */}
        {!loading && surveys.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Your Surveys</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surveys.map((survey) => {
                const status = getStatusInfo(survey);
                return (
                  <Card key={survey._id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500 transition-all shadow-lg backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-cyan-400">
                        {survey.surveyType}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Survey #:</span>
                          <span>{survey.surveyNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">District:</span>
                          <span>{survey.district}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Thaluk:</span>
                          <span>{survey.thaluk}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className={status.color}>
                            {status.text}
                          </span>
                        </div>
                        {survey.assignedTo && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Assigned:</span>
                            <span className="text-green-400">Yes</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-400">Approved:</span>
                          <span className={survey.approved ? "text-green-400" : "text-yellow-400"}>
                            {survey.approved ? "Yes" : "Pending"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Created:</span>
                          <span>{formatDate(survey.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Remarks:</span>
                          <span>{survey.remarks?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
  <Button
    variant="outline"
    size="sm"
    className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 hover:text-white"
    onClick={() => handleViewRemarks(survey)}
  >
    <Eye className="mr-2 h-4 w-4" />
    View Remarks
  </Button>
</CardFooter>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Survey Modal */}
      <Dialog open={isSurveyModalVisible} onOpenChange={setIsSurveyModalVisible}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-cyan-400">Apply for New Survey</DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill out the form below to request a new survey.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-slate-300">Name</Label>
              <Input
                id="name"
                name="name"
                value={formValues.name}
                disabled
                className="col-span-3 bg-slate-800 border-slate-700 text-slate-300 disabled:opacity-80 disabled:text-slate-300"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                name="email"
                value={formValues.email}
                disabled
                className="col-span-3 bg-slate-800 border-slate-700 text-slate-300 disabled:opacity-80 disabled:text-slate-300"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-slate-300">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formValues.phone}
                disabled
                className="col-span-3 bg-slate-800 border-slate-700 text-slate-300 disabled:opacity-80 disabled:text-slate-300"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="district" className="text-slate-300">District*</Label>
              <Input
                id="district"
                name="district"
                value={formValues.district}
                onChange={handleInputChange}
                className="col-span-3 bg-slate-800 border-slate-700 text-slate-300"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thaluk" className="text-slate-300">Thaluk*</Label>
              <Input
                id="thaluk"
                name="thaluk"
                value={formValues.thaluk}
                onChange={handleInputChange}
                className="col-span-3 bg-slate-800 border-slate-700 text-slate-300"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="surveyNumber" className="text-slate-300">Survey Number*</Label>
              <Input
                id="surveyNumber"
                name="surveyNumber"
                value={formValues.surveyNumber}
                onChange={handleInputChange}
                className="col-span-3 bg-slate-800 border-slate-700 text-slate-300"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="surveyType" className="text-slate-300">Survey Type*</Label>
              <Select value={formValues.surveyType} onValueChange={handleSelectChange} required>
                <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700 text-slate-300">
                  <SelectValue placeholder="Select survey type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                  {surveyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-slate-700 text-blue-900 hover:bg-slate-800 hover:text-white" onClick={handleSurveyModalClose}>
              Cancel
            </Button>
            <Button className="bg-cyan-500 hover:bg-cyan-600" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remarks Modal */}


{/* Remarks Modal */}
<Dialog open={isRemarksModalVisible} onOpenChange={setIsRemarksModalVisible}>
  <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-xl text-cyan-400">
        Survey Remarks
        {selectedSurvey && (
          <span className="block text-sm font-normal mt-1 text-slate-400">
            {selectedSurvey.surveyType} - Survey #{selectedSurvey.surveyNumber}
          </span>
        )}
      </DialogTitle>
    </DialogHeader>
    
    <div className="py-4">
      {selectedSurvey && selectedSurvey.remarks && selectedSurvey.remarks.length > 0 ? (
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
          {[...selectedSurvey.remarks]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((remark, index) => (
              <div 
                key={remark._id || index} 
                className={`p-4 rounded-lg ${
                  remark.createdByModel === 'Employee' 
                    ? 'bg-blue-900/30 border-l-4 border-blue-500' 
                    : remark.createdByModel === 'User'
                    ? 'bg-purple-900/30 border-l-4 border-purple-500'
                    : 'bg-green-900/30 border-l-4 border-green-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">
                    {remark.createdByName} 
                    <span className="text-xs font-normal ml-2 text-slate-400">
                      ({remark.createdByModel})
                    </span>
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(remark.createdAt)}
                  </span>
                </div>
                <p className="text-slate-300">{remark.content}</p>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <MessageCircle className="h-12 w-12 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400">No remarks yet.</p>
        </div>
      )}
    </div>
    
    <DialogFooter>
      <Button 
        className="bg-cyan-500 hover:bg-cyan-600" 
        onClick={handleRemarksModalClose}
      >
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default User;