const dbPool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const moment = require("moment-timezone");

const saltRounds = 10;
const jwtSecret = "SECRET";

const getAllRoom = () => {
    const SQLQuery = 
    `SELECT 
      ID_Ruangan,
      Type_Ruangan,
      Harga
    from ruangan;
    `
    return dbPool.execute(SQLQuery);
};

const createRoom = async (req, res) => {
  const { Type_Ruangan, Harga } = req.body;

  if (!Type_Ruangan || !Harga) {
    return res.status(400).json({
      error: 'Type_Ruangan dan Harga diperlukan.',
    });
  }

  const SQLCRoom = 'INSERT INTO ruangan ( Type_Ruangan, Harga) VALUES (?, ?, ?)';
  const values = [ Type_Ruangan, Harga];

  try {
    console.log('Executing Query: ', SQLCRoom);
    console.log('With Values: ', values);

    const [roomResult] = await dbPool.execute(SQLCRoom, values);
    const ID_Ruangan = roomResult.insertId;

    res.status(201).json({
      message: 'Ruangan berhasil dibuat.',
      ID_Ruangan,
    });
  } catch (error) {
    console.error('Error saat membuat ruangan:', error);
    res.status(500).json({
      error: 'Gagal menambahkan ruangan. Silakan periksa data dan coba lagi.',
    });
  }
};

const deleteRoom = async (ID_Ruangan) =>{
    const SQLDRoom = `DELETE FROM ruangan where ID_Ruangan = ?`;
    const [result] = await dbPool.execute(SQLDRoom, [ID_Ruangan]);

    if(result.affectedRows === 0){
        throw new Error("Data ruangan tidak ditemukan");
    }
    return {message: "Data ruangan berhasil dihapus"};
};

const updateRoom = async (RoomData) => {
    const SQLURoom = `UPDATE ruangan 
                      Set Type_Ruangan = ?, 
                      Harga = ?
                      WHERE ID_Ruangan = ?`;
    const values = [RoomData.Type_Ruangan, RoomData.Harga, RoomData.ID_Ruangan];

    return await dbPool.execute(SQLURoom, values);
};

//Ruang Rapat
const getAllRoomMeeting = () =>{
  const SQLRMQuery = 
  `select
   ID_Meeting,
   Nama_Ruangan,
   Harga
  from ruangan_meeting;
  `
  return dbPool.execute(SQLRMQuery);
}

const createRoomMeeting = async (req, res) => {
  const { Nama_Ruangan, Harga } = req.body;

  if (!Nama_Ruangan || !Harga) {
    return res.status(400).json({
      error: 'Nama Ruangan dan Harga diperlukan.',
    });
  }

  const SQLCRoomMeeting = 'INSERT INTO ruangan_meeting (Nama_Ruangan, Harga) VALUES (?, ?)';
  const values = [ Nama_Ruangan, Harga];

  try {
    console.log('Executing Query: ', SQLCRoomMeeting);
    console.log('With Values: ', values);

    const [roomResult] = await dbPool.execute(SQLCRoomMeeting, values);
    const ID_Meeting = roomResult.insertId;

    res.status(201).json({
      message: 'Ruangan meeting berhasil dibuat',
      ID_Meeting,
    });
  } catch (error) {
    console.error('Error saat membuat ruangan:', error);
    res.status(500).json({
      error: 'Gagal menambahkan ruangan. Silakan periksa data dan coba lagi.',
    });
  }
};

const deleteRoomMeeting = async (ID_Meeting) => {
  const SQLDRMeeting = `DELETE FROM ruangan_meeting where ID_Meeting = ?`;
  const [result] = await dbPool.execute(SQLDRMeeting,[ID_Meeting]);

  if(result.affectedRows === 0){
    throw new Error("Data meeting tidak ditemukan");
  }
  return {message: "Data Ruang Meeting berhasil di hapus"};
}

const updateRoomMeeting = async (RoomMeetingData) => {
  const SQLURoomMeeting = `UPDATE ruangan_meeting
                           SET Nama_Ruangan = ?,
                           Harga = ?
                           Where ID_Meeting = ?`;
  const values = [RoomMeetingData.Nama_Ruangan, RoomMeetingData.Harga, RoomMeetingData.ID_Meeting];

  return await dbPool.execute(SQLURoomMeeting, values);
};

module.exports = {
    getAllRoom,
    createRoom,
    deleteRoom,
    updateRoom,
    getAllRoomMeeting,
    createRoomMeeting,
    updateRoomMeeting,
    deleteRoomMeeting
}