const midtransclient = require('midtrans-client');
const MeetingsModel = require('../models/bookingrapat');
const scheduleModel = require('../models/jadwalmeeting');
const { sendRoomMeetingConfirmation } = require('../controller/mailer');

let snap = new midtransclient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-MTHm3X1sj8GTjVosdKR-T7gg',
    clientKey: 'SB-Mid-client-WRrnBAPxArMioHRQ',
});

const createMidtransTransactionMeeting = async (req, res) => {
    const { fullname, email, phonenumber, ruanganmeeting, selectedDurations, initialRoomPrice, gender, datemeeting } = req.body;

    const selectedDurationsArray = Array.isArray(selectedDurations) ? selectedDurations : [selectedDurations];
    const totalHours = selectedDurationsArray.length;

    console.log("Selected Durations:", selectedDurationsArray);
    console.log("Total Hours:", totalHours);

    const orderID = `RR${Date.now().toString().slice(-5).padStart(5, '0')}`;

    if (totalHours === 0) {
        return res.status(400).json({ message: "Durasi belum dipilih." });
    }

    try {
        for (const ID_Durasi of selectedDurationsArray) {
            const isAvailable = await MeetingsModel.checkingRoomMeeting(datemeeting, ID_Durasi, ruanganmeeting);
            if (!isAvailable) {
                return res.status(400).json({ message: `Durasi ${ID_Durasi} tidak tersedia pada ${datemeeting}.` });
            }
        }

        const durationStrings = await scheduleModel.getDurasiByIds(selectedDurationsArray);

        const parameter = {
            transaction_details: {
                order_id: orderID,
                gross_amount: initialRoomPrice * totalHours,
            },
            item_details: selectedDurationsArray.map((durasi) => ({
                id: durasi,
                name: ruanganmeeting,
                price: initialRoomPrice,
                quantity: 1,
            })),
            customer_details: {
                first_name: fullname,
                email: email,
                phone: phonenumber,
            },
        };

        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;

        res.json({ transactionToken });

        // Optional: Handle post-payment actions
        setTimeout(async () => {
            const transactionStatus = await snap.transaction.status(orderID);
            if (transactionStatus.transaction_status === 'settlement') {
                const BookingData = {
                    Nama_Lengkap: fullname,
                    Jenis_Kelamin: gender,
                    Email: email,
                    No_Hp: phonenumber,
                    ID_Meeting: ruanganmeeting,
                    ID_DurasiArray: selectedDurationsArray,
                    Tanggal_Sewa: datemeeting,
                    ID_Transaksi: transactionStatus.order_id,
                    Metode_Pembayaran: transactionStatus.payment_type,
                    Tanggal_Bayar: transactionStatus.settlement_time,
                    Jumlah_Bayar: transactionStatus.gross_amount,
                };

                await MeetingsModel.createMeeting(BookingData, transactionStatus.transaction_status);
                await sendRoomMeetingConfirmation(email, fullname, ruanganmeeting, durationStrings, totalHours, datemeeting);
            }
        }, 50000);
    } catch (error) {
        console.error("Error creating Midtrans transaction:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createMidtransTransactionMeeting };