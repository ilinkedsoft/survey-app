import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import surveyRoutes from './routes/survey.route';
import './models'; // Import models to initialize associations and sync database

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.use('/api/survey', surveyRoutes);

//Start server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
