const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllCustomers = () => {
    const SQLQuery = `
        SELECT 
            c.id_cust, 
            c.name, 
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
            user u ON c.user_user_id = u.user_id`;

    return dbPool.execute(SQLQuery);
}


const createNewCustomer = async (body) => {
    const { username, email, password, confirmPassword, role, photo, name, nomorWA, address, city_id, city_province_id, } = body;
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
    

    const id_cust = nanoid(16);
    const user_user_id = user_id;

    const SQLQueryCustomer = `INSERT INTO customer (id_cust, name, nomorWA, 
                                        address, city_id , city_province_id, user_user_id ) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const valuesCustomer = [id_cust, name, nomorWA, address, city_id, city_province_id, user_user_id];
    return dbPool.execute(SQLQueryCustomer, valuesCustomer);
}

const authenticateCustomer = async (body) => {
    
    console.log(body.email, body.password);
    if (!body.email || !body.password) {
        throw new Error('Email dan password harus diisi');
    }
    const SQLQuery = 'SELECT username, email, password FROM user WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [body.email]);
    if (rows.length === 0) {
        throw new Error('User Tidak Ditemukan');
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
        throw new Error('Password Tidak Valid!');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    return token;
}


const updateUser = (body, idSeller) => {
    const SQLQuery = `  UPDATE seller 
                        SET name='${body.name}', email='${body.email}', address='${body.address}' 
                        WHERE id=${idSeller}`;

    return dbPool.execute(SQLQuery);
}

const deleteUser = (idSeller) => {
    const SQLQuery = `DELETE FROM seller WHERE id=${idSeller}`;

    return dbPool.execute(SQLQuery);
}

const getCustomerByEmail = async (email) => {
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
            CONCAT("/assets/", u.photo) AS photo
        FROM 
            customer c
        INNER JOIN 
            user u ON c.user_user_id = u.user_id
        WHERE 
            u.email = ?`;
    const [rows, _] = await dbPool.execute(SQLQuery, [email]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

module.exports = {
    getCustomerByEmail,
}


module.exports = {
    getAllCustomers,
    createNewCustomer,
    updateUser,
    deleteUser,
    getCustomerByEmail,
    authenticateCustomer,
}