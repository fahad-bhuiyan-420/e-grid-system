// app/lib/db.ts
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",      // Usually localhost for XAMPP/Local MySQL
  user: "root",           // Your MySQL username
  password: "",           // Your MySQL password (leave empty for XAMPP default)
  database: "e-grid", // The name of your database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});