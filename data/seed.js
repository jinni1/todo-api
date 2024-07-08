import mongoose from 'mongoose';
import data from './mock.js';
import Task from '../models/Task.js';
//import { DATABASE_URL } from '../env.js';
import * as dotenv from 'dotenv';
dotenv.config();

//mongoose.connect(DATABASE_URL); 
mongoose.connect(process.env.DATABASE_URL);

await Task.deleteMany({}); 
await Task.insertMany(data); 

mongoose.connection.close(); 
