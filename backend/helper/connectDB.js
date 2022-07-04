const mongoose = require("mongoose");

async function connectDB(MONGODB_URL) {
  const con = await mongoose
    .connect(MONGODB_URL)
    .catch((error) => console.log(error));
  if (con) console.log("Connected to MONGODB");
}

module.exports = connectDB;
