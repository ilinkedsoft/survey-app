import sequelize from "../config/database";
import Question from "./Question";
import SurveyResponse from "./SurveyResponse";
import SurveySubmission from "./SurveySubmission";

const models = {
    Question,
    SurveySubmission,
    SurveyResponse,
};

// Initialize associations
Object.values(models).forEach((model: any) => {
    if (model.associate) {
        model.associate(models);
    }
});


// Sync all models with database
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized');
}).catch((error: any) => {
    console.error('Error syncronizing database: ', error);
});

export { 
    Question,
    SurveyResponse,
    SurveySubmission
};
