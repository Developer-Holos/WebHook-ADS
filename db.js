const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:JONdBgamupvtqnAePuaaBoJWOXCiRmNn@shortline.proxy.rlwy.net:32303/railway",
  ssl: {
    rejectUnauthorized: false, 
  },
});

module.exports = pool;