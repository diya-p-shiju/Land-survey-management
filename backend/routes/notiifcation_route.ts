// routes/notification_routes.ts
import { Router } from 'express';
import Notification from '../models/notification_model';

const notificationRouter = Router();

// Get notifications for a user or employee
notificationRouter.get('/', async (req, res) => {
  try {
    const { userId, userType = 'User', limit = 20, skip = 0, unread = false } = req.query;
    
    if (!userId) {
      return res.status(400).send("UserId is required");
    }
    
    const query: any = {
      recipient: userId,
      recipientModel: userType
    };
    
    if (unread === 'true') {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('surveyId', 'name surveyNumber');
    
    const count = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false
    });
    
    res.json({
      notifications,
      count,
      unreadCount
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Mark a notification as read
notificationRouter.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).send("Notification not found");
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Mark all notifications as read for a user
notificationRouter.patch('/read-all', async (req, res) => {
  try {
    const { userId, userType = 'User' } = req.body;
    
    if (!userId) {
      return res.status(400).send("UserId is required");
    }
    
    const result = await Notification.updateMany(
      {
        recipient: userId,
        recipientModel: userType,
        isRead: false
      },
      { isRead: true }
    );
    
    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default notificationRouter;