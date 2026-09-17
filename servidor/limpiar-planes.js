require("dotenv").config();
const mysql = require("mysql2/promise");

async function limpiarPlanes() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "gym",
  });

  try {
    await pool.query(`ALTER TABLE usuarios MODIFY COLUMN plan VARCHAR(50) DEFAULT NULL`);
    const [result] = await pool.query(
      `UPDATE usuarios SET plan = NULL WHERE LOWER(TRIM(COALESCE(plan, ''))) = 'mensual'`
    );
    console.log(`Listo: ${result.affectedRows} registro(s) limpiados.`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

limpiarPlanes();
