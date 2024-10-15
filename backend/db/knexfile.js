import dotenv from "dotenv";
import pkg from "knex";
const { Knex } = pkg;

// Load environment variables from a .env file
dotenv.config({path: "../../.env"});

const config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: ".migrations",
  },
  seeds: {
    directory: ".seeds",
  },
};

export default config;
