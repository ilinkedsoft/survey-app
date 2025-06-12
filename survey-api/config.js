require('dotenv').config();

module.exports = {
    development: {
        username: 'postgres',
        password: 'postgres',
        database: 'survey_db',
        host: 'localhost',
        port: '5432',
        dialect: 'postgres',
        logging: false
    }
};