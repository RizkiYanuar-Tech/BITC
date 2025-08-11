const dbPool = require('../config/database');

// Mendapatkan semua jawaban survey
const getAllSurveyResponses = () => {
    const SQLQuery = 'SELECT * FROM survey_responses';
    return dbPool.execute(SQLQuery);
};

// Mendapatkan jawaban survey berdasarkan ID pertanyaan
const getSurveyResponsesByQuestionId = async (questions_id) => {
    const SQLQuery = 'SELECT answer, COUNT(*) as count FROM survey_responses WHERE questions_id = ? GROUP BY answer';
    const [rows] = await dbPool.execute(SQLQuery, [questions_id]);
    return rows;
};

// Menambah jawaban survey baru
const createSurveyResponse = async ({ responden_id, questions_id, answer }) => {
    const SQLQuery = `
        INSERT INTO survey_responses (responden_id, questions_id, answer) 
        VALUES (?, ?, ?)
    `;
    return dbPool.execute(SQLQuery, [responden_id, questions_id, answer]);
};

module.exports = {
    getAllSurveyResponses,
    getSurveyResponsesByQuestionId,
    createSurveyResponse
};
