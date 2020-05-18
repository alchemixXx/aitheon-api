import App from './app';
import express from 'express';
import { userRouter } from './routers/users';
// import * as bodyParser from 'body-parser';

const PORT: number = Number(process.env.PORT);

const app = new App({
  port: PORT,
  controllers: [userRouter],
  middleWares: [express.json],
});

app.listen();
