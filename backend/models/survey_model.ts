import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    thaluk:{type:String,required:true},
    surveyNumber :{type:String,required:true},
    surveyType:{type:String,required:true, enum:['Land Survey','Road Survey','Building Survey', 'Leveling Survey', 'Topographical Survey', 'Contour Survey', 'Quantity Survey', 'Real Estate Projects']},
    approved:{type:Boolean,required:false,default:false},
});

export default mongoose.model("Survey", surveySchema);