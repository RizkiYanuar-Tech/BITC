require('dotenv').config()
const nodemailer = require("nodemailer");
const { getJadwal } = require('../models/jadwalmeeting');
const date = new Date();
const options = { day: '2-digit', month: 'long', year: 'numeric' };

const dateFormatter = new Intl.DateTimeFormat('en-US', options);
const today = dateFormatter.format(date);

async function VerificationEmail(Email) {
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
      user: "technoparkcimahibitc@gmail.com",
       pass: "rwso rcyo ffng ifbs"
     }
   });

   const mailOptions = {
     from: "technoparkcimahibitc@gmail.com",
     to: Email,
     subject: 'BITC - Terima kasih telah mengirimkan keluhan Anda',
     html: `
     <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Konfirmasi Keluhan</title>
     <style>
         body {
             font-family: Arial, sans-serif;
             background-color: #f4f4f4;
             color: #333;
             margin: 0;
             padding: 0;
         }
         .email-container {
             width: 100%;
             max-width: 600px;
             margin: 0 auto;
             background-color: #ffffff;
             padding: 20px;
             border-radius: 8px;
             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
         }
         .header {
             background-color: #007bff;
             padding: 10px 0;
             text-align: center;
             color: #ffffff;
             font-size: 24px;
             border-top-left-radius: 8px;
             border-top-right-radius: 8px;
         }
         .content {
            padding: 20px;
             font-size: 16px;
             line-height: 1.6;
        }
         .footer {
             text-align: center;
             padding: 10px;
           font-size: 12px;
           color: #666666;
       }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
             color: #ffffff;
           text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
 </head>
 <body>
     <div class="email-container">
         <div class="header">
             BITC Customer Support
        </div>
         <div class="content">
             <p>Halo,</p>
             <p>Terima kasih telah mengirimkan keluhan Anda melalui platform kami. Kami telah menerima keluhan Anda dan saat ini sedang dalam proses untuk menindaklanjutinya.</p>
             <p>Tim kami akan menghubungi Anda kembali dalam waktu 1-2 hari kerja untuk memberi update terkait keluhan Anda. Jika Anda memiliki informasi tambahan yang ingin disampaikan, silakan balas email ini atau hubungi kami melalui halaman "Complaints" di website kami.</p>
             <p>Salam hangat,<br>Tim BITC</p>
             <!--<a href="https://example.com/complaints" class="button">Lihat Status Keluhan</a>-->
         </div>
         <div class="footer">
             &copy; 2024 BITC. All rights reserved.
         </div>
     </div>
 </body>
 </html>
     `,
};

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to', Email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}
async function KeluhanSelesai(Email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "technoparkcimahibitc@gmail.com",
      pass: "rwso rcyo ffng ifbs"
    }
  });

  const mailOptions = {
    from: "technoparkcimahibitc@gmail.com",
    to: Email,
    subject: 'BITC - Keluhan Anda telah selesai',
    html: `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Keluhan</title>
    <style>
        body {
            font-family: Arial, sans-serif;             background-color: #f4f4f4;
             color: #333;
             margin: 0;
             padding: 0;
         }
         .email-container {
             width: 100%;
             max-width: 600px;
             margin: 0 auto;
             background-color: #ffffff;
             padding: 20px;
             border-radius: 8px;
             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
         }
         .header {
             background-color: #007bff;
             padding: 10px 0;
             text-align: center;
             color: #ffffff;
             font-size: 24px;
             border-top-left-radius: 8px;
             border-top-right-radius: 8px;
         }
         .content {
             padding: 20px;
             font-size: 16px;
             line-height: 1.6;
         }
         .footer {
             text-align: center;
             padding: 10px;
             font-size: 12px;
             color: #666666;
         }
         .button {
             display: inline-block;
             padding: 10px 20px;
             margin-top: 20px;
             background-color: #007bff;
             color: #ffffff;
             text-decoration: none;
             border-radius: 4px;
             font-weight: bold;
         }
     </style>
 </head>
 <body>
     <div class="email-container">
         <div class="header">
             BITC Customer Support
         </div>
         <div class="content">
             <p>Halo,</p>
             <p>Kami ingin memberitahukan bahwa keluhan Anda telah diselesaikan oleh tim kami.</p>
            <!--<a href="https://example.com/complaints" class="button">Lihat Status Keluhan</a>-->
        </div>
        <div class="footer">
             &copy; 2024 BITC. All rights reserved.
         </div>
    </div>
 </body>
 </html>
     `,
   };
  try {
     await transporter.sendMail(mailOptions);
     console.log('Verification email sent to', Email);
   } catch (error) {
     console.error('Error sending verification email:', error);
     throw error;
   }
 }

