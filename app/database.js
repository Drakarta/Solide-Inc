const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'qwer',
  database: 'SolideDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.query = util.promisify(pool.query);

module.exports = pool;