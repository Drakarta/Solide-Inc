const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const db = require("./database");
const bottle = require("./routes/bottle");
const user = require("./routes/user");
const waterdata = require("./routes/waterdata");

const app = express();
const port = 3000;

app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use("/api/bottle", bottle);
app.use("/api/user", user);
app.use("/api/waterdata", waterdata);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  db.end((err) => {
    if (err) throw err;
    console.log('MySQL connection pool closed');
    process.exit();
  });
});