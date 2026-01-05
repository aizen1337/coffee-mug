import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';

beforeAll(async () => {
  await mongoose.connect(
      'mongodb://127.0.0.1:27108/order_db',
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
