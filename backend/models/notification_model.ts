// models/notification_model.ts
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  // The user or employee who should receive this notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientModel'
  },
  // Whether this is for a User or Employee
  recipientModel: {
    type: String,
    required: true,
    enum: ['User', 'Employee']
  },
  // The survey this notification is about
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  // Type of notification
  type: {
    type: String,
    required: true,
    enum: [
      'SURVEY_SUBMITTED',
      'SURVEY_APPROVED',
      'SURVEY_REJECTED',
      'SURVEY_ASSIGNED',
      'NEW_REMARK',
      'STATUS_UPDATED'
    ]
  },
  // Notification content/message
  message: {
    type: String,
    required: true
  },
  // Optional data payload
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  // Has the notification been read?
  isRead: {
    type: Boolean,
    default: false
  },
  // Timestamps for created and updated
}, { timestamps: true });

// Create indexes for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);