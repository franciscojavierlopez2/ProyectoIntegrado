import express from 'express';
import Receta from '../models/Receta.js';
import User from '../models/User.js';
import UserRecetaFavorita from "../models/User_Receta_Favorita.js"
const router = express.Router();

// Ruta para insertar una nueva receta
router.post('/insert-receta', async (req, res) => {
  const { nombre, pasos, tiempo_elaboracion, dificultad } = req.body;

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

// Ruta para obtener recetas que no sean del usuario 

router.get("/recetas/otros/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const usuario = await User.findOne({ where: { username } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const idUsuarioActual = usuario.idUser;

    const recetas = await Receta.findAll();

    const recetasDeOtros = recetas.filter(receta => receta.idUser !== idUsuarioActual);

    res.json(recetasDeOtros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No se pudieron obtener las recetas" });
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

    const recetasFavs = await UserRecetaFavorita.findAll({
      where: { idReceta: receta.idReceta }
    });

    if (recetasFavs.length > 0) {
      await UserRecetaFavorita.destroy({
        where: { idReceta: receta.idReceta }
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

// ruta para alternar receta favorita
router.post('/recetas/favoritas', async (req, res) => {
  const { idUser, idReceta } = req.body;

  try {
    const existe = await UserRecetaFavorita.findOne({
      where: { idUser, idReceta }
    });

    if (existe) {
      await UserRecetaFavorita.destroy({ where: { idUser, idReceta } });
      return res.status(200).json({ message: 'Eliminada de favoritos', favorita: false });
    }

    await UserRecetaFavorita.create({ idUser, idReceta });
    res.status(201).json({ message: 'Agregada a favoritas', favorita: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar las recetas favoritas' });
  }
});


// Ruta devolver las recetas favoritas
router.get('/recetas/favoritas/:idUser', async (req, res) => {
  const { idUser } = req.params;

  try {
    const favoritas = await UserRecetaFavorita.findAll({
      where: { idUser },
      include: [{ model: Receta, as: 'Receta' }]
    });

    const recetas = favoritas.map(fav => fav.Receta);
    res.json(recetas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener recetas favoritas' });
  }
});

// Ruta para sacar los ids de las recetas para favoritas
router.get('/recetas/favoritas/ids/:idUser', async (req, res) => {
  const { idUser } = req.params;

  try {
    const favoritos = await UserRecetaFavorita.findAll({
      where: { idUser },
      attributes: ['idReceta']
    });

    const ids = favoritos.map(f => f.idReceta);
    res.json(ids);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las recetas favoritas' });
  }
});




export default router;