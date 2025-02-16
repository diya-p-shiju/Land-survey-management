import {Router} from 'express';
import {getSurvey,createSurvey,getSurveys,updateSurvey,deleteSurvey} from '../controllers/survey_controller';

const surveyRouter = Router();

surveyRouter.get('/', getSurveys);
surveyRouter.post('/', createSurvey);
surveyRouter.get('/:id', getSurvey);
surveyRouter.put('/:id', updateSurvey);
surveyRouter.delete('/:id', deleteSurvey);


export default surveyRouter;