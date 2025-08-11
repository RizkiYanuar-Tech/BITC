const dbPool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const moment = require("moment-timezone");

const saltRounds = 10;
const jwtSecret = "SECRET";

const getAllBooking = () => {
  const SQLQuery = 
  `SELECT 
      pmvo.ID_Transaksi, 
      plgn.Nama_Lengkap, 
      plgn.No_Hp, 
      plgn.Email, 
      pmvo.Metode_Pembayaran, 
      pmvo.Jumlah_Bayar, 
      pmvo.Tanggal_Bayar, 
      r.Type_Ruangan, 
      pmvo.durasi, 
      pmvo.Tanggal_Sewa, 
      pmvo.Akhir_Sewa,
      pmvo.Status
From 
  pemesanan_voffice as pmvo
JOIN pelanggan as plgn
  ON pmvo.ID_Pelanggan = plgn.ID_Pelanggan
JOIN ruangan as r
  ON pmvo.ID_Ruangan =  r.ID_Ruangan
`
  return dbPool.execute(SQLQuery);
};

const getBookingById = async (id) => {
  const SQLQuery = 'SELECT * FROM pemesanan WHERE ID_Pemesanan = ?';
  const [rows] = await dbPool.execute(SQLQuery, [id]);

  if (rows.length === 0) {
      throw new Error('Data Pesanan tidak ditemukan');
  }

  return rows[0];
};

const createBooking = async (body, transactionStatus) => {
  const {
      Nama_Lengkap,
      Jenis_Kelamin,
      Email,
      No_Hp,
      ID_Ruangan,
      Durasi,
      ID_Transaksi,
      Metode_Pembayaran,
      Tanggal_Bayar,
      Jumlah_Bayar,
      Tanggal_Sewa,
      Akhir_Sewa,
      Status
  } = body;

  const SQLQueryUser = `INSERT INTO pelanggan (Nama_Lengkap, Jenis_Kelamin, Email, No_Hp) VALUES (?, ?, ?, ?)`;

  const values = [Nama_Lengkap, Jenis_Kelamin, Email, No_Hp];

  try {
      console.log("Executing query:", SQLQueryUser); 
      console.log("With values:", values);

      if (transactionStatus === 'settlement') {
          //Memasukkan Data User kedalam table user
          const [userResult] = await dbPool.execute(SQLQueryUser, values);
          const ID_Pelanggan = userResult.insertId;

          //Memasukkan data pemesanan
          const paymentSQLQuery = `INSERT INTO pemesanan_voffice (ID_Transaksi, Metode_Pembayaran, Tanggal_Bayar, Jumlah_Bayar, ID_Pelanggan, ID_Ruangan, Durasi, Tanggal_Sewa, Akhir_Sewa, Status)
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          const paymentValues = [ID_Transaksi, Metode_Pembayaran, Tanggal_Bayar, Jumlah_Bayar, ID_Pelanggan, ID_Ruangan, Durasi, Tanggal_Sewa, Akhir_Sewa, 'Menunggu'];

          console.log("Executing payment query:", paymentSQLQuery);
          console.log("With payment values:", paymentValues); 

          await dbPool.execute(paymentSQLQuery, paymentValues);
      } else {
          console.log(`Transaction status is ${transactionStatus}. Booking will not be created.`);
      }
  } catch (error) {
      console.error("Error during booking creation:", error);
      throw error;
  }
};

const deleteBooking = async (ID_Transaksi) => {
  const SQLQuery = 'DELETE FROM pemesanan_voffice WHERE ID_Transaksi = ?';
  const [result] = await dbPool.execute(SQLQuery, [ID_Transaksi]);

  if (result.affectedRows === 0) {
      throw new Error('Data pesanan tidak ditemukan');
  }
    return { message: 'Data pesanan berhasil dihapus' };
};

const updateBooking = (BookingData) => {
  const SQLQuery = `  UPDATE pelanggan 
                      SET Nama_Lengkap='${BookingData.Nama_Lengkap}',  Email='${BookingData.Email}',  No_Hp='${BookingData.No_Hp}' WHERE ID_Pelanggan=${BookingData.ID_Pelanggan}`;

  dbPool.execute(SQLQuery);

  const SQLQuerypemesanan = `  UPDATE pemesanan_voffice
                      SET ID_Ruangan='${BookingData.ID_Ruangan}' WHERE ID_Pemesanan=${BookingData.ID_Pemesanan}`;

  return dbPool.execute(SQLQuerypemesanan);
}

const updateBookingVo = async () => {
  const now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
  try {
    console.log(`[${now}] Memulai pembaruan status pemesanan Virtual Office...`);

    const queryToOngoing = `
        UPDATE pemesanan_voffice
        SET Status = 'Berjalan'
        WHERE Status = 'Menunggu'
          AND '${now}' >= Tanggal_Sewa
          AND '${now}' < DATE_ADD(Tanggal_Sewa, INTERVAL Durasi MONTH)
    `;

    const [ongoingResult] = await dbPool.execute(queryToOngoing);
    console.log(`[${now}] Pemesanan diperbarui ke 'Berjalan':`, ongoingResult.affectedRows);

    const queryToCompleted = `
        UPDATE pemesanan_voffice
        SET Status = 'Habis'
        WHERE Status = 'Berjalan'
          AND '${now}' >= DATE_ADD(Tanggal_Sewa, INTERVAL Durasi MONTH)
    `;

    const [completedResult] = await dbPool.execute(queryToCompleted);
    console.log(`[${now}] Pemesanan diperbarui ke 'Habis':`, completedResult.affectedRows)
    console.log(`[${now}] Pembaruan status pemesanan selesai.`);
} catch (error) {
    console.error(`[${now}] Error saat memperbarui status pemesanan:`, error.message);
}
};

module.exports = {
  getAllBooking,
  createBooking,
  deleteBooking,
  updateBooking,
  getBookingById,
  updateBookingVo
};
