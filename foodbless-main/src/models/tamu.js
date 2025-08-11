const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllTamu = () => {
    const SQLQuery = 'SELECT * FROM guest';
    return dbPool.execute(SQLQuery);
};

const getTamuById = async (id) => {
    const SQLQuery = 'SELECT * FROM guest WHERE id = ?';
    const [rows] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Data tamu tidak ditemukan');
    }

    return rows[0];
};

const createTamu = async (body) => {
    const {
        nama,
        telepon,
        keperluan,
        dituju
    } = body;

    console.log("Data tamu baru:", body);  // Tambahkan ini untuk debugging

    const tamuId = nanoid(16);
    const waktu = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    const SQLQuery = `INSERT INTO guest (nama, telepon, keperluan, tujuan, waktu) 
                      VALUES (?, ?, ?, ?, ?)`;
    const values = [
        nama || null,
        telepon || null,
        keperluan || null,
        dituju || null,
        waktu
    ];

    return dbPool.execute(SQLQuery, values);
};

const deleteTamu = async (id) => {
    // const { id } = id;
    const tamu = await getTamuById(id);

    if (id !== id) {
        throw new Error('Anda tidak memiliki izin untuk menghapus data tamu ini');
    }

    const SQLQuery = `DELETE FROM guest WHERE id = ?`;
    const [result] = await dbPool.execute(SQLQuery, [id]);

    if (result.affectedRows === 0) {
        throw new Error('Data tamu tidak ditemukan');
    }

    return { message: 'Data tamu berhasil dihapus' };
};

const updateTamu = (tamuData) => {
    const SQLQuery = `  UPDATE guest 
                        SET nama='${tamuData.nama}', telepon='${tamuData.telepon}', keperluan='${tamuData.keperluan}', tujuan='${tamuData.dituju}'
                        WHERE id=${tamuData.id}`;

    return dbPool.execute(SQLQuery);
}

const updateComplain = (tamuData) => {
    const SQLQuery = `  UPDATE guest 
                        SET nama='${tamuData.nama}', telepon='${tamuData.telepon}', keperluan='${tamuData.keperluan}', tujuan='${tamuData.dituju}'
                        WHERE id=${tamuData.id}`;

    return dbPool.execute(SQLQuery);
}

const updateTamuStatus = (id, status) => {
    const SQLQuery = `UPDATE guest SET status = ? WHERE id = ?`; // Query SQL untuk update status
    return dbPool.execute(SQLQuery, [status, id]);
  };
  
  // Fungsi untuk mendapatkan tamu berdasarkan status
  const getTamuByStatus = (status) => {
    const SQLQuery = `SELECT * FROM guest WHERE status = ?`; // Query SQL untuk mendapatkan tamu berdasarkan status
    return dbPool.execute(SQLQuery, [status]);
  };
  
// Fungsi untuk mendapatkan data kunjungan per bulan
const getVisitData = () => {
    const SQLQuery = `
      SELECT MONTH(waktu) AS bulan, COUNT(*) AS total
      FROM guest
      WHERE YEAR(waktu) = YEAR(CURDATE())
      GROUP BY MONTH(waktu)
    `;
    return dbPool.execute(SQLQuery);
  };
  
  // Fungsi untuk mendapatkan 10 tamu terbaru
  const getLatestVisitors = () => {
    const SQLQuery = `
      SELECT nama, telepon, keperluan, tujuan, waktu, status
      FROM guest
      ORDER BY waktu DESC
      LIMIT 10
    `;
    return dbPool.execute(SQLQuery);
};

  
  module.exports = {
    getAllTamu,
    createTamu,
    deleteTamu,
    updateTamuStatus,
    getTamuByStatus,
    getVisitData,          // Tambahkan ini
    getLatestVisitors      // Tambahkan ini
  };
  
  
