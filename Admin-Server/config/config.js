require("dotenv").config();

const config = {
  PORT: process.env.PORT || 5001,
  DB_CONN: process.env.DB_PASS,
  USERS_DB_CONN: process.env.USERS_DB_CONN,
  //DB_CONN: `mongodb+srv://roni9843:roni9843@cluster0.utd8f8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  // DB_CONN: `mongodb+srv://roni9843:${process.env.DB_CONN}@cluster0.utd8f8o.mongodb.net/HasanShop`,
};

module.exports = config;