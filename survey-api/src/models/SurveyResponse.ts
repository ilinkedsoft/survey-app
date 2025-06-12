import { DataTypes, Model, ModelStatic } from "sequelize";
import sequelize from "../config/database";

class SurveyResponse extends Model {
    public static associate(models: { [key: string]: ModelStatic<Model> }) {
        SurveyResponse.belongsTo(models.SurveySubmission, {
            foreignKey: 'submissionId',
            as: 'responses'
        });
        SurveyResponse.belongsTo(models.Question, {
            foreignKey: 'questionId',
            as: 'question'
        });
    }
}

SurveyResponse.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    submissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'survey_submissions',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    answer: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'survey_responses'
});

export default SurveyResponse;