const dbPool = require('../config/database');

const getAllProvincies = () => {
    const SQLQuery = 'SELECT * FROM province';

    return dbPool.execute(SQLQuery);
}

const getProvinceById = async (id) => {
    const SQLQuery = 'SELECT * FROM province WHERE id=?';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Kota Tidak Ditemukan');
    }

    return rows[0];
}

module.exports = {
    getAllProvincies,
    getProvinceById,
}