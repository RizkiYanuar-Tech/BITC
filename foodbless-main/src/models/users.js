const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllUsers = () => {
    const SQLQuery = 'SELECT id, name, email, address, latitude, longitude FROM user';

    return dbPool.execute(SQLQuery);
}

const createNewUser = async (body) => {
    const { email, password, name,provinceId, cityId, address, latitude, longitude } = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userId = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const SQLQuery = `INSERT INTO user (id, email, 
                                        password, name,provinceId, cityId, 
                                        address, latitude, 
                                        longitude, createdAt, updatedAt ) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [userId, email, hashedPassword, name,provinceId, cityId, address, latitude, longitude, createdAt, updatedAt];
    return dbPool.execute(SQLQuery, values);
}

const authenticateUser = async (body) => {
    
    console.log(body.email, body.password);
    if (!body.email || !body.password) {
        throw new Error('Email dan password harus diisi');
    }
    const SQLQuery = 'SELECT user_id, username, email, password, role FROM user WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [body.email]);
    if (rows.length === 0) {
        throw new Error('User Tidak Ditemukan');
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
        throw new Error('Password Tidak Valid!');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1d' });
    return token;
}



const deleteUser = (idSeller) => {
    const SQLQuery = `DELETE FROM seller WHERE id=${idSeller}`;

    return dbPool.execute(SQLQuery);
}

const getUserByEmail = async (email) => {
    const SQLQuery = 'SELECT * FROM user WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [email]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

const getUserById = async (id) => {
    const SQLQuery = 'SELECT * FROM user WHERE user_id = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}
const checkRoleUserByEmail = async (email) => {
    const SQLQuery = 'SELECT user_id, username, email, password, role FROM user WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [email]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

const getCustomerDataById = async (user_id) => {
    const SQLQuery = `
        SELECT 
            c.id_cust, 
            c.name AS customer_name, 
            c.nomorWA, 
            c.address, 
            c.city_id, 
            c.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.password, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", u.photo) AS photo
        FROM 
            customer c
        INNER JOIN 
            user u ON c.user_user_id = u.user_id
        WHERE 
            u.user_id = ?`;
    const [rows, _] = await dbPool.execute(SQLQuery, [user_id]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

const getCustomerDataByIdForUpdate = async (user_id) => {
    const SQLQuery = `
        SELECT 
            c.id_cust, 
            c.name AS customer_name, 
            c.nomorWA, 
            c.address, 
            c.city_id, 
            c.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.password, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            u.photo
        FROM 
            customer c
        INNER JOIN 
            user u ON c.user_user_id = u.user_id
        WHERE 
            u.user_id = ?`;
    const [rows, _] = await dbPool.execute(SQLQuery, [user_id]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

const getSellerDataById = async (user_id) => {
    const SQLQuery = `
        SELECT 
            s.id_seller, 
            s.name, 
            s.desc,
            s.nomorWA, 
            s.address, 
            s.city_id, 
            s.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.password, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", u.photo) AS photo
        FROM 
            seller s 
        INNER JOIN 
            user u ON s.user_user_id = u.user_id
        WHERE 
            u.user_id = ?`;
    const [rows, _] = await dbPool.execute(SQLQuery, [user_id]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

const getSellerDataByIdForUpdate = async (user_id) => {
    const SQLQuery = `
        SELECT 
            s.id_seller, 
            s.name, 
            s.desc,
            s.nomorWA, 
            s.address, 
            s.city_id, 
            s.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.password, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            u.photo
        FROM 
            seller s 
        INNER JOIN 
            user u ON s.user_user_id = u.user_id
        WHERE 
            u.user_id = ?`;
    const [rows, _] = await dbPool.execute(SQLQuery, [user_id]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}



const getAdminDataById = async (user_id) => {
    const SQLQuery = 'SELECT user_id, username, email, password, role, createdAt, updatedAt, CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", photo) AS photo FROM user WHERE user_id = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [user_id]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

const getAllUserCustomers = async () => {
    const SQLQuery = `
        SELECT 
            c.id_cust, 
            c.name AS customer_name, 
            c.nomorWA, 
            c.address, 
            c.city_id, 
            c.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.password, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", u.photo) AS photo
        FROM 
            customer c
        INNER JOIN 
            user u ON c.user_user_id = u.user_id
        WHERE 
            u.role = 'customer'`;
    const [rows, _] = await dbPool.execute(SQLQuery);
    return rows; // Return the entire array of rows
};

const getAllUserSellers = async () => {
    const SQLQuery = `
        SELECT 
            s.id_seller, 
            s.name AS seller_name, 
            s.desc,
            s.nomorWA, 
            s.address, 
            s.city_id, 
            s.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.password, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", u.photo) AS photo
        FROM 
            seller s
        INNER JOIN 
            user u ON s.user_user_id = u.user_id
        WHERE 
            u.role = 'seller'`;
    const [rows, _] = await dbPool.execute(SQLQuery);
    return rows; 
};

const updateDataSeller = async (data) => {
    const { user_id, id_seller, username, email, password, name, desc, nomorWA, address, city_id, city_province_id, photo } = data;
    const updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const SQLQuery = `
        UPDATE seller s
        INNER JOIN user u ON s.user_user_id = u.user_id
        SET 
            u.username = ?,
            u.email = ?,
            u.password = ?,
            s.name = ?,
            s.desc = ?,
            s.nomorWA = ?,
            s.address = ?,
            s.city_id = ?,
            s.city_province_id = ?,
            u.photo = ?,
            u.updatedAt = ?
        WHERE u.user_id = ? AND s.id_seller = ?`;

    const values = [username, email, password, name, desc, nomorWA, address, city_id, city_province_id, photo, updatedAt, user_id, id_seller];

    const [result] = await dbPool.execute(SQLQuery, values);

    if (result.affectedRows === 0) {
        throw new Error('Update data seller gagal');
    }

    return { status: 200,
        message: 'Data seller berhasil diperbarui' };
};

const updateDataCustomer = async (data) => {
    const { user_id, id_cust, username, email, password, name, nomorWA, address, city_id, city_province_id, photo } = data;
    const updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const SQLQuery = `
        UPDATE customer c
        INNER JOIN user u ON c.user_user_id = u.user_id
        SET 
            u.username = ?,
            u.email = ?,
            u.password = ?,
            c.name = ?,
            c.nomorWA = ?,
            c.address = ?,
            c.city_id = ?,
            c.city_province_id = ?,
            u.photo = ?,
            u.updatedAt = ?
        WHERE u.user_id = ? AND c.id_cust = ?`;

    const values = [username, email, password, name, nomorWA, address, city_id, city_province_id, photo, updatedAt, user_id, id_cust];

    const [result] = await dbPool.execute(SQLQuery, values);

    if (result.affectedRows === 0) {
        throw new Error('Update data customer gagal');
    }

    return { status: 200, message: 'Data customer berhasil diperbarui' };
};

module.exports = {
    getAllUsers,
    createNewUser,
    deleteUser,
    getUserByEmail,
    getUserById,
    authenticateUser,
    checkRoleUserByEmail,
    getCustomerDataById,
    getSellerDataById,
    getAdminDataById,
    getAllUserCustomers,
    getAllUserSellers,
    updateDataSeller,
    updateDataCustomer,
    getCustomerDataByIdForUpdate,
    getSellerDataByIdForUpdate
}