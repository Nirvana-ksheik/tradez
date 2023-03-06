import express from 'express';
import * as database from './database.js';
import authRouter from './routes/authRoutes.js';
import itemRouter from './routes/itemRoutes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';

const app = express(); 
const httpServer = http.createServer(app);

app.use(express.static('./public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin:true, credentials:true }));

httpServer.listen(3000, () => {
    console.log("Server started on port : 3000");
});

app.use('/', authRouter);
app.use('/', itemRouter);
// app.get('/', express.static(path.join("./public")));

database.connectDB();