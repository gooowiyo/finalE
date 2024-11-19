const { db } = require('../config/firebase-config');

class Movement {
  static async create(movementData) {
    const movementRef = db.collection('movements').doc();
    const timestamp = new Date();
    await movementRef.set({
      ...movementData,
      quantity: parseInt(movementData.quantity),
      previousStock: parseInt(movementData.previousStock),
      currentStock: parseInt(movementData.currentStock),
      date: timestamp
    });
    return movementRef.id;
  }

  static async getAll() {
    const snapshot = await db.collection('movements')
      .orderBy('date', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getByDateRange(startDate, endDate) {
    const snapshot = await db.collection('movements')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getByProduct(productId) {
    const snapshot = await db.collection('movements')
      .where('productId', '==', productId)
      .orderBy('date', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = Movement;