const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

connection.query("CREATE DATABASE IF NOT EXISTS SolideDB", function (err) {
  if (err) throw err;
  console.log("Database is created.");
})

// Create user table
connection.query(`
  CREATE TABLE IF NOT EXISTS SolideDB.user (
    id INT NOT NULL AUTO_INCREMENT, 
    email VARCHAR(255), 
    password VARCHAR(255), 
    username VARCHAR(255), 
    water_goal INT DEFAULT 2000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (id)
  )
  `, function (err) {
    if (err) throw err;
    console.log("User table created.")
})

// Create waterdata table
connection.query(`
  CREATE TABLE IF NOT EXISTS SolideDB.waterdata (
    water_intake INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES user(id)
  )
`, function (err) {
    if (err) throw err;
    console.log("Waterdata table created.")
})

// Create bottle table
connection.query(`
  CREATE TABLE IF NOT EXISTS SolideDB.bottle (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    weight INT,
    user_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
  )
`, function (err) {
    if (err) throw err;
    console.log("Bottle table created.")
})

// finish the connection
connection.end((err) => {
  if (err) throw err;
  console.log("Connection closed.")
  process.exit(0)
})