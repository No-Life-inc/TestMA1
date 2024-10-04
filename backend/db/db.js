import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_HOST is:", process.env.DB_HOST)
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Exists" : "Not Set");
console.log("DB_NAME:", process.env.DB_NAME);

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