import survey_model from "../models/survey_model";
import { Request, RequestHandler, Response } from "express";

// First, let's create a simplified notification service
// You can move this to a separate file later

const createNotification = async (
  recipientId: string,
  recipientModel: 'User' | 'Employee',
  surveyId: string,
  type: string,
  message: string,
  data?: any
) => {
  try {
    // Import your notification model
    const Notification = require("../models/notification_model").default;
    
    const notification = new Notification({
      recipient: recipientId,
      recipientModel,
      surveyId,
      type,
      message,
      data,
      isRead: false
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw the error - we don't want notifications to break the main flow
    return null;
  }
};

// Create a new survey
export const createSurvey = async (req: Request, res: Response) => {
    try {
        const survey = new survey_model(req.body);
        await survey.save();
        
        // Create notification for admin(s) about new survey
        try {
            // Assuming you have a userId in the request body
            const userId = req.body.userId;
            
            if (userId) {
                // Get user name - this depends on your User model structure
                const User = require("../models/user_model").default;
                const user = await User.findById(userId);
                const userName = user ? user.name : 'Unknown User';
                
                // Find admin(s) to notify - this depends on your User model
                const admins = await User.find({ isAdmin: true });
                
                // Notify each admin
                if (admins && admins.length > 0) {
                    for (const admin of admins) {
                        await createNotification(
                            admin._id.toString(),
                            'User', // Assuming admins are in the User model
                            survey._id.toString(),
                            'SURVEY_SUBMITTED',
                            `New survey request from ${userName}: ${survey.surveyType} in ${survey.district}`,
                            { surveyType: survey.surveyType }
                        );
                    }
                }
            }
        } catch (notificationError) {
            // Log the error but don't fail the request
            console.error('Failed to create notification:', notificationError);
        }
        
        res.status(201).send(survey);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all surveys
export const getSurveys = async (req: Request, res: Response) => {
    try {
        const surveys = await survey_model.find({});
        res.status(200).send(surveys);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }   
};

// Get single survey
export const getSurvey = async (req: Request, res: Response) => {
    try {
        const survey = await survey_model.findById(req.params.id);
        if (!survey) {
            return res.status(404).send("Survey not found");
        }
        res.status(200).send(survey);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// Update survey
export const updateSurvey = async (req: Request, res: Response) => {
    try {
        // Get the original survey to compare changes
        const originalSurvey = await survey_model.findById(req.params.id);
        if (!originalSurvey) {
            return res.status(404).send("Survey not found");
        }
        
        const survey = await survey_model.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        // Handle notifications for different types of updates
        try {
            // 1. Status change notification
            if (req.body.status && originalSurvey.status !== req.body.status) {
                // Notify the survey owner
                if (originalSurvey.userId) {
                    let message = '';
                    switch (req.body.status) {
                        case 'Approved':
                            message = `Your survey request #${originalSurvey.surveyNumber} has been approved.`;
                            break;
                        case 'Rejected':
                            message = `Your survey request #${originalSurvey.surveyNumber} has been rejected.`;
                            break;
                        case 'Assigned':
                            message = `Your survey request #${originalSurvey.surveyNumber} has been assigned to an employee.`;
                            break;
                        case 'In Progress':
                            message = `Your survey request #${originalSurvey.surveyNumber} is now in progress.`;
                            break;
                        case 'Completed':
                            message = `Your survey request #${originalSurvey.surveyNumber} has been completed.`;
                            break;
                        default:
                            message = `Your survey request #${originalSurvey.surveyNumber} status has been updated to ${req.body.status}.`;
                    }

                    await createNotification(
                        originalSurvey.userId.toString(),
                        'User',
                        originalSurvey._id.toString(),
                        'STATUS_UPDATED',
                        message,
                        { status: req.body.status }
                    );
                }
                
                // If assigned to employee, notify them too
                if (req.body.assignedTo && req.body.status === 'Assigned') {
                    const message = `You have been assigned survey #${originalSurvey.surveyNumber} in ${originalSurvey.district}.`;
                    
                    await createNotification(
                        req.body.assignedTo.toString(),
                        'Employee',
                        originalSurvey._id.toString(),
                        'SURVEY_ASSIGNED',
                        message,
                        { status: req.body.status }
                    );
                }
            }
            
            // 2. Employee assignment notification
            if (req.body.assignedTo && 
                (!originalSurvey.assignedTo || 
                 originalSurvey.assignedTo.toString() !== req.body.assignedTo.toString())) {
                
                // Only notify if we haven't already sent a status change notification
                if (!req.body.status || originalSurvey.status === req.body.status) {
                    const message = `You have been assigned survey #${originalSurvey.surveyNumber} in ${originalSurvey.district}.`;
                    
                    await createNotification(
                        req.body.assignedTo.toString(),
                        'Employee',
                        originalSurvey._id.toString(),
                        'SURVEY_ASSIGNED',
                        message,
                        null
                    );
                }
            }
            
            // 3. New remark notification
            if (req.body.remarks && Array.isArray(req.body.remarks)) {
                // Check if a new remark was added
                const originalRemarkCount = originalSurvey.remarks ? originalSurvey.remarks.length : 0;
                
                if (req.body.remarks.length > originalRemarkCount) {
                    // Get the new remark
                    const newRemark = req.body.remarks[req.body.remarks.length - 1];
                    
                    // Determine who should be notified
                    // If remark was added by user, notify employee (if assigned)
                    if (newRemark.createdByModel === 'User' && originalSurvey.assignedTo) {
                        await createNotification(
                            originalSurvey.assignedTo.toString(),
                            'Employee',
                            originalSurvey._id.toString(),
                            'NEW_REMARK',
                            `New remark from ${newRemark.createdByName} on survey #${originalSurvey.surveyNumber}`,
                            { remarkId: newRemark._id }
                        );
                    }
                    
                    // If remark was added by employee, notify user
                    if (newRemark.createdByModel === 'Employee' && originalSurvey.userId) {
                        await createNotification(
                            originalSurvey.userId.toString(),
                            'User',
                            originalSurvey._id.toString(),
                            'NEW_REMARK',
                            `New remark from ${newRemark.createdByName} on survey #${originalSurvey.surveyNumber}`,
                            { remarkId: newRemark._id }
                        );
                    }
                }
            }
            
            // 4. Approval status notification
            if (req.body.approved !== undefined && 
                originalSurvey.approved !== req.body.approved) {
                
                if (originalSurvey.userId) {
                    const message = req.body.approved 
                        ? `Your survey request #${originalSurvey.surveyNumber} has been approved.`
                        : `Your survey request #${originalSurvey.surveyNumber} has been rejected.`;
                        
                    await createNotification(
                        originalSurvey.userId.toString(),
                        'User',
                        originalSurvey._id.toString(),
                        req.body.approved ? 'SURVEY_APPROVED' : 'SURVEY_REJECTED',
                        message,
                        { approved: req.body.approved }
                    );
                }
            }
            
        } catch (notificationError) {
            // Log the error but don't fail the request
            console.error('Failed to create notification:', notificationError);
        }
        
        res.status(200).send(survey);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }       
};

// Add a new remark to a survey
export const addRemark = async (req: Request, res: Response) => {
    try {
        const { content, userId, userType, userName } = req.body;
        
        if (!content || !userId || !userType || !userName) {
            return res.status(400).send("Missing required fields: content, userId, userType, userName");
        }
        
        const newRemark = {
            content,
            createdBy: userId,
            createdByModel: userType,
            createdByName: userName,
            createdAt: new Date()
        };
        
        const survey = await survey_model.findByIdAndUpdate(
            req.params.id,
            { $push: { remarks: newRemark } },
            { new: true }
        );
        
        if (!survey) {
            return res.status(404).send("Survey not found");
        }
        
        // Create notification for the new remark
        try {
            // Get the ID of the newly added remark
            const addedRemark = survey.remarks[survey.remarks.length - 1];
            
            // Determine who to notify
            if (userType === 'User' && survey.assignedTo) {
                // User added remark, notify assigned employee
                await createNotification(
                    survey.assignedTo.toString(),
                    'Employee',
                    survey._id.toString(),
                    'NEW_REMARK',
                    `New remark from ${userName} on survey #${survey.surveyNumber}`,
                    { remarkId: addedRemark._id }
                );
            } else if (userType === 'Employee' && survey.userId) {
                // Employee added remark, notify user
                await createNotification(
                    survey.userId.toString(),
                    'User',
                    survey._id.toString(),
                    'NEW_REMARK',
                    `New remark from ${userName} on survey #${survey.surveyNumber}`,
                    { remarkId: addedRemark._id }
                );
            }
        } catch (notificationError) {
            console.error('Failed to create notification for remark:', notificationError);
        }
        
        res.status(200).send(survey);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// Assign survey to employee
export const assignSurvey = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.body;
        
        if (!employeeId) {
            return res.status(400).send("Employee ID is required");
        }
        
        const survey = await survey_model.findByIdAndUpdate(
            req.params.id,
            { 
                assignedTo: employeeId,
                status: 'Assigned'
            },
            { new: true }
        );
        
        if (!survey) {
            return res.status(404).send("Survey not found");
        }
        
        // Create notification for the employee
        try {
            const Employee = require("../models/employee_model").default;
            const employee = await Employee.findById(employeeId);
            
            const message = `You have been assigned survey #${survey.surveyNumber} in ${survey.district}.`;
            
            await createNotification(
                employeeId,
                'Employee',
                survey._id.toString(),
                'SURVEY_ASSIGNED',
                message,
                null
            );
            
            // Also notify the user about assignment
            if (survey.userId) {
                await createNotification(
                    survey.userId.toString(),
                    'User',
                    survey._id.toString(),
                    'STATUS_UPDATED',
                    `Your survey request #${survey.surveyNumber} has been assigned to ${employee ? employee.name : 'an employee'}.`,
                    { status: 'Assigned' }
                );
            }
        } catch (notificationError) {
            console.error('Failed to create notification for assignment:', notificationError);
        }
        
        res.status(200).send(survey);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// Delete survey
export const deleteSurvey = async (req: Request, res: Response) => {
    try {
        const survey = await survey_model.findByIdAndDelete(req.params.id);
        if (!survey) {
            return res.status(404).send("Survey not found");
        }
        res.status(200).send(survey);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};




