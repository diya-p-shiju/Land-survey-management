// In your survey_model.ts file

import mongoose from "mongoose";

// Define remarkSchema FIRST, before using it in surveySchema
const remarkSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        refPath: 'createdByModel'
    },
    createdByModel: {
        type: String,
        required: true,
        enum: ['User', 'Employee']
    },
    createdByName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// THEN define your surveySchema that uses remarkSchema
const surveySchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    thaluk: { type: String, required: true },
    surveyNumber: { type: String, required: true },
    surveyType: { 
        type: String, 
        required: true, 
        enum: [
            'Land Survey',
            'Road Survey',
            'Building Survey', 
            'Leveling Survey', 
            'Topographical Survey', 
            'Contour Survey', 
            'Quantity Survey', 
            'Real Estate Projects'
        ]
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: false
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    approved: { type: Boolean, required: false, default: false },
    remarks: [remarkSchema]  // Using remarkSchema here
}, { timestamps: true });

// Virtual for sorted remarks
surveySchema.virtual('sortedRemarks').get(function() {
    return this.remarks.sort((a, b) => b.createdAt - a.createdAt);
});

// Ensure virtuals are included when converting to JSON
surveySchema.set('toJSON', { virtuals: true });
surveySchema.set('toObject', { virtuals: true });

export default mongoose.model("Survey", surveySchema);