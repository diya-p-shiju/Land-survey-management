// services/notificationService.ts
import Notification from '../models/notification_model';
import Survey from '../models/survey_model';
import User from '../models/user_model';
import Employee from '../models/employee_model'; // If you're keeping them separate

// Create a notification
export const createNotification = async (
  recipientId: string,
  recipientModel: 'User' | 'Employee',
  surveyId: string,
  type: string,
  message: string,
  data?: any
) => {
  try {
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
    throw error;
  }
};

// Get all notifications for a user or employee
export const getNotifications = async (
  recipientId: string,
  recipientModel: 'User' | 'Employee',
  limit = 20,
  skip = 0,
  onlyUnread = false
) => {
  try {
    const query: any = {
      recipient: recipientId,
      recipientModel
    };

    if (onlyUnread) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('surveyId', 'name surveyNumber');

    const count = await Notification.countDocuments(query);

    return {
      notifications,
      count,
      unreadCount: onlyUnread ? count : await Notification.countDocuments({
        ...query,
        isRead: false
      })
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (notificationId: string) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async (
  recipientId: string,
  recipientModel: 'User' | 'Employee'
) => {
  try {
    return await Notification.updateMany(
      { recipient: recipientId, recipientModel, isRead: false },
      { isRead: true }
    );
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Create survey status change notification
export const notifySurveyStatusChange = async (
  surveyId: string,
  status: string,
  changedBy: { id: string, model: 'User' | 'Employee' }
) => {
  try {
    const survey = await Survey.findById(surveyId)
      .populate('assignedTo')
      .populate('userId');
    
    if (!survey) {
      throw new Error('Survey not found');
    }

    let message;
    switch (status) {
      case 'Approved':
        message = `Your survey request #${survey.surveyNumber} has been approved.`;
        break;
      case 'Rejected':
        message = `Your survey request #${survey.surveyNumber} has been rejected.`;
        break;
      case 'Assigned':
        message = `Your survey request #${survey.surveyNumber} has been assigned to an employee.`;
        break;
      case 'In Progress':
        message = `Your survey request #${survey.surveyNumber} is now in progress.`;
        break;
      case 'Completed':
        message = `Your survey request #${survey.surveyNumber} has been completed.`;
        break;
      default:
        message = `Your survey request #${survey.surveyNumber} status has been updated to ${status}.`;
    }

    // Notify the user who owns the survey
    if (survey.userId && survey.userId._id) {
      await createNotification(
        survey.userId._id.toString(),
        'User',
        surveyId,
        'STATUS_UPDATED',
        message,
        { status }
      );
    }

    // If assigned to an employee, notify them as well (except if they made the change)
    if (
      survey.assignedTo && 
      survey.assignedTo._id && 
      !(changedBy.model === 'Employee' && changedBy.id === survey.assignedTo._id.toString())
    ) {
      const employeeMessage = `Survey #${survey.surveyNumber} status has been updated to ${status}.`;
      await createNotification(
        survey.assignedTo._id.toString(),
        'Employee',
        surveyId,
        'STATUS_UPDATED',
        employeeMessage,
        { status }
      );
    }

    return true;
  } catch (error) {
    console.error('Error creating status change notification:', error);
    throw error;
  }
};

// Create new remark notification
export const notifyNewRemark = async (
  surveyId: string,
  remarkId: string,
  authorId: string,
  authorModel: 'User' | 'Employee'
) => {
  try {
    const survey = await Survey.findById(surveyId)
      .populate('assignedTo')
      .populate('userId');
    
    if (!survey) {
      throw new Error('Survey not found');
    }

    // Find the specific remark
    const remark = survey.remarks.id(remarkId);
    if (!remark) {
      throw new Error('Remark not found');
    }

    const authorName = remark.createdByName;
    const message = `New remark from ${authorName} on survey #${survey.surveyNumber}`;

    // Notify user if remark was added by an employee or admin
    if (survey.userId && authorModel !== 'User') {
      await createNotification(
        survey.userId._id.toString(),
        'User',
        surveyId,
        'NEW_REMARK',
        message,
        { remarkId }
      );
    }

    // Notify assigned employee if remark was added by user or admin
    if (
      survey.assignedTo && 
      survey.assignedTo._id && 
      authorModel !== 'Employee'
    ) {
      await createNotification(
        survey.assignedTo._id.toString(),
        'Employee',
        surveyId,
        'NEW_REMARK',
        message,
        { remarkId }
      );
    }

    return true;
  } catch (error) {
    console.error('Error creating new remark notification:', error);
    throw error;
  }
};