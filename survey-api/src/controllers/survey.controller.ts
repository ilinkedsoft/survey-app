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
    const { responses } = req.body;

    if (!Array.isArray(responses)) {
        return res.status(400).json({ error: "Invalid request format" });
    }

    const transaction = await sequelize.transaction();

    try {
        // Create the submission first
        const submission = await SurveySubmission.create({
            submittedAt: new Date()
        }, { transaction });

        // Create all responses in parallel
        const responsePromises = responses.map(response => 
            SurveyResponse.create({
                submissionId: submission.id, // Fixed: using submission.id instead of isSoftDeleted
                questionId: response.questionId,
                answer: response.answer
            }, { transaction })
        );

        await Promise.all(responsePromises);
        
        // Commit the transaction
        await transaction.commit();
        
        return res.json({ 
            message: 'Survey submitted successfully', 
            submissionId: submission.id 
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error('Error submitting survey:', error);
        res.status(500).json({ 
            error: 'Failed to submit survey response',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}