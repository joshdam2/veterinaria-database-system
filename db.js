import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "potochino12", 
  database: "veterinaria",
  port: 5432
});
