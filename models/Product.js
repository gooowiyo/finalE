const { db } = require('../config/firebase-config');

class Product {
  static async create(productData) {
    const productRef = db.collection('products').doc();
    const timestamp = new Date();
    await productRef.set({
      ...productData,
      stock: parseInt(productData.stock),
      minStock: parseInt(productData.minStock),
      cost: parseFloat(productData.cost),
      price: parseFloat(productData.price),
      createdAt: timestamp,
      updatedAt: timestamp
    });
    return productRef.id;
  }

  static async getAll() {
    const snapshot = await db.collection('products').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, productData) {
    const productRef = db.collection('products').doc(id);
    await productRef.update({
      ...productData,
      updatedAt: new Date()
    });
  }

  static async delete(id) {
    await db.collection('products').doc(id).delete();
  }

  static async getLowStock() {
    const snapshot = await db.collection('products').get();
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(product => product.stock <= product.minStock);
  }
}

module.exports = Product;