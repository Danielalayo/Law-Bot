const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI no está definida en .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('✅ Conectado a MongoDB');
}

module.exports = { connectDB };
