import dotenv from 'dotenv';

import connectDb from './db/index.js';
import app from './app.js';

dotenv.config({ path: './env' });

connectDb()
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed', err);
    process.exit(1);
  });

