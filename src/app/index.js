import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productoRouter from "./routes/productoRouter.js"
import superRouter from "./routes/superRouter.js"
import userRouter from "./routes/userRouter.js"
import proSuperRouter from "./routes/proSuperRouter.js"
import sesionRouter from "./routes/sesionRouter.js"
import roleRouter from "./routes/roleRouter.js"
import recetaRouter from "./routes/recetaRouter.js"
import forgotPassword from "./routes/forgotPassword.js"
dotenv.config();

const app = express();

app.use(express.json()); // Para poder parsear el cuerpo de las solicitudes JSON
app.use(cors()); // Para permitir solicitudes desde el frontend

app.use('/api', productoRouter);
app.use('/api', superRouter);
app.use("/api", userRouter);
app.use("/api", proSuperRouter);
app.use("/api", sesionRouter);
app.use("/api", roleRouter);
app.use("/api", recetaRouter);
app.use("/api", forgotPassword);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
