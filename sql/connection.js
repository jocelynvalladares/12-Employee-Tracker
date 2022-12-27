/**
 * /db/connection.js
 *
 * @description: connection file sets the connection to MYSQL db
 *
 */

// dependencies
const mysql = require('mysql');

// mysql password
// change file path to './config' once you've added your mysql password to the config file. See README
const pass = require('./pass');

// connection to db
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: pass,
  database: 'employee_trackerdb',
});

module.exports = connection;