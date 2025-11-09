import dotenv from 'dotenv';

import express from 'express';
import connectDb from './db/index.js';

dotenv.config({path: './env'});


const app = express();
connectDb();
app.get('/', (req, res) => {
    res.send('Server is running');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    }
);