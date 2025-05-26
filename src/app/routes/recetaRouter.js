import express from 'express';
import Receta from '../models/Receta.js'; 
import User from '../models/User.js';
const router = express.Router();

// Ruta para insertar una nueva receta
router.post('/insert-receta', async (req, res) => {
    const { nombre, pasos,tiempo_elaboracion,dificultad } = req.body;

    try {
        const newRecipe = await Receta.create({
            nombre,
            pasos,
            tiempo_elaboracion,
            dificultad
        });

        return res.status(201).json({
            message: 'Receta creada',
            receta: newRecipe,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'No se pudo crear la Receta',
            error: error.message,
        });
    }
});

router.get('/receta/usuario/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const usuario = await User.findOne({
      where: { username },
      include: {
        model: Receta,
        foreignKey: 'idUser'
      }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario.Receta || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudieron obtener las recetas del usuario' });
  }
});

// Ruta listar recetas
router.get('/recetas', async (req, res) => {
  try {
    const recetas = await Receta.findAll();
    res.json(recetas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las recetas' });
  }
});

//Ruta eliminar recetas
router.delete('/eliminar-receta/:nombre', async (req, res) => {
    const { nombre } = req.params;
  
    try {
      const receta = await Receta.findOne({ where: { nombre } });
  
      if (!receta) {
        return res.status(404).json({
          message: 'Receta no encontrada',
        });
      }
      await receta.destroy();
  
      return res.status(200).json({
        message: 'Receta eliminada',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'No se pudo eliminar la receta',
        error: error.message,
      });
    }
  });



export default router;