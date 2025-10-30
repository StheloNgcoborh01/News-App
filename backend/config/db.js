import pg from "pg";
import pgSession from "connect-pg-simple";
const { Pool } = pg;


 export const db = new pg.Client({
  port: 5432,
  database: "News-app",
  user: "postgres",
  password: "asanda0411",
  host: "localhost",
});

export const testConnection = async () => {
  try {
    await db.connect();
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

export const PgSessionStore = pgSession;
