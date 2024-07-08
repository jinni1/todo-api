import express from 'express';
//import mockTasks from './data/mock.js';
import mongoose from 'mongoose';
//import { DATABASE_URL } from './env.js';
import * as dotenv from 'dotenv';
dotenv.config();
import Task from './models/Task.js'
import cors from 'cors';

//mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

const app = express(); 

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res); // 원래 실행하던 핸들러 함수 실행
    } catch (e) {              // 오류가 발생하면 catch로 잡아서 처리
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {  // id가 변환되는 과정에서 발생하는 에러
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });  // 서버 측에서 오류 발생
      }
    }
  }
}

app.get('/tasks', asyncHandler( async (req, res) => {
  /**
   *  쿼리 파라미터
   * -sort: 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
   * -count: 태스크 개수
   */
  const sort = req.query.sort; // 쿼리 파라미터는 query 객체에 전달됨
  const count = Number(req.query.count) || 0; //파라미터 값은 모두 문자열로 전달되기 때문에 Number로 바꾸어줌

  const sortOption = { 
    createdAt: sort === 'oldest' ? 'asc' : 'desc'
  };
  const tasks = await Task.find().sort(sortOption).limit(count);  //여러 객체를 가져옴

  res.send(tasks); 
}));

app.get('/tasks/:id', asyncHandler( async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.'});
  }
}));

app.post('/tasks', asyncHandler( async (req, res) => { // 리턴하는 함수가 핸들러 함수이기 때문에 오류처리까지 된다. 
  const newTask = await Task.create(req.body)
  res.status(201).send(newTask);
}));

app.patch('/tasks/:id', asyncHandler( async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if (task) {
    Object.keys(req.body).forEach((key) => {  // 태스크는 자바스크립트 객체이기 때문에 업데이트 하는 부분은 놔둔다. 
      task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.'});
  }
}));

app.delete('/tasks/:id', asyncHandler (async (req, res) => {
  const id = req.params.id;
  //const idx = mockTasks.findIndex((task) => task.id === id);
  const task = await Task.findByIdAndDelete(id); 
  // 객체를 찾아서 삭제, 객체를 찾으면 삭제한 객체 리턴, 없으면 null 리턴
  if ( task) {
    //mockTasks.splice(idx, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'Cannot find given id.'});
  }
}));

//app.listen(3000, () => console.log('Server Started')); 
app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