async function sendRoomBookingEmail(email, typeruangan, fullname) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "technoparkcimahibitc@gmail.com",
        pass: "rwso rcyo ffng ifbs"
      },
    });

    const mailOptions = {
        from:"technoparkcimahibitc@gmail.com",
        to: email,
        subject:'Konfirmasi Pemesanan Virtual Office',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Konfirmasi Pemesanan Ruangan</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    border: 1px solid #eaeaea;
                }
                .header {
                    background-color: #007bff;
                    padding: 20px;
                    text-align: center;
                    color: #ffffff;
                    font-size: 28px;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .content {
                    padding: 20px;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #666666;
                    border-top: 1px solid #eaeaea;
                    margin-top: 20px;
                }
                .facilities-list {
                    list-style-type: disc;
                    padding-left: 20px;
                }
                h1 {
                    color: #007bff;
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                .highlight {
                    color: #007bff;
                    font-weight: bold;
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    BITC Ruang Rapat
                </div>
                <div class="content">
                    <h1>Halo, ${fullname}!</h1>
                    <p>Terima kasih telah memesan Ruangan Tipe <span class="highlight">${typeruangan}</span>.</p>
                    <p>Anda mendapatkan fasilitas berikut:</p>
                    <ul class="facilities-list">
                        ${typeruangan === '1' ? `
                            <li>Alamat Bisnis Perusahaan</li>
                            <li>Penanganan Surat & Penerimaan Paket</li>
                            <li>Pemberitahuan SMS untuk Paket atau Surat Masuk</li>
                            <li>Surat Domisili Bangunan</li>
                        ` : ''}
                        ${typeruangan === '2' ? `
                            <li>Ruang Rapat 2 jam per bulan</li>
                            <li>Alamat Bisnis Perusahaan</li>
                            <li>Penanganan Surat & Penerimaan Paket</li>
                        ` : ''}
                        ${typeruangan === '3' ? `
                            <li>Ruang Rapat 3 jam per bulan</li>
                            <li>Alamat Bisnis Perusahaan</li>
                            <li>Penanganan Surat & Penerimaan Paket</li>
                        ` : ''}
                        ${typeruangan === '4' ? `
                            <li>Ruang Rapat 4 jam per bulan</li>
                            <li>Alamat Bisnis Perusahaan</li>
                            <li>Penanganan Surat & Penerimaan Paket</li>
                        ` : ''}
                    </ul>
                </div>
                <div class="footer">
                    &copy; 2024 BITC. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to', email);
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        throw error;
    }
}

async function sendRoomMeetingConfirmation(email, fullName, roomeeting, selectedDurations, totalHours, datemeeting) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "technoparkcimahibitc@gmail.com",
            pass: "rwso rcyo ffng ifbs"
        }
    });

    const mailOptions = {
        from: "technoparkcimahibitc@gmail.com",
        to: email,
        subject: 'Konfirmasi Booking Ruang Rapat',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Konfirmasi Booking</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
                .email-container { max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; }
                .header { background-color: #007bff; color: #fff; padding: 10px; text-align: center; }
                .content { font-size: 16px; line-height: 1.5; }
                .footer { font-size: 12px; color: #666; text-align: center; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">BITC Ruang Rapat</div>
                <div class="content">
                    <p>Halo ${fullName},</p>
                    <p>Terima kasih telah melakukan booking ruang rapat dengan detail sebagai berikut:</p>
                    <ul>
                        <li>Jenis Ruang: ${roomeeting}</li>
                        <li>Jam Booking: ${selectedDurations.join(', ')}</li>
                        <li>Jumlah Jam Booking: ${totalHours} Jam</li>
                        <li>Tanggal Booking: ${datemeeting}</li>
                    </ul>
                    <p>Jika ada pertanyaan, hubungi kami.</p>
                </div>
                <div class="footer">&copy; 2024 BITC. All rights reserved.</div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to', email);
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
    }
}


module.exports = {
    VerificationEmail,
    KeluhanSelesai,
    sendRoomBookingEmail,
    sendRoomMeetingConfirmation,
};
