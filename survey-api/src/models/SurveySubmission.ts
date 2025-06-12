import { CreationOptional, DataTypes, Model, ModelStatic } from "sequelize";
import sequelize from "../config/database";

class SurveySubmission extends Model {
    declare id: CreationOptional<number>;
    declare submittedAt: Date;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    public static associate(models: { [key: string]: ModelStatic<Model> }) {
        SurveySubmission.hasMany(models.SurveyResponse, {
            foreignKey: 'submissionId',
            as: 'responses'
        });
    }
}

SurveySubmission.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
}, {
    sequelize,
    tableName: 'survey_submissions'
})

export default SurveySubmission;

