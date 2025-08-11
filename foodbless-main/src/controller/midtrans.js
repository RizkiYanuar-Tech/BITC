const midtransclient = require('midtrans-client');
const BookingsModel = require('../models/booking');
const {sendRoomBookingEmail} = require('./mailer');

let snap = new midtransclient.Snap({
    isProduction: false,
    serverKey: '',
    clientKey: '',
});

const createMidtransTransaction = async (req, res) => {
    const { fullname, email, phonenumber, typeruangan, duration, initialRoomPrice, gender, startDate, endDate } = req.body;

    console.log("Typeruangan yang diterima:", typeruangan);
    const orderID = `VO${Date.now().toString().slice(-5).padStart(5, '0')}`;

    const durationValue = parseInt(duration.match(/\d+/), 10);

    if (!durationValue || isNaN(durationValue)) {
        return res.status(400).json({ message: 'Durasi tidak valid. Harap masukkan angka dalam format yang benar (contoh: "6 bulan").' });
    }

    const grossAmount = initialRoomPrice * durationValue;

    let parameter = {
        transaction_details: {
            order_id: orderID,
            gross_amount: grossAmount,
        },
        item_details: [{
            name: typeruangan,
            price: initialRoomPrice,
            quantity: durationValue,
        }],
        customer_details: {
            first_name: fullname,
            email: email,
            phone: phonenumber,
        },
    };

    try {
        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;

        // Kirim token ke klien
        res.json({ transactionToken });

        // Proses status transaksi
        setTimeout(async () => {
            try {
                const transactionStatus = await snap.transaction.status(orderID);
                console.log('Transaction Status: ', JSON.stringify(transactionStatus, null, 2));

                if (transactionStatus.transaction_status === 'settlement') {
                    const BookingData = {
                        Nama_Lengkap: fullname,
                        Jenis_Kelamin: gender,
                        Email: email,
                        No_Hp: phonenumber,
                        ID_Ruangan: typeruangan,
                        Durasi: durationValue, // Durasi sekarang sudah dalam angka
                        ID_Transaksi: transactionStatus.order_id,
                        Jumlah_Bayar: transactionStatus.gross_amount,
                        Metode_Pembayaran: transactionStatus.payment_type,
                        Tanggal_Bayar: transactionStatus.settlement_time,
                        Tanggal_Sewa: startDate,
                        Akhir_Sewa: endDate
                    };

                    console.log("Booking Data: ", BookingData);

                    // Simpan ke database
                    await BookingsModel.createBooking(BookingData, transactionStatus.transaction_status);
                    console.log('Booking data saved successfully.');

                    await sendRoomBookingEmail(email, typeruangan, fullname);
                } else {
                    console.log('Transaction not settled:', transactionStatus.transaction_status);
                }
            } catch (error) {
                console.error('Error checking transaction status:', error);
            }
        }, 50000);
    } catch (error) {
        console.error('Error Object:', error);
        res.status(500).json({ message: error.ApiResponse || error.message });
    }
};

module.exports = { createMidtransTransaction };