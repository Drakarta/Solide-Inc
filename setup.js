const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qwer',
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
  con.query("CREATE DATABASE IF NOT EXISTS SolideDB", function (err, result) {
    if (err) throw err;
    console.log("Database is created.");
  })  
  con.query("USE SolideDB", function (err, result) {
    if (err) throw err;
    console.log("SolideDB is selected.")
  })
  con.query(`
    CREATE TABLE IF NOT EXISTS user (
      id INT NOT NULL AUTO_INCREMENT, 
      email VARCHAR(255), 
      password VARCHAR(255), 
      username VARCHAR(255), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      PRIMARY KEY (id)
    )
  `, function (err, result) {
      if (err) throw err;
      console.log("User table created.")
  })
  con.query(`
    CREATE TABLE IF NOT EXISTS waterdata (
      water_intake INT,
      user_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      FOREIGN KEY (user_id) REFERENCES user(id)
    )
  `, function (err, result) {
      if (err) throw err;
      console.log("Waterdata table created.")
  })
  con.query(`
    CREATE TABLE IF NOT EXISTS bottle (
      id INT NOT NULL,
      name VARCHAR(255),
      weight INT,
      user_id INT,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES user(id)
    )
  `, function (err, result) {
      if (err) throw err;
      console.log("Bottle table created.")
  })
  con.end((err) => {
    if (err) throw err;
    console.log("Connection closed.")
    process.exit(0)
  })
});
