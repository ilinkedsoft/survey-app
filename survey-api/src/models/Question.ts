import { DataTypes, Model, ModelStatic } from "sequelize";
import sequelize from "../config/database";

class Question extends Model {
    public static associate(models: { [key: string]: ModelStatic<Model> }) {
        Question.hasMany(models.SurveyResponse, {
            foreignKey: 'questionId',
            as: 'responses'
        });
    }
}

Question.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      options: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
}, {
    sequelize,
    tableName: 'questions'
})

export default Question;
