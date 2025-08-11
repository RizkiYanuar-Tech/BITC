const dbPool = require("../config/database");

const getAllJadwal = () => {
    const SQLJadwal = `
    SELECT 
        ID_Durasi,
        Jangka_Waktu,
        status,
        Lama_Waktu,
        ID_Meeting
    FROM durasi_rapat`;

    return dbPool.execute(SQLJadwal);
}

const getDurasiByIds = async (ids) => {
    const placeholders = ids.map(() => '?').join(', ');
    const query = `SELECT Jangka_Waktu FROM durasi_rapat WHERE ID_Durasi IN (${placeholders})`;
    const [result] = await dbPool.execute(query, ids);
    return result.map((row) => row.Jangka_Waktu);
};

const createJadwal = async (req, res) => {
    const { newPeriod, newDuration, newStatus } = req.body;

    if (!newPeriod || !newDuration || !newStatus) {
        return res.status(400).json({ message: "Jangka Waktu, Lama Waktu, dan Status harus diisi." });
    }

    const validStatus = ['Available', 'Booked'];
    const finalStatus = validStatus.includes(newStatus) ? newStatus : "Available";

    if (isNaN(newDuration) || newDuration <= 0) {
        return res.status(400).json({ message: "Lama Waktu harus berupa angka positif." });
    }

    const SQLInsert = `
        INSERT INTO durasi_rapat (Jangka_Waktu, Lama_Waktu, status)
        VALUES (?, ?, ?)`;

    try {
        const [result] = await dbPool.execute(SQLInsert, [newPeriod, newDuration, finalStatus]);
        return res.status(201).json({ message: "Jadwal berhasil ditambahkan.", id: result.insertId });
    } catch (error) {
        console.error("Error saat menambahkan jadwal:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat menambahkan jadwal." });
    }
};


const deleteJadwal = async (ID_Durasi) => {
    const SQLDeleteJadwal = `DELETE from durasi_rapat where ID_Durasi = ?`;
    const [result] = await dbPool.execute(SQLDeleteJadwal, [ID_Durasi]);

    if(result.affectedRows === 0){
        return { message: "Jadwal tidak ditemukan." };
    }
    return {message: "Jadwal Berhasil dihapus"};
}

const updateJadwal = async (req, res) => {
    const { ID_Durasi, Jangka_Waktu, Lama_Waktu, status, ID_Meeting} = req.body;

    console.log("Data diterima untuk update:", req.body);

    if (!ID_Durasi || !Jangka_Waktu || !Lama_Waktu || !status || !ID_Meeting) {
        return res.status(400).json({ message: "Semua data harus diisi." });
    }

    const SQLUpdate = `
        UPDATE durasi_rapat
        SET Jangka_Waktu = ?, Lama_Waktu = ?, status = ?, ID_Meeting = ?
        WHERE ID_Durasi = ?`;

    try {
        const [result] = await dbPool.execute(SQLUpdate, [ID_Durasi, Jangka_Waktu, Lama_Waktu, status, ID_Meeting]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Jadwal tidak ditemukan." });
        }

        return res.status(200).json({ message: "Jadwal berhasil diperbarui." });
    } catch (error) {
        console.error("Error saat memperbarui jadwal:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat memperbarui jadwal." });
    }
};

module.exports = {
    getAllJadwal,
    createJadwal,
    deleteJadwal,
    updateJadwal,
    getDurasiByIds
}