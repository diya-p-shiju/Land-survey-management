import survey_model from "../models/survey_model";
import { Request, RequestHandler, Response } from "express";

// Create a new survey

export const createSurvey = async (req: Request, res: Response) => {
    try {
        const survey = new survey_model(req.body);
        await survey.save();
        res.status(201).send(survey);
    } catch (error) {
        res.status(400).send(error);
    }
};


export const getSurveys = async (req: Request, res: Response) => {
    try {
        const surveys = await survey_model.find({});
        res.status(200).send(surveys);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }   


}

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
}

export const updateSurvey = async (req: Request, res: Response) => {
    try {
        const survey = await survey_model.findByIdAndUpdate(req.params.id, req.body, { new: true });    
        if (!survey) {
            return res.status(404).send("Survey not found");
        }
        res.status(200).send(survey);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }       
}

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
}