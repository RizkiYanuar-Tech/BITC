const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllAdmins = () => {
    const SQLQuery = 'SELECT id, name, email, address, latitude, longitude FROM admin';

    return dbPool.execute(SQLQuery);
}


const createNewAdmin = async (body) => {
    const { username, email, password, confirmPassword, role, photo} = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (body.password != body.confirmPassword) {
        throw new Error('password dan konfirmasi password tidak sama!!!');
    }

    const checkEmailQuery = 'SELECT email FROM user WHERE email = ?';
    const [existingUsers] = await dbPool.execute(checkEmailQuery, [email]);

    if (existingUsers.length > 0) {
        throw new Error('Email sudah digunakan!');
    }
    
    const user_id = nanoid(16);
    const createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = createdAt;
    const SQLQueryUser = `INSERT INTO user (user_id, username, email, 
                                        password, role , createdAt, updatedAt, photo ) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const valuesUser = [user_id, username, email, hashedPassword, role, createdAt, updatedAt, photo];
    dbPool.execute(SQLQueryUser, valuesUser);
}

const authenticateAdmin = async (body) => {
    
    console.log(body.email, body.password);
    if (!body.email || !body.password) {
        throw new Error('Email dan password harus diisi');
    }
    const SQLQuery = 'SELECT user_id, username, email, password, role, createdAt, updatedAt, CONCAT("/assets/", photo) AS photo FROM user WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [body.email]);
    if (rows.length === 0) {
        throw new Error('Admin Tidak Ditemukan');
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, admin.password);

    if (!isPasswordValid) {
        throw new Error('Password Tidak Valid!');
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, { expiresIn: '1h' });
    return token;
}


const updateAdmin = (body, idAdmin) => {
    const SQLQuery = `  UPDATE admin 
                        SET name='${body.name}', email='${body.email}', address='${body.address}' 
                        WHERE id=${idAdmin}`;

    return dbPool.execute(SQLQuery);
}

const deleteAdmin = (idAdmin) => {
    const SQLQuery = `DELETE FROM admin WHERE id=${idAdmin}`;

    return dbPool.execute(SQLQuery);
}

const getAdminByEmail = async (email) => {
    const SQLQuery = 'SELECT * FROM user WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [email]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

module.exports = {
    getAllAdmins,
    createNewAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminByEmail,
    authenticateAdmin,
}