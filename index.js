import express from 'express';
import { initApp } from './src/initApp.js';

const app = express();
const port = process.env.PORT || 3000;

initApp(app,express)

app.listen(port, () => console.log(`Listening on port ${port}...`));