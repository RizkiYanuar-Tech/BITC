const dbPool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const moment = require("moment-timezone");

const getallMeeting = () => {
    const SQLQueryGetMeeting = 
    `SELECT 
        pmm.ID_Transaksi,
        ANY_VALUE(plgm.Nama_Lengkap) AS Nama_Lengkap,
        ANY_VALUE(plgm.No_Hp) AS No_Hp,
        pmm.Metode_Pembayaran,
        pmm.Jumlah_Bayar,
        pmm.Tanggal_Bayar,
        rmm.Nama_Ruangan,
        GROUP_CONCAT(drp.Jangka_Waktu SEPARATOR ', ') AS Durasi_Booking,
        count(pmm.Lama_Durasi) as Lama_Durasi,
        pmm.Tanggal_Sewa,
        pmm.Status
    FROM pemesanan_meeting AS pmm
    JOIN pelanggan_meeting AS plgm ON pmm.ID_Pelanggan = plgm.ID_PelangganMeeting
    JOIN durasi_rapat AS drp ON pmm.ID_Durasi = drp.ID_Durasi
    JOIN ruangan_meeting AS rmm ON pmm.ID_Meeting = rmm.ID_Meeting
    GROUP BY pmm.ID_Transaksi, pmm.Metode_Pembayaran, pmm.Jumlah_Bayar, pmm.Tanggal_Bayar, rmm.Nama_Ruangan, pmm.Lama_Durasi, pmm.Tanggal_Sewa, pmm.Status
    `
    return dbPool.execute(SQLQueryGetMeeting);
};

