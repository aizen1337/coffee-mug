import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGODB_URI ??
      'mongodb://127.0.0.1:27018/product_service_test',
    {
      serverSelectionTimeoutMS: 5_000,
    }
  );
});

afterEach(async () => {
  await mongoose?.connection?.db?.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});
