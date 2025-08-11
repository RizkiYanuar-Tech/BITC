const dbPool = require('../config/database');

// Mendapatkan semua responden
const getAllRespondents = async () => {
    const SQLQuery = 'SELECT * FROM responden';
    return dbPool.execute(SQLQuery);
};

// Mendapatkan responden berdasarkan ID
const getRespondentById = async (id) => {
    const SQLQuery = 'SELECT * FROM responden WHERE id = ?';
    const [rows] = await dbPool.execute(SQLQuery, [id]);
    return rows;
};

// Menambah responden baru
const createRespondent = async ({ nama, jenis_kelamin, umur, posisi }) => {
    const SQLQuery = `
        INSERT INTO responden (nama, jenis_kelamin, umur, posisi) 
        VALUES (?, ?, ?, ?)
    `;
    return dbPool.execute(SQLQuery, [nama, jenis_kelamin, umur, posisi]);
};

const createJawaban = async ({ id_pertanyaan, jawaban }) => {
    const SQLQuery = `
        INSERT INTO jawaban (id_pertanyaan, jawaban) 
        VALUES (?, ?)
    `;
    return dbPool.execute(SQLQuery, [id_pertanyaan, jawaban]);
};


// Menghapus responden berdasarkan ID
const deleteRespondent = async (id) => {
    const SQLQuery = 'DELETE FROM responden WHERE id = ?';
    return dbPool.execute(SQLQuery, [id]);
};

// Memperbarui data responden
const updateRespondent = async ({ id, nama, jenis_kelamin, umur, pendidikan }) => {
    const SQLQuery = `
        UPDATE responden 
        SET nama = ?, jenis_kelamin = ?, umur = ?, pendidikan = ?
        WHERE id = ?
    `;
    return dbPool.execute(SQLQuery, [nama, jenis_kelamin, umur, pendidikan, id]);
};

module.exports = {
    getAllRespondents,
    getRespondentById,
    createRespondent,
    deleteRespondent,
    updateRespondent,
    createJawaban
};
