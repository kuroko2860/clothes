const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  { host: process.env.DATABASE_HOST, dialect: "mysql", logging: false }
);

module.exports = {
  sequelize,
  connect: async () => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      });

      await connection.query(
        "CREATE DATABASE IF NOT EXISTS `clothes-web-shop`"
        // run in first install
        // "ALTER TABLE orders ADD COLUMN payment_method VARCHAR(20) DEFAULT 'cod'",
        // "ALTER TABLE orders ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending'"
      );

      await connection.end();

      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      await sequelize.sync();
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  },
};
