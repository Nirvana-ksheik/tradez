import express from 'express';
import * as database from './database.js';
import authRouter from './routes/authRoutes.js';
import itemRouter from './routes/itemRoutes.js';
import tradeRouter from './routes/tradeRoutes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';

const app = express(); 

app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({credentials: true, origin: true }));

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    next();
  });

app.use('/', authRouter);
app.use('/', itemRouter);
app.use('/', tradeRouter);

const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
    console.log("Server started on port : 3000");
});

database.connectDB();