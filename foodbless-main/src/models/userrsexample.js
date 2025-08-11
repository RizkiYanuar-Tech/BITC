const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllUsers = () => {
    // const SQLQuery = 'SELECT * FROM users';
    const SQLQuery = 'SELECT id, name, email, address, CONCAT("/assets/", photo) AS photo FROM users';

    return dbPool.execute(SQLQuery);
}

// const createNewUser = (body) => {
//     const SQLQuery = `  INSERT INTO users (name, email, address, photo) 
//                         VALUES ('${body.name}', '${body.email}', '${body.address}', '${body.photo}')`;

//     return dbPool.execute(SQLQuery);
// }

const createNewUser = async (body) => {
    const { name, email, address, password, photo } = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const SQLQuery = `INSERT INTO users (name, email, address, password, photo) 
                      VALUES (?, ?, ?, ?, ?)`;
    const values = [name, email, address, hashedPassword, photo];

    return dbPool.execute(SQLQuery, values);
}

const authenticateUser = async (body) => {
    // const { email,  password } = body;
    console.log(body.email, body.password);
    if (!body.email || !body.password) {
        throw new Error('Email dan password harus diisi');
    }

    const SQLQuery = 'SELECT id, name, email, password FROM users WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [body.email]);

    if (rows.length === 0) {
        throw new Error('User not found');
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    return token;
}


const updateUser = (body, idUser) => {
    const SQLQuery = `  UPDATE users 
                        SET name='${body.name}', email='${body.email}', address='${body.address}' 
                        WHERE id=${idUser}`;

    return dbPool.execute(SQLQuery);
}

const deleteUser = (idUser) => {
    const SQLQuery = `DELETE FROM users WHERE id=${idUser}`;

    return dbPool.execute(SQLQuery);
}

const getUserByEmail = async (email) => {
    const SQLQuery = 'SELECT id, name, email, address FROM users WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [email]);

    if (rows.length === 0) {
        throw new Error('User not found');
    }

    return rows[0];
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    authenticateUser,
}