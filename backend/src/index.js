import dotenv from 'dotenv';

import express from 'express';
import connectDb from './db/index.js';

dotenv.config({path: './env'});


const app = express();

connectDb()
.then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed",err);
    process.exit(1);
})

app.get('/', (req, res) => {
    res.send('Server is running');
})
