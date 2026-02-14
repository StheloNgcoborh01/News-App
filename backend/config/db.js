import pg from "pg";
import pgSession from "connect-pg-simple";

const { Pool } = pg;


export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  
});



export const PgSessionStore = pgSession;
