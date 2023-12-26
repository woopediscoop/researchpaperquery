import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index.js';
import {fileURLToPath} from 'url';
import path from 'path';
import multer from 'multer';
import PdfParse from 'pdf-parse';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//changes: package.json node dist/index.js and prestart:npm run build and Openai api key in pinecone.ts and llm.ts process.env.OPENAI_API_KEY
//changes: host in authentication.ts
export const app = express()

app.use(cors({
    credentials: true,
}));
app.use(express.static(path.join(__dirname,'public')));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());



const server = http.createServer(app);

const port =  3000

server.listen(port);

const MONGO_URL = 'mongodb+srv://rotelanza1984:QueGuay123@testcluster.eaos9pa.mongodb.net/?retryWrites=true&w=majority';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
