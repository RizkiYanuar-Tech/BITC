const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: "sql.freedb.tech",
    user: "freedb_firmanbitc",
    password: "PzP$@wW5%rx7bH@",
    database: "freedb_firmanbitc",
});

module.exports = dbPool.promise();