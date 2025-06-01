import express from 'express';
import User from '../models/User.js'; 
const router = express.Router();

// Ruta para insertar un nuevo usuario
router.post('/insert-user', async (req, res) => {
    const { nombre, apellidos, username, password } = req.body;

    try {
        const newUser = await User.create({
            nombre,
            apellidos,
            username,
            password,
        });

        return res.status(201).json({
            message: 'Usuario creado con éxito',
            product: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'No se pudo crear el usuario',
            error: error.message,
        });
    }
});

// Ruta para eliminar un usuario
router.delete('/eliminar-user/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado',
        });
      }
      await user.destroy();
  
      return res.status(200).json({
        message: 'Usuario eliminado',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'No se pudo eliminar el usuario',
        error: error.message,
      });
    }
  });

  // ruta para buscar el usuario por el nombre
router.get('/buscar-user/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado',
        });
      }
  
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Hubo un problema al buscar el usuario',
        error: error.message,
      });
    }
  });
  

// Ruta para editar un usuario
router.put('/editar-user', async (req, res) => {
    const { username, nuevoNombre,nuevoEmail, nuevoApellidos, nuevoUsername, nuevoPassword } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado',
            });
        }

        user.nombre = nuevoNombre || user.nombre;
        user.apellidos = nuevoApellidos || user.apellidos;
        user.email=nuevoEmail || user.emaill;
        user.username = nuevoUsername || user.username;
        user.password = nuevoPassword || user.password;

        await user.save();

        return res.status(200).json({
            message: 'Usuario actualizado con éxito',
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'No se pudo editar el usuario.',
            error: error.message,
        });
    }
});

// ruta  listar usuario 
router.get('/usuarios', async (req, res) => {
  try {
    const Users = await User.findAll();
    const users = Users.filter(user => user.username !== 'admin');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

export default router;
