const { sendRoomBookingEmail } = require('../controller/mailer');

const Email = 'ryanuar87@gmail.com'
const typeruangan = 'type 1';

sendRoomBookingEmail(Email,typeruangan)
  .then(()=>{
    console.log('Email sent')
  })
  .catch((error)=>{
    console.log('Error sending email')
  });