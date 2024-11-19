const { db } = require('../config/firebase-config');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userRef = db.collection('users').doc();
    await userRef.set({
      ...userData,
      password: hashedPassword,
      active: true,
      createdAt: new Date()
    });
    return userRef.id;
  }

  static async findByEmail(email) {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) return null;
    const userData = snapshot.docs[0].data();
    return { id: snapshot.docs[0].id, ...userData };
  }

  static async getAll() {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      password: undefined
    }));
  }

  static async update(id, userData) {
    const userRef = db.collection('users').doc(id);
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await userRef.update({
      ...userData,
      updatedAt: new Date()
    });
  }
}

module.exports = User;