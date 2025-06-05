import express from 'express';
import ProductoSupermercado from '../models/Producto_Supermercado.js';
import Producto from '../models/Producto.js';
import Supermercado from '../models/Supermercado.js';

const router = express.Router();

const obtenerProductoSupermercado = async (nombreProducto, nombreSuper) => {

  const producto = await Producto.findOne({ where: { nombre: nombreProducto } });
  const supermercado = await Supermercado.findOne({ where: { nombre: nombreSuper } });

  if (!producto || !supermercado) {
    return {
      error: 'Producto o supermercado no encontrado',
    };
  }

  return { producto, supermercado };
};

// Ruta para agregar la relacion de super y producto
router.post('/insert-producto-super', async (req, res) => {
  const { nombreProducto, nombreSuper, precio, valoracion } = req.body;

  try {
    const { producto, supermercado, error } = await obtenerProductoSupermercado(nombreProducto, nombreSuper);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const idPro = producto.idPro;
    const idSuper = supermercado.idSuper;

    const existe = await ProductoSupermercado.findOne({ where: { idPro, idSuper } });

    if (existe) {
      return res.status(400).json({
        message: 'El producto ya existe en ese supermercado',
      });
    }
    const proSuper = await ProductoSupermercado.create({
      idPro,
      idSuper,
      precio,
      valoracion,
    });

    return res.status(201).json({
      message: 'Producto insertado en el supermercado',
      relacion: proSuper,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'No se pudo insertar el producto en el supermercado',
      error: error.message,
    });
  }
});

// Ruta para eliminar un producto para un super
router.delete('/eliminar-producto-super', async (req, res) => {
  const { nombreProducto, nombreSuper } = req.body;

  try {
    const { producto, supermercado, error } = await obtenerProductoSupermercado(nombreProducto, nombreSuper);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const idPro = producto.idPro;
    const idSuper = supermercado.idSuper;

    const proSuper = await ProductoSupermercado.findOne({ where: { idPro, idSuper } });

    if (!proSuper) {
      return res.status(404).json({
        message: 'No se ha encontrado el producto para ese supermercado',
      });
    }

    await proSuper.destroy();

    return res.status(200).json({
      message: 'Producto eliminado del supermercado',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'No se pudo eliminar el producto del supermercado',
      error: error.message,
    });
  }
});

// Ruta para editar la el producto de un supermercado
router.put('/editar-producto-super', async (req, res) => {
  const { nombreProducto, nombreSuper, nuevoPrecio, nuevaValoracion } = req.body;

  try {
    const { producto, supermercado, error } = await obtenerProductoSupermercado(nombreProducto, nombreSuper);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const idPro = producto.idPro;
    const idSuper = supermercado.idSuper;

    const proSuper = await ProductoSupermercado.findOne({ where: { idPro, idSuper } });

    if (!proSuper) {
      return res.status(404).json({
        message: 'Producto no encontrado en el supermercado',
      });
    }

    proSuper.precio = nuevoPrecio || proSuper.precio;
    proSuper.valoracion = nuevaValoracion || proSuper.valoracion;

    await proSuper.save();

    return res.status(200).json({
      message: 'Producto actualizado correctamente para el supermercado',
      proSuper,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Hubo un problema al editar el producto para el supermercado.',
      error: error.message,
    });
  }
});

// Ruta obtener el producto en los distintos supermercados
router.get('/productos-comparador/:nombreProducto', async (req, res) => {
  const { nombreProducto } = req.params;

  try {
    const producto = await Producto.findOne({ where: { nombre: nombreProducto } });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const productosSuper = await ProductoSupermercado.findAll({
      where: { idPro: producto.idPro },
      include: [{ model: Supermercado, attributes: ['nombre'] }],
      order: [['precio', 'ASC']],
    });

    if (productosSuper.length === 0) {
      return res.status(404).json({ message: 'No se ha encontrado el producto en ningun supermercado' });
    }

    return res.status(200).json({
      productos: productosSuper,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al buscar los productos',
      error: error.message,
    });
  }
});


export default router;
