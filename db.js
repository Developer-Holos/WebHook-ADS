const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:JONdBgamupvtqnAePuaaBoJWOXCiRmNn@shortline.proxy.rlwy.net:32303/railway",
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    // 🔹 Ajusta automáticamente la secuencia de IDs en la tabla leads
    await pool.query(`
      SELECT setval('leads_id_seq', COALESCE((SELECT MAX(id) FROM leads), 1), true);
    `);

    console.log("✅ Secuencia de leads_id_seq actualizada correctamente");
  } catch (error) {
    console.error("❌ Error actualizando la secuencia:", error);
  }
})();

module.exports = pool;
