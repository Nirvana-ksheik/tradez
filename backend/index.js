import express from 'express';
import * as database from './database.js';
import authRouter from './routes/authRoutes.js';
import itemRouter from './routes/itemRoutes.js';
import tradeRouter from './routes/tradeRoutes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express(); 

app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({credentials: true, origin: true }));

app.use('/', (req, res, next) => {
    res.setHeader(
      'Access-Control-Allow-Origin', 'http://localhost:3001'
      );
    next();
});

// app.use(
//   '/api',
//   createProxyMiddleware({
//     target: 'http://localhost:3001',
//     changeOrigin: true,
//     pathFilter: '/:id/:idd/:iddd',
//   }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/api/image/:id/:idd/:iddd', (req, res) => {

    const params = req.params
    console.log("params: ", params);
    const dirname = "/public/" + params.id + "/" + params.idd + "/" + params.iddd;
    // console.log("dirname: ", __dirname + dirname);
    res.sendFile(__dirname + dirname);  
});

app.use('/', authRouter);
app.use('/', itemRouter);
app.use('/', tradeRouter);

const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
    console.log("Server started on port : 3000");
});

database.connectDB();