const createMeeting = async (body, transactionStatus) => {
    const {
        Nama_Lengkap,
        Jenis_Kelamin,
        Email,
        No_Hp,
        ID_Transaksi,
        ID_Meeting,
        ID_DurasiArray,
        Metode_Pembayaran,
        Tanggal_Bayar,
        Tanggal_Sewa,
        Jumlah_Bayar
    } = body;

    const SQLQueryMeeting = `INSERT INTO pelanggan_meeting (Nama_Lengkap, Jenis_Kelamin, Email, No_Hp) VALUES (?,?,?,?)`;
    const values = [Nama_Lengkap, Jenis_Kelamin, Email, No_Hp];

    try {
        console.log("Executing query:", SQLQueryMeeting);
        console.log("With values:", values);

        const [userResult] = await dbPool.execute(SQLQueryMeeting, values);
        const ID_Pelanggan = userResult.insertId;

        for (let i = 0; i < ID_DurasiArray.length; i++) {
            const ID_Durasi = parseInt(ID_DurasiArray[i], 10);
            const LamaDurasi = 1;

            const isRoomAvailable = await checkingRoomMeeting(Tanggal_Sewa, ID_Durasi, ID_Meeting);
            if (!isRoomAvailable) {
                throw new Error(`Ruangan tidak tersedia pada tanggal ${Tanggal_Sewa} dan durasi ${ID_Durasi}`);
            }

            if (transactionStatus === 'settlement') {
                const paymentSQLQuery = `
                    INSERT INTO pemesanan_meeting 
                    (ID_Transaksi, ID_Meeting, ID_Pelanggan, ID_Durasi, Metode_Pembayaran, Tanggal_Bayar, Jumlah_Bayar, Tanggal_Sewa, Lama_Durasi, Status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                const meetingValues = [
                    ID_Transaksi, ID_Meeting, ID_Pelanggan, ID_Durasi,
                    Metode_Pembayaran, Tanggal_Bayar, Jumlah_Bayar,
                    Tanggal_Sewa, LamaDurasi, 'Menunggu'
                ];

                console.log("Executing payment query:", paymentSQLQuery);
                console.log("With values:", meetingValues);
                await dbPool.execute(paymentSQLQuery, meetingValues);

            } else {
                console.log(`Transaction status is ${transactionStatus}, skipping insertion.`);
            }
        }
    } catch (error) {
        console.error("Error during booking meeting create:", error);
        throw error;
    }
};


const checkingRoomMeeting = async (Tanggal_Sewa, ID_Durasi, ID_Meeting) => {
    const SQLCheck = `
        SELECT * 
        FROM pemesanan_meeting 
        WHERE Tanggal_Sewa = ? 
          AND ID_Meeting = ? 
          AND ID_Durasi = ?
          AND Status IN ('Menunggu', 'Berjalan')`;

    try {
        const [result] = await dbPool.execute(SQLCheck, [Tanggal_Sewa, ID_Meeting, ID_Durasi]);
        return result.length === 0;
    } catch (error) {
        console.error("Error checking room availability:", error);
        throw error;
    }
};


const getAvailableDurations = async (roomId, date) => {
    if (!roomId || !date) {
        throw new Error("Room ID atau tanggal tidak valid.");
    }

    const SQLQuery = `
        SELECT drp.ID_Durasi, drp.Jangka_Waktu, drp.Lama_Waktu, drp.status
        FROM durasi_rapat drp
        WHERE drp.ID_Meeting = ? 
          AND NOT EXISTS (
            SELECT 1 
            FROM pemesanan_meeting pmm 
            WHERE pmm.ID_Durasi = drp.ID_Durasi 
              AND pmm.Tanggal_Sewa = ?
              AND pmm.Status IN ('Menunggu', 'Berjalan')
          )`;

    try {
        console.log("Query Parameters - Room ID:", roomId, "Date:", date);
        const [durations] = await dbPool.execute(SQLQuery, [roomId, date]);
        return durations;
    } catch (error) {
        throw new Error(`Error fetching available durations: ${error.message}`);
    }
};


const deleteMeeting = async (ID_Transaksi) =>{
    const SQLQueryDelete = `DELETE FROM pemesanan_meeting WHERE ID_Transaksi = ?`;
    const [result] = await dbPool.execute(SQLQueryDelete, [ID_Transaksi]);

    if(result.affectedRows == 0){
        throw new error("Data Pesanan Meeting tidak ditemukan");
    }
        return {message: 'Data Pesanan Berhasil dihapus'};
};

const updateBookingStatus = async () => {
    const now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    const today = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    const tomorrow = moment().add(1, 'days').tz("Asia/Jakarta").format("YYYY-MM-DD");

    try {
        console.log("Starting updateBookingStatus at", now);

        const queryToOngoing = `
            UPDATE pemesanan_meeting pmm
            JOIN durasi_rapat drp ON pmm.ID_Durasi = drp.ID_Durasi
            SET pmm.Status = 'Berjalan'
            WHERE pmm.Status = 'Menunggu'
              AND pmm.Tanggal_Sewa = ?
              AND ? >= CONCAT(pmm.Tanggal_Sewa, ' ', LEFT(drp.Jangka_Waktu, 5))
              AND ? < CONCAT(pmm.Tanggal_Sewa, ' ', RIGHT(drp.Jangka_Waktu, 5));
        `;
        const [ongoingResult] = await dbPool.execute(queryToOngoing, [today, now, now]);
        console.log("Rows affected for 'Berjalan':", ongoingResult.affectedRows);

        const queryToWaiting = `
            UPDATE pemesanan_meeting pmm
            SET pmm.Status = 'Menunggu'
            WHERE pmm.Tanggal_Sewa = ? AND pmm.Status != 'Selesai';
        `;
        const [waitingResult] = await dbPool.execute(queryToWaiting, [tomorrow]);
        console.log("Rows affected for 'Menunggu':", waitingResult.affectedRows);

        const queryToCompleted = `
            UPDATE pemesanan_meeting pmm
            JOIN durasi_rapat drp ON pmm.ID_Durasi = drp.ID_Durasi
            SET pmm.Status = 'Selesai'
            WHERE pmm.Status IN ('Menunggu', 'Berjalan')
              AND (pmm.Tanggal_Sewa <= ?)
              AND ? >= CONCAT(pmm.Tanggal_Sewa, ' ', RIGHT(drp.Jangka_Waktu, 5));
        `;
        const [completedResult] = await dbPool.execute(queryToCompleted, [today, now]);
        console.log("Rows affected for 'Selesai':", completedResult.affectedRows);

        const updateScheduleStatus = `
            UPDATE durasi_rapat drp
            LEFT JOIN pemesanan_meeting pmm ON drp.ID_Durasi = pmm.ID_Durasi
            SET drp.status = CASE 
                WHEN pmm.Status = 'Berjalan' THEN 'Booked'
                WHEN pmm.Status = 'Selesai' THEN 'Available'
                ELSE drp.status
            END
            Where drp.ID_Meeting = pmm.ID_Meeting;
        `;
        const [scheduleResult] = await dbPool.execute(updateScheduleStatus);
        console.log("Rows affected for updating schedules:", scheduleResult.affectedRows);

        console.log("updateBookingStatus completed successfully.");
    } catch (error) {
        console.error("Error in updateBookingStatus:", error);
    }
};


module.exports = {
    getallMeeting,
    checkingRoomMeeting,
    createMeeting,
    deleteMeeting,
    getAvailableDurations,
    updateBookingStatus
}