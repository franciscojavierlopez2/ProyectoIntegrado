import express from 'express';
import Receta from '../models/Receta.js';
import User from '../models/User.js';
import UserRecetaFavorita from "../models/User_Receta_Favorita.js"
const router = express.Router();

// Ruta para insertar una nueva receta
router.post('/insert-receta/:idUser', async (req, res) => {
  const { idUser } = req.params;
  const { nombre, pasos, tiempo_elaboracion, dificultad } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  try {
    const recetaExistente = await Receta.findOne({
      where: {
        nombre,
        idUser,
      }
    });

    if (recetaExistente) {
      return res.status(409).json({
        message: `Ya creaste una receta con ese nombre`,
      });
    }

    const newRecipe = await Receta.create({
      nombre,
      pasos,
      tiempo_elaboracion,
      dificultad,
      idUser,
    });

    return res.status(201).json({
      message: 'Receta creada',
      receta: newRecipe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'No se pudo crear la receta',
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

//Ruta buscar receta concreta
router.get('/receta-concreta/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    const recetas = await Receta.findAll();

    const recetasConNombre = recetas.filter(receta =>
      receta.nombre.toLowerCase().includes(nombre.toLowerCase())
    );

    if (recetasConNombre.length === 0) {
      return res.status(404).json({ message: 'No se encontraron recetas' });
    }

    res.json(recetasConNombre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las recetas' });
  }
});



//Ruta eliminar recetas
router.delete('/eliminar-receta/:nombre/:idUser', async (req, res) => {
  const { nombre, idUser } = req.params;

  try {
    const receta = await Receta.findOne({ where: { nombre, idUser } });

    if (!receta) {
      return res.status(404).json({
        message: 'Receta no encontrada o no pertenece al usuario',
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
    });
  }
});

//Ruta para obtener la receta a editar
router.get('/editar-receta/:nombre/:idUser', async (req, res) => {
  const { nombre, idUser } = req.params;

  try {
    const receta = await Receta.findOne({ where: { nombre, idUser } });

    if (!receta) {
      return res.status(404).json({ message: 'Receta no encontrada o no pertenece al usuario' });
    }

    return res.json(receta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al obtener la receta para editar',
    });
  }
});

// Ruta para editar receta por nombre + idUser
router.put('/editar-receta/:nombre/:idUser', async (req, res) => {
  const { nombre, idUser } = req.params;
  const { nuevoNombre, pasos, tiempo_elaboracion, dificultad } = req.body;

  try {
    const receta = await Receta.findOne({ where: { nombre, idUser } });

    if (!receta) {
      return res.status(404).json({ message: 'Receta no encontrada o no pertenece al usuario' });
    }

    receta.nombre = nuevoNombre ?? receta.nombre;
    receta.pasos = pasos ?? receta.pasos;
    receta.tiempo_elaboracion = tiempo_elaboracion ?? receta.tiempo_elaboracion;
    receta.dificultad = dificultad ?? receta.dificultad;

    await receta.save();

    return res.status(200).json({ message: 'Receta actualizada', receta });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al editar la receta'});
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
      await Receta.update(
        { favorita: 0 },
        { where: { idReceta } }
      );
      return res.status(200).json({ message: 'Eliminada de favoritos', favorita: false });
    }

    await UserRecetaFavorita.create({ idUser, idReceta });
    await Receta.update(
      { favorita: 1 },
      { where: { idReceta } }
    );
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