import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_HOST is:", process.env.DB_HOST);
const db = knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  });
  
  export default db;