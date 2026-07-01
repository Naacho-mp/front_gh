// db.js - Cambiado a ESM usando esm.sh optimizado para Deno
import mariadb from "https://esm.sh/mariadb@3.3.0?target=deno";

const pool = mariadb.createPool({
     host: "127.0.0.1",
     port: 3307,
     user: "db_jaime",  
     password: "",      
     database: "db",
     connectionLimit: 5
});

export default pool;
