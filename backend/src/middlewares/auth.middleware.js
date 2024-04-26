// middleware de autorización
const isAdmin = (req, res, next) => {
    // Verificar si el usuario está autenticado y tiene el rol de administrador
    if (req.user && req.user.role === 'admin') {
        // El usuario es un administrador, permitir acceso a la ruta protegida
        next();
    } else {
        // El usuario no tiene permisos de administrador, devolver un error de acceso denegado
        return res.status(403).json({ error: 'Acceso denegado. Esta ruta es solo para administradores.' });
    }
};

const isUser = (req, res, next) => {
    // Verificar si el usuario está autenticado y tiene el rol de administrador
    if (req.user && req.user.role === 'user') {
        // El usuario es un user, permitir acceso a la ruta protegida
        next();
    } else {
        // El usuario no tiene permisos de administrador, devolver un error de acceso denegado
        return res.status(403).json({ error: 'Acceso denegado. Esta ruta es solo para Users.' });
    }
};
const isAuthenticated = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (req.user) {
        // El usuario está autenticado, permitir acceso a la ruta protegida
        next();
    } else {
         // El usuario no está autenticado, redirigir a la página de acceso denegado
         res.redirect('/access-denied');
    }
};


module.exports = {isAdmin, isUser, isAuthenticated};