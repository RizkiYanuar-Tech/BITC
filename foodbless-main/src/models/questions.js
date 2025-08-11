const dbPool = require("../config/database");

// Mendapatkan semua pertanyaan
const getAllQuestions = () => {
  const SQLQuery = "SELECT * FROM pertanyaan";
  return dbPool.execute(SQLQuery);
};

// Menambah pertanyaan baru
const createQuestion = async (pertanyaan) => {
  const SQLQuery = `INSERT INTO pertanyaan (pertanyaan) VALUES (?)`;
  return dbPool.execute(SQLQuery, [pertanyaan]);
};

const getStatistik = async () => {
  const SQLQuery = `
        SELECT 
            pertanyaan.id,
            pertanyaan.pertanyaan,
            SUM(CASE WHEN jawaban.jawaban = 0 THEN 1 ELSE 0 END) AS sangat_sesuai,
            SUM(CASE WHEN jawaban.jawaban = 1 THEN 1 ELSE 0 END) AS sesuai,
            SUM(CASE WHEN jawaban.jawaban = 2 THEN 1 ELSE 0 END) AS kurang_sesuai
        FROM 
            pertanyaan
        LEFT JOIN 
            jawaban ON pertanyaan.id = jawaban.id_pertanyaan
        GROUP BY 
            pertanyaan.id;
    `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
};

module.exports = {
  getAllQuestions,
  createQuestion,
  getStatistik,
};
