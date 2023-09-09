// "mysql" cause error, use "mysql2" instead
import mysql from "mysql2";

export const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "Mysqlroot12345/",
    database: "uniclubshub",
});
