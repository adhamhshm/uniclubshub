import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// export const db = mysql.createConnection(process.env.DATABASE_URL);
// export const db = mysql.createConnection({
//     host: process.env.MYSQL_DB_HOST,
//     user: process.env.MYSQL_DB_USER,
//     password: process.env.MYSQL_DB_PASSWORD,
//     database: process.env.MYSQL_DB_NAME,
// });

let db;

if (process.env.MYSQL_DB_HOST) {
    db = mysql.createConnection({
        host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
    });    
} 
else {
    db = mysql.createConnection(process.env.DATABASE_URL);
}

export { db };