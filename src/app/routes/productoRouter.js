import express from 'express';
import Producto from '../models/Producto.js';
import ProductoSupermercado from '../models/Producto_Supermercado.js';
const router = express.Router();

// Ruta para insertar un nuevo producto
router.post('/insert-producto', async (req, res) => {
  const { nombre, tipo } = req.body;

  try {
    const newProduct = await Producto.create({
      nombre,
      tipo,
    });

    return res.status(201).json({
      message: 'Producto creado con éxito',
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Hubo un error al crear el producto.',
      error: error.message,
    });
  }
});

// Ruta para eliminar un producto por nombre
router.delete('/eliminar-producto/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const product = await Producto.findOne({ where: { nombre } });

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado',
      });
    }

    await ProductoSupermercado.destroy({
      where: { idPro: product.idPro } 
    });

    await product.destroy();

    return res.status(200).json({
      message: 'Producto eliminado correctamente',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'No se pudo eliminar el producto.',
      error: error.message,
    });
  }
});

// Ruta para buscar el producto por nombre
router.get('/buscar-producto/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const producto = await Producto.findOne({ where: { nombre } });

    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      producto,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Hubo un error al buscar el producto.',
      error: error.message,
    });
  }
});


// Ruta para editar un producto por nombre
router.put('/editar-producto', async (req, res) => {
  const { nombre, nuevoNombre, nuevoTipo } = req.body;

  try {
    const product = await Producto.findOne({ where: { nombre } });

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado',
      });
    }

    product.nombre = nuevoNombre || product.nombre;
    product.tipo = nuevoTipo || product.tipo;

    await product.save();

    return res.status(200).json({
      message: 'Producto actualizado',
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Hubo un error al editar el producto.',
      error: error.message,
    });
  }
});

// ruta listar productos 
router.get('/products', async (req, res) => {
  try {
    const products = await Producto.findAll();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

export default router;
