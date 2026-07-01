// main.js
import "jsr:@std/dotenv/load";
import express from "https://esm.sh/express@5.2.1?target=deno";
import cors from "https://esm.sh/cors@2.8.5?target=deno"; // <-- Importar CORS
import authRoutes from "./routesAuth.js";
import adminRoutes from "./routesAdmin.js";
import crudRoutes from "./routes.js";

const app = express();

// Habilitar CORS para Angular localhost:4200
app.use(cors());
app.use(express.json());

// Inyectamos todas las capas de enrutamiento
app.use(authRoutes);
app.use(adminRoutes);
app.use(crudRoutes); 

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
