const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware de sesión (solo una vez)
app.use(session({
  secret: 'tu_secreto_super_seguro', // Reemplaza esto con una clave secreta más segura
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Middleware para parsear el body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Archivos estáticos
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar errores de Firebase
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Error en el servidor');
});

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/inventory', require('./routes/inventoryRoutes'));
app.use('/reports', require('./routes/reportRoutes'));

// Default route
app.get('/', (req, res) => res.redirect('/auth/login'));

// Puerto fijo
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});