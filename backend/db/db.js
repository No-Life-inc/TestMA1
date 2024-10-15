import knex from "knex";
import dotenv from "dotenv";

if (!process.env.GITHUB_ACTIONS) {
    dotenv.config({ });
}
const db = knex({
    client: 'mysql2',
    connection: {
        host:  "mysql",
        user: "test",
        password: "test",
        database: "test",
    },
});

export default db;