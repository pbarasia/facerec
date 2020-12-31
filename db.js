const mysql = require('mysql');
const conf = require('./config').dbConfig;

var pool        = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : conf.host,
    user            : conf.user,
    password        : conf.password,
});

pool.getConnection(function(err,con) {
    if (err) throw err;

    con.query(`CREATE DATABASE IF NOT EXISTS ${conf.database};`);
    con.query(`USE ${conf.database};`);
    con.query('CREATE TABLE IF NOT EXISTS facemaps(id int NOT NULL AUTO_INCREMENT, username varchar(64), image varchar(255), PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
    });
    con.release();
});

module.exports.addMap = function(username,image){
    pool.getConnection(function(err,con) {
        if (err) throw err;
        con.query(`INSERT INTO facemaps (username, image) VALUES ('${username}', '${image}')`, function(err, result, fields) {
            con.release();
            if (err) console.log(err)
            if (result) console.log("Inserted in db");
            if (fields) console.log(fields);
        });
    });
}

module.exports.getImagesForUser = function(username,callback){
    pool.getConnection(function(err,con) {
        if (err) throw err;
        con.query(`SELECT image from facemaps where username='${username}'`, function(err, result, fields) {
            con.release();
            if (err) console.log(err)
            if (result) callback(result)
        });
    });
}

