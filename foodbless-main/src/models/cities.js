const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllCities = () => {
    const SQLQuery = 'SELECT * FROM city';

    return dbPool.execute(SQLQuery);
}


const getCityById = async (id) => {
    const SQLQuery = 'SELECT * FROM city WHERE id=?';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Kota Tidak Ditemukan');
    }

    return rows[0];
}

const getCityByProvinceId = async (provinceId) => {
    const SQLQuery = 'SELECT * FROM city WHERE provinceId=?';
    const [rows, _] = await dbPool.execute(SQLQuery, [provinceId]);

    if (rows.length === 0) {
        throw new Error('Kota Tidak Ditemukan');
    }

    return rows; 
}

module.exports = {
    getAllCities,
    getCityById,
    getCityByProvinceId,
}