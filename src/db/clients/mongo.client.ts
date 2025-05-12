// db.ts
import mongoose from 'mongoose';
import { getEnvVar } from '../../utils/common.utils';

const CONTENT_MONGO_URI = getEnvVar('CONTENT_MONGO_URI');

export function connectMongoose() {
  mongoose.connect(CONTENT_MONGO_URI, {});

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error(err);
  });

  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}
