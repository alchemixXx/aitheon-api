import mongoose from 'mongoose';

const connectionUrl: string = process.env.DB_CONNECTION_URL || '';

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
