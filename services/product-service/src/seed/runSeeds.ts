import mongoose from 'mongoose';
import ENV from '@src/common/constants/ENV';
import { seedProductTypes } from './seedProductTypes';
import { seedProducts } from './seedProducts';
import { exit } from 'node:process';

const run = async () => {
  try {
    console.log('🌱 Connecting to DB...');
    await mongoose.connect(
      'mongodb://127.0.0.1:27018/product_db',
    {
      serverSelectionTimeoutMS: 5_000,
    });

    console.log('🌱 Seeding product types...');
    const productTypes = await seedProductTypes();
    console.log('🌱 Seeding products...');
    await seedProducts(productTypes);
    console.log('✅ Seeding completed');
    exit(0);
  } catch (err) {
    console.error('❌ Seeding failed', err);
  }
};

run();
