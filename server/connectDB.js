import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection(process.env.MYSQL_CONNECTION_URI);
// export const db = mysql.createConnection({
//     host:process.env.MYSQL_DB_HOST,
//     user: process.env.MYSQL_DB_USER,
//     password: process.env.MYSQL_DB_PASSWORD,
//     database: process.env.MYSQL_DB_NAME,
// });