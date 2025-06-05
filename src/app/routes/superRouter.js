import express from 'express';
import Supermercado from '../models/Supermercado.js';
import ProductoSupermercado from '../models/Producto_Supermercado.js';
const router = express.Router();

// Ruta para insertar un nuevo supermercado
router.post('/insert-super', async (req, res) => {
  const { nombre, direccion } = req.body;

  try {
    const newSuper = await Supermercado.create({
      nombre,
      direccion,
    });

    return res.status(201).json({
      message: 'Supermercado creado correctamente',
      supermercado: newSuper,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Hubo un error al crear el supermercado.',
      error: error.message,
    });
  }
});

// Ruta para buscar un supermercado
router.get('/buscar-super/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const supermercado = await Supermercado.findOne({ where: { nombre } });

    if (!supermercado) {
      return res.status(404).json({
        message: 'Supermercado no encontrado',
      });
    }

    return res.status(200).json({
      supermercado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Hubo un error al buscar el supermercado.',
      error: error.message,
    });
  }
});

// Ruta para eliminar un supermercado por nombre
router.delete('/eliminar-super/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const supermercado = await Supermercado.findOne({ where: { nombre } });

    if (!supermercado) {
      return res.status(404).json({
        message: 'Supermercado no encontrado',
      });
    }

    const productosAsociados = await ProductoSupermercado.findAll({
      where: { idSuper: supermercado.idSuper }
    });

    if (productosAsociados.length > 0) {
      await ProductoSupermercado.destroy({
        where: { idSuper: supermercado.idSuper }
      });
    }

    await supermercado.destroy();

    return res.status(200).json({
      message: 'Supermercado eliminado',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'No se pudo eliminar el supermercado',
      error: error.message,
    });
  }
});

// Ruta para editar un supermercado por nombre
router.put('/editar-super', async (req, res) => {
  const { nombre, nuevoNombre, nuevaDirecc } = req.body;

  try {
    const supermercado = await Supermercado.findOne({ where: { nombre } });

    if (!supermercado) {
      return res.status(404).json({
        message: 'Supermercado no encontrado',
      });
    }

    supermercado.nombre = nuevoNombre || supermercado.nombre;
    supermercado.direccion = nuevaDirecc || supermercado.direccion;

    await supermercado.save();

    return res.status(200).json({
      message: 'Supermercado actualizado con exito',
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'No se pudo editar el supermercado.',
      error: error.message,
    });
  }
});

// ruta  listar supermercados 
router.get('/supers', async (req, res) => {
  try {
    const supers = await Supermercado.findAll();

    res.json(supers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los supermercados' });
  }
});

export default router;