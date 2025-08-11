const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: "bxt0v75lts6r2gdrf04y-mysql.services.clever-cloud.com",
    user: "ukldiubaw1chdjco",
    password: "fbJIqjYOm7eLvJLEaM14",
    database: "bxt0v75lts6r2gdrf04y",
});

module.exports = dbPool.promise();