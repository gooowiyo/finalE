const Product = require('../models/Product');
const Movement = require('../models/Movement');
const { db } = require('../config/firebase-config');

exports.getDashboard = async (req, res) => {
  try {
    const products = await Product.getAll();
    const lowStock = await Product.getLowStock();
    const recentMovements = await Movement.getAll();
    res.render('inventory/dashboard', { 
      products, 
      lowStock,
      recentMovements: recentMovements.slice(0, 10)
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al cargar el dashboard' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.render('inventory/products', { products });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al cargar productos' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    await Product.create(req.body);
    res.redirect('/inventory/products');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al crear producto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    await Product.update(req.params.id, req.body);
    res.redirect('/inventory/products');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al actualizar producto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.redirect('/inventory/products');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al eliminar producto' });
  }
};

exports.createMovement = async (req, res) => {
  const { productId, type, quantity, description } = req.body;
  
  try {
    const product = await Product.getById(productId);
    const previousStock = product.stock;
    const currentStock = type === 'entrada' 
      ? previousStock + parseInt(quantity)
      : previousStock - parseInt(quantity);

    await Movement.create({
      productId,
      type,
      quantity,
      previousStock,
      currentStock,
      userId: req.session.user.id,
      description
    });

    await Product.update(productId, { stock: currentStock });
    
    res.redirect('/inventory/movements');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al registrar movimiento' });
  }
};

exports.getMovements = async (req, res) => {
  try {
    const movements = await Movement.getAll();
    const products = await Product.getAll();
    res.render('inventory/movements', { movements, products });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al cargar movimientos' });
  }
};