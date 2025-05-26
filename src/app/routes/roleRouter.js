import express from 'express';
import Role from '../models/Role.js';
const router = express.Router();

// Ruta para insertar un nuevo rol
router.post('/insert-role', async (req, res) => {
    const { nombre } = req.body;
    const name = nombre;

    try {
        const newRole = await Role.create({
            name,
        });

        return res.status(201).json({
            message: 'Rol creado',
            product: newRole,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'No se pudo crear el rol.',
            error: error.message,
        });
    }
});

// Ruta para eliminar un rol por nombre
router.delete('/eliminar-role/:nombre', async (req, res) => {
    const { nombre } = req.params;
    const name=nombre;

    try {
        const role = await Role.findOne({ where: { name } });

        if (!role) {
            return res.status(404).json({
                message: 'Rol no encontrado',
            });
        }

        await role.destroy();

        return res.status(200).json({
            message: 'Rol eliminado',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'No se pudo eliminar el rol.',
            error: error.message,
        });
    }
});

// Ruta para buscar el rol por nombre
router.get('/buscar-role/:nombre', async (req, res) => {
    const { nombre } = req.params;
    const name=nombre;

    try {
        const role = await Role.findOne({ where: { name } });

        if (!role) {
            return res.status(404).json({
                message: 'Role no encontrado',
            });
        }

        return res.status(200).json({
            role,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Hubo un error al buscar el role.',
            error: error.message,
        });
    }
});


// Ruta para editar un rol por nombre
router.put('/editar-role', async (req, res) => {
    const { nombre, nuevoNombre } = req.body;
    const name=nombre;
    try {
        const role = await Role.findOne({ where: { name } });

        if (!role) {
            return res.status(404).json({
                message: 'Rol no encontrado',
            });
        }

        role.name = nuevoNombre || role.name;

        await role.save();

        return res.status(200).json({
            message: 'Rol actualizado con exito',
            role,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'No se pudo editar el rol.',
            error: error.message,
        });
    }
});

export default router;
