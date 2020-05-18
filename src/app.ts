
import express from 'express';
import './db/mongoose';
import { Application } from 'express';

class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; middleWares: any; controllers: any }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares();
    this.routes(appInit.controllers);
  }

  private middlewares() {
      this.app.use(express.json());

  }

  private routes(controllers) {
    controllers.forEach((controller: any) => {
      this.app.use(controller)
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}

export default App

