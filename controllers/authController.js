const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('auth/login', { error: 'Credenciales inválidas' });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.redirect('/inventory/dashboard');
  } catch (error) {
    res.render('auth/login', { error: 'Error en el servidor' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
};