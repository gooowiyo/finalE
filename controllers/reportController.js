const Product = require('../models/Product');
const Movement = require('../models/Movement');
const moment = require('moment');

exports.getRotationReport = async (req, res) => {
  try {
    const movements = await Movement.getAll();
    const products = await Product.getAll();
    
    const rotation = products.map(product => {
      const productMovements = movements.filter(m => m.productId === product.id);
      const totalMovements = productMovements.length;
      const totalQuantity = productMovements.reduce((sum, m) => sum + m.quantity, 0);
      
      return {
        ...product,
        totalMovements,
        totalQuantity
      };
    }).sort((a, b) => b.totalMovements - a.totalMovements);

    res.render('reports/rotation', { rotation });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al generar reporte' });
  }
};

exports.getMovementsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let movements;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      movements = await Movement.getByDateRange(start, end);
    } else {
      movements = await Movement.getAll();
    }

    res.render('reports/movements', { 
      movements,
      startDate,
      endDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al generar reporte' });
  }
};

exports.getProfitsReport = async (req, res) => {
  try {
    const movements = await Movement.getAll();
    const products = await Product.getAll();
    
    const profits = movements.map(movement => {
      const product = products.find(p => p.id === movement.productId);
      const profit = movement.type === 'salida' 
        ? movement.quantity * (product.price - product.cost)
        : 0;
      
      return {
        ...movement,
        productName: product.name,
        profit
      };
    });

    const totalProfits = profits.reduce((sum, m) => sum + m.profit, 0);

    res.render('reports/profits', { 
      profits,
      totalProfits
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al generar reporte' });
  }
};