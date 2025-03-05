import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: false },
    designation: { type: String, required: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);

// 2. Next, create a Remark schema for the conversation thread
// This will be embedded in the Survey model
const remarkSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        // This refers to either User, Employee, or Admin
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