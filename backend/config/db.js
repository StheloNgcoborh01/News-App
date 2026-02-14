import pg from "pg";
import pgSession from "connect-pg-simple";
// const { Pool } = pg;


// export const db = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: 5432,
//   ssl: { rejectUnauthorized: false }
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const testConnection = async () => {
  try {
    await db.connect();
    console.log("DB connected");
    client.release();
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

export const PgSessionStore = pgSession;
