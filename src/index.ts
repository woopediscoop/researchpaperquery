import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index.js';
import multer from 'multer';
import PdfParse from 'pdf-parse';

export const app = express()

app.use(cors({
    credentials: true,
}));
app.use(express.static('./public'))
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());




const server = http.createServer(app);

const port = process.env.PORT || 3000

server.listen(port);

const MONGO_URL = 'mongodb+srv://rotelanza1984:QueGuay123@testcluster.eaos9pa.mongodb.net/?retryWrites=true&w=majority';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
