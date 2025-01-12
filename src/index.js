// index.js

require("dotenv").config();
const app = require("./app");

const { PORT = 3001 } = process.env;

// Start the server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
