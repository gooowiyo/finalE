const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next();
    }
    res.redirect('/auth/login');
  };
  
  const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    res.status(403).send('Acceso denegado');
  };
  
  module.exports = { isAuthenticated, isAdmin };