const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllFoods = () => {
    const SQLQuery = `
        SELECT 
            food.id, 
            food.seller_id, 
            food.seller_city_id, 
            food.name, 
            food.price, 
            food.stock, 
            food.status, 
            CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", food.photo) AS photo, 
            food.description, 
            food.expireDate, 
            food.pickUpTimeStart, 
            food.pickUpTimeEnd, 
            food.createdAt, 
            food.updatedAt,
            seller.name AS seller_name
        FROM 
            food
        INNER JOIN 
            seller 
        ON 
            food.seller_id = seller.id_seller;
    `;

    return dbPool.execute(SQLQuery);
}


const getReadyFoods = () => {
    const SQLQuery = 'SELECT id, seller_id, seller_city_id, name, price, stock, status, CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", photo) AS photo, description, expireDate, pickUpTimeStart, pickUpTImeEnd, createdAt, updatedAt FROM food WHERE status = 1';

    return dbPool.execute(SQLQuery);
}


const getUnReadyFoods = () => {
    const SQLQuery = 'SELECT id, seller_id, seller_city_id, name, price, stock, status, CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", photo) AS photo, description, expireDate, pickUpTimeStart, pickUpTImeEnd,  createdAt, updatedAt FROM food WHERE status = 0';

    return dbPool.execute(SQLQuery);
}

const createNewFood = async (body) => {
    const {
        seller_id,
        seller_city_id,
        name,
        price,
        stock,
        photo,
        description,
        expireDate,
        pickUpTimeStart,
        pickUpTimeEnd,
        token
    } = body;

    const decodedToken = jwt.verify(token, jwtSecret);
    const foodId = nanoid(16);
    const createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = createdAt;
    const status = true;

    const SQLQuery = `INSERT INTO food (id, seller_id, seller_city_id, name, price, stock, status, photo, description, expireDate, pickUpTimeStart, pickUpTimeEnd, createdAt, updatedAt) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        foodId,
        seller_id || null,
        seller_city_id || null,
        name || null,
        price || null,
        stock || null,
        status,
        photo || null,
        description || null,
        expireDate || null,
        pickUpTimeStart || null,
        pickUpTimeEnd || null,
        createdAt,
        updatedAt
    ];

    return dbPool.execute(SQLQuery, values);
};

const deleteFood = async (foodData) => {
    const { id, seller_id, token } = foodData;
    const food = await getFoodById(id);
    const decodedToken = jwt.verify(token, jwtSecret);

    if (food.seller_id != seller_id) {
        throw new Error('Anda tidak memiliki izin untuk menghapus data makanan ini');
    }

    const SQLQuery = `DELETE FROM food WHERE id=?`;
    const [result] = await dbPool.execute(SQLQuery, [id]);

    if (result.affectedRows === 0) {
        throw new Error('Data makanan tidak ditemukan');
    }

    return { message: 'Data makanan berhasil dihapus' };
}


const getFoodById = async (id) => {
    console.log(id);
    const SQLQuery = 'SELECT id, seller_id, seller_city_id, name, price, stock, status, CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", photo) AS photo, description, expireDate, pickUpTimeStart, pickUpTimeEnd,  createdAt, updatedAt FROM food WHERE id=?';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Data Makanan Tidak Ditemukan');
    }
    console.log(rows[0]);
    return rows[0];
}

const getFoodByIdToUpdate = async (id) => {
    console.log(id);
    const SQLQuery = 'SELECT id, seller_id, seller_city_id, name, price, stock, status, photo, description, expireDate, pickUpTimeStart, pickUpTimeEnd,  createdAt, updatedAt FROM food WHERE id=?';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Data Makanan Tidak Ditemukan');
    }
    console.log(rows[0]);
    return rows[0];
}

const getFoodBySellerId = async (seller_id) => {
    const SQLQuery = 'SELECT id, seller_id, seller_city_id, name, price, stock, status, CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", photo) AS photo, description, expireDate, pickUpTimeStart, pickUpTImeEnd,  createdAt, updatedAt FROM food WHERE seller_id=?';
    const [rows, _] = await dbPool.execute(SQLQuery, [seller_id]);

    if (rows.length === 0) {
        throw new Error('Data Makanan Tidak Ditemukan');
    }
    // console.log(rows[0]);
    // return rows[0];

    return [rows, _]
}
// const getFoodById = async (id) => {
//     const [rows] = await dbPool.query('SELECT * FROM food WHERE id = ?', [id]);
//     return rows[0];
// };

const updateFood = async (foodData) => {
    const {
        id,
        seller_id,
        status,
        description,
        expireDate,
        pickUpTimeStart,
        pickUpTimeEnd,
        token,
        price,
        stock,
        name,
        photo
    } = foodData;

    // Replace undefined values with null
    const safeValues = {
        id,
        seller_id,
        status: status || null,
        description: description || null,
        expireDate: expireDate || null,
        pickUpTimeStart: pickUpTimeStart || null,
        pickUpTimeEnd: pickUpTimeEnd || null,
        token,
        price: price || null,
        stock: stock || null,
        name: name || null,
        photo: photo || null
    };

    const food = await getFoodById(id);
    const decodedToken = jwt.verify(token, jwtSecret);
    const updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    if (food.seller_id !== seller_id) {
        throw new Error('Anda tidak memiliki izin untuk update data makanan ini');
    }

    const SQLQuery = `UPDATE food SET name=?, price=?, stock=?, status=?, description=?, expireDate=?, pickUpTimeStart=?, pickUpTimeEnd=?, updatedAt=?, photo=? WHERE id=?`;
    const [result] = await dbPool.execute(SQLQuery, [
        safeValues.name,
        safeValues.price,
        safeValues.stock,
        safeValues.status,
        safeValues.description,
        safeValues.expireDate,
        safeValues.pickUpTimeStart,
        safeValues.pickUpTimeEnd,
        updatedAt,
        safeValues.photo,
        safeValues.id
    ]);

    if (result.affectedRows === 0) {
        throw new Error('Data makanan tidak ditemukan');
    }

    return { message: 'Data makanan berhasil diperbaharui' };
};


const updateFoodByOrderFood = async (foodData) => {
    const { food_id, amount } = foodData;
    const food = await getFoodById(food_id);
    const newStock = food.stock - amount;
    let newStatus = food.status;

    if (newStock === 0) {
        newStatus = 0;
    }

    const SQLQuery = `UPDATE food SET stock=?, status=? WHERE id=?`;
    const [result] = await dbPool.execute(SQLQuery, [newStock, newStatus, food_id]);
};

const updateFoodIfCancelBySeller = async (foodData) => {
    const { food_id, amount } = foodData;
    const food = await getFoodById(food_id);
    const newStock = food.stock + amount;
    let newStatus = food.status;

    if (newStock === 0) {
        newStatus = 0;
    }

    const SQLQuery = `UPDATE food SET stock=?, status=? WHERE id=?`;
    const [result] = await dbPool.execute(SQLQuery, [newStock, newStatus, food_id]);
};


module.exports = {
    getAllFoods,
    createNewFood,
    updateFood,
    deleteFood,
    getFoodById,
    updateFoodByOrderFood,
    getReadyFoods,
    getUnReadyFoods,
    getFoodBySellerId,
    updateFoodIfCancelBySeller,
    getFoodByIdToUpdate
}