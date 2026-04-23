import postgres from "postgres";

/**
 * Global database connection singleton.
 * Uses `DATABASE_URL` if defined in the environment.
 */
const sql = process.env.DATABASE_URL 
  ? postgres(process.env.DATABASE_URL) 
  : null;

export default sql;
