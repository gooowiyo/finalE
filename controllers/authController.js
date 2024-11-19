// controllers/authController.js
const db = require('../config/firebase-config');

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Buscar usuario en Firestore
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      
      if (snapshot.empty) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const userData = snapshot.docs[0].data();
      // Aquí deberías verificar la contraseña con hash
      
      // Guardar usuario en sesión
      req.session.user = {
        id: snapshot.docs[0].id,
        email: userData.email,
        role: userData.role
      };

      res.redirect('/inventory');
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error en logout:', err);
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }
      res.redirect('/auth/login');
    });
  }
};

module.exports = authController;