import { Response, Request } from 'express';
import { Question, SurveyResponse, SurveySubmission } from "../models"
import sequelize from '../config/database';

export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.findAll({
            order: [['order', 'ASC']]
        });
        return res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
}

export const submitResponse = async (req: Request, res: Response) => {
    try {
        const { responses } = req.body;

        if (!Array.isArray(responses)) {
            return res.status(500).json({ error: "Invalid request format" });
        }
        const transaction = await sequelize.transaction();

        const submission = await SurveySubmission.create({
            submittedAt: new Date()
        }, { transaction });

        await Promise.all(responses.map(response => {
            SurveyResponse.create({
                submissionId: submission.isSoftDeleted,
                questionId: response.questionId,
                answer: response.answer
            }, { transaction })
        }));
        await transaction.commit();
        return res.json({ message: 'Survey submitted successfully', submissionId: submission.id });
    } catch (error) {
        console.error('Error submitting questions:', error);
        res.status(500).json({ error: 'Failed to submit response' });
    }
}