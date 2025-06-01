import express from 'express';
import User from '../models/User.js';
import Role from '../models/Role.js';
import UserRole from '../models/User_Role.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = 't!oKen2';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const coincide = await bcrypt.compare(password, user.password);

    if (!coincide) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const userRole = await UserRole.findOne({
      where: { idUser: user.idUser },
      include: {
        model: Role,
        attributes: ['name'],  
      }
    });

    const rol = userRole?.Role?.name || 'user';

    const tokenData = {
      idUser: user.idUser,
      username: user.username,
      rol,
    };

    const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: user.idUser,
        nombre: user.nombre,
        apellidos: user.apellidos,
        username: user.username,
        rol,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno', error: error.message });
  }
});

// Ruta para registrar un nuevo usuario
  router.post('/register', async (req, res) => {
    const { nombre, apellidos,email, username, password } = req.body;

    try {
      const exist = await User.findOne({ where: { username } });

      if (exist) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 5);
      const nuevoUsuario = await User.create({ nombre, apellidos,email, username, password:hashedPassword });

      await UserRole.create({
            idUser: nuevoUsuario.idUser, 
            idRole: 2 
        });
        
      return res.status(201).json({
        message: 'Usuario registrado',
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          apellidos: nuevoUsuario.apellidos,
          email: nuevoUsuario.email,
          username: nuevoUsuario.username,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno', error: error.message });
    }
  });

export default router;
