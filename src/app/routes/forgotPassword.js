import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from '../models/User.js'; 
import crypto from "crypto";

dotenv.config();
const router = express.Router();

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Introduzca un correo" });
    }

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return;
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiration = Date.now() + 3600000;

        user.resetToken = resetToken;
        user.tokenExpiration = resetTokenExpiration;

        await user.save();

        const resetLink = `http://localhost:3000/resetpassword/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "franciscojavierlopezjimenez7@gmail.com",
                pass: "iwjndqppgsvkxctu ",
            },
        });

        const mailOptions = {
            from: "franciscojavierlopezjimenez7@gmail.com",
            to: email,
            subject: "Restablecer contraseña",
            html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; color: #0B132B; padding: 20px; background-color: #F7F9FB;">
          <p style="font-size: 16px;">Hola, has solicitado restablecer tu contraseña<br><br>
            Haz clic en el siguiente enlace para continuar:<br><br>
            <a href="${resetLink}">Restablecer contraseña</a>
          </p>
          <p style="font-size: 16px; margin-top: 20px;">
            Si no solicitaste este correo, puedes ignorarlo.
          </p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Correo enviado correctamente" });
        
    } catch (error) {
        console.error("Error enviando correo:", error);
        res.status(500).json({ message: "Error al enviar el correo" });
    }
});

router.post("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).send("Token no válido.");
    }

    if (Date.now() > user.tokenExpiration) {
      return res.status(400).send("El token ha expirado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.tokenExpiration = undefined; 
    await user.save();

    res.status(200).send("Contraseña restablecida con éxito.");
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).send("Hubo un error al restablecer la contraseña.");
  }
});

export default router;
