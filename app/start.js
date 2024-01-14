const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const db = require("./database");
const bottle = require("./routes/bottle");
const user = require("./routes/user");
const waterdata = require("./routes/waterdata");
const goal = require("./routes/goal");

// Create a new express application instance
const app = express();
// The port the express app will listen on
const port = 3000;

app.use(cors());
// Serve the Swagger documents and Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

// Mount all of the routers on /api path
app.use("/api/bottle", bottle);
app.use("/api/user", user);
app.use("/api/waterdata", waterdata);
app.use("/api/goal", goal);   

// Serve the application at the given port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Close the MySQL connection pool on CTRL-C
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) throw err;
    console.log('MySQL connection pool closed');
    process.exit();
  });
});