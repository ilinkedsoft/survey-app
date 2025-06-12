import { Router, Request, Response, RequestHandler } from 'express';
import { getQuestions, submitResponse } from '../controllers/survey.controller';

const router = Router();

router.get('/questions', getQuestions as RequestHandler);
router.post('/submit', submitResponse as RequestHandler);

export default router;
