import * as database from './database.js';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import itemRouter from './routes/itemRoutes.js';
import tradeRouter from './routes/tradeRoutes.js';
import subscriptionRouter from './routes/subscriptionRoutes.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import commentRouter from './routes/commentRoute.js';
import charityRouter from './routes/charityRoutes.js';
import postRouter from './routes/postRoutes.js';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';
import notificationRouter from './routes/notificationRoutes.js';
import path from 'path';

dotenv.config();

const app = express(); 
const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({credentials: true, origin: true }));
app.use(cors({origin: '*'}));

app.use('/', (req, res, next) => {
    res.setHeader(
      'Access-Control-Allow-Origin', 'http://localhost:3001'
    );
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/image/:id/:idd/:iddd', (req, res) => {

    const params = req.params
    console.log("params: ", params);
    const dirname = "/public/" + params.id + "/" + params.idd + "/" + params.iddd;
    res.sendFile(__dirname + dirname);  
});

app.use('/', authRouter);
app.use('/', itemRouter);
app.use('/', tradeRouter);
app.use('/', commentRouter);
app.use('/', charityRouter);
app.use('/', postRouter);
app.use('/', subscriptionRouter);
app.use('/', notificationRouter);

httpServer.listen(3000, () => {
  console.log("Server started on port : 3000");
});

database.connectDB